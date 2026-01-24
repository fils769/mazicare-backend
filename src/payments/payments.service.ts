import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Prisma } from '@prisma/client';
import Stripe from 'stripe';

import { PrismaService } from '../prisma/prisma.service';
import { SubscriptionService } from '../subscription/subscription.service';
import { CreateSubscriptionCheckoutDto } from './dto/create-subscription-checkout.dto';
import { ConfirmCheckoutDto } from './dto/confirm-subscription.dto';
import { CreateCaregiverCheckoutDto } from './dto/create-payout-intent.dto';
import { ActivityEvents } from '../activity/activity.events';

const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  SUCCEEDED: 'SUCCEEDED',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
} as const;

const PAYMENT_TYPE = {
  SUBSCRIPTION: 'SUBSCRIPTION',
  CAREGIVER_PAYOUT: 'CAREGIVER_PAYOUT',
} as const;

interface AuthContext {
  userId: string;
  email?: string;
  role?: string;
}

@Injectable()
export class PaymentsService {
  private readonly stripe: Stripe;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly subscriptionService: SubscriptionService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    const secretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY is not configured');
    }

    this.stripe = new Stripe(secretKey, {
      apiVersion: '2025-12-15.clover',
    });
  }

  async createSubscriptionCheckout(
    { userId, email }: AuthContext,
    dto: CreateSubscriptionCheckoutDto,
  ) {
    const plan = await this.prisma.subscriptionPlan.findUnique({
      where: { id: dto.planId },
    });

    if (!plan) {
      throw new NotFoundException('Subscription plan not found');
    }

    if (!plan.stripePriceId) {
      throw new BadRequestException(
        'Plan is missing Stripe price configuration',
      );
    }

    if (!email) {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { email: true },
      });

      email = user?.email ?? undefined;
    }

    if (!email) {
      throw new BadRequestException('User email is required for checkout');
    }

    const transaction = await this.prisma.paymentTransaction.create({
      data: {
        userId,
        amount: plan.price,
        currency: 'usd',
        type: PAYMENT_TYPE.SUBSCRIPTION,
        status: PAYMENT_STATUS.PENDING,
        metadata: {
          planId: plan.id,
        } as Prisma.JsonObject,
      },
    });

    const successUrl = this.ensureCheckoutRedirect(dto.successUrl);

    const session = await this.stripe.checkout.sessions.create({
      mode: 'subscription',
      customer_email: email,
      line_items: [
        {
          price: plan.stripePriceId,
          quantity: 1,
        },
      ],
      metadata: {
        transactionId: transaction.id,
        planId: plan.id,
        userId,
      },
      subscription_data: {
        metadata: {
          transactionId: transaction.id,
          planId: plan.id,
        },
      },
      success_url: successUrl,
      cancel_url: dto.cancelUrl,
    });

    await this.prisma.paymentTransaction.update({
      where: { id: transaction.id },
      data: {
        stripeCheckoutSessionId: session.id,
        metadata: {
          planId: plan.id,
          sessionId: session.id,
          sessionUrl: session.url,
        } as Prisma.JsonObject,
      },
    });

    return {
      sessionId: session.id,
      checkoutUrl: session.url,
    };
  }

  async confirmSubscriptionCheckout(
    { userId, role }: AuthContext,
    dto: ConfirmCheckoutDto,
  ) {
    const session = await this.stripe.checkout.sessions.retrieve(
      dto.sessionId,
      {
        expand: ['subscription', 'payment_intent'],
      },
    );

    const transactionId = session.metadata?.transactionId;
    if (!transactionId) {
      throw new NotFoundException(
        'Checkout session metadata missing transaction reference',
      );
    }

    const transaction = await this.prisma.paymentTransaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction || transaction.userId !== userId) {
      throw new NotFoundException('Payment transaction not found');
    }

    if (transaction.status === PAYMENT_STATUS.SUCCEEDED) {
      return { success: true };
    }

    if (session.payment_status !== 'paid') {
      await this.prisma.paymentTransaction.update({
        where: { id: transaction.id },
        data: { status: PAYMENT_STATUS.FAILED },
      });

      throw new BadRequestException('Payment has not completed yet');
    }

    const paymentIntentId =
      typeof session.payment_intent === 'string'
        ? session.payment_intent
        : (session.payment_intent?.id ?? null);

    const metadata = this.mergeMetadata(transaction.metadata, {
      sessionId: session.id,
      paymentIntentId,
    });

    await this.prisma.paymentTransaction.update({
      where: { id: transaction.id },
      data: {
        status: PAYMENT_STATUS.SUCCEEDED,
        stripePaymentIntentId: paymentIntentId,
        metadata: metadata as Prisma.JsonObject,
      },
    });

    const planId =
      (metadata as Record<string, unknown>).planId ?? session.metadata?.planId;
    if (!planId || typeof planId !== 'string') {
      throw new BadRequestException(
        'Plan reference missing from payment metadata',
      );
    }

    await this.subscriptionService.renewSubscription(userId, { planId });

    this.eventEmitter.emit(ActivityEvents.PAYMENT_SUCCEEDED, {
      userId,
      actorRole: role,
      transactionId: transaction.id,
      paymentType: PAYMENT_TYPE.SUBSCRIPTION,
      amount: transaction.amount,
    });

    return { success: true };
  }

  async createCaregiverCheckout(
    { userId, email, role }: AuthContext,
    dto: CreateCaregiverCheckoutDto,
  ) {
    if (!email) {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { email: true },
      });

      email = user?.email ?? undefined;
    }

    if (!email) {
      throw new BadRequestException('User email is required for checkout');
    }

    const caregiver = await this.prisma.caregiver.findUnique({
      where: { id: dto.caregiverId },
    });

    if (!caregiver) {
      throw new NotFoundException('Caregiver not found');
    }

    if (!caregiver.stripeAccountId) {
      throw new BadRequestException(
        'Caregiver has no Stripe account connected',
      );
    }

    const amountCents = this.toMinorCurrency(dto.amount);

    const transaction = await this.prisma.paymentTransaction.create({
      data: {
        userId,
        caregiverId: caregiver.id,
        amount: dto.amount,
        currency: dto.currency,
        type: PAYMENT_TYPE.CAREGIVER_PAYOUT,
        status: PAYMENT_STATUS.PENDING,
        metadata: {
          caregiverId: caregiver.id,
        } as Prisma.JsonObject,
      },
    });

    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: dto.currency,
            product_data: {
              name: `Payment to ${this.caregiverName(caregiver)}`,
            },
            unit_amount: amountCents,
          },
          quantity: 1,
        },
      ],
      metadata: {
        transactionId: transaction.id,
        caregiverId: caregiver.id,
        userId,
      },
      payment_intent_data: {
        transfer_data: {
          destination: caregiver.stripeAccountId,
        },
        metadata: {
          transactionId: transaction.id,
          caregiverId: caregiver.id,
        },
      },
      success_url: this.ensureCheckoutRedirect(dto.successUrl),
      cancel_url: dto.cancelUrl,
    });

    await this.prisma.paymentTransaction.update({
      where: { id: transaction.id },
      data: {
        stripeCheckoutSessionId: session.id,
        metadata: {
          caregiverId: caregiver.id,
          sessionId: session.id,
          sessionUrl: session.url,
        } as Prisma.JsonObject,
      },
    });

    return {
      sessionId: session.id,
      checkoutUrl: session.url,
    };
  }

  async confirmCaregiverCheckout(
    { userId, role }: AuthContext,
    dto: ConfirmCheckoutDto,
  ) {
    const session = await this.stripe.checkout.sessions.retrieve(
      dto.sessionId,
      {
        expand: ['payment_intent'],
      },
    );

    const transactionId = session.metadata?.transactionId;
    if (!transactionId) {
      throw new NotFoundException(
        'Checkout session metadata missing transaction reference',
      );
    }

    const prisma: any = this.prisma;

    const transaction: any = await prisma.paymentTransaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction || transaction.userId !== userId) {
      throw new NotFoundException('Payment transaction not found');
    }

    if (transaction.status === PAYMENT_STATUS.SUCCEEDED) {
      return { success: true };
    }

    if (session.payment_status !== 'paid') {
      await prisma.paymentTransaction.update({
        where: { id: transaction.id },
        data: { status: PAYMENT_STATUS.FAILED },
      });

      throw new BadRequestException('Payment has not completed yet');
    }

    const paymentIntentId =
      typeof session.payment_intent === 'string'
        ? session.payment_intent
        : (session.payment_intent?.id ?? null);

    const metadata = this.mergeMetadata(transaction.metadata, {
      sessionId: session.id,
      paymentIntentId,
    });

    let stripeTransferId: string | undefined;

    if (paymentIntentId) {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(
        paymentIntentId,
        {
          expand: ['latest_charge', 'latest_charge.transfer'],
        },
      );

      const latestCharge = paymentIntent.latest_charge as
        | Stripe.Charge
        | undefined;
      if (latestCharge && typeof latestCharge.transfer === 'string') {
        stripeTransferId = latestCharge.transfer;
      }
    }

    await this.prisma.paymentTransaction.update({
      where: { id: transaction.id },
      data: {
        status: PAYMENT_STATUS.SUCCEEDED,
        stripePaymentIntentId: paymentIntentId,
        stripeTransferId,
        metadata: metadata as Prisma.JsonObject,
      },
    });

    this.eventEmitter.emit(ActivityEvents.PAYMENT_SUCCEEDED, {
      userId,
      actorRole: role,
      transactionId: transaction.id,
      paymentType: PAYMENT_TYPE.CAREGIVER_PAYOUT,
      amount: transaction.amount,
      caregiverId: transaction.caregiverId,
    });

    return { success: true };
  }

  private toMinorCurrency(amount: number) {
    return Math.round(amount * 100);
  }

  private ensureCheckoutRedirect(url: string) {
    if (url.includes('{CHECKOUT_SESSION_ID}')) {
      return url;
    }

    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}session_id={CHECKOUT_SESSION_ID}`;
  }

  private caregiverName(caregiver: {
    firstName?: string | null;
    lastName?: string | null;
  }) {
    const parts = [caregiver.firstName, caregiver.lastName].filter(Boolean);
    return parts.length ? parts.join(' ') : 'Caregiver';
  }

  private mergeMetadata(
    existing: Prisma.JsonValue | null | undefined,
    additions: Record<string, unknown>,
  ) {
    const baseRecord: Record<string, unknown> =
      existing && typeof existing === 'object' && !Array.isArray(existing)
        ? { ...(existing as Record<string, unknown>) }
        : {};

    return {
      ...baseRecord,
      ...additions,
    } as Prisma.JsonObject;
  }
}

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const event_emitter_1 = require("@nestjs/event-emitter");
const stripe_1 = __importDefault(require("stripe"));
const prisma_service_1 = require("../prisma/prisma.service");
const subscription_service_1 = require("../subscription/subscription.service");
const activity_events_1 = require("../activity/activity.events");
const PAYMENT_STATUS = {
    PENDING: 'PENDING',
    SUCCEEDED: 'SUCCEEDED',
    FAILED: 'FAILED',
    REFUNDED: 'REFUNDED',
};
const PAYMENT_TYPE = {
    SUBSCRIPTION: 'SUBSCRIPTION',
    CAREGIVER_PAYOUT: 'CAREGIVER_PAYOUT',
};
let PaymentsService = class PaymentsService {
    configService;
    prisma;
    subscriptionService;
    eventEmitter;
    stripe;
    constructor(configService, prisma, subscriptionService, eventEmitter) {
        this.configService = configService;
        this.prisma = prisma;
        this.subscriptionService = subscriptionService;
        this.eventEmitter = eventEmitter;
        const secretKey = this.configService.get('STRIPE_SECRET_KEY');
        if (!secretKey) {
            throw new Error('STRIPE_SECRET_KEY is not configured');
        }
        this.stripe = new stripe_1.default(secretKey, {
            apiVersion: '2025-12-15.clover',
        });
    }
    async createSubscriptionCheckout({ userId, email }, dto) {
        const plan = await this.prisma.subscriptionPlan.findUnique({
            where: { id: dto.planId },
        });
        if (!plan) {
            throw new common_1.NotFoundException('Subscription plan not found');
        }
        if (!plan.stripePriceId) {
            throw new common_1.BadRequestException('Plan is missing Stripe price configuration');
        }
        if (!email) {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
                select: { email: true },
            });
            email = user?.email ?? undefined;
        }
        if (!email) {
            throw new common_1.BadRequestException('User email is required for checkout');
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
                },
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
                },
            },
        });
        return {
            sessionId: session.id,
            checkoutUrl: session.url,
        };
    }
    async confirmSubscriptionCheckout({ userId, role }, dto) {
        const session = await this.stripe.checkout.sessions.retrieve(dto.sessionId, {
            expand: ['subscription', 'payment_intent'],
        });
        const transactionId = session.metadata?.transactionId;
        if (!transactionId) {
            throw new common_1.NotFoundException('Checkout session metadata missing transaction reference');
        }
        const transaction = await this.prisma.paymentTransaction.findUnique({
            where: { id: transactionId },
        });
        if (!transaction || transaction.userId !== userId) {
            throw new common_1.NotFoundException('Payment transaction not found');
        }
        if (transaction.status === PAYMENT_STATUS.SUCCEEDED) {
            return { success: true };
        }
        if (session.payment_status !== 'paid') {
            await this.prisma.paymentTransaction.update({
                where: { id: transaction.id },
                data: { status: PAYMENT_STATUS.FAILED },
            });
            throw new common_1.BadRequestException('Payment has not completed yet');
        }
        const paymentIntentId = typeof session.payment_intent === 'string'
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
                metadata: metadata,
            },
        });
        const planId = metadata.planId ?? session.metadata?.planId;
        if (!planId || typeof planId !== 'string') {
            throw new common_1.BadRequestException('Plan reference missing from payment metadata');
        }
        await this.subscriptionService.renewSubscription(userId, { planId });
        this.eventEmitter.emit(activity_events_1.ActivityEvents.PAYMENT_SUCCEEDED, {
            userId,
            actorRole: role,
            transactionId: transaction.id,
            paymentType: PAYMENT_TYPE.SUBSCRIPTION,
            amount: transaction.amount,
        });
        return { success: true };
    }
    async createCaregiverCheckout({ userId, email, role }, dto) {
        if (!email) {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
                select: { email: true },
            });
            email = user?.email ?? undefined;
        }
        if (!email) {
            throw new common_1.BadRequestException('User email is required for checkout');
        }
        const caregiver = await this.prisma.caregiver.findUnique({
            where: { id: dto.caregiverId },
        });
        if (!caregiver) {
            throw new common_1.NotFoundException('Caregiver not found');
        }
        if (!caregiver.stripeAccountId) {
            throw new common_1.BadRequestException('Caregiver has no Stripe account connected');
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
                },
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
                },
            },
        });
        return {
            sessionId: session.id,
            checkoutUrl: session.url,
        };
    }
    async confirmCaregiverCheckout({ userId, role }, dto) {
        const session = await this.stripe.checkout.sessions.retrieve(dto.sessionId, {
            expand: ['payment_intent'],
        });
        const transactionId = session.metadata?.transactionId;
        if (!transactionId) {
            throw new common_1.NotFoundException('Checkout session metadata missing transaction reference');
        }
        const prisma = this.prisma;
        const transaction = await prisma.paymentTransaction.findUnique({
            where: { id: transactionId },
        });
        if (!transaction || transaction.userId !== userId) {
            throw new common_1.NotFoundException('Payment transaction not found');
        }
        if (transaction.status === PAYMENT_STATUS.SUCCEEDED) {
            return { success: true };
        }
        if (session.payment_status !== 'paid') {
            await prisma.paymentTransaction.update({
                where: { id: transaction.id },
                data: { status: PAYMENT_STATUS.FAILED },
            });
            throw new common_1.BadRequestException('Payment has not completed yet');
        }
        const paymentIntentId = typeof session.payment_intent === 'string'
            ? session.payment_intent
            : (session.payment_intent?.id ?? null);
        const metadata = this.mergeMetadata(transaction.metadata, {
            sessionId: session.id,
            paymentIntentId,
        });
        let stripeTransferId;
        if (paymentIntentId) {
            const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId, {
                expand: ['latest_charge', 'latest_charge.transfer'],
            });
            const latestCharge = paymentIntent.latest_charge;
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
                metadata: metadata,
            },
        });
        this.eventEmitter.emit(activity_events_1.ActivityEvents.PAYMENT_SUCCEEDED, {
            userId,
            actorRole: role,
            transactionId: transaction.id,
            paymentType: PAYMENT_TYPE.CAREGIVER_PAYOUT,
            amount: transaction.amount,
            caregiverId: transaction.caregiverId,
        });
        return { success: true };
    }
    toMinorCurrency(amount) {
        return Math.round(amount * 100);
    }
    ensureCheckoutRedirect(url) {
        if (url.includes('{CHECKOUT_SESSION_ID}')) {
            return url;
        }
        const separator = url.includes('?') ? '&' : '?';
        return `${url}${separator}session_id={CHECKOUT_SESSION_ID}`;
    }
    caregiverName(caregiver) {
        const parts = [caregiver.firstName, caregiver.lastName].filter(Boolean);
        return parts.length ? parts.join(' ') : 'Caregiver';
    }
    mergeMetadata(existing, additions) {
        const baseRecord = existing && typeof existing === 'object' && !Array.isArray(existing)
            ? { ...existing }
            : {};
        return {
            ...baseRecord,
            ...additions,
        };
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService,
        subscription_service_1.SubscriptionService,
        event_emitter_1.EventEmitter2])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map
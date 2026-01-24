import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaymentsService } from './payments.service';
import { CreateSubscriptionCheckoutDto } from './dto/create-subscription-checkout.dto';
import { ConfirmCheckoutDto } from './dto/confirm-subscription.dto';
import { CreateCaregiverCheckoutDto } from './dto/create-payout-intent.dto';
import { CheckoutSessionResponseDto } from './dto/checkout-response.dto';
import { PaymentConfirmationResponseDto } from './dto/confirmation-response.dto';

interface AuthContext {
  userId: string;
  email?: string;
  role?: string;
}

@ApiTags('Payments')
@ApiBearerAuth('bearer')
@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('subscription/checkout')
  @ApiOperation({
    summary: 'Create a Stripe Checkout session for a subscription plan',
  })
  @ApiBody({ type: CreateSubscriptionCheckoutDto })
  @ApiCreatedResponse({
    description: 'Stripe Checkout session created successfully',
    type: CheckoutSessionResponseDto,
  })
  async createSubscriptionCheckout(
    @Request() req: any,
    @Body() dto: CreateSubscriptionCheckoutDto,
  ) {
    const context = this.getContext(req);
    return this.paymentsService.createSubscriptionCheckout(context, dto);
  }

  @Post('subscription/confirm')
  @ApiOperation({
    summary: 'Confirm a subscription checkout session after payment success',
  })
  @ApiBody({ type: ConfirmCheckoutDto })
  @ApiOkResponse({
    description: 'Subscription payment confirmed and subscription activated/renewed',
    type: PaymentConfirmationResponseDto,
  })
  async confirmSubscriptionCheckout(
    @Request() req: any,
    @Body() dto: ConfirmCheckoutDto,
  ) {
    const context = this.getContext(req);
    return this.paymentsService.confirmSubscriptionCheckout(context, dto);
  }

  @Post('caregiver/checkout')
  @ApiOperation({
    summary: 'Create a Stripe Checkout session to pay a caregiver directly',
  })
  @ApiBody({ type: CreateCaregiverCheckoutDto })
  @ApiCreatedResponse({
    description: 'Stripe Checkout session created successfully for a caregiver payment',
    type: CheckoutSessionResponseDto,
  })
  async createCaregiverCheckout(
    @Request() req: any,
    @Body() dto: CreateCaregiverCheckoutDto,
  ) {
    const context = this.getContext(req);
    return this.paymentsService.createCaregiverCheckout(context, dto);
  }

  @Post('caregiver/confirm')
  @ApiOperation({
    summary:
      'Confirm a caregiver payout checkout session after payment success',
  })
  @ApiBody({ type: ConfirmCheckoutDto })
  @ApiOkResponse({
    description: 'Caregiver payment confirmed and funds transferred',
    type: PaymentConfirmationResponseDto,
  })
  async confirmCaregiverCheckout(
    @Request() req: any,
    @Body() dto: ConfirmCheckoutDto,
  ) {
    const context = this.getContext(req);
    return this.paymentsService.confirmCaregiverCheckout(context, dto);
  }

  private getContext(req: any): AuthContext {
    return {
      userId: req.user?.userId,
      email: req.user?.email,
      role: req.user?.role,
    };
  }
}

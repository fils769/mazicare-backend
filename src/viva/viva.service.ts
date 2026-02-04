import { Injectable, BadRequestException } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VivaService {
  constructor(private prisma: PrismaService) {}

  private getAuthHeader() {
    return {
      Authorization:
        'Basic ' +
        Buffer.from(
          `${process.env.VIVA_WALLET_MERCHANT_ID}:${process.env.VIVA_WALLET_API_KEY}`,
        ).toString('base64'),
    };
  }

  /* =====================================================
      CREATE NEW ORDER
  ====================================================== */
//   async createOrder(userId: string, planId: string) {
//     const plan = await this.prisma.subscriptionPlan.findUnique({
//       where: { id: planId },
//     });

//     if (!plan) throw new BadRequestException('Plan not found');
//     if (plan.basePrice == null) throw new BadRequestException('Plan base price not defined');
//     if (plan.vatRate == null) throw new BadRequestException('Plan VAT rate not defined');

//     const vat = plan.basePrice * plan.vatRate;
//     const total = plan.basePrice + vat;

//     const response = await axios.post(
//       `${process.env.VIVA_BASE_URL}/api/orders`,
//       {
//         amount: Math.round(total * 100), // cents
//         customerTrns: `${plan.name} Subscription`,
//         sourceCode: 'Default',
//         redirectUrl: `${process.env.FRONTEND_URL}/subscription?success=true`,
//         cancelUrl: `${process.env.FRONTEND_URL}/subscription?canceled=true`,
//       },
//       { headers: this.getAuthHeader() },
//     );

//     const orderCode = response.data.OrderCode;

//     await this.prisma.paymentOrder.create({
//       data: {
//         userId,
//         planId,
//         orderCode,
//         amount: Math.round(total * 100),
//         currency: 'EUR',
//         paymentType: 'SUBSCRIPTION',
//       },
//     });

//     return {
//       checkoutUrl: `${process.env.VIVA_BASE_URL}/web/checkout?ref=${orderCode}`,
//     };
//   }

async createOrder(userId: string, planId: string) {
    const plan = await this.prisma.subscriptionPlan.findUnique({
      where: { id: planId },
    });
  
    if (!plan || plan.basePrice == null || plan.vatRate == null) {
      throw new BadRequestException('Plan details incomplete or not found');
    }
  
    // 1. Precise Calculation: Viva requires the amount in CENTS
    const vatAmount = plan.basePrice * plan.vatRate;
    const totalAmountCents = Math.round((plan.basePrice + vatAmount) * 100);
  
    // 2. Clear Customer Display: Appears on the Smart Checkout page
    // The 'customerTrns' field is highly recommended for conversion
    const customerDescription = `${plan.name} Subscription (Inc. VAT)`;
  
    const response = await axios.post(
      `${process.env.VIVA_BASE_URL}/api/orders`,
      {
        amount: totalAmountCents,
        customerTrns: customerDescription, // Displayed to customer
        merchantTrns: `User:${userId}|Plan:${planId}`, // Internal reference
        sourceCode: 'Default',
        // Note: Success/Failure URLs are often pre-configured in the Viva portal
      },
      { headers: this.getAuthHeader() },
    );
  
    const orderCode = response.data.OrderCode;
  
    // 3. Save Order for Reconciliation
    await this.prisma.paymentOrder.create({
      data: {
        userId,
        planId,
        orderCode: orderCode.toString(),
        amount: totalAmountCents,
        currency: 'EUR',
        paymentType: 'SUBSCRIPTION',
      },
    });
  
    return {
      // 4. Redirect: The 'ref' parameter displays the total amount and your logo automatically
      checkoutUrl: `${process.env.VIVA_BASE_URL}/web/checkout?ref=${orderCode}`,
    };
  }
  

  /* =====================================================
      VERIFY PAYMENT & ACTIVATE SUBSCRIPTION
  ====================================================== */
  async verifyAndActivate(orderCode: bigint, transactionId: string) {
    console.log(`🔍 Looking for payment with orderCode: ${orderCode}`);
    
    const payment = await this.prisma.paymentOrder.findUnique({
      where: { orderCode },
    });

    if (!payment) {
      console.log('❌ Payment not found');
      return;
    }
    
    if (payment.status === 'SUCCEEDED') {
      console.log('ℹ️ Payment already processed');
      return;
    }

    console.log(`✅ Found payment: ${payment.id}`);

    console.log(`🔍 Verifying transaction: ${transactionId}`);
    const tx = await axios.get(
      `${process.env.VIVA_BASE_URL}/api/transactions/${transactionId}`,
      { headers: this.getAuthHeader() },
    );

    console.log('📋 Transaction API response:', JSON.stringify(tx.data, null, 2));

    const transaction = tx.data.Transactions?.[0];
    if (!transaction || transaction.StatusId !== 'F') {
      console.log(`❌ Transaction not successful. Status: ${transaction?.StatusId || 'not found'}`);
      return;
    }

    console.log('✅ Transaction verified as successful');

    const plan = await this.prisma.subscriptionPlan.findUnique({
      where: { id: payment.planId },
    });

    if (!plan || plan.durationMonths == null) {
      throw new BadRequestException('Plan durationMonths is not defined');
    }
    if (plan.basePrice == null || plan.vatRate == null) {
      throw new BadRequestException('Plan pricing information is incomplete');
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + plan.durationMonths);

    console.log('💾 Updating subscription...');
    await this.prisma.subscription.upsert({
      where: { userId: payment.userId },
      update: {
        status: 'ACTIVE',
        startDate,
        endDate,
        cancelledAt: null,
        priceExclVat: plan.basePrice,
        vatAmount: plan.basePrice * plan.vatRate,
        totalAmount: plan.basePrice + plan.basePrice * plan.vatRate,
      },
      create: {
        userId: payment.userId,
        planId: plan.id,
        status: 'ACTIVE',
        startDate,
        endDate,
        priceExclVat: plan.basePrice,
        vatAmount: plan.basePrice * plan.vatRate,
        totalAmount: plan.basePrice + plan.basePrice * plan.vatRate,
      },
    });

    console.log('💾 Updating payment order status...');
    await this.prisma.paymentOrder.update({
      where: { orderCode },
      data: { status: 'SUCCEEDED', transactionId },
    });
    
    console.log('✅ Payment processing completed');
  }

  /* =====================================================
      MANUAL USER CANCEL SUBSCRIPTION
  ====================================================== */
  async cancelSubscription(userId: string) {
    if (!userId?.trim()) {
      throw new BadRequestException('User ID is required');
    }

    const subscription = await this.prisma.subscription.findUnique({
      where: { userId },
    });

    if (!subscription) {
      throw new BadRequestException('No subscription found for this user');
    }

    if (subscription.status === 'CANCELLED') {
      throw new BadRequestException('Subscription is already cancelled');
    }

    if (subscription.status === 'EXPIRED') {
      throw new BadRequestException('Cannot cancel an expired subscription');
    }

    // Check if subscription has already ended
    if (subscription.endDate && subscription.endDate < new Date()) {
      throw new BadRequestException('Cannot cancel a subscription that has already ended');
    }

    await this.prisma.subscription.update({
      where: { userId },
      data: {
        cancelledAt: new Date(),
        status: 'CANCELLED',
      },
    });

    return { message: 'Subscription cancelled successfully' };
  }
}

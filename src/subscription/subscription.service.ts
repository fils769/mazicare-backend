import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RenewSubscriptionDto } from './dto/subscription.dto';

@Injectable()
export class SubscriptionService {
  constructor(private prisma: PrismaService) { }

  async getSubscription(userId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { userId },
      include: {
        plan: true
      }
    });

    if (!subscription) {
      return null;
    }

    return {
      ...subscription,
      planName: subscription.plan.name
    };
  }

  async renewSubscription(userId: string, renewData: RenewSubscriptionDto) {
    const plan = await this.prisma.subscriptionPlan.findUnique({
      where: { id: renewData.planId }
    });

    if (!plan) {
      throw new NotFoundException('Subscription plan not found');
    }

    const endDate = new Date();
    // Add 1 year for yearly subscription
    endDate.setFullYear(endDate.getFullYear() + 1);

    const subscription = await this.prisma.subscription.upsert({
      where: { userId },
      update: {
        planId: renewData.planId,
        endDate,
        price: plan.price,
        status: 'ACTIVE'
      },
      create: {
        userId,
        planId: renewData.planId,
        endDate,
        price: plan.price,
        status: 'ACTIVE'
      }
    });

    return {
      success: true,
      subscription,
      message: 'Subscription renewed successfully'
    };
  }

  async getPlans() {
    return this.prisma.subscriptionPlan.findMany({
      orderBy: { price: 'asc' }
    });
  }

  async cancelSubscription(userId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { userId }
    });

    if (!subscription) {
      throw new NotFoundException('No active subscription found');
    }

    const updatedSubscription = await this.prisma.subscription.update({
      where: { userId },
      data: {
        status: 'CANCELLED'
      }
    });

    return {
      success: true,
      subscription: updatedSubscription,
      message: 'Subscription cancelled successfully'
    };
  }
}
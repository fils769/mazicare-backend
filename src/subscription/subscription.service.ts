import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VivaService } from '../viva/viva.service';

@Injectable()
export class SubscriptionService {
  constructor(
    private prisma: PrismaService,
    private viva: VivaService,
  ) {}

  async startSubscription(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const plan = await this.prisma.subscriptionPlan.findFirst({
      where: { role: user.role },
    });

    if (!plan) {
      throw new Error('Subscription plan not found');
    }
    return this.viva.createOrder(userId, plan.id);
  }

  async getSubscription(userId: string) {
    return this.prisma.subscription.findUnique({
      where: { userId },
      include: { plan: true },
    });
  }
}

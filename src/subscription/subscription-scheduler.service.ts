import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SubscriptionSchedulerService {
  constructor(private prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async checkExpiredSubscriptions() {
    const now = new Date();
    
    const expiredCount = await this.prisma.subscription.updateMany({
      where: {
        status: 'ACTIVE',
        endDate: {
          lt: now,
        },
      },
      data: {
        status: 'EXPIRED',
      },
    });

    if (expiredCount.count > 0) {
      console.log(`📅 Updated ${expiredCount.count} expired subscriptions`);
    }
  }
}
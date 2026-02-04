import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { PrismaService } from '../prisma/prisma.service';
import { VivaService } from '../viva/viva.service';
import { SubscriptionSchedulerService } from './subscription-scheduler.service';

@Module({
  controllers: [SubscriptionController],
  providers: [SubscriptionService, PrismaService, VivaService, SubscriptionSchedulerService],
  exports: [SubscriptionService],
})
export class SubscriptionModule { }
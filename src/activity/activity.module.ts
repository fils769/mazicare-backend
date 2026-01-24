import { Module } from '@nestjs/common';
import { ActivityLogService } from './activity-log.service';
import { ActivityListeners } from './activity.listeners';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [ActivityLogService, ActivityListeners, PrismaService],
  exports: [ActivityLogService],
})
export class ActivityModule {}

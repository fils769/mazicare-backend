import { Module } from '@nestjs/common';
import { AdminAnalyticsController, FamilyAnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
    controllers: [AdminAnalyticsController, FamilyAnalyticsController],
    providers: [AnalyticsService, PrismaService],
    exports: [AnalyticsService],
})
export class AnalyticsModule { }

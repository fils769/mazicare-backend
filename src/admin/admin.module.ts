import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaService } from '../prisma/prisma.service';
import { ActivityModule } from '../activity/activity.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminGuard } from '../auth/guards/admin.guard';

@Module({
  imports: [ActivityModule, ConfigModule],
  controllers: [AdminController],
  providers: [AdminService, PrismaService, AdminGuard],
})
export class AdminModule {}

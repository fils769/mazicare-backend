import { Module } from '@nestjs/common';
import { DealsController } from './deals.controller';
import { DealsService } from './deals.service';
import { PrismaService } from '../prisma/prisma.service';
import { ActivityModule } from '../activity/activity.module';

@Module({
  imports: [ActivityModule],
  controllers: [DealsController],
  providers: [DealsService, PrismaService],
  exports: [DealsService],
})
export class DealsModule {}

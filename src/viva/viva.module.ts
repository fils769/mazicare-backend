import { Module } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { VivaService } from './viva.service';
import { VivaController } from './viva.controller';
import { VivaWebhookController } from 'src/webhooks/webhook.controller';

@Module({
  providers: [VivaService, PrismaService],
  controllers: [VivaController, VivaWebhookController],
  exports: [VivaService],
})
export class VivaModule {}

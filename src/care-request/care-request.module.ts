// src/care-request/care-request.module.ts
import { Module } from '@nestjs/common';
import { CareRequestService } from './care-request.service';
import { CareRequestController } from './care-request.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  
  controllers: [CareRequestController],
  providers: [CareRequestService, PrismaService],
  exports: [CareRequestService],
})
export class CareRequestModule {}
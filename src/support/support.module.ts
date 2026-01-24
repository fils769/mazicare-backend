import { Module } from '@nestjs/common';
import { SupportController, AdminSupportController } from './support.controller';
import { SupportService } from './support.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
    controllers: [SupportController, AdminSupportController],
    providers: [SupportService, PrismaService],
    exports: [SupportService],
})
export class SupportModule { }

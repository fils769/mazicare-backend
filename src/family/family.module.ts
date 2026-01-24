import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { FamilyController, FamiliesController } from './family.controller';
import { FamilyService } from './family.service';
import { PrismaService } from '../prisma/prisma.service';
import { UploadThingService } from '../uploadthing/uploadthing.service';

@Module({
  imports: [
    MulterModule.register({
      storage: memoryStorage()
    }),
  ],
  controllers: [FamilyController, FamiliesController],
  providers: [FamilyService, PrismaService, UploadThingService],
})
export class FamilyModule { }
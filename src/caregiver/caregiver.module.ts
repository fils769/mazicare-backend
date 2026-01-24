import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CaregiverController, CaregiversController } from './caregiver.controller';
import { CaregiverService } from './caregiver.service';
import { PrismaService } from '../prisma/prisma.service';
import { UploadThingService } from '../uploadthing/uploadthing.service';

@Module({
  imports: [
    MulterModule.register({
      storage: memoryStorage()
    }),
  ],
  controllers: [CaregiverController, CaregiversController],
  providers: [CaregiverService, PrismaService, UploadThingService],
})
export class CaregiverModule {}
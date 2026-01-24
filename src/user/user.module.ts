import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { UploadThingService } from '../uploadthing/uploadthing.service';

@Module({
  imports: [
    MulterModule.register({
      storage: memoryStorage()
    }),
  ],
  controllers: [UserController],
  providers: [UserService, PrismaService, UploadThingService],
})
export class UserModule {}
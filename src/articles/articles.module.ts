import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { PrismaService } from '../prisma/prisma.service';
import { UploadThingService } from '../uploadthing/uploadthing.service';

@Module({
  controllers: [ArticlesController],
  providers: [ArticlesService, PrismaService, UploadThingService],
})
export class ArticlesModule {}
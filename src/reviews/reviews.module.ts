import { Module } from '@nestjs/common';
import { ReviewsController, AdminReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
    controllers: [ReviewsController, AdminReviewsController],
    providers: [ReviewsService, PrismaService],
    exports: [ReviewsService],
})
export class ReviewsModule { }

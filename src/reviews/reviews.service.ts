import {
    Injectable,
    NotFoundException,
    ForbiddenException,
    BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class ReviewsService {
    constructor(private prisma: PrismaService) { }

    async createReview(userId: string, dto: CreateReviewDto) {
        // 1. Check if caregiver exists
        const caregiver = await this.prisma.caregiver.findUnique({
          where: { id: dto.caregiverId },
        });
      
        if (!caregiver) {
          throw new NotFoundException('Caregiver not found');
        }
      
        // 2. Prevent self-review
        if (caregiver.userId === userId) {
          throw new BadRequestException('You cannot review yourself');
        }
      
        // 3. Ensure user is a family member
        const family = await this.prisma.family.findUnique({
          where: { userId },
          select: { id: true },
        });
      
        if (!family) {
          throw new ForbiddenException('Only family members can review caregivers');
        }
      
        // 4. Check if this family EVER worked with this caregiver
        const workedTogether = await this.prisma.careRequest.findFirst({
          where: {
            caregiverId: dto.caregiverId,
            status: 'ACCEPTED',
            elder: {
              familyId: family.id,
            },
          },
        });
      
        if (!workedTogether) {
          throw new ForbiddenException(
            'You can only review caregivers you have worked with',
          );
        }
      
        const existingReview = await this.prisma.review.findFirst({
            where: {
              reviewerId: userId,
              caregiverId: dto.caregiverId,
            },
          });
          
          if (existingReview) {
            throw new BadRequestException({
                key: 'reviews.alreadyReviewed',
              });
              
          }
          
        // 5. Create review
        const review = await this.prisma.review.create({
          data: {
            reviewerId: userId,
            caregiverId: dto.caregiverId,
            rating: dto.rating,
            comment: dto.comment,
          },
          include: {
            reviewer: {
              select: {
                id: true,
                email: true,
                family: {
                  select: {
                    familyName: true,
                    profilePicture: true,
                  },
                },
              },
            },
          },
        });
      
        return review;
      }
      

    async getCaregiverReviews(caregiverId: string) {
        const reviews = await this.prisma.review.findMany({
            where: { caregiverId },
            orderBy: { createdAt: 'desc' },
            include: {
                reviewer: {
                    select: {
                        id: true,
                        email: true,
                        family: {
                            select: {
                                familyName: true,
                                profilePicture: true,
                            },
                        },
                    },
                },
            },
        });

        return reviews.map((review) => ({
            id: review.id,
            rating: review.rating,
            comment: review.comment,
            createdAt: review.createdAt,
            reviewer: {
                id: review.reviewer.id,
                name: review.reviewer.family?.familyName || 'Family User',
                avatar: review.reviewer.family?.profilePicture,
            },
        }));
    }

    async getCaregiverStats(caregiverId: string) {
        const reviews = await this.prisma.review.findMany({
            where: { caregiverId },
            select: { rating: true },
        });

        const total = reviews.length;
        if (total === 0) {
            return {
                averageRating: 0,
                totalReviews: 0,
                distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
            };
        }

        const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
        const averageRating = parseFloat((sum / total).toFixed(1));

        const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        reviews.forEach((r) => {
            if (distribution[r.rating] !== undefined) {
                distribution[r.rating]++;
            }
        });

        return {
            averageRating,
            totalReviews: total,
            distribution,
        };
    }

    async getAllReviews() {
        const reviews = await this.prisma.review.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                reviewer: {
                    select: {
                        id: true,
                        email: true,
                        family: {
                            select: {
                                familyName: true,
                            },
                        },
                    },
                },
                caregiver: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });

        return reviews.map((review) => ({
            id: review.id,
            rating: review.rating,
            comment: review.comment,
            createdAt: review.createdAt,
            reviewerName: review.reviewer.family?.familyName || 'Unknown User',
            caregiverName: `${review.caregiver.firstName} ${review.caregiver.lastName}`,
        }));
    }

    async deleteReview(reviewId: string, userId: string, userRole: string) {
        const review = await this.prisma.review.findUnique({
            where: { id: reviewId },
        });

        if (!review) {
            throw new NotFoundException('Review not found');
        }

        // Allow deletion if user owns the review OR is an ADMIN
        if (review.reviewerId !== userId && userRole !== 'ADMIN') {
            throw new ForbiddenException('You can only delete your own reviews');
        }

        await this.prisma.review.delete({
            where: { id: reviewId },
        });

        return { success: true, message: 'Review deleted successfully' };
    }

    async getMyReviews(userId: string) {
        const reviews = await this.prisma.review.findMany({
            where: { reviewerId: userId },
            orderBy: { createdAt: 'desc' },
            include: {
                caregiver: {
                    select: {
                        firstName: true,
                        lastName: true,
                        id: true,
                    },
                },
            },
        });

        return reviews;
    }
}

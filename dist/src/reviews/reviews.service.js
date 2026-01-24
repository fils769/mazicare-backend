"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ReviewsService = class ReviewsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createReview(userId, dto) {
        const caregiver = await this.prisma.caregiver.findUnique({
            where: { id: dto.caregiverId },
        });
        if (!caregiver) {
            throw new common_1.NotFoundException('Caregiver not found');
        }
        if (caregiver.userId === userId) {
            throw new common_1.BadRequestException('You cannot review yourself');
        }
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
    async getCaregiverReviews(caregiverId) {
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
    async getCaregiverStats(caregiverId) {
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
    async deleteReview(reviewId, userId, userRole) {
        const review = await this.prisma.review.findUnique({
            where: { id: reviewId },
        });
        if (!review) {
            throw new common_1.NotFoundException('Review not found');
        }
        if (review.reviewerId !== userId && userRole !== 'ADMIN') {
            throw new common_1.ForbiddenException('You can only delete your own reviews');
        }
        await this.prisma.review.delete({
            where: { id: reviewId },
        });
        return { success: true, message: 'Review deleted successfully' };
    }
    async getMyReviews(userId) {
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
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map
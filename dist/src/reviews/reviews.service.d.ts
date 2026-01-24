import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
export declare class ReviewsService {
    private prisma;
    constructor(prisma: PrismaService);
    createReview(userId: string, dto: CreateReviewDto): Promise<{
        reviewer: {
            id: string;
            email: string;
            family: {
                profilePicture: string | null;
                familyName: string | null;
            } | null;
        };
    } & {
        id: string;
        createdAt: Date;
        caregiverId: string;
        reviewerId: string;
        rating: number;
        comment: string | null;
    }>;
    getCaregiverReviews(caregiverId: string): Promise<{
        id: string;
        rating: number;
        comment: string | null;
        createdAt: Date;
        reviewer: {
            id: string;
            name: string;
            avatar: string | null | undefined;
        };
    }[]>;
    getCaregiverStats(caregiverId: string): Promise<{
        averageRating: number;
        totalReviews: number;
        distribution: {
            1: number;
            2: number;
            3: number;
            4: number;
            5: number;
        };
    }>;
    getAllReviews(): Promise<{
        id: string;
        rating: number;
        comment: string | null;
        createdAt: Date;
        reviewerName: string;
        caregiverName: string;
    }[]>;
    deleteReview(reviewId: string, userId: string, userRole: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getMyReviews(userId: string): Promise<({
        caregiver: {
            id: string;
            firstName: string | null;
            lastName: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        caregiverId: string;
        reviewerId: string;
        rating: number;
        comment: string | null;
    })[]>;
}

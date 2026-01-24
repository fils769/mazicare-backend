import { SubscriptionService } from './subscription.service';
import { RenewSubscriptionDto } from './dto/subscription.dto';
export declare class SubscriptionController {
    private subscriptionService;
    constructor(subscriptionService: SubscriptionService);
    getSubscription(req: any): Promise<{
        planName: string;
        plan: {
            id: string;
            name: string;
            price: number;
            features: string[];
            duration: string;
            stripePriceId: string | null;
            createdAt: Date;
        };
        id: string;
        price: number;
        createdAt: Date;
        status: import(".prisma/client").$Enums.SubscriptionStatus;
        startDate: Date;
        endDate: Date;
        updatedAt: Date;
        userId: string;
        planId: string;
    } | null>;
    renewSubscription(req: any, renewData: RenewSubscriptionDto): Promise<{
        success: boolean;
        subscription: {
            id: string;
            price: number;
            createdAt: Date;
            status: import(".prisma/client").$Enums.SubscriptionStatus;
            startDate: Date;
            endDate: Date;
            updatedAt: Date;
            userId: string;
            planId: string;
        };
        message: string;
    }>;
    getPlans(): Promise<{
        id: string;
        name: string;
        price: number;
        features: string[];
        duration: string;
        stripePriceId: string | null;
        createdAt: Date;
    }[]>;
    cancelSubscription(req: any): Promise<{
        success: boolean;
        subscription: {
            id: string;
            price: number;
            createdAt: Date;
            status: import(".prisma/client").$Enums.SubscriptionStatus;
            startDate: Date;
            endDate: Date;
            updatedAt: Date;
            userId: string;
            planId: string;
        };
        message: string;
    }>;
}

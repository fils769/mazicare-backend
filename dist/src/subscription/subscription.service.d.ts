import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../prisma/prisma.service';
import { RenewSubscriptionDto } from './dto/subscription.dto';
export declare class SubscriptionService {
    private prisma;
    private eventEmitter;
    constructor(prisma: PrismaService, eventEmitter: EventEmitter2);
    getSubscription(userId: string): Promise<{
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
    renewSubscription(userId: string, renewData: RenewSubscriptionDto): Promise<{
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
    cancelSubscription(userId: string): Promise<{
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

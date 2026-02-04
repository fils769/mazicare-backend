import { SubscriptionService } from './subscription.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class SubscriptionController {
    private service;
    private prisma;
    constructor(service: SubscriptionService, prisma: PrismaService);
    getPlans(req: any): Promise<{
        id: string;
        name: string;
        features: string[];
        basePrice: number | null;
        durationMonths: number | null;
        role: import(".prisma/client").$Enums.UserRole | null;
        vatRate: number | null;
    }[]>;
    getSubscription(req: any): Promise<{
        id: string;
        planId: string;
        planName: string;
        status: string;
        currentPeriodEnd: string;
        cancelAtPeriodEnd: boolean;
    }>;
    checkout(req: any): Promise<{
        checkoutUrl: string;
    }>;
    mySubscription(req: any): Promise<({
        plan: {
            id: string;
            name: string;
            features: string[];
            createdAt: Date;
            basePrice: number | null;
            durationMonths: number | null;
            role: import(".prisma/client").$Enums.UserRole | null;
            vatRate: number | null;
        };
    } & {
        id: string;
        createdAt: Date;
        planId: string;
        status: import(".prisma/client").$Enums.SubscriptionStatus;
        updatedAt: Date;
        userId: string;
        startDate: Date;
        endDate: Date;
        cancelledAt: Date | null;
        priceExclVat: number | null;
        totalAmount: number | null;
        vatAmount: number | null;
    }) | null>;
}

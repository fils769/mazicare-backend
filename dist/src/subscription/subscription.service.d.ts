import { PrismaService } from '../prisma/prisma.service';
import { VivaService } from '../viva/viva.service';
export declare class SubscriptionService {
    private prisma;
    private viva;
    constructor(prisma: PrismaService, viva: VivaService);
    startSubscription(userId: string): Promise<{
        checkoutUrl: string;
    }>;
    getSubscription(userId: string): Promise<({
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

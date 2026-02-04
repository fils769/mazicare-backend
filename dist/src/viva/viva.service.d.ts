import { PrismaService } from '../prisma/prisma.service';
export declare class VivaService {
    private prisma;
    constructor(prisma: PrismaService);
    private getAuthHeader;
    createOrder(userId: string, planId: string): Promise<{
        checkoutUrl: string;
    }>;
    verifyAndActivate(orderCode: bigint, transactionId: string): Promise<void>;
    cancelSubscription(userId: string): Promise<{
        message: string;
    }>;
}

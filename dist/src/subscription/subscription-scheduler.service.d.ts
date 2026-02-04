import { PrismaService } from '../prisma/prisma.service';
export declare class SubscriptionSchedulerService {
    private prisma;
    constructor(prisma: PrismaService);
    checkExpiredSubscriptions(): Promise<void>;
}

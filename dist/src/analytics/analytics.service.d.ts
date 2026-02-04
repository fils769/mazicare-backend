import { PrismaService } from '../prisma/prisma.service';
export declare class AnalyticsService {
    private prisma;
    constructor(prisma: PrismaService);
    getUserGrowth(period?: string): Promise<{
        month: string;
        caregivers: number;
        families: number;
    }[]>;
    getFeatureUsage(period?: string): Promise<{
        month: string;
        caregiving: number;
        deals: number;
        onboarding: number;
    }[]>;
    getGenderDistribution(): Promise<{
        name: string;
        value: number;
    }[]>;
    getRecentActivity(limit?: number): Promise<any>;
    getFamilyRecentActivity(userId: string, limit?: number): Promise<any[]>;
    private formatActivityEvent;
}

import { AnalyticsService } from './analytics.service';
export declare class AdminAnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
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
}
export declare class FamilyAnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    getRecentActivity(req: any, limit?: number): Promise<any[]>;
}

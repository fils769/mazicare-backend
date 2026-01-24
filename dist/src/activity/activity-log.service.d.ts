import { PrismaService } from '../prisma/prisma.service';
export declare const ACTIVITY_CATEGORY: {
    readonly USER_ACTIVITY: "USER_ACTIVITY";
    readonly FEATURE_USAGE: "FEATURE_USAGE";
    readonly SYSTEM: "SYSTEM";
};
export type ActivityCategory = (typeof ACTIVITY_CATEGORY)[keyof typeof ACTIVITY_CATEGORY];
export interface LogEventInput {
    userId?: string;
    actorRole?: string;
    category: ActivityCategory;
    eventType: string;
    entityType?: string;
    entityId?: string;
    metadata?: Record<string, unknown> | null;
}
export interface ActivityFilters {
    category?: ActivityCategory;
    userId?: string;
    from?: Date;
    to?: Date;
    limit?: number;
}
export declare class ActivityLogService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    logEvent(payload: LogEventInput): Promise<any>;
    getUserActivity(userId: string, limit?: number): Promise<any>;
    getActivitiesByCategory(category: ActivityCategory, limit?: number): Promise<any>;
    getRecentActivities(filters?: ActivityFilters): Promise<any>;
}

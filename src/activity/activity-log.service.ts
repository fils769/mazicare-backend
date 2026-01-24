import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export const ACTIVITY_CATEGORY = {
  USER_ACTIVITY: 'USER_ACTIVITY',
  FEATURE_USAGE: 'FEATURE_USAGE',
  SYSTEM: 'SYSTEM',
} as const;

export type ActivityCategory =
  (typeof ACTIVITY_CATEGORY)[keyof typeof ACTIVITY_CATEGORY];

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

@Injectable()
export class ActivityLogService {
  constructor(private readonly prisma: PrismaService) {}

  async logEvent(payload: LogEventInput) {
    const prisma = this.prisma as any;

    return prisma.activityLog.create({
      data: {
        userId: payload.userId ?? null,
        actorRole: payload.actorRole,
        category: payload.category,
        eventType: payload.eventType,
        entityType: payload.entityType,
        entityId: payload.entityId,
        metadata: payload.metadata ?? undefined,
      },
    });
  }

  async getUserActivity(userId: string, limit = 20) {
    const prisma = this.prisma as any;

    return prisma.activityLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async getActivitiesByCategory(category: ActivityCategory, limit = 50) {
    const prisma = this.prisma as any;

    return prisma.activityLog.findMany({
      where: { category },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async getRecentActivities(filters: ActivityFilters = {}) {
    const prisma = this.prisma as any;

    return prisma.activityLog.findMany({
      where: {
        ...(filters.category && { category: filters.category }),
        ...(filters.userId && { userId: filters.userId }),
        ...(filters.from || filters.to
          ? {
              createdAt: {
                ...(filters.from && { gte: filters.from }),
                ...(filters.to && { lte: filters.to }),
              },
            }
          : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: filters.limit ?? 100,
    });
  }
}

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityLogService = exports.ACTIVITY_CATEGORY = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
exports.ACTIVITY_CATEGORY = {
    USER_ACTIVITY: 'USER_ACTIVITY',
    FEATURE_USAGE: 'FEATURE_USAGE',
    SYSTEM: 'SYSTEM',
};
let ActivityLogService = class ActivityLogService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async logEvent(payload) {
        const prisma = this.prisma;
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
    async getUserActivity(userId, limit = 20) {
        const prisma = this.prisma;
        return prisma.activityLog.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
    }
    async getActivitiesByCategory(category, limit = 50) {
        const prisma = this.prisma;
        return prisma.activityLog.findMany({
            where: { category },
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
    }
    async getRecentActivities(filters = {}) {
        const prisma = this.prisma;
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
};
exports.ActivityLogService = ActivityLogService;
exports.ActivityLogService = ActivityLogService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ActivityLogService);
//# sourceMappingURL=activity-log.service.js.map
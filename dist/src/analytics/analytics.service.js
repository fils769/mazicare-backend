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
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AnalyticsService = class AnalyticsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getUserGrowth(period = '12months') {
        const months = period === '6months' ? 6 : 12;
        const monthlyData = [];
        const now = new Date();
        for (let i = months - 1; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
            const monthName = date.toLocaleString('en-US', { month: 'short' });
            const [caregivers, families] = await Promise.all([
                this.prisma.user.count({
                    where: {
                        role: 'CAREGIVER',
                        createdAt: {
                            gte: date,
                            lt: nextMonth,
                        },
                    },
                }),
                this.prisma.user.count({
                    where: {
                        role: 'FAMILY',
                        createdAt: {
                            gte: date,
                            lt: nextMonth,
                        },
                    },
                }),
            ]);
            monthlyData.push({
                month: monthName,
                caregivers,
                families,
            });
        }
        return monthlyData;
    }
    async getFeatureUsage(period = '12months') {
        const months = period === '6months' ? 6 : 12;
        const monthlyData = [];
        const now = new Date();
        const prisma = this.prisma;
        for (let i = months - 1; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
            const monthName = date.toLocaleString('en-US', { month: 'short' });
            const [careRequests, dealClaims, newFamilies] = await Promise.all([
                this.prisma.careRequest.count({
                    where: {
                        createdAt: {
                            gte: date,
                            lt: nextMonth,
                        },
                    },
                }),
                prisma.dealClaim ? prisma.dealClaim.count({
                    where: {
                        createdAt: {
                            gte: date,
                            lt: nextMonth,
                        },
                    },
                }) : 0,
                this.prisma.family.count({
                    where: {
                        createdAt: {
                            gte: date,
                            lt: nextMonth,
                        },
                    },
                }),
            ]);
            monthlyData.push({
                month: monthName,
                caregiving: careRequests,
                deals: dealClaims,
                onboarding: newFamilies,
            });
        }
        return monthlyData;
    }
    async getGenderDistribution() {
        const elders = await this.prisma.elder.findMany({
            select: { gender: true },
        });
        const distribution = elders.reduce((acc, elder) => {
            const gender = elder.gender || 'OTHER';
            acc[gender] = (acc[gender] || 0) + 1;
            return acc;
        }, {});
        return Object.entries(distribution).map(([name, value]) => ({
            name: name.charAt(0) + name.slice(1).toLowerCase(),
            value,
        }));
    }
    async getRecentActivity(limit = 10) {
        const prisma = this.prisma;
        const activities = await prisma.activityLog.findMany({
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        email: true,
                        role: true,
                        caregiver: {
                            select: {
                                firstName: true,
                                lastName: true,
                            },
                        },
                        family: {
                            select: {
                                familyName: true,
                            },
                        },
                    },
                },
            },
        });
        return activities.map((activity) => {
            let name = 'Unknown User';
            if (activity.user) {
                if (activity.user.caregiver) {
                    name = `${activity.user.caregiver.firstName} ${activity.user.caregiver.lastName}`;
                }
                else if (activity.user.family) {
                    name = activity.user.family.familyName;
                }
                else {
                    name = activity.user.email;
                }
            }
            return {
                id: activity.id,
                name,
                role: activity.actorRole || activity.user?.role || 'Unknown',
                activity: this.formatActivityEvent(activity.eventType),
                timestamp: activity.createdAt,
            };
        });
    }
    async getFamilyRecentActivity(userId, limit = 5) {
        const family = await this.prisma.family.findUnique({
            where: { userId },
            include: {
                elders: {
                    select: { id: true, firstName: true, lastName: true },
                },
            },
        });
        if (!family) {
            return [];
        }
        const elderIds = family.elders.map((e) => e.id);
        const prisma = this.prisma;
        const scheduleActivities = await prisma.scheduleItem.findMany({
            where: {
                schedule: {
                    elderId: { in: elderIds },
                },
                status: 'COMPLETED',
            },
            orderBy: { updatedAt: 'desc' },
            take: limit,
            include: {
                schedule: {
                    include: {
                        elder: {
                            select: {
                                firstName: true,
                                lastName: true,
                            },
                        },
                    },
                },
            },
        });
        const requestActivities = await this.prisma.careRequest.findMany({
            where: {
                familyId: family.id,
            },
            orderBy: { createdAt: 'desc' },
            take: limit,
            include: {
                elder: {
                    select: {
                        firstName: true,
                        lastName: true,
                    },
                },
                caregiver: {
                    select: {
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });
        const allActivities = [
            ...scheduleActivities.map((item) => ({
                title: `${item.title} completed`,
                description: `${item.schedule.elder.firstName} completed ${item.title}`,
                timestamp: item.updatedAt,
                type: 'schedule',
            })),
            ...requestActivities.map((req) => ({
                title: `Caregiver request ${req.status.toLowerCase()}`,
                description: `Request for ${req.elder.firstName} ${req.elder.lastName} ${req.status === 'ACCEPTED' ? 'approved by' : 'from'} ${req.caregiver.firstName} ${req.caregiver.lastName}`,
                timestamp: req.respondedAt || req.createdAt,
                type: 'request',
            })),
        ]
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
            .slice(0, limit);
        return allActivities;
    }
    formatActivityEvent(eventType) {
        const eventMap = {
            'user.registered': 'Registration',
            'user.login': 'Login',
            'caregiver.profile_updated': 'Profile Update',
            'family.elder_created': 'Elder Added',
            'care_request.created': 'Care Request',
            'care_request.accepted': 'Request Accepted',
            'schedule.completed': 'Schedule Completed',
            'subscription.created': 'Subscription Started',
        };
        return eventMap[eventType] || eventType.replace(/_/g, ' ').replace(/\./g, ' - ');
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map
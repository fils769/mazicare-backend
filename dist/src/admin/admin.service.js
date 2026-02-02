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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const config_1 = require("@nestjs/config");
const stripe_1 = __importDefault(require("stripe"));
const prisma_service_1 = require("../prisma/prisma.service");
const activity_log_service_1 = require("../activity/activity-log.service");
const activity_events_1 = require("../activity/activity.events");
const admin_profile_query_dto_1 = require("./dto/admin-profile-query.dto");
const MS_IN_DAY = 1000 * 60 * 60 * 24;
let AdminService = class AdminService {
    prisma;
    activityLogService;
    configService;
    stripe;
    constructor(prisma, activityLogService, configService) {
        this.prisma = prisma;
        this.activityLogService = activityLogService;
        this.configService = configService;
        const secretKey = this.configService.get('STRIPE_SECRET_KEY');
        if (!secretKey) {
            throw new Error('STRIPE_SECRET_KEY is not configured');
        }
        this.stripe = new stripe_1.default(secretKey, {
            apiVersion: '2025-12-15.clover',
        });
    }
    async getActivityLogs(filters) {
        return this.activityLogService.getRecentActivities(filters);
    }
    async getFamilyAccounts() {
        const families = await this.prisma.family.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        status: true,
                        createdAt: true,
                        subscription: {
                            include: { plan: true },
                        },
                    },
                },
                elders: {
                    select: { id: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        const totalFamilies = families.length;
        const withActiveSubscription = families.filter((family) => family.user.subscription?.status === 'ACTIVE').length;
        return {
            totalFamilies,
            withActiveSubscription,
            families: families.map((family) => {
                const subscription = family.user.subscription ?? undefined;
                const progress = subscription
                    ? this.calculateSubscriptionProgress(subscription)
                    : null;
                const daysRemaining = subscription
                    ? Math.max(0, Math.ceil((subscription.endDate.getTime() - Date.now()) / MS_IN_DAY))
                    : null;
                return {
                    id: family.id,
                    familyName: family.familyName,
                    user: {
                        id: family.user.id,
                        email: family.user.email,
                        status: family.user.status,
                        createdAt: family.user.createdAt,
                    },
                    onboardingComplete: family.onboardingComplete,
                    eldersCount: family.elders.length,
                    subscription: subscription
                        ? {
                            id: subscription.id,
                            planId: subscription.planId,
                            planName: subscription.plan?.name,
                            status: subscription.status,
                            startDate: subscription.startDate,
                            endDate: subscription.endDate,
                            price: subscription.price,
                            progressPercent: progress,
                            daysRemaining,
                        }
                        : null,
                };
            }),
        };
    }
    async getCaregivers() {
        const caregivers = await this.prisma.caregiver.findMany({
            include: {
                user: true,
                caregiverRegion: true,
                programs: true,
                careRequests: { include: { elder: true } },
                certificates: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        return caregivers.map((c) => ({
            id: c.id,
            userId: c.userId,
            firstName: c.firstName,
            lastName: c.lastName,
            email: c.email || c.user.email,
            phone: c.phone,
            status: c.user.status,
            gender: c.gender,
            region: c.caregiverRegion?.name || c.region,
            experience: c.experience,
            languages: c.languages || [],
            bio: c.bio,
            dateOfBirth: c.dateOfBirth,
            onboardingComplete: c.onboardingComplete,
            assignedElders: c.careRequests.length,
            programs: c.programs.map((p) => p.name),
            documents: {
                profilePicture: c.profilePicture,
                documentUrl: c.documentUrl,
                idPassportPhoto: c.idPassportPhoto,
                recommendationLetter: c.recommendationLetter,
                certificates: c.certificates || [],
            },
            createdAt: c.createdAt,
        }));
    }
    async getFeatureActivity() {
        const logs = await this.activityLogService.getRecentActivities({
            category: client_1.ActivityCategory.FEATURE_USAGE,
            limit: 200,
        });
        const caregivingEvents = new Set([
            activity_events_1.ActivityEvents.SCHEDULE_ITEM_COMPLETED,
            activity_events_1.ActivityEvents.SCHEDULE_COMPLETED,
        ]);
        const onboardingEvents = new Set([
            activity_events_1.ActivityEvents.FAMILY_ELDER_CREATED,
            activity_events_1.ActivityEvents.FAMILY_ELDER_DELETED,
        ]);
        const dealsEvents = new Set([
            'event.created',
            'event.updated',
            'event.registered',
        ]);
        return {
            caregiving: logs.filter((log) => caregivingEvents.has(log.eventType)),
            onboarding: logs.filter((log) => onboardingEvents.has(log.eventType)),
            deals: logs.filter((log) => dealsEvents.has(log.eventType)),
            raw: logs,
        };
    }
    async getElders() {
        const elders = await this.prisma.elder.findMany({
            include: {
                family: { include: { user: true } },
                program: true,
                careRequests: { include: { caregiver: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        return elders.map((elder) => {
            const activeCaregiver = elder.careRequests[0]?.caregiver ?? null;
            return {
                id: elder.id,
                firstName: elder.firstName,
                lastName: elder.lastName,
                gender: elder.gender,
                dateOfBirth: elder.dateOfBirth,
                description: elder.description,
                family: elder.family
                    ? {
                        id: elder.family.id,
                        familyName: elder.family.familyName,
                        email: elder.family.user?.email,
                    }
                    : null,
                caregiver: activeCaregiver
                    ? {
                        id: activeCaregiver.id,
                        name: `${activeCaregiver.firstName ?? ''} ${activeCaregiver.lastName ?? ''}`.trim(),
                        email: activeCaregiver.email,
                    }
                    : null,
                program: elder.program
                    ? { id: elder.program.id, name: elder.program.name }
                    : null,
                createdAt: elder.createdAt,
            };
        });
    }
    async updateElder(elderId, dto) {
        const elder = await this.prisma.elder.findUnique({
            where: { id: elderId },
        });
        if (!elder) {
            throw new common_1.NotFoundException('Elder not found');
        }
        const updateData = { ...dto };
        if (dto.dateOfBirth) {
            updateData.dateOfBirth = new Date(dto.dateOfBirth);
        }
        return this.prisma.elder.update({
            where: { id: elderId },
            data: updateData,
        });
    }
    async deleteElder(elderId) {
        const elder = await this.prisma.elder.findUnique({
            where: { id: elderId },
        });
        if (!elder) {
            throw new common_1.NotFoundException('Elder not found');
        }
        await this.prisma.elder.delete({ where: { id: elderId } });
        return { success: true, elderId };
    }
    async updateCaregiverStatus(caregiverId, dto) {
        const caregiver = await this.prisma.caregiver.findUnique({
            where: { id: caregiverId },
            include: {
                user: true,
            },
        });
        if (!caregiver) {
            throw new common_1.NotFoundException('Caregiver not found');
        }
        await this.prisma.user.update({
            where: { id: caregiver.userId },
            data: { status: dto.status },
        });
        return {
            success: true,
            caregiverId,
            userId: caregiver.userId,
            status: dto.status,
        };
    }
    async getSubscriptionActivity(limit = 100) {
        const prisma = this.prisma;
        const logs = await prisma.activityLog.findMany({
            where: { eventType: activity_events_1.ActivityEvents.SUBSCRIPTION_RENEWED },
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
        return logs;
    }
    async getProfile(query) {
        const { type, id } = query;
        if (type === admin_profile_query_dto_1.AdminProfileType.FAMILY) {
            const family = await this.prisma.family.findUnique({
                where: { id },
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            status: true,
                            createdAt: true,
                            subscription: {
                                include: { plan: true },
                            },
                        },
                    },
                    elders: true,
                },
            });
            if (!family)
                throw new common_1.NotFoundException('Family not found');
            return {
                id: family.id,
                familyName: family.familyName,
                careFor: family.careFor,
                user: family.user,
                elders: family.elders,
                createdAt: family.createdAt,
                updatedAt: family.updatedAt,
                onboardingComplete: family.onboardingComplete,
            };
        }
        if (type === admin_profile_query_dto_1.AdminProfileType.CAREGIVER) {
            const caregiver = await this.prisma.caregiver.findUnique({
                where: { id },
                include: {
                    user: {
                        select: { id: true, email: true, status: true, createdAt: true },
                    },
                    caregiverRegion: { select: { name: true } },
                    programs: { select: { name: true } },
                    careRequests: {
                        where: { status: 'ACCEPTED' },
                        include: { elder: true },
                    },
                    certificates: true,
                },
            });
            if (!caregiver)
                throw new common_1.NotFoundException('Caregiver not found');
            return {
                id: caregiver.id,
                firstName: caregiver.firstName,
                lastName: caregiver.lastName,
                email: caregiver.email,
                phone: caregiver.phone,
                gender: caregiver.gender,
                region: caregiver.region,
                user: caregiver.user,
                caregiverRegion: caregiver.caregiverRegion,
                programs: caregiver.programs,
                elders: caregiver.careRequests.map((cr) => ({
                    id: cr.elder.id,
                    firstName: cr.elder.firstName,
                    lastName: cr.elder.lastName,
                })),
                onboardingComplete: caregiver.onboardingComplete,
                experience: caregiver.experience,
                bio: caregiver.bio,
                languages: caregiver.languages || [],
                documents: {
                    profilePicture: caregiver.profilePicture,
                    documentUrl: caregiver.documentUrl,
                    idPassportPhoto: caregiver.idPassportPhoto,
                    recommendationLetter: caregiver.recommendationLetter,
                    certificates: caregiver.certificates || [],
                },
                createdAt: caregiver.createdAt,
            };
        }
        if (type === admin_profile_query_dto_1.AdminProfileType.ELDER) {
            const elder = await this.prisma.elder.findUnique({
                where: { id },
                include: {
                    family: { select: { id: true, familyName: true } },
                    careRequests: {
                        where: { status: 'ACCEPTED' },
                        include: { caregiver: true },
                    },
                    program: { select: { id: true, name: true } },
                },
            });
            if (!elder)
                throw new common_1.NotFoundException('Elder not found');
            const activeCaregiver = elder.careRequests[0]?.caregiver ?? null;
            return {
                id: elder.id,
                firstName: elder.firstName,
                lastName: elder.lastName,
                gender: elder.gender,
                dateOfBirth: elder.dateOfBirth,
                description: elder.description,
                family: elder.family,
                caregiver: activeCaregiver
                    ? {
                        id: activeCaregiver.id,
                        name: `${activeCaregiver.firstName ?? ''} ${activeCaregiver.lastName ?? ''}`.trim(),
                        email: activeCaregiver.email,
                    }
                    : null,
                program: elder.program,
                createdAt: elder.createdAt,
            };
        }
        throw new common_1.NotFoundException(`Unsupported profile type: ${type}`);
    }
    async getGenderCounts() {
        const caregivers = await this.prisma.caregiver.findMany({
            select: { gender: true },
        });
        const elders = await this.prisma.elder.findMany({
            select: { gender: true },
        });
        const caregiverCounts = this.aggregateStringGenderCounts(caregivers.map((c) => c.gender));
        const elderCounts = this.aggregateEnumGenderCounts(elders.map((e) => e.gender));
        return {
            caregivers: caregiverCounts,
            elders: elderCounts,
        };
    }
    async getReports() {
        const [totalScheduleItems, completedScheduleItems] = await Promise.all([
            this.prisma.scheduleItem.count(),
            this.prisma.scheduleItem.count({ where: { status: 'COMPLETED' } }),
        ]);
        const careCompletionRate = totalScheduleItems > 0
            ? Math.round((completedScheduleItems / totalScheduleItems) * 100)
            : 0;
        const [activeFamilies, activeCaregivers] = await Promise.all([
            this.prisma.user.count({
                where: { role: 'FAMILY', status: client_1.AccountStatus.ACTIVE },
            }),
            this.prisma.user.count({
                where: { role: 'CAREGIVER', status: client_1.AccountStatus.ACTIVE },
            }),
        ]);
        const [totalFamilies, totalCaregivers] = await Promise.all([
            this.prisma.user.count({ where: { role: 'FAMILY' } }),
            this.prisma.user.count({ where: { role: 'CAREGIVER' } }),
        ]);
        const acceptedRequests = await this.prisma.careRequest.findMany({
            where: { status: 'ACCEPTED' },
            select: {
                elderId: true,
                caregiverId: true,
                familyId: true,
            },
        });
        const eldersWithCaregivers = new Set(acceptedRequests.map(r => r.elderId)).size;
        const caregiversWithElders = new Set(acceptedRequests.map(r => r.caregiverId)).size;
        const familiesWithCaregivers = new Set(acceptedRequests.map(r => r.familyId)).size;
        const uniqueConnections = new Set(acceptedRequests.map(r => `${r.familyId}-${r.caregiverId}`));
        const pendingCaregivers = await this.prisma.user.count({
            where: { role: 'CAREGIVER', status: client_1.AccountStatus.PENDING },
        });
        const activeSubscriptions = await this.prisma.subscription.count({
            where: { status: 'ACTIVE' },
        });
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentActivityCount = await this.prisma.activityLog.count({
            where: { createdAt: { gte: thirtyDaysAgo } },
        });
        const [activeFamiliesList, activeCaregiversList, pendingCaregiversList, activeConnectionsList,] = await Promise.all([
            this.prisma.family.findMany({
                where: { user: { status: client_1.AccountStatus.ACTIVE } },
                select: { id: true, familyName: true, user: { select: { email: true, status: true } } },
            }),
            this.prisma.caregiver.findMany({
                where: { user: { status: client_1.AccountStatus.ACTIVE } },
                select: { id: true, firstName: true, lastName: true, user: { select: { email: true, status: true } } },
            }),
            this.prisma.caregiver.findMany({
                where: { user: { status: client_1.AccountStatus.PENDING } },
                select: { id: true, firstName: true, lastName: true, user: { select: { email: true, status: true } } },
            }),
            this.prisma.careRequest.findMany({
                where: { status: 'ACCEPTED' },
                select: {
                    elder: { select: { firstName: true, lastName: true } },
                    caregiver: { select: { firstName: true, lastName: true } },
                    family: { select: { familyName: true } },
                },
            }),
        ]);
        const totalElders = await this.prisma.elder.count();
        return {
            overview: {
                totalFamilies,
                activeFamilies,
                totalCaregivers,
                activeCaregivers,
                pendingCaregivers,
                totalElders,
                eldersWithCaregivers,
                totalConnections: uniqueConnections.size,
                activeSubscriptions,
            },
            careMetrics: {
                careCompletionRate,
                totalScheduleItems,
                completedScheduleItems,
                pendingScheduleItems: totalScheduleItems - completedScheduleItems,
            },
            matchingMetrics: {
                familiesWithCaregivers,
                familiesWithoutCaregivers: totalFamilies - familiesWithCaregivers,
                caregiversWithElders,
                caregiversWithoutElders: totalCaregivers - caregiversWithElders,
                eldersWithCaregivers,
                eldersWithoutCaregivers: totalElders - eldersWithCaregivers,
                matchRate: totalElders > 0 ? Math.round((eldersWithCaregivers / totalElders) * 100) : 0,
            },
            activity: { recentActivityCount, periodDays: 30 },
            details: {
                activeFamilies: activeFamiliesList.map(f => ({
                    id: f.id,
                    name: f.familyName,
                    email: f.user.email,
                    status: f.user.status,
                })),
                activeCaregivers: activeCaregiversList.map(c => ({
                    id: c.id,
                    name: `${c.firstName} ${c.lastName}`,
                    email: c.user.email,
                    status: c.user.status,
                })),
                pendingCaregivers: pendingCaregiversList.map(c => ({
                    id: c.id,
                    name: `${c.firstName} ${c.lastName}`,
                    email: c.user.email,
                    status: c.user.status,
                })),
                connections: activeConnectionsList.map(c => ({
                    elderName: `${c.elder.firstName} ${c.elder.lastName}`,
                    familyName: c.family.familyName,
                    caregiverName: `${c.caregiver.firstName} ${c.caregiver.lastName}`,
                })),
            },
        };
    }
    async getStripeBalance() {
        try {
            const balance = await this.stripe.balance.retrieve();
            const totalTransactions = await this.prisma.paymentTransaction.aggregate({
                where: { status: 'SUCCEEDED' },
                _sum: { amount: true },
                _count: true,
            });
            const subscriptionRevenue = await this.prisma.paymentTransaction.aggregate({
                where: {
                    status: 'SUCCEEDED',
                    type: 'SUBSCRIPTION'
                },
                _sum: { amount: true },
                _count: true,
            });
            const caregiverPayouts = await this.prisma.paymentTransaction.aggregate({
                where: {
                    status: 'SUCCEEDED',
                    type: 'CAREGIVER_PAYOUT'
                },
                _sum: { amount: true },
                _count: true,
            });
            const availableBalance = balance.available.map(b => ({
                amount: b.amount / 100,
                currency: b.currency.toUpperCase(),
            }));
            const pendingBalance = balance.pending.map(b => ({
                amount: b.amount / 100,
                currency: b.currency.toUpperCase(),
            }));
            return {
                stripe: {
                    available: availableBalance,
                    pending: pendingBalance,
                    livemode: balance.livemode,
                },
                database: {
                    totalRevenue: totalTransactions._sum.amount || 0,
                    totalTransactions: totalTransactions._count,
                    subscriptionRevenue: subscriptionRevenue._sum.amount || 0,
                    subscriptionCount: subscriptionRevenue._count,
                    caregiverPayouts: caregiverPayouts._sum.amount || 0,
                    caregiverPayoutCount: caregiverPayouts._count,
                },
                summary: {
                    totalRevenue: totalTransactions._sum.amount || 0,
                    stripeAvailable: availableBalance[0]?.amount || 0,
                    stripePending: pendingBalance[0]?.amount || 0,
                    currency: availableBalance[0]?.currency || 'USD',
                }
            };
        }
        catch (error) {
            throw new Error(`Failed to fetch Stripe balance: ${error.message}`);
        }
    }
    calculateSubscriptionProgress(subscription) {
        const now = Date.now();
        const start = subscription.startDate.getTime();
        const end = subscription.endDate.getTime();
        if (end <= start) {
            return 100;
        }
        const progress = (now - start) / (end - start);
        return Math.min(100, Math.max(0, Math.round(progress * 100)));
    }
    aggregateStringGenderCounts(values) {
        return values.reduce((acc, gender) => {
            const key = gender?.toLowerCase() || 'unspecified';
            acc[key] = (acc[key] ?? 0) + 1;
            return acc;
        }, {});
    }
    aggregateEnumGenderCounts(values) {
        return values.reduce((acc, gender) => {
            const key = gender ?? 'UNSPECIFIED';
            acc[key] = (acc[key] ?? 0) + 1;
            return acc;
        }, {});
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        activity_log_service_1.ActivityLogService,
        config_1.ConfigService])
], AdminService);
//# sourceMappingURL=admin.service.js.map
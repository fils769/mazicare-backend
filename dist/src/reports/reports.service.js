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
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ReportsService = class ReportsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async generateFamilyReport(userId) {
        const family = await this.prisma.family.findUnique({
            where: { userId },
            include: {
                user: {
                    select: {
                        email: true,
                        subscription: { include: { plan: true } },
                    },
                },
                elders: {
                    include: {
                        program: { select: { id: true, name: true } },
                        careRequests: {
                            where: { status: 'ACCEPTED' },
                            include: {
                                caregiver: {
                                    select: {
                                        id: true,
                                        firstName: true,
                                        lastName: true,
                                        email: true,
                                        phone: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        if (!family) {
            throw new common_1.NotFoundException('Family not found');
        }
        const elderIds = family.elders.map((e) => e.id);
        const prisma = this.prisma;
        const [totalScheduleItems, completedScheduleItems, pendingScheduleItems, careRequests] = await Promise.all([
            prisma.scheduleItem.count({
                where: { schedule: { elderId: { in: elderIds } } },
            }),
            prisma.scheduleItem.count({
                where: { schedule: { elderId: { in: elderIds } }, status: 'COMPLETED' },
            }),
            prisma.scheduleItem.count({
                where: { schedule: { elderId: { in: elderIds } }, status: 'PENDING' },
            }),
            this.prisma.careRequest.findMany({
                where: { familyId: family.id },
                include: {
                    caregiver: { select: { id: true, firstName: true, lastName: true } },
                    elder: { select: { id: true, firstName: true, lastName: true } },
                },
                orderBy: { createdAt: 'desc' },
                take: 10,
            }),
        ]);
        const totalElders = family.elders.length;
        const eldersWithCaregivers = family.elders.filter((e) => e.careRequests.length > 0).length;
        const eldersWithoutCaregivers = totalElders - eldersWithCaregivers;
        const completionRate = totalScheduleItems > 0
            ? Math.round((completedScheduleItems / totalScheduleItems) * 100)
            : 0;
        const uniqueCaregivers = new Set(family.elders
            .flatMap((e) => e.careRequests.map((r) => r.caregiver?.id))
            .filter(Boolean));
        const subscription = family.user.subscription;
        const subscriptionInfo = subscription
            ? {
                planName: subscription.plan?.name,
                status: subscription.status,
                startDate: subscription.startDate,
                endDate: subscription.endDate,
                daysRemaining: Math.max(0, Math.ceil((subscription.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))),
            }
            : null;
        return {
            reportId: `family-${userId}-${Date.now()}`,
            userId,
            familyId: family.id,
            familyName: family.familyName,
            generatedAt: new Date(),
            summary: {
                totalElders,
                eldersWithCaregivers,
                eldersWithoutCaregivers,
                activeCaregivers: uniqueCaregivers.size,
                totalScheduleItems,
                completedScheduleItems,
                pendingScheduleItems,
                completionRate,
            },
            subscription: subscriptionInfo,
            requests: {
                total: careRequests.length,
                pending: careRequests.filter((r) => r.status === 'PENDING').length,
                accepted: careRequests.filter((r) => r.status === 'ACCEPTED').length,
                rejected: careRequests.filter((r) => r.status === 'REJECTED').length,
                recent: careRequests.map((r) => ({
                    id: r.id,
                    status: r.status,
                    elderName: r.elder ? `${r.elder.firstName} ${r.elder.lastName}` : 'Unknown',
                    caregiverName: r.caregiver ? `${r.caregiver.firstName} ${r.caregiver.lastName}` : 'Unknown',
                    createdAt: r.createdAt,
                })),
            },
            elders: family.elders.map((elder) => {
                const age = elder.dateOfBirth
                    ? new Date().getFullYear() - elder.dateOfBirth.getFullYear()
                    : null;
                const acceptedCaregiver = elder.careRequests[0]?.caregiver;
                return {
                    id: elder.id,
                    name: `${elder.firstName} ${elder.lastName}`,
                    age,
                    gender: elder.gender,
                    program: elder.program?.name || null,
                    caregiver: acceptedCaregiver
                        ? {
                            id: acceptedCaregiver.id,
                            name: `${acceptedCaregiver.firstName} ${acceptedCaregiver.lastName}`,
                            email: acceptedCaregiver.email,
                            phone: acceptedCaregiver.phone,
                        }
                        : null,
                    hasCaregiver: elder.careRequests.length > 0,
                };
            }),
        };
    }
    async generateCaregiverReport(userId) {
        const caregiver = await this.prisma.caregiver.findUnique({
            where: { userId },
            include: {
                user: { select: { email: true, status: true } },
                programs: { select: { id: true, name: true } },
                caregiverRegion: { select: { name: true } },
                careRequests: {
                    where: { status: 'ACCEPTED' },
                    include: {
                        elder: {
                            include: {
                                family: { select: { id: true, familyName: true, user: { select: { email: true } } } },
                                program: { select: { id: true, name: true } },
                                schedules: { include: { scheduleItems: true } },
                            },
                        },
                        family: { select: { id: true, familyName: true } },
                    },
                },
            },
        });
        if (!caregiver) {
            throw new common_1.NotFoundException('Caregiver not found');
        }
        const elderIds = caregiver.careRequests.map((r) => r.elderId);
        const prisma = this.prisma;
        const [totalScheduleItems, completedScheduleItems, pendingScheduleItems, averageRating] = await Promise.all([
            prisma.scheduleItem.count({
                where: { schedule: { elderId: { in: elderIds } } },
            }),
            prisma.scheduleItem.count({
                where: { schedule: { elderId: { in: elderIds } }, status: 'COMPLETED' },
            }),
            prisma.scheduleItem.count({
                where: { schedule: { elderId: { in: elderIds } }, status: 'PENDING' },
            }),
            prisma.review.aggregate({
                where: { caregiverId: caregiver.id },
                _avg: { rating: true },
                _count: { id: true },
            }),
        ]);
        const totalElders = new Set(caregiver.careRequests.map((r) => r.elder.id)).size;
        const uniqueFamilies = new Set(caregiver.careRequests.map((r) => r.family.id));
        const completionRate = totalScheduleItems > 0
            ? Math.round((completedScheduleItems / totalScheduleItems) * 100)
            : 0;
        return {
            reportId: `caregiver-${userId}-${Date.now()}`,
            userId,
            caregiverId: caregiver.id,
            caregiverName: `${caregiver.firstName} ${caregiver.lastName}`,
            generatedAt: new Date(),
            profile: {
                email: caregiver.email || caregiver.user.email,
                phone: caregiver.phone,
                status: caregiver.user.status,
                gender: caregiver.gender,
                region: caregiver.caregiverRegion?.name || caregiver.region,
                programs: caregiver.programs.map((p) => p.name),
                experience: caregiver.experience,
                onboardingComplete: caregiver.onboardingComplete,
            },
            summary: {
                totalElders,
                activeFamilies: uniqueFamilies.size,
                totalScheduleItems,
                completedScheduleItems,
                pendingScheduleItems,
                completionRate,
            },
            ratings: {
                averageRating: averageRating._avg.rating
                    ? Number(averageRating._avg.rating.toFixed(2))
                    : 0,
                totalReviews: averageRating._count.id,
            },
            requests: {
                total: caregiver.careRequests.length,
                pending: caregiver.careRequests.filter((r) => r.status === 'PENDING').length,
                accepted: caregiver.careRequests.filter((r) => r.status === 'ACCEPTED').length,
                rejected: caregiver.careRequests.filter((r) => r.status === 'REJECTED').length,
                recent: caregiver.careRequests
                    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                    .slice(0, 10)
                    .map((r) => ({
                    id: r.id,
                    status: r.status,
                    familyName: r.family.familyName,
                    elderName: `${r.elder.firstName} ${r.elder.lastName}`,
                    createdAt: r.createdAt,
                })),
            },
            elders: caregiver.careRequests.map((r) => {
                const elder = r.elder;
                const age = elder.dateOfBirth
                    ? new Date().getFullYear() - elder.dateOfBirth.getFullYear()
                    : null;
                return {
                    id: elder.id,
                    name: `${elder.firstName} ${elder.lastName}`,
                    age,
                    gender: elder.gender,
                    program: elder.program?.name || null,
                    family: {
                        id: elder.family.id,
                        name: elder.family.familyName,
                        email: elder.family.user?.email,
                    },
                };
            }),
        };
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map
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
exports.DealsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const activity_log_service_1 = require("../activity/activity-log.service");
const activity_events_1 = require("../activity/activity.events");
let DealsService = class DealsService {
    prisma;
    activityLogService;
    constructor(prisma, activityLogService) {
        this.prisma = prisma;
        this.activityLogService = activityLogService;
    }
    async create(createDealDto, createdBy) {
        const deal = await this.prisma.deal.create({
            data: {
                ...createDealDto,
                createdBy,
            },
        });
        return deal;
    }
    async findAll(query) {
        const { category, region, isActive, hasDiscount, limit = 50, offset = 0 } = query;
        const where = {};
        if (category) {
            where.category = category;
        }
        if (region) {
            where.region = region;
        }
        if (isActive !== undefined) {
            where.endsAt = isActive ? { gte: new Date() } : { lt: new Date() };
        }
        if (hasDiscount !== undefined) {
            where.discountPercent = hasDiscount
                ? { not: null, gt: 0 }
                : { OR: [{ equals: null }, { equals: 0 }] };
        }
        const [deals, total] = await Promise.all([
            this.prisma.deal.findMany({
                where,
                take: limit,
                skip: offset,
                orderBy: { createdAt: 'desc' },
                include: {
                    _count: {
                        select: { claims: true },
                    },
                },
            }),
            this.prisma.deal.count({ where }),
        ]);
        return {
            deals: deals.map((deal) => ({
                ...deal,
                claimsCount: deal._count.claims,
                _count: undefined,
            })),
            total,
            limit,
            offset,
        };
    }
    async findOne(id, userId) {
        const deal = await this.prisma.deal.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { claims: true },
                },
            },
        });
        if (!deal) {
            throw new common_1.NotFoundException('Deal not found');
        }
        let isClaimed = false;
        if (userId) {
            const claim = await this.prisma.dealClaim.findUnique({
                where: {
                    dealId_userId: {
                        dealId: id,
                        userId,
                    },
                },
            });
            isClaimed = !!claim;
            await this.activityLogService.logEvent({
                userId,
                category: 'FEATURE_USAGE',
                eventType: activity_events_1.ActivityEvents.DEAL_VIEWED,
                entityType: 'deal',
                entityId: id,
                metadata: {
                    dealTitle: deal.title,
                    dealCategory: deal.category,
                },
            });
        }
        return {
            ...deal,
            claimsCount: deal._count.claims,
            isClaimed,
            _count: undefined,
        };
    }
    async update(id, updateDealDto) {
        const deal = await this.prisma.deal.findUnique({
            where: { id },
        });
        if (!deal) {
            throw new common_1.NotFoundException('Deal not found');
        }
        return this.prisma.deal.update({
            where: { id },
            data: updateDealDto,
        });
    }
    async remove(id) {
        const deal = await this.prisma.deal.findUnique({
            where: { id },
        });
        if (!deal) {
            throw new common_1.NotFoundException('Deal not found');
        }
        await this.prisma.deal.delete({
            where: { id },
        });
        return { success: true, message: 'Deal deleted successfully' };
    }
    async claimDeal(dealId, userId, userRole) {
        const deal = await this.prisma.deal.findUnique({
            where: { id: dealId },
        });
        if (!deal) {
            throw new common_1.NotFoundException('Deal not found');
        }
        const now = new Date();
        if (deal.startsAt && deal.startsAt > now) {
            throw new common_1.BadRequestException('Deal has not started yet');
        }
        if (deal.endsAt && deal.endsAt < now) {
            throw new common_1.BadRequestException('Deal has expired');
        }
        const existingClaim = await this.prisma.dealClaim.findUnique({
            where: {
                dealId_userId: {
                    dealId,
                    userId,
                },
            },
        });
        if (existingClaim) {
            throw new common_1.ConflictException('You have already claimed this deal');
        }
        const claim = await this.prisma.dealClaim.create({
            data: {
                dealId,
                userId,
            },
            include: {
                deal: true,
            },
        });
        await this.activityLogService.logEvent({
            userId,
            actorRole: userRole,
            category: 'FEATURE_USAGE',
            eventType: activity_events_1.ActivityEvents.DEAL_CLAIMED,
            entityType: 'deal',
            entityId: dealId,
            metadata: {
                dealTitle: deal.title,
                dealCategory: deal.category,
                claimId: claim.id,
            },
        });
        return claim;
    }
    async getUserClaims(userId) {
        const claims = await this.prisma.dealClaim.findMany({
            where: { userId },
            include: {
                deal: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        return claims;
    }
    async getDealClaims(dealId) {
        const deal = await this.prisma.deal.findUnique({
            where: { id: dealId },
        });
        if (!deal) {
            throw new common_1.NotFoundException('Deal not found');
        }
        const claims = await this.prisma.dealClaim.findMany({
            where: { dealId },
            include: {
                user: {
                    select: {
                        id: true,
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
            orderBy: { createdAt: 'desc' },
        });
        return {
            deal,
            claims: claims.map((claim) => ({
                id: claim.id,
                userId: claim.userId,
                claimedAt: claim.createdAt,
                user: {
                    email: claim.user.email,
                    role: claim.user.role,
                    name: claim.user.caregiver
                        ? `${claim.user.caregiver.firstName} ${claim.user.caregiver.lastName}`
                        : claim.user.family?.familyName || claim.user.email,
                },
            })),
            totalClaims: claims.length,
        };
    }
};
exports.DealsService = DealsService;
exports.DealsService = DealsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        activity_log_service_1.ActivityLogService])
], DealsService);
//# sourceMappingURL=deals.service.js.map
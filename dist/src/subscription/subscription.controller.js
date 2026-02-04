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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionController = void 0;
const common_1 = require("@nestjs/common");
const subscription_service_1 = require("./subscription.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const prisma_service_1 = require("../prisma/prisma.service");
let SubscriptionController = class SubscriptionController {
    service;
    prisma;
    constructor(service, prisma) {
        this.service = service;
        this.prisma = prisma;
    }
    async getPlans(req) {
        const userRole = req.user.role;
        return this.prisma.subscriptionPlan.findMany({
            where: {
                role: userRole,
            },
            select: {
                id: true,
                name: true,
                role: true,
                basePrice: true,
                vatRate: true,
                durationMonths: true,
                features: true,
            },
        });
    }
    async getSubscription(req) {
        const subscription = await this.prisma.subscription.findUnique({
            where: { userId: req.user.userId },
            include: {
                plan: {
                    select: {
                        name: true,
                    },
                },
            },
        });
        if (!subscription) {
            throw new common_1.NotFoundException('No subscription found');
        }
        return {
            id: subscription.id,
            planId: subscription.planId,
            planName: subscription.plan.name,
            status: subscription.status.toLowerCase(),
            currentPeriodEnd: subscription.endDate.toISOString(),
            cancelAtPeriodEnd: !!subscription.cancelledAt,
        };
    }
    async checkout(req) {
        return this.service.startSubscription(req.user.userId);
    }
    async mySubscription(req) {
        return this.service.getSubscription(req.user.userId);
    }
};
exports.SubscriptionController = SubscriptionController;
__decorate([
    (0, common_1.Get)('plans'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "getPlans", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "getSubscription", null);
__decorate([
    (0, common_1.Post)('checkout'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "checkout", null);
__decorate([
    (0, common_1.Get)('me'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "mySubscription", null);
exports.SubscriptionController = SubscriptionController = __decorate([
    (0, common_1.Controller)('subscription'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [subscription_service_1.SubscriptionService,
        prisma_service_1.PrismaService])
], SubscriptionController);
//# sourceMappingURL=subscription.controller.js.map
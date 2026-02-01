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
exports.SubscriptionService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const prisma_service_1 = require("../prisma/prisma.service");
let SubscriptionService = class SubscriptionService {
    prisma;
    eventEmitter;
    constructor(prisma, eventEmitter) {
        this.prisma = prisma;
        this.eventEmitter = eventEmitter;
    }
    async getSubscription(userId) {
        const subscription = await this.prisma.subscription.findUnique({
            where: { userId },
            include: {
                plan: true
            }
        });
        if (!subscription) {
            return null;
        }
        return {
            ...subscription,
            planName: subscription.plan.name
        };
    }
    async renewSubscription(userId, renewData) {
        const plan = await this.prisma.subscriptionPlan.findUnique({
            where: { id: renewData.planId }
        });
        if (!plan) {
            throw new common_1.NotFoundException('Subscription plan not found');
        }
        const endDate = new Date();
        endDate.setFullYear(endDate.getFullYear() + 1);
        const subscription = await this.prisma.subscription.upsert({
            where: { userId },
            update: {
                planId: renewData.planId,
                endDate,
                price: plan.price,
                status: 'ACTIVE'
            },
            create: {
                userId,
                planId: renewData.planId,
                endDate,
                price: plan.price,
                status: 'ACTIVE'
            }
        });
        this.eventEmitter.emit('subscription.renewed', {
            userId,
            planName: plan.name,
            subscription,
        });
        return {
            success: true,
            subscription,
            message: 'Subscription renewed successfully'
        };
    }
    async getPlans() {
        return this.prisma.subscriptionPlan.findMany({
            orderBy: { price: 'asc' }
        });
    }
    async cancelSubscription(userId) {
        const subscription = await this.prisma.subscription.findUnique({
            where: { userId }
        });
        if (!subscription) {
            throw new common_1.NotFoundException('No active subscription found');
        }
        const updatedSubscription = await this.prisma.subscription.update({
            where: { userId },
            data: {
                status: 'CANCELLED'
            }
        });
        return {
            success: true,
            subscription: updatedSubscription,
            message: 'Subscription cancelled successfully'
        };
    }
};
exports.SubscriptionService = SubscriptionService;
exports.SubscriptionService = SubscriptionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        event_emitter_1.EventEmitter2])
], SubscriptionService);
//# sourceMappingURL=subscription.service.js.map
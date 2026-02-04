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
exports.VivaService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
const prisma_service_1 = require("../prisma/prisma.service");
let VivaService = class VivaService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    getAuthHeader() {
        return {
            Authorization: 'Basic ' +
                Buffer.from(`${process.env.VIVA_WALLET_MERCHANT_ID}:${process.env.VIVA_WALLET_API_KEY}`).toString('base64'),
        };
    }
    async createOrder(userId, planId) {
        const plan = await this.prisma.subscriptionPlan.findUnique({
            where: { id: planId },
        });
        if (!plan || plan.basePrice == null || plan.vatRate == null) {
            throw new common_1.BadRequestException('Plan details incomplete or not found');
        }
        const vatAmount = plan.basePrice * plan.vatRate;
        const totalAmountCents = Math.round((plan.basePrice + vatAmount) * 100);
        const customerDescription = `${plan.name} Subscription (Inc. VAT)`;
        const response = await axios_1.default.post(`${process.env.VIVA_BASE_URL}/api/orders`, {
            amount: totalAmountCents,
            customerTrns: customerDescription,
            merchantTrns: `User:${userId}|Plan:${planId}`,
            sourceCode: 'Default',
        }, { headers: this.getAuthHeader() });
        const orderCode = response.data.OrderCode;
        await this.prisma.paymentOrder.create({
            data: {
                userId,
                planId,
                orderCode: orderCode.toString(),
                amount: totalAmountCents,
                currency: 'EUR',
                paymentType: 'SUBSCRIPTION',
            },
        });
        return {
            checkoutUrl: `${process.env.VIVA_BASE_URL}/web/checkout?ref=${orderCode}`,
        };
    }
    async verifyAndActivate(orderCode, transactionId) {
        console.log(`🔍 Looking for payment with orderCode: ${orderCode}`);
        const payment = await this.prisma.paymentOrder.findUnique({
            where: { orderCode },
        });
        if (!payment) {
            console.log('❌ Payment not found');
            return;
        }
        if (payment.status === 'SUCCEEDED') {
            console.log('ℹ️ Payment already processed');
            return;
        }
        console.log(`✅ Found payment: ${payment.id}`);
        console.log(`🔍 Verifying transaction: ${transactionId}`);
        const tx = await axios_1.default.get(`${process.env.VIVA_BASE_URL}/api/transactions/${transactionId}`, { headers: this.getAuthHeader() });
        console.log('📋 Transaction API response:', JSON.stringify(tx.data, null, 2));
        const transaction = tx.data.Transactions?.[0];
        if (!transaction || transaction.StatusId !== 'F') {
            console.log(`❌ Transaction not successful. Status: ${transaction?.StatusId || 'not found'}`);
            return;
        }
        console.log('✅ Transaction verified as successful');
        const plan = await this.prisma.subscriptionPlan.findUnique({
            where: { id: payment.planId },
        });
        if (!plan || plan.durationMonths == null) {
            throw new common_1.BadRequestException('Plan durationMonths is not defined');
        }
        if (plan.basePrice == null || plan.vatRate == null) {
            throw new common_1.BadRequestException('Plan pricing information is incomplete');
        }
        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + plan.durationMonths);
        console.log('💾 Updating subscription...');
        await this.prisma.subscription.upsert({
            where: { userId: payment.userId },
            update: {
                status: 'ACTIVE',
                startDate,
                endDate,
                cancelledAt: null,
                priceExclVat: plan.basePrice,
                vatAmount: plan.basePrice * plan.vatRate,
                totalAmount: plan.basePrice + plan.basePrice * plan.vatRate,
            },
            create: {
                userId: payment.userId,
                planId: plan.id,
                status: 'ACTIVE',
                startDate,
                endDate,
                priceExclVat: plan.basePrice,
                vatAmount: plan.basePrice * plan.vatRate,
                totalAmount: plan.basePrice + plan.basePrice * plan.vatRate,
            },
        });
        console.log('💾 Updating payment order status...');
        await this.prisma.paymentOrder.update({
            where: { orderCode },
            data: { status: 'SUCCEEDED', transactionId },
        });
        console.log('✅ Payment processing completed');
    }
    async cancelSubscription(userId) {
        if (!userId?.trim()) {
            throw new common_1.BadRequestException('User ID is required');
        }
        const subscription = await this.prisma.subscription.findUnique({
            where: { userId },
        });
        if (!subscription) {
            throw new common_1.BadRequestException('No subscription found for this user');
        }
        if (subscription.status === 'CANCELLED') {
            throw new common_1.BadRequestException('Subscription is already cancelled');
        }
        if (subscription.status === 'EXPIRED') {
            throw new common_1.BadRequestException('Cannot cancel an expired subscription');
        }
        if (subscription.endDate && subscription.endDate < new Date()) {
            throw new common_1.BadRequestException('Cannot cancel a subscription that has already ended');
        }
        await this.prisma.subscription.update({
            where: { userId },
            data: {
                cancelledAt: new Date(),
                status: 'CANCELLED',
            },
        });
        return { message: 'Subscription cancelled successfully' };
    }
};
exports.VivaService = VivaService;
exports.VivaService = VivaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], VivaService);
//# sourceMappingURL=viva.service.js.map
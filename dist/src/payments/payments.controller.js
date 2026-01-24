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
exports.PaymentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const payments_service_1 = require("./payments.service");
const create_subscription_checkout_dto_1 = require("./dto/create-subscription-checkout.dto");
const confirm_subscription_dto_1 = require("./dto/confirm-subscription.dto");
const create_payout_intent_dto_1 = require("./dto/create-payout-intent.dto");
const checkout_response_dto_1 = require("./dto/checkout-response.dto");
const confirmation_response_dto_1 = require("./dto/confirmation-response.dto");
let PaymentsController = class PaymentsController {
    paymentsService;
    constructor(paymentsService) {
        this.paymentsService = paymentsService;
    }
    async createSubscriptionCheckout(req, dto) {
        const context = this.getContext(req);
        return this.paymentsService.createSubscriptionCheckout(context, dto);
    }
    async confirmSubscriptionCheckout(req, dto) {
        const context = this.getContext(req);
        return this.paymentsService.confirmSubscriptionCheckout(context, dto);
    }
    async createCaregiverCheckout(req, dto) {
        const context = this.getContext(req);
        return this.paymentsService.createCaregiverCheckout(context, dto);
    }
    async confirmCaregiverCheckout(req, dto) {
        const context = this.getContext(req);
        return this.paymentsService.confirmCaregiverCheckout(context, dto);
    }
    getContext(req) {
        return {
            userId: req.user?.userId,
            email: req.user?.email,
            role: req.user?.role,
        };
    }
};
exports.PaymentsController = PaymentsController;
__decorate([
    (0, common_1.Post)('subscription/checkout'),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a Stripe Checkout session for a subscription plan',
    }),
    (0, swagger_1.ApiBody)({ type: create_subscription_checkout_dto_1.CreateSubscriptionCheckoutDto }),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'Stripe Checkout session created successfully',
        type: checkout_response_dto_1.CheckoutSessionResponseDto,
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_subscription_checkout_dto_1.CreateSubscriptionCheckoutDto]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "createSubscriptionCheckout", null);
__decorate([
    (0, common_1.Post)('subscription/confirm'),
    (0, swagger_1.ApiOperation)({
        summary: 'Confirm a subscription checkout session after payment success',
    }),
    (0, swagger_1.ApiBody)({ type: confirm_subscription_dto_1.ConfirmCheckoutDto }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Subscription payment confirmed and subscription activated/renewed',
        type: confirmation_response_dto_1.PaymentConfirmationResponseDto,
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, confirm_subscription_dto_1.ConfirmCheckoutDto]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "confirmSubscriptionCheckout", null);
__decorate([
    (0, common_1.Post)('caregiver/checkout'),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a Stripe Checkout session to pay a caregiver directly',
    }),
    (0, swagger_1.ApiBody)({ type: create_payout_intent_dto_1.CreateCaregiverCheckoutDto }),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'Stripe Checkout session created successfully for a caregiver payment',
        type: checkout_response_dto_1.CheckoutSessionResponseDto,
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_payout_intent_dto_1.CreateCaregiverCheckoutDto]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "createCaregiverCheckout", null);
__decorate([
    (0, common_1.Post)('caregiver/confirm'),
    (0, swagger_1.ApiOperation)({
        summary: 'Confirm a caregiver payout checkout session after payment success',
    }),
    (0, swagger_1.ApiBody)({ type: confirm_subscription_dto_1.ConfirmCheckoutDto }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Caregiver payment confirmed and funds transferred',
        type: confirmation_response_dto_1.PaymentConfirmationResponseDto,
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, confirm_subscription_dto_1.ConfirmCheckoutDto]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "confirmCaregiverCheckout", null);
exports.PaymentsController = PaymentsController = __decorate([
    (0, swagger_1.ApiTags)('Payments'),
    (0, swagger_1.ApiBearerAuth)('bearer'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('payments'),
    __metadata("design:paramtypes", [payments_service_1.PaymentsService])
], PaymentsController);
//# sourceMappingURL=payments.controller.js.map
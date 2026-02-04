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
exports.VivaTestController = void 0;
const common_1 = require("@nestjs/common");
const viva_service_1 = require("./viva.service");
let VivaTestController = class VivaTestController {
    vivaService;
    constructor(vivaService) {
        this.vivaService = vivaService;
    }
    async createTestOrder(body) {
        return this.vivaService.createOrder(body.userId, body.planId);
    }
    async verifyPayment(orderCode, transactionId) {
        return this.vivaService.verifyAndActivate(BigInt(orderCode), transactionId);
    }
    async cancelSubscription(userId) {
        return this.vivaService.cancelSubscription(userId);
    }
};
exports.VivaTestController = VivaTestController;
__decorate([
    (0, common_1.Post)('create-order'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VivaTestController.prototype, "createTestOrder", null);
__decorate([
    (0, common_1.Post)('verify/:orderCode/:transactionId'),
    __param(0, (0, common_1.Param)('orderCode')),
    __param(1, (0, common_1.Param)('transactionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], VivaTestController.prototype, "verifyPayment", null);
__decorate([
    (0, common_1.Post)('cancel/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VivaTestController.prototype, "cancelSubscription", null);
exports.VivaTestController = VivaTestController = __decorate([
    (0, common_1.Controller)('viva-test'),
    __metadata("design:paramtypes", [viva_service_1.VivaService])
], VivaTestController);
//# sourceMappingURL=viva-test.controller.js.map
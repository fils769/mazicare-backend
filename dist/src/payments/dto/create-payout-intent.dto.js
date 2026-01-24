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
exports.CreateCaregiverCheckoutDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateCaregiverCheckoutDto {
    caregiverId;
    amount;
    currency = 'usd';
    successUrl;
    cancelUrl;
}
exports.CreateCaregiverCheckoutDto = CreateCaregiverCheckoutDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Caregiver identifier receiving the payout' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCaregiverCheckoutDto.prototype, "caregiverId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Amount to transfer to the caregiver (in major currency units)',
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], CreateCaregiverCheckoutDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Currency ISO code (default usd)',
        default: 'usd',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCaregiverCheckoutDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'URL to redirect after successful payment' }),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], CreateCaregiverCheckoutDto.prototype, "successUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'URL to redirect if the payer cancels the payment',
    }),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], CreateCaregiverCheckoutDto.prototype, "cancelUrl", void 0);
//# sourceMappingURL=create-payout-intent.dto.js.map
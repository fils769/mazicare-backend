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
exports.AdminProfileQueryDto = exports.AdminProfileType = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var AdminProfileType;
(function (AdminProfileType) {
    AdminProfileType["FAMILY"] = "family";
    AdminProfileType["ELDER"] = "elder";
    AdminProfileType["CAREGIVER"] = "caregiver";
})(AdminProfileType || (exports.AdminProfileType = AdminProfileType = {}));
class AdminProfileQueryDto {
    type;
    id;
}
exports.AdminProfileQueryDto = AdminProfileQueryDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: AdminProfileType,
        description: 'Profile type to retrieve',
    }),
    (0, class_validator_1.IsEnum)(AdminProfileType),
    __metadata("design:type", String)
], AdminProfileQueryDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Entity identifier' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AdminProfileQueryDto.prototype, "id", void 0);
//# sourceMappingURL=admin-profile-query.dto.js.map
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
exports.UpdateScheduleItemDto = exports.ScheduleStatus = exports.ElderRequestResponseDto = exports.CareProgramDto = exports.RegionSelectionDto = exports.SaveDetailsDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class SaveDetailsDto {
    firstName;
    lastName;
    dateOfBirth;
    gender;
    region;
    regionId;
    regionIds;
    bio;
    phone;
    email;
    languages;
    idPassportPhoto;
    recommendationLetter;
    certificates;
}
exports.SaveDetailsDto = SaveDetailsDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SaveDetailsDto.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SaveDetailsDto.prototype, "lastName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], SaveDetailsDto.prototype, "dateOfBirth", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SaveDetailsDto.prototype, "gender", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SaveDetailsDto.prototype, "region", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value, obj }) => {
        if (obj.regionIds && Array.isArray(obj.regionIds) && obj.regionIds.length > 0) {
            return obj.regionIds[0];
        }
        return value;
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'regionId must be a string' }),
    __metadata("design:type", String)
], SaveDetailsDto.prototype, "regionId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], SaveDetailsDto.prototype, "regionIds", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SaveDetailsDto.prototype, "bio", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SaveDetailsDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SaveDetailsDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], SaveDetailsDto.prototype, "languages", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SaveDetailsDto.prototype, "idPassportPhoto", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SaveDetailsDto.prototype, "recommendationLetter", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], SaveDetailsDto.prototype, "certificates", void 0);
class RegionSelectionDto {
    regionId;
}
exports.RegionSelectionDto = RegionSelectionDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegionSelectionDto.prototype, "regionId", void 0);
class CareProgramDto {
    programIds;
}
exports.CareProgramDto = CareProgramDto;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CareProgramDto.prototype, "programIds", void 0);
class ElderRequestResponseDto {
    elderId;
}
exports.ElderRequestResponseDto = ElderRequestResponseDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ElderRequestResponseDto.prototype, "elderId", void 0);
var ScheduleStatus;
(function (ScheduleStatus) {
    ScheduleStatus["PENDING"] = "PENDING";
    ScheduleStatus["COMPLETED"] = "COMPLETED";
})(ScheduleStatus || (exports.ScheduleStatus = ScheduleStatus = {}));
class UpdateScheduleItemDto {
    title;
    description;
    startTime;
    endTime;
    status;
}
exports.UpdateScheduleItemDto = UpdateScheduleItemDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateScheduleItemDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateScheduleItemDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^([01]?\d|2[0-3]):[0-5]\d$/, {
        message: 'startTime must be in HH:MM format (24-hour)',
    }),
    __metadata("design:type", String)
], UpdateScheduleItemDto.prototype, "startTime", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^([01]?\d|2[0-3]):[0-5]\d$/, {
        message: 'endTime must be in HH:MM format (24-hour)',
    }),
    __metadata("design:type", String)
], UpdateScheduleItemDto.prototype, "endTime", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(ScheduleStatus),
    __metadata("design:type", String)
], UpdateScheduleItemDto.prototype, "status", void 0);
//# sourceMappingURL=caregiver.dto.js.map
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
exports.UpdateItemStatusDto = exports.WeekScheduleResponse = exports.ScheduleResponse = exports.ScheduleItemResponse = exports.UpdateScheduleDto = exports.CreateScheduleDto = exports.ScheduleDto = exports.ScheduleItemDto = exports.ScheduleStatus = exports.Day = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
var Day;
(function (Day) {
    Day["MONDAY"] = "MONDAY";
    Day["TUESDAY"] = "TUESDAY";
    Day["WEDNESDAY"] = "WEDNESDAY";
    Day["THURSDAY"] = "THURSDAY";
    Day["FRIDAY"] = "FRIDAY";
    Day["SATURDAY"] = "SATURDAY";
    Day["SUNDAY"] = "SUNDAY";
})(Day || (exports.Day = Day = {}));
var ScheduleStatus;
(function (ScheduleStatus) {
    ScheduleStatus["PENDING"] = "PENDING";
    ScheduleStatus["COMPLETED"] = "COMPLETED";
})(ScheduleStatus || (exports.ScheduleStatus = ScheduleStatus = {}));
class ScheduleItemDto {
    title;
    description;
    startTime;
    endTime;
    status = ScheduleStatus.PENDING;
}
exports.ScheduleItemDto = ScheduleItemDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ScheduleItemDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ScheduleItemDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^([01]?\d|2[0-3]):[0-5]\d$/, {
        message: 'startTime must be in HH:MM format (24-hour)',
    }),
    __metadata("design:type", String)
], ScheduleItemDto.prototype, "startTime", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^([01]?\d|2[0-3]):[0-5]\d$/, {
        message: 'endTime must be in HH:MM format (24-hour)',
    }),
    __metadata("design:type", String)
], ScheduleItemDto.prototype, "endTime", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(ScheduleStatus),
    __metadata("design:type", String)
], ScheduleItemDto.prototype, "status", void 0);
class ScheduleDto {
    day;
    scheduleItems;
}
exports.ScheduleDto = ScheduleDto;
__decorate([
    (0, class_validator_1.IsEnum)(Day),
    __metadata("design:type", String)
], ScheduleDto.prototype, "day", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ScheduleItemDto),
    __metadata("design:type", Array)
], ScheduleDto.prototype, "scheduleItems", void 0);
class CreateScheduleDto {
    elderId;
    schedules;
}
exports.CreateScheduleDto = CreateScheduleDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateScheduleDto.prototype, "elderId", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ScheduleDto),
    __metadata("design:type", Array)
], CreateScheduleDto.prototype, "schedules", void 0);
class UpdateScheduleDto {
    schedules;
}
exports.UpdateScheduleDto = UpdateScheduleDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ScheduleDto),
    __metadata("design:type", Array)
], UpdateScheduleDto.prototype, "schedules", void 0);
class ScheduleItemResponse {
    title;
    description;
    startTime;
    endTime;
    status;
}
exports.ScheduleItemResponse = ScheduleItemResponse;
class ScheduleResponse {
    day;
    start;
    end;
    scheduleItems;
}
exports.ScheduleResponse = ScheduleResponse;
class WeekScheduleResponse {
    elderId;
    elderName;
    weekStart;
    weekEnd;
    schedules;
}
exports.WeekScheduleResponse = WeekScheduleResponse;
class UpdateItemStatusDto {
    status;
}
exports.UpdateItemStatusDto = UpdateItemStatusDto;
__decorate([
    (0, class_validator_1.IsEnum)(ScheduleStatus),
    __metadata("design:type", String)
], UpdateItemStatusDto.prototype, "status", void 0);
//# sourceMappingURL=schedule.dto.js.map
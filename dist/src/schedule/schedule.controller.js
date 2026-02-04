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
exports.ScheduleController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const schedule_service_1 = require("./schedule.service");
const schedule_dto_1 = require("./dto/schedule.dto");
let ScheduleController = class ScheduleController {
    scheduleService;
    constructor(scheduleService) {
        this.scheduleService = scheduleService;
    }
    getTodaySchedule(elderId) {
        return this.scheduleService.getTodaySchedule(elderId);
    }
    getWeeklySchedule(elderId) {
        return this.scheduleService.getWeeklySchedule(elderId);
    }
    getDaySchedule(elderId, day) {
        return this.scheduleService.getDaySchedule(elderId, day);
    }
    getElderSchedule(elderId) {
        return this.scheduleService.getElderSchedule(elderId);
    }
    createSchedule(elderId, scheduleData) {
        return this.scheduleService.createSchedule(elderId, scheduleData);
    }
    updateSchedule(elderId, scheduleData) {
        return this.scheduleService.updateSchedule(elderId, scheduleData);
    }
    deleteSchedule(scheduleId) {
        return this.scheduleService.deleteSchedule(scheduleId);
    }
    deleteAllDaySchedules(elderId, day) {
        return this.scheduleService.deleteAllDaySchedules(elderId, day);
    }
    updateItemStatus(itemId, statusData) {
        return this.scheduleService.updateItemStatus(itemId, statusData.status);
    }
};
exports.ScheduleController = ScheduleController;
__decorate([
    (0, common_1.Get)(':elderId/today'),
    __param(0, (0, common_1.Param)('elderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ScheduleController.prototype, "getTodaySchedule", null);
__decorate([
    (0, common_1.Get)(':elderId/weekly'),
    __param(0, (0, common_1.Param)('elderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ScheduleController.prototype, "getWeeklySchedule", null);
__decorate([
    (0, common_1.Get)(':elderId/day/:day'),
    __param(0, (0, common_1.Param)('elderId')),
    __param(1, (0, common_1.Param)('day', new common_1.ParseEnumPipe(schedule_dto_1.Day))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ScheduleController.prototype, "getDaySchedule", null);
__decorate([
    (0, common_1.Get)(':elderId'),
    __param(0, (0, common_1.Param)('elderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ScheduleController.prototype, "getElderSchedule", null);
__decorate([
    (0, common_1.Post)(':elderId'),
    __param(0, (0, common_1.Param)('elderId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, schedule_dto_1.CreateScheduleDto]),
    __metadata("design:returntype", void 0)
], ScheduleController.prototype, "createSchedule", null);
__decorate([
    (0, common_1.Put)(':elderId'),
    __param(0, (0, common_1.Param)('elderId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, schedule_dto_1.UpdateScheduleDto]),
    __metadata("design:returntype", void 0)
], ScheduleController.prototype, "updateSchedule", null);
__decorate([
    (0, common_1.Delete)('schedule/:scheduleId'),
    __param(0, (0, common_1.Param)('scheduleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ScheduleController.prototype, "deleteSchedule", null);
__decorate([
    (0, common_1.Delete)(':elderId/day/:day'),
    __param(0, (0, common_1.Param)('elderId')),
    __param(1, (0, common_1.Param)('day', new common_1.ParseEnumPipe(schedule_dto_1.Day))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ScheduleController.prototype, "deleteAllDaySchedules", null);
__decorate([
    (0, common_1.Put)('items/:itemId/status'),
    __param(0, (0, common_1.Param)('itemId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, schedule_dto_1.UpdateItemStatusDto]),
    __metadata("design:returntype", void 0)
], ScheduleController.prototype, "updateItemStatus", null);
exports.ScheduleController = ScheduleController = __decorate([
    (0, common_1.Controller)('schedule'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [schedule_service_1.ScheduleService])
], ScheduleController);
//# sourceMappingURL=schedule.controller.js.map
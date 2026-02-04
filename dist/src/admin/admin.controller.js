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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const admin_guard_1 = require("../auth/guards/admin.guard");
const admin_service_1 = require("./admin.service");
const admin_activity_query_dto_1 = require("./dto/admin-activity-query.dto");
const update_elder_dto_1 = require("./dto/update-elder.dto");
const update_caregiver_status_dto_1 = require("./dto/update-caregiver-status.dto");
const admin_profile_query_dto_1 = require("./dto/admin-profile-query.dto");
let AdminController = class AdminController {
    adminService;
    constructor(adminService) {
        this.adminService = adminService;
    }
    async getActivityLogs(query) {
        return this.adminService.getActivityLogs(query);
    }
    async getFamilyAccounts() {
        return this.adminService.getFamilyAccounts();
    }
    async getCaregivers() {
        return this.adminService.getCaregivers();
    }
    async getFeatureActivity() {
        return this.adminService.getFeatureActivity();
    }
    async getElders() {
        return this.adminService.getElders();
    }
    async updateElder(elderId, dto) {
        return this.adminService.updateElder(elderId, dto);
    }
    async deleteElder(elderId) {
        return this.adminService.deleteElder(elderId);
    }
    async updateCaregiverStatus(caregiverId, dto) {
        return this.adminService.updateCaregiverStatus(caregiverId, dto);
    }
    async getSubscriptionActivity(limit) {
        const parsedLimit = limit ? Number(limit) : undefined;
        return this.adminService.getSubscriptionActivity(parsedLimit);
    }
    async getProfile(query) {
        return this.adminService.getProfile(query);
    }
    async getGenderCounts() {
        return this.adminService.getGenderCounts();
    }
    async getReports() {
        return this.adminService.getReports();
    }
    async getStripeBalance() {
        return this.adminService.getStripeBalance();
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('activity'),
    (0, swagger_1.ApiOperation)({ summary: 'Fetch activity logs with optional filters' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_activity_query_dto_1.AdminActivityQueryDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getActivityLogs", null);
__decorate([
    (0, common_1.Get)('families'),
    (0, swagger_1.ApiOperation)({ summary: 'Fetch family accounts with subscription progress' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getFamilyAccounts", null);
__decorate([
    (0, common_1.Get)('caregivers'),
    (0, swagger_1.ApiOperation)({ summary: 'Fetch caregiver accounts with status information' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getCaregivers", null);
__decorate([
    (0, common_1.Get)('activity/feature'),
    (0, swagger_1.ApiOperation)({ summary: 'Fetch feature usage activity groups' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getFeatureActivity", null);
__decorate([
    (0, common_1.Get)('elders'),
    (0, swagger_1.ApiOperation)({ summary: 'Fetch all elders with relationship details' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getElders", null);
__decorate([
    (0, common_1.Put)('elders/:elderId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update elder details' }),
    (0, swagger_1.ApiParam)({ name: 'elderId', description: 'Elder identifier' }),
    __param(0, (0, common_1.Param)('elderId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_elder_dto_1.AdminUpdateElderDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateElder", null);
__decorate([
    (0, common_1.Delete)('elders/:elderId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete an elder record' }),
    (0, swagger_1.ApiParam)({ name: 'elderId', description: 'Elder identifier' }),
    __param(0, (0, common_1.Param)('elderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteElder", null);
__decorate([
    (0, common_1.Patch)('caregivers/:caregiverId/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Update caregiver account status' }),
    (0, swagger_1.ApiParam)({ name: 'caregiverId', description: 'Caregiver identifier' }),
    __param(0, (0, common_1.Param)('caregiverId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_caregiver_status_dto_1.UpdateCaregiverStatusDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateCaregiverStatus", null);
__decorate([
    (0, common_1.Get)('subscriptions/activity'),
    (0, swagger_1.ApiOperation)({ summary: 'Fetch recent subscription activity logs' }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        description: 'Maximum number of records',
        type: Number,
    }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getSubscriptionActivity", null);
__decorate([
    (0, common_1.Get)('profile'),
    (0, swagger_1.ApiOperation)({
        summary: 'View profile details for family, elder, or caregiver',
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_profile_query_dto_1.AdminProfileQueryDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Get)('stats/gender'),
    (0, swagger_1.ApiOperation)({ summary: 'Fetch counts grouped by gender' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getGenderCounts", null);
__decorate([
    (0, common_1.Get)('reports'),
    (0, swagger_1.ApiOperation)({ summary: 'Fetch comprehensive admin reports and statistics' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getReports", null);
__decorate([
    (0, common_1.Get)('stripe/balance'),
    (0, swagger_1.ApiOperation)({ summary: 'Fetch Stripe account balance and revenue' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getStripeBalance", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)('Admin'),
    (0, swagger_1.ApiBearerAuth)('bearer'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map
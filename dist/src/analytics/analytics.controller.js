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
exports.FamilyAnalyticsController = exports.AdminAnalyticsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const admin_guard_1 = require("../auth/guards/admin.guard");
const analytics_service_1 = require("./analytics.service");
let AdminAnalyticsController = class AdminAnalyticsController {
    analyticsService;
    constructor(analyticsService) {
        this.analyticsService = analyticsService;
    }
    async getUserGrowth(period) {
        return this.analyticsService.getUserGrowth(period);
    }
    async getFeatureUsage(period) {
        return this.analyticsService.getFeatureUsage(period);
    }
    async getGenderDistribution() {
        return this.analyticsService.getGenderDistribution();
    }
    async getRecentActivity(limit) {
        const parsedLimit = limit ? Number(limit) : 10;
        return this.analyticsService.getRecentActivity(parsedLimit);
    }
};
exports.AdminAnalyticsController = AdminAnalyticsController;
__decorate([
    (0, common_1.Get)('user-growth'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get user growth analytics',
        description: 'Returns monthly caregiver and family registration trends',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'period',
        required: false,
        enum: ['6months', '12months'],
        description: 'Time period for analytics',
    }),
    __param(0, (0, common_1.Query)('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminAnalyticsController.prototype, "getUserGrowth", null);
__decorate([
    (0, common_1.Get)('feature-usage'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get feature usage analytics',
        description: 'Returns monthly usage statistics for platform features',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'period',
        required: false,
        enum: ['6months', '12months'],
        description: 'Time period for analytics',
    }),
    __param(0, (0, common_1.Query)('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminAnalyticsController.prototype, "getFeatureUsage", null);
__decorate([
    (0, common_1.Get)('gender-distribution'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get gender distribution',
        description: 'Returns elder gender breakdown for pie chart',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminAnalyticsController.prototype, "getGenderDistribution", null);
__decorate([
    (0, common_1.Get)('recent-activity'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get recent platform activity',
        description: 'Returns recent user activities across the platform',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Maximum number of activities to return',
    }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminAnalyticsController.prototype, "getRecentActivity", null);
exports.AdminAnalyticsController = AdminAnalyticsController = __decorate([
    (0, swagger_1.ApiTags)('Analytics'),
    (0, common_1.Controller)('admin/analytics'),
    (0, swagger_1.ApiBearerAuth)('bearer'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    __metadata("design:paramtypes", [analytics_service_1.AnalyticsService])
], AdminAnalyticsController);
let FamilyAnalyticsController = class FamilyAnalyticsController {
    analyticsService;
    constructor(analyticsService) {
        this.analyticsService = analyticsService;
    }
    async getRecentActivity(req, limit) {
        const parsedLimit = limit ? Number(limit) : 5;
        return this.analyticsService.getFamilyRecentActivity(req.user.userId, parsedLimit);
    }
};
exports.FamilyAnalyticsController = FamilyAnalyticsController;
__decorate([
    (0, common_1.Get)('recent-activity'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get family recent activity',
        description: 'Returns recent activities for the authenticated family user',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Maximum number of activities to return',
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], FamilyAnalyticsController.prototype, "getRecentActivity", null);
exports.FamilyAnalyticsController = FamilyAnalyticsController = __decorate([
    (0, swagger_1.ApiTags)('Family'),
    (0, common_1.Controller)('family'),
    (0, swagger_1.ApiBearerAuth)('bearer'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [analytics_service_1.AnalyticsService])
], FamilyAnalyticsController);
//# sourceMappingURL=analytics.controller.js.map
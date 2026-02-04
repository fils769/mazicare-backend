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
exports.AdminReviewsController = exports.ReviewsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const admin_guard_1 = require("../auth/guards/admin.guard");
const reviews_service_1 = require("./reviews.service");
const create_review_dto_1 = require("./dto/create-review.dto");
let ReviewsController = class ReviewsController {
    reviewsService;
    constructor(reviewsService) {
        this.reviewsService = reviewsService;
    }
    async createReview(req, dto) {
        return this.reviewsService.createReview(req.user.userId, dto);
    }
    async getCaregiverReviews(caregiverId) {
        return this.reviewsService.getCaregiverReviews(caregiverId);
    }
    async getCaregiverStats(caregiverId) {
        return this.reviewsService.getCaregiverStats(caregiverId);
    }
    async getMyReviews(req) {
        return this.reviewsService.getMyReviews(req.user.userId);
    }
    async deleteReview(req, id) {
        return this.reviewsService.deleteReview(id, req.user.userId, req.user.role);
    }
    async checkIfFamilyWorkedWithCaregiver(familyId, caregiverId) {
        const workedTogether = await this.reviewsService.checkIfFamilyWorkedWithCaregiver(familyId, caregiverId);
        return { workedTogether };
    }
};
exports.ReviewsController = ReviewsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Submit a review for a caregiver',
        description: 'Allows a user (typically a family member) to review a caregiver.',
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_review_dto_1.CreateReviewDto]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "createReview", null);
__decorate([
    (0, common_1.Get)('caregiver/:caregiverId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get reviews for a caregiver',
        description: 'Publicly readable reviews for a specific caregiver',
    }),
    (0, swagger_1.ApiParam)({ name: 'caregiverId', description: 'ID of the caregiver' }),
    __param(0, (0, common_1.Param)('caregiverId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "getCaregiverReviews", null);
__decorate([
    (0, common_1.Get)('caregiver/:caregiverId/stats'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get rating stats for a caregiver',
        description: 'Get average rating, total count, and star distribution',
    }),
    (0, swagger_1.ApiParam)({ name: 'caregiverId', description: 'ID of the caregiver' }),
    __param(0, (0, common_1.Param)('caregiverId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "getCaregiverStats", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get my reviews',
        description: 'Get all reviews submitted by the authenticated user',
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "getMyReviews", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete a review',
        description: 'Delete a review. Only the author or an admin can do this.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Review ID' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "deleteReview", null);
__decorate([
    (0, common_1.Get)('worked-together/:familyId/:caregiverId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Check if a family has previously worked with a caregiver',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns true if they worked together, false otherwise',
        schema: {
            example: { workedTogether: true },
        },
    }),
    __param(0, (0, common_1.Param)('familyId')),
    __param(1, (0, common_1.Param)('caregiverId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "checkIfFamilyWorkedWithCaregiver", null);
exports.ReviewsController = ReviewsController = __decorate([
    (0, swagger_1.ApiTags)('Reviews'),
    (0, common_1.Controller)('reviews'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('bearer'),
    __metadata("design:paramtypes", [reviews_service_1.ReviewsService])
], ReviewsController);
let AdminReviewsController = class AdminReviewsController {
    reviewsService;
    constructor(reviewsService) {
        this.reviewsService = reviewsService;
    }
    async getAllReviews() {
        return this.reviewsService.getAllReviews();
    }
};
exports.AdminReviewsController = AdminReviewsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all reviews (Admin)',
        description: 'Get a list of all reviews in the system.',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminReviewsController.prototype, "getAllReviews", null);
exports.AdminReviewsController = AdminReviewsController = __decorate([
    (0, swagger_1.ApiTags)('Admin - Reviews'),
    (0, common_1.Controller)('admin/reviews'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    (0, swagger_1.ApiBearerAuth)('bearer'),
    __metadata("design:paramtypes", [reviews_service_1.ReviewsService])
], AdminReviewsController);
//# sourceMappingURL=reviews.controller.js.map
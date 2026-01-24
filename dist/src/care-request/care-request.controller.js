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
exports.CareRequestController = void 0;
const common_1 = require("@nestjs/common");
const care_request_service_1 = require("./care-request.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
const create_care_request_dto_1 = require("./dto/create-care-request.dto");
const update_care_request_dto_1 = require("./dto/update-care-request.dto");
let CareRequestController = class CareRequestController {
    careRequestService;
    constructor(careRequestService) {
        this.careRequestService = careRequestService;
    }
    async create(req, createCareRequestDto) {
        return this.careRequestService.createCareRequest(req.user.userId, createCareRequestDto);
    }
    async findAll(req) {
        return this.careRequestService.findAllForUser(req.user.userId);
    }
    async findOne(id, req) {
        return this.careRequestService.findOne(req.user.userId, id);
    }
    async update(id, req, updateCareRequestDto) {
        return this.careRequestService.update(req.user.userId, id, updateCareRequestDto);
    }
    async remove(id, req) {
        return this.careRequestService.remove(req.user.userId, id);
    }
    async accept(id, req) {
        return this.careRequestService.acceptCareRequest(req.user.userId, id);
    }
    async reject(id, req) {
        return this.careRequestService.rejectCareRequest(req.user.userId, id);
    }
};
exports.CareRequestController = CareRequestController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new care request' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Care request created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Elder or Caregiver not found' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_care_request_dto_1.CreateCareRequestDto]),
    __metadata("design:returntype", Promise)
], CareRequestController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all care requests for the current user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Care requests fetched successfully' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CareRequestController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a care request by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Care request ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Care request fetched successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Care request not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CareRequestController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a care request' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Care request ID' }),
    (0, swagger_1.ApiBody)({ type: update_care_request_dto_1.UpdateCareRequestDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Care request updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Care request not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, update_care_request_dto_1.UpdateCareRequestDto]),
    __metadata("design:returntype", Promise)
], CareRequestController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a care request' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Care request ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Care request deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Care request not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CareRequestController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/accept'),
    (0, swagger_1.ApiOperation)({ summary: 'Accept a care request' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Care request ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Care request accepted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Care request not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Not authorized to accept this request' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CareRequestController.prototype, "accept", null);
__decorate([
    (0, common_1.Post)(':id/reject'),
    (0, swagger_1.ApiOperation)({ summary: 'Reject a care request' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Care request ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Care request rejected successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Care request not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Not authorized to reject this request' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CareRequestController.prototype, "reject", null);
exports.CareRequestController = CareRequestController = __decorate([
    (0, swagger_1.ApiTags)('care-requests'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('care-requests'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [care_request_service_1.CareRequestService])
], CareRequestController);
//# sourceMappingURL=care-request.controller.js.map
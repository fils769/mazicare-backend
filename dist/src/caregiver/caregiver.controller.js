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
exports.CaregiversController = exports.CaregiverController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const public_decorator_1 = require("../auth/decorators/public.decorator");
const caregiver_service_1 = require("./caregiver.service");
const caregiver_dto_1 = require("./dto/caregiver.dto");
const uploadthing_service_1 = require("../uploadthing/uploadthing.service");
let CaregiverController = class CaregiverController {
    caregiverService;
    uploadThingService;
    constructor(caregiverService, uploadThingService) {
        this.caregiverService = caregiverService;
        this.uploadThingService = uploadThingService;
    }
    async getMyProfile(req) {
        return this.caregiverService.getMyCaregiverProfile(req.user.userId);
    }
    async saveDetails(req, data, profilePicture) {
        let profilePictureUrl;
        if (profilePicture) {
            const uploadResult = await this.uploadThingService.uploadFile(profilePicture);
            profilePictureUrl = uploadResult.url;
        }
        return this.caregiverService.saveDetails(req.user.userId, data, profilePictureUrl);
    }
    async getRegions() {
        return this.caregiverService.getRegions();
    }
    async saveRegionSelection(req, data) {
        return this.caregiverService.saveRegionSelection(req.user.userId, data);
    }
    async uploadDocument(req, document) {
        if (!document) {
            throw new common_1.BadRequestException('Document file is required');
        }
        const uploadResult = await this.uploadThingService.uploadFile(document);
        return this.caregiverService.uploadDocument(req.user.userId, uploadResult.url);
    }
    async uploadIdPassport(req, idPassport) {
        if (!idPassport) {
            throw new common_1.BadRequestException('ID/Passport file is required');
        }
        const uploadResult = await this.uploadThingService.uploadFile(idPassport);
        return this.caregiverService.uploadIdPassport(req.user.userId, uploadResult.url);
    }
    async uploadRecommendation(req, recommendation) {
        if (!recommendation) {
            throw new common_1.BadRequestException('Recommendation letter file is required');
        }
        const uploadResult = await this.uploadThingService.uploadFile(recommendation);
        return this.caregiverService.uploadRecommendation(req.user.userId, uploadResult.url);
    }
    async uploadCertificate(req, certificate) {
        if (!certificate) {
            throw new common_1.BadRequestException('Certificate file is required');
        }
        const uploadResult = await this.uploadThingService.uploadFile(certificate);
        return this.caregiverService.uploadCertificate(req.user.userId, uploadResult.url);
    }
    async getCarePrograms() {
        return this.caregiverService.getCarePrograms();
    }
    async saveCareProgram(req, data) {
        return this.caregiverService.saveCareProgram(req.user.userId, data);
    }
    async completeOnboarding(req) {
        return this.caregiverService.completeOnboarding(req.user.userId);
    }
    async getOnboardingStatus(req) {
        return this.caregiverService.getOnboardingStatus(req.user.userId);
    }
    async getMyElders(req) {
        return this.caregiverService.getMyElders(req.user.userId);
    }
    async getMyElderCount(req) {
        return this.caregiverService.getMyElderCount(req.user.userId);
    }
    async getElderSchedules(req, elderId) {
        return this.caregiverService.getElderSchedules(req.user.userId, elderId);
    }
    async getMyRating(req) {
        return this.caregiverService.getMyRating(req.user.userId);
    }
    async getMySchedules(req) {
        return this.caregiverService.getMySchedules(req.user.userId);
    }
    async updateScheduleItem(req, itemId, data) {
        return this.caregiverService.updateScheduleItem(req.user.userId, itemId, data);
    }
    async updateScheduleItemStatus(req, itemId, status) {
        return this.caregiverService.updateScheduleItemStatus(req.user.userId, itemId, status);
    }
    async getElderRequests(req) {
        return this.caregiverService.getElderRequests(req.user.userId);
    }
    async searchFamilies(filters) {
        return this.caregiverService.searchFamilies(filters);
    }
    async getActivity(req, period = '7d') {
        const periodMap = {
            '24h': 'today',
            '7d': '7d',
            '30d': '30d',
            '12m': '90d'
        };
        const mappedPeriod = periodMap[period] || period || '7d';
        return this.caregiverService.getActivity(req.user.userId, mappedPeriod);
    }
};
exports.CaregiverController = CaregiverController;
__decorate([
    (0, common_1.Get)('profile'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CaregiverController.prototype, "getMyProfile", null);
__decorate([
    (0, common_1.Post)('details'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('profilePicture')),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: false,
        transform: true
    }))),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, caregiver_dto_1.SaveDetailsDto, Object]),
    __metadata("design:returntype", Promise)
], CaregiverController.prototype, "saveDetails", null);
__decorate([
    (0, common_1.Get)('regions'),
    (0, public_decorator_1.Public)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CaregiverController.prototype, "getRegions", null);
__decorate([
    (0, common_1.Post)('regions'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, caregiver_dto_1.RegionSelectionDto]),
    __metadata("design:returntype", Promise)
], CaregiverController.prototype, "saveRegionSelection", null);
__decorate([
    (0, common_1.Post)('documents'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('document')),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CaregiverController.prototype, "uploadDocument", null);
__decorate([
    (0, common_1.Post)('documents/id-passport'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('idPassport')),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CaregiverController.prototype, "uploadIdPassport", null);
__decorate([
    (0, common_1.Post)('documents/recommendation'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('recommendation')),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CaregiverController.prototype, "uploadRecommendation", null);
__decorate([
    (0, common_1.Post)('documents/certificates'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('certificate')),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CaregiverController.prototype, "uploadCertificate", null);
__decorate([
    (0, common_1.Get)('programs'),
    (0, public_decorator_1.Public)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CaregiverController.prototype, "getCarePrograms", null);
__decorate([
    (0, common_1.Post)('programs'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, caregiver_dto_1.CareProgramDto]),
    __metadata("design:returntype", Promise)
], CaregiverController.prototype, "saveCareProgram", null);
__decorate([
    (0, common_1.Post)('complete-onboarding'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CaregiverController.prototype, "completeOnboarding", null);
__decorate([
    (0, common_1.Get)('onboarding-status'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CaregiverController.prototype, "getOnboardingStatus", null);
__decorate([
    (0, common_1.Get)('elders'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CaregiverController.prototype, "getMyElders", null);
__decorate([
    (0, common_1.Get)('elders/count'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CaregiverController.prototype, "getMyElderCount", null);
__decorate([
    (0, common_1.Get)('elders/:elderId/schedules'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('elderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CaregiverController.prototype, "getElderSchedules", null);
__decorate([
    (0, common_1.Get)('rating'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CaregiverController.prototype, "getMyRating", null);
__decorate([
    (0, common_1.Get)('schedules'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CaregiverController.prototype, "getMySchedules", null);
__decorate([
    (0, common_1.Put)('schedules/items/:itemId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('itemId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, caregiver_dto_1.UpdateScheduleItemDto]),
    __metadata("design:returntype", Promise)
], CaregiverController.prototype, "updateScheduleItem", null);
__decorate([
    (0, common_1.Put)('schedules/items/:itemId/status'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('itemId')),
    __param(2, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], CaregiverController.prototype, "updateScheduleItemStatus", null);
__decorate([
    (0, common_1.Get)('requests'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CaregiverController.prototype, "getElderRequests", null);
__decorate([
    (0, common_1.Get)('families'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CaregiverController.prototype, "searchFamilies", null);
__decorate([
    (0, common_1.Get)('activity'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CaregiverController.prototype, "getActivity", null);
exports.CaregiverController = CaregiverController = __decorate([
    (0, common_1.Controller)('caregiver'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [caregiver_service_1.CaregiverService,
        uploadthing_service_1.UploadThingService])
], CaregiverController);
let CaregiversController = class CaregiversController {
    caregiverService;
    constructor(caregiverService) {
        this.caregiverService = caregiverService;
    }
    async searchCaregivers(filters) {
        return this.caregiverService.searchCaregivers(filters);
    }
    async getCaregiverProfile(id) {
        return this.caregiverService.getCaregiverProfile(id);
    }
    async getCaregiverReviews(id) {
        return this.caregiverService.getCaregiverReviews(id);
    }
    async assignCaregiver(caregiverId, elderId, familyId) {
        return this.caregiverService.assignCaregiver(caregiverId, elderId, familyId);
    }
};
exports.CaregiversController = CaregiversController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CaregiversController.prototype, "searchCaregivers", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CaregiversController.prototype, "getCaregiverProfile", null);
__decorate([
    (0, common_1.Get)(':id/reviews'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CaregiversController.prototype, "getCaregiverReviews", null);
__decorate([
    (0, common_1.Post)(':caregiverId/assign'),
    __param(0, (0, common_1.Param)('caregiverId')),
    __param(1, (0, common_1.Body)('elderId')),
    __param(2, (0, common_1.Body)('familyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], CaregiversController.prototype, "assignCaregiver", null);
exports.CaregiversController = CaregiversController = __decorate([
    (0, common_1.Controller)('caregivers'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [caregiver_service_1.CaregiverService])
], CaregiversController);
//# sourceMappingURL=caregiver.controller.js.map
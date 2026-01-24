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
exports.FamiliesController = exports.FamilyController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const family_service_1 = require("./family.service");
const family_dto_1 = require("./dto/family.dto");
const uploadthing_service_1 = require("../uploadthing/uploadthing.service");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
let FamilyController = class FamilyController {
    familyService;
    uploadThingService;
    constructor(familyService, uploadThingService) {
        this.familyService = familyService;
        this.uploadThingService = uploadThingService;
        console.log('FamilyController initialized');
    }
    async saveOnboardingData(req, rawData, profilePicture) {
        let careTypes = rawData.careTypes;
        if (typeof careTypes === 'string') {
            try {
                careTypes = JSON.parse(careTypes);
            }
            catch (e) {
                careTypes = careTypes.includes(',') ? careTypes.split(',').map((s) => s.trim()) : [careTypes];
            }
        }
        if (!Array.isArray(careTypes)) {
            careTypes = careTypes ? [careTypes] : [];
        }
        const parsedData = {
            ...rawData,
            careTypes,
            backgroundCheck: rawData.backgroundCheck === 'true' || rawData.backgroundCheck === true
        };
        const data = await this.validateDto(family_dto_1.FamilyOnboardingDto, parsedData);
        let profilePictureUrl;
        if (profilePicture) {
            const uploadResult = await this.uploadThingService.uploadFile(profilePicture);
            profilePictureUrl = uploadResult.url;
        }
        return this.familyService.saveOnboardingData(req.user.userId, data, profilePictureUrl);
    }
    async validateDto(dtoClass, data) {
        const dtoInstance = (0, class_transformer_1.plainToInstance)(dtoClass, data);
        const errors = await (0, class_validator_1.validate)(dtoInstance);
        if (errors.length > 0) {
            throw new common_1.BadRequestException(errors);
        }
        return dtoInstance;
    }
    async getCaregivers(filters) {
        return this.familyService.getCaregivers(filters);
    }
    async getRegions() {
        return this.familyService.getRegions();
    }
    async getLanguages() {
        return this.familyService.getLanguages();
    }
    async completeOnboarding(req) {
        return this.familyService.completeOnboarding(req.user.userId);
    }
    async getProfileStatus(req) {
        return this.familyService.getProfileStatus(req.user.userId);
    }
    async getOnboardingData(req) {
        return this.familyService.getOnboardingData(req.user.userId);
    }
    async getElders(req) {
        console.log('GET ELDERS METHOD CALLED');
        return this.familyService.getElders(req.user.userId);
    }
    async registerElder(req, elderData, profilePicture) {
        if (profilePicture) {
            console.log('File details:', {
                originalname: profilePicture.originalname,
                mimetype: profilePicture.mimetype,
                size: profilePicture.size
            });
        }
        let profilePictureUrl;
        if (profilePicture) {
            console.log('Uploading profile picture...');
            try {
                const uploadResult = await this.uploadThingService.uploadFile(profilePicture);
                profilePictureUrl = uploadResult.url;
                console.log('Upload successful, URL:', profilePictureUrl);
            }
            catch (error) {
                console.error('Upload failed:', error);
                throw new common_1.BadRequestException('Failed to upload profile picture');
            }
        }
        else {
            console.log('No profile picture to upload');
        }
        const result = await this.familyService.registerElder(req.user.userId, elderData, profilePictureUrl);
        return result;
    }
    async updateElder(req, id, elderData) {
        return this.familyService.updateElder(req.user.userId, id, elderData);
    }
    async removeElder(req, id) {
        return this.familyService.removeElder(req.user.userId, id);
    }
    async getFamilyRequests(req, elderId) {
        return this.familyService.getFamilyRequests(req.user.userId, elderId);
    }
    async getRequestStatus(req, requestId) {
        return this.familyService.getRequestStatus(req.user.userId, requestId);
    }
};
exports.FamilyController = FamilyController;
__decorate([
    (0, common_1.Post)('onboarding'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('profilePicture')),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], FamilyController.prototype, "saveOnboardingData", null);
__decorate([
    (0, common_1.Get)('caregivers'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FamilyController.prototype, "getCaregivers", null);
__decorate([
    (0, common_1.Get)('regions'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FamilyController.prototype, "getRegions", null);
__decorate([
    (0, common_1.Get)('languages'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FamilyController.prototype, "getLanguages", null);
__decorate([
    (0, common_1.Post)('complete-onboarding'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FamilyController.prototype, "completeOnboarding", null);
__decorate([
    (0, common_1.Get)('profile-status'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FamilyController.prototype, "getProfileStatus", null);
__decorate([
    (0, common_1.Get)('onboarding-data'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FamilyController.prototype, "getOnboardingData", null);
__decorate([
    (0, common_1.Get)('elders'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FamilyController.prototype, "getElders", null);
__decorate([
    (0, common_1.Post)('elders'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('profilePicture')),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], FamilyController.prototype, "registerElder", null);
__decorate([
    (0, common_1.Put)('elders/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], FamilyController.prototype, "updateElder", null);
__decorate([
    (0, common_1.Delete)('elders/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FamilyController.prototype, "removeElder", null);
__decorate([
    (0, common_1.Get)('requests'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('elderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FamilyController.prototype, "getFamilyRequests", null);
__decorate([
    (0, common_1.Get)('requests/:requestId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('requestId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FamilyController.prototype, "getRequestStatus", null);
exports.FamilyController = FamilyController = __decorate([
    (0, common_1.Controller)('family'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [family_service_1.FamilyService,
        uploadthing_service_1.UploadThingService])
], FamilyController);
let FamiliesController = class FamiliesController {
    familyService;
    constructor(familyService) {
        this.familyService = familyService;
    }
    async searchFamilies(query, filters) {
        return this.familyService.searchFamilies({ ...filters, search: query });
    }
};
exports.FamiliesController = FamiliesController;
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)('query')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FamiliesController.prototype, "searchFamilies", null);
exports.FamiliesController = FamiliesController = __decorate([
    (0, common_1.Controller)('families'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [family_service_1.FamilyService])
], FamiliesController);
//# sourceMappingURL=family.controller.js.map
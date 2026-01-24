"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaregiverModule = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const caregiver_controller_1 = require("./caregiver.controller");
const caregiver_service_1 = require("./caregiver.service");
const prisma_service_1 = require("../prisma/prisma.service");
const uploadthing_service_1 = require("../uploadthing/uploadthing.service");
let CaregiverModule = class CaregiverModule {
};
exports.CaregiverModule = CaregiverModule;
exports.CaregiverModule = CaregiverModule = __decorate([
    (0, common_1.Module)({
        imports: [
            platform_express_1.MulterModule.register({
                storage: (0, multer_1.memoryStorage)()
            }),
        ],
        controllers: [caregiver_controller_1.CaregiverController, caregiver_controller_1.CaregiversController],
        providers: [caregiver_service_1.CaregiverService, prisma_service_1.PrismaService, uploadthing_service_1.UploadThingService],
    })
], CaregiverModule);
//# sourceMappingURL=caregiver.module.js.map
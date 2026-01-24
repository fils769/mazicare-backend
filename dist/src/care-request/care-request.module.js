"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CareRequestModule = void 0;
const common_1 = require("@nestjs/common");
const care_request_service_1 = require("./care-request.service");
const care_request_controller_1 = require("./care-request.controller");
const prisma_service_1 = require("../prisma/prisma.service");
let CareRequestModule = class CareRequestModule {
};
exports.CareRequestModule = CareRequestModule;
exports.CareRequestModule = CareRequestModule = __decorate([
    (0, common_1.Module)({
        controllers: [care_request_controller_1.CareRequestController],
        providers: [care_request_service_1.CareRequestService, prisma_service_1.PrismaService],
        exports: [care_request_service_1.CareRequestService],
    })
], CareRequestModule);
//# sourceMappingURL=care-request.module.js.map
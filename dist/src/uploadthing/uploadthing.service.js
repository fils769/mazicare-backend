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
exports.UploadThingService = void 0;
const common_1 = require("@nestjs/common");
const server_1 = require("uploadthing/server");
let UploadThingService = class UploadThingService {
    utapi;
    constructor() {
        this.utapi = new server_1.UTApi({
            token: process.env.UPLOADTHING_TOKEN,
        });
    }
    async uploadFile(file) {
        try {
            if (!this.utapi) {
                throw new common_1.InternalServerErrorException("UploadThing client is not initialized");
            }
            if (!file || !file.buffer) {
                throw new common_1.BadRequestException("File buffer is required");
            }
            console.log(`Preparing to upload file: ${file.originalname}, size: ${file.size}, type: ${file.mimetype}`);
            const blob = new Blob([new Uint8Array(file.buffer)], { type: file.mimetype });
            const fileObject = new File([blob], file.originalname, {
                type: file.mimetype,
            });
            console.log(`Created File object: name=${fileObject.name}, size=${fileObject.size}, type=${fileObject.type}`);
            const response = await this.utapi.uploadFiles(fileObject);
            console.log('UploadThing response received');
            if (!response) {
                throw new common_1.InternalServerErrorException("No response from UploadThing");
            }
            if (response.error) {
                console.error('UploadThing error response:', response.error);
                throw new common_1.InternalServerErrorException(`UploadThing upload failed: ${response.error.message}`);
            }
            console.log('Upload successful:', response.data);
            return {
                key: response.data.key,
                url: response.data.ufsUrl || response.data.url,
                name: response.data.name,
                size: response.data.size,
                type: response.data.type,
            };
        }
        catch (error) {
            console.error("UploadThing upload exception:", error);
            console.dir(error, { depth: null });
            throw new common_1.InternalServerErrorException("Failed to upload file to UploadThing", error instanceof Error ? error.message : String(error));
        }
    }
    async deleteFile(fileKey) {
        try {
            await this.utapi.deleteFiles(fileKey);
            return { success: true };
        }
        catch (error) {
            console.error("UploadThing delete error:", error);
            throw new common_1.InternalServerErrorException("Failed to delete file from UploadThing", error instanceof Error ? error.message : String(error));
        }
    }
    async deleteFiles(fileKeys) {
        try {
            await this.utapi.deleteFiles(fileKeys);
            return { success: true };
        }
        catch (error) {
            console.error("UploadThing batch delete error:", error);
            throw new common_1.InternalServerErrorException("Failed to delete files from UploadThing", error instanceof Error ? error.message : String(error));
        }
    }
    getFileUrl(fileKey) {
        return `https://utfs.io/f/${fileKey}`;
    }
    async listFiles(limit = 100, offset = 0) {
        try {
            const response = await this.utapi.listFiles({ limit, offset });
            return response;
        }
        catch (error) {
            console.error("UploadThing list files error:", error);
            throw new common_1.InternalServerErrorException("Failed to list files from UploadThing", error instanceof Error ? error.message : String(error));
        }
    }
};
exports.UploadThingService = UploadThingService;
exports.UploadThingService = UploadThingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], UploadThingService);
//# sourceMappingURL=uploadthing.service.js.map
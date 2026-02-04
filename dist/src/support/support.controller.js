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
exports.AdminSupportController = exports.SupportController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const admin_guard_1 = require("../auth/guards/admin.guard");
const support_service_1 = require("./support.service");
const support_ticket_dto_1 = require("./dto/support-ticket.dto");
let SupportController = class SupportController {
    supportService;
    constructor(supportService) {
        this.supportService = supportService;
    }
    async createTicket(req, dto) {
        return this.supportService.createTicket(req.user.userId, dto);
    }
    async getUserTickets(req) {
        return this.supportService.getUserTickets(req.user.userId);
    }
    async getTicketById(req, id) {
        return this.supportService.getTicketById(id, req.user.userId);
    }
};
exports.SupportController = SupportController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a support ticket',
        description: 'Create a new support ticket for the authenticated user',
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, support_ticket_dto_1.CreateSupportTicketDto]),
    __metadata("design:returntype", Promise)
], SupportController.prototype, "createTicket", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get user tickets',
        description: 'Get all support tickets for the authenticated user',
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SupportController.prototype, "getUserTickets", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get ticket by ID',
        description: 'Get a specific support ticket by ID (only own tickets)',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Ticket ID' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], SupportController.prototype, "getTicketById", null);
exports.SupportController = SupportController = __decorate([
    (0, swagger_1.ApiTags)('Support'),
    (0, common_1.Controller)('support'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('bearer'),
    __metadata("design:paramtypes", [support_service_1.SupportService])
], SupportController);
let AdminSupportController = class AdminSupportController {
    supportService;
    constructor(supportService) {
        this.supportService = supportService;
    }
    async getAllTickets(status) {
        return this.supportService.getAllTickets(status);
    }
    async getTicketStats() {
        return this.supportService.getTicketStats();
    }
    async getTicketById(id) {
        return this.supportService.getTicketById(id);
    }
    async updateTicketStatus(id, dto) {
        return this.supportService.updateTicketStatus(id, dto);
    }
    async updateTicket(id, dto) {
        return this.supportService.updateTicket(id, dto);
    }
    async deleteTicket(id) {
        return this.supportService.deleteTicket(id);
    }
};
exports.AdminSupportController = AdminSupportController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all support tickets',
        description: 'Get all support tickets with optional status filter',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'status',
        required: false,
        enum: support_ticket_dto_1.TicketStatus,
        description: 'Filter by ticket status',
    }),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminSupportController.prototype, "getAllTickets", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get support tickets statistics',
        description: 'Get statistics about support tickets',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminSupportController.prototype, "getTicketStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get ticket by ID (Admin)',
        description: 'Get any support ticket by ID',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Ticket ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminSupportController.prototype, "getTicketById", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update ticket status',
        description: 'Update the status of a support ticket',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Ticket ID' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, support_ticket_dto_1.UpdateTicketStatusDto]),
    __metadata("design:returntype", Promise)
], AdminSupportController.prototype, "updateTicketStatus", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update ticket details',
        description: 'Update ticket details (subject, description, category, etc.)',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Ticket ID' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, support_ticket_dto_1.UpdateTicketDto]),
    __metadata("design:returntype", Promise)
], AdminSupportController.prototype, "updateTicket", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete a support ticket',
        description: 'Permanently delete a support ticket',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Ticket ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminSupportController.prototype, "deleteTicket", null);
exports.AdminSupportController = AdminSupportController = __decorate([
    (0, swagger_1.ApiTags)('Admin - Support'),
    (0, common_1.Controller)('admin/support'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    (0, swagger_1.ApiBearerAuth)('bearer'),
    __metadata("design:paramtypes", [support_service_1.SupportService])
], AdminSupportController);
//# sourceMappingURL=support.controller.js.map
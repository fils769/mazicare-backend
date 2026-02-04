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
exports.MessagesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const messages_service_1 = require("./messages.service");
const message_dto_1 = require("./dto/message.dto");
const messages_gateway_1 = require("./messages.gateway");
let MessagesController = class MessagesController {
    messagesService;
    messagesGateway;
    constructor(messagesService, messagesGateway) {
        this.messagesService = messagesService;
        this.messagesGateway = messagesGateway;
    }
    async getMessages(req, conversationId) {
        return this.messagesService.getMessages(req.user.userId, conversationId);
    }
    async sendMessage(req, messageData) {
        const result = await this.messagesService.sendMessage(req.user.userId, messageData);
        this.messagesGateway.broadcastMessage(result);
        return result.message;
    }
    async getConversations(req) {
        return this.messagesService.getConversations(req.user.userId);
    }
    async getUnreadCount(req) {
        return this.messagesService.getUnreadCount(req.user.userId);
    }
    async markAsRead(req, messageId) {
        return this.messagesService.markAsRead(req.user.userId, messageId);
    }
    async markConversationAsRead(req, conversationId) {
        return this.messagesService.markConversationAsRead(req.user.userId, conversationId);
    }
};
exports.MessagesController = MessagesController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve messages for a user' }),
    (0, swagger_1.ApiQuery)({ name: 'conversationId', required: false }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('conversationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "getMessages", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Send a message to a conversation or user' }),
    (0, swagger_1.ApiBody)({ type: message_dto_1.SendMessageDto }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, message_dto_1.SendMessageDto]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.Get)('conversations'),
    (0, swagger_1.ApiOperation)({ summary: 'List conversations for a user' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "getConversations", null);
__decorate([
    (0, common_1.Get)('unread-count'),
    (0, swagger_1.ApiOperation)({ summary: 'Get unread message count for the current user' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "getUnreadCount", null);
__decorate([
    (0, common_1.Put)(':messageId/read'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark a message as read' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('messageId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "markAsRead", null);
__decorate([
    (0, common_1.Put)('conversation/:conversationId/read-all'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark all messages in a conversation as read' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('conversationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "markConversationAsRead", null);
exports.MessagesController = MessagesController = __decorate([
    (0, swagger_1.ApiTags)('Messages'),
    (0, swagger_1.ApiBearerAuth)('bearer'),
    (0, common_1.Controller)('messages'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [messages_service_1.MessagesService,
        messages_gateway_1.MessagesGateway])
], MessagesController);
//# sourceMappingURL=messages.controller.js.map
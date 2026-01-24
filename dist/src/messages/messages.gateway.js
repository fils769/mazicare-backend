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
var MessagesGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const messages_service_1 = require("./messages.service");
const message_dto_1 = require("./dto/message.dto");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
let MessagesGateway = MessagesGateway_1 = class MessagesGateway {
    jwtService;
    configService;
    messagesService;
    server;
    logger = new common_1.Logger(MessagesGateway_1.name);
    constructor(jwtService, configService, messagesService) {
        this.jwtService = jwtService;
        this.configService = configService;
        this.messagesService = messagesService;
    }
    afterInit(server) {
        this.logger.log('Messages WebSocket Gateway initialized');
        server.on('connection_error', (err) => {
            this.logger.error(`WebSocket connection error: ${err.message}`, err.stack);
        });
    }
    connectedUsers = new Map();
    socketToUserId = new Map();
    async handleConnection(socket) {
        const startTime = Date.now();
        try {
            this.logger.debug(`New connection attempt from socket: ${socket.id}`);
            socket.on('disconnect', (reason) => {
                this.logger.debug(`Socket ${socket.id} disconnecting. Reason: ${reason}`);
                this.handleDisconnect(socket);
            });
            socket.on('error', (err) => {
                this.logger.error(`Socket error for ${socket.id}:`, err);
            });
            const token = this.extractToken(socket);
            const secret = this.configService.get('JWT_SECRET') || 'fallback-secret';
            const payload = this.jwtService.verify(token, { secret });
            if (!payload?.sub) {
                throw new Error('Invalid token payload: missing sub');
            }
            const userId = payload.sub;
            const existingUser = this.connectedUsers.get(userId);
            if (existingUser?.socketId) {
                this.logger.warn(`Closing duplicate connection for user ${userId}`);
                const oldSocket = this.server.sockets.sockets.get(existingUser.socketId);
                oldSocket?.disconnect(true);
            }
            const user = {
                userId,
                email: payload.email,
                role: payload.role,
                socketId: socket.id,
                connectedAt: new Date(),
                lastActive: new Date()
            };
            this.connectedUsers.set(userId, user);
            this.socketToUserId.set(socket.id, userId);
            socket.data.user = user;
            socket.join(userId);
            socket.emit('connected', {
                userId: user.userId,
                socketId: socket.id,
                timestamp: new Date().toISOString(),
                connectionTime: Date.now() - startTime,
                reconnect: !!existingUser
            });
            socket.broadcast.emit('user-online', {
                userId: user.userId,
                timestamp: new Date().toISOString(),
                online: true
            });
            this.logger.log(`Client connected: ${user.userId} (${socket.id}), Total: ${this.connectedUsers.size}`);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            this.logger.warn(`Connection rejected for ${socket.id}: ${errorMessage}`, error instanceof Error ? error.stack : undefined);
            const errorResponse = {
                status: 'error',
                message: 'Authentication failed',
                details: errorMessage,
                code: 'AUTH_ERROR',
                timestamp: new Date().toISOString()
            };
            socket.emit('error', errorResponse);
            socket.emit('authentication_error', errorResponse);
            setTimeout(() => socket.disconnect(true), 100);
        }
    }
    handleDisconnect(socket) {
        const user = socket.data?.user;
        const userId = user?.userId;
        if (userId) {
            const currentUser = this.connectedUsers.get(userId);
            if (currentUser?.socketId === socket.id) {
                this.connectedUsers.delete(userId);
            }
            this.socketToUserId.delete(socket.id);
            this.logger.log(`Client disconnected: ${userId} (${socket.id}), Remaining: ${this.connectedUsers.size}`, {
                duration: user.connectedAt ?
                    Date.now() - user.connectedAt.getTime() + 'ms' : 'unknown',
                lastActive: user.lastActive?.toISOString()
            });
            socket.broadcast.emit('user-offline', {
                userId,
                timestamp: new Date().toISOString(),
                online: false
            });
            socket.broadcast.emit('user-disconnected', { userId, socketId: socket.id });
        }
        else {
            this.logger.warn(`Unknown client disconnected: ${socket.id}`);
        }
        socket.removeAllListeners();
    }
    handleJoinConversation(body, socket) {
        this.ensureAuthenticated(socket);
        if (!body?.conversationId) {
            throw new websockets_1.WsException('conversationId is required');
        }
        socket.join(body.conversationId);
        return {
            event: 'joined-conversation',
            data: { conversationId: body.conversationId },
        };
    }
    handleLeaveConversation(body, socket) {
        this.ensureAuthenticated(socket);
        if (!body?.conversationId) {
            throw new websockets_1.WsException('conversationId is required');
        }
        socket.leave(body.conversationId);
        return {
            event: 'left-conversation',
            data: { conversationId: body.conversationId },
        };
    }
    async handleSendMessage(payload, socket) {
        const startTime = Date.now();
        const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`;
        const user = this.ensureAuthenticated(socket);
        user.lastActive = new Date();
        const ack = (data) => {
            socket.emit('message-ack', {
                messageId,
                status: 'received',
                timestamp: new Date().toISOString(),
                ...data
            });
        };
        this.logger.debug(`[${socket.id}] Received message from user ${user.userId}`, {
            messageId,
            payload,
            timestamp: new Date().toISOString()
        });
        ack({ status: 'processing' });
        try {
            if (typeof payload !== 'object' || payload === null) {
                throw new websockets_1.WsException({
                    status: 'error',
                    code: 'INVALID_PAYLOAD',
                    message: 'Message must be an object'
                });
            }
            const dto = (0, class_transformer_1.plainToInstance)(message_dto_1.SendMessageDto, payload);
            const errors = await (0, class_validator_1.validate)(dto);
            if (errors.length > 0) {
                const errorMessages = errors
                    .map(error => Object.values(error.constraints || {}))
                    .flat();
                this.logger.warn(`[${socket.id}] Validation failed`, {
                    messageId,
                    userId: user.userId,
                    errors: errorMessages,
                    payload
                });
                throw new websockets_1.WsException({
                    status: 'error',
                    code: 'VALIDATION_ERROR',
                    message: 'Message validation failed',
                    errors: errorMessages,
                    messageId
                });
            }
            this.logger.debug(`[${socket.id}] Processing message`, {
                messageId,
                userId: user.userId,
                recipientId: dto.recipientId,
                conversationId: dto.conversationId,
                contentLength: dto.content?.length
            });
            const result = await this.messagesService.sendMessage(user.userId, dto);
            this.logger.debug(`[${socket.id}] Message processed successfully`, {
                messageId,
                serverMessageId: result.message.id,
                duration: `${Date.now() - startTime}ms`
            });
            this.broadcastMessage(result);
            const response = {
                event: 'message-sent',
                data: {
                    message: result.message,
                    conversation: result.conversation,
                    messageId,
                    timestamp: new Date().toISOString()
                }
            };
            ack({ status: 'sent', ...response });
            return response;
        }
        catch (error) {
            const errorObj = error;
            const isWsException = error instanceof websockets_1.WsException;
            const errorMessage = errorObj.message || 'Unknown error';
            const errorCode = isWsException && typeof errorObj['code'] === 'string'
                ? errorObj['code']
                : 'MESSAGE_PROCESSING_ERROR';
            this.logger.error(`[${socket.id}] Error processing message: ${errorMessage}`, {
                messageId,
                userId: user.userId,
                error: {
                    name: errorObj.name,
                    message: errorObj.message,
                    stack: errorObj.stack,
                    code: errorCode,
                    isWsException
                },
                timestamp: new Date().toISOString()
            });
            const errorResponse = {
                status: 'error',
                code: errorCode,
                message: errorMessage,
                messageId,
                timestamp: new Date().toISOString(),
                ...(isWsException && errorObj['errors'] ? { errors: errorObj['errors'] } : {})
            };
            ack(errorResponse);
            throw new websockets_1.WsException(errorResponse);
        }
    }
    broadcastMessage(result) {
        const { message, conversation } = result;
        const targetRooms = new Set([
            conversation.id,
            ...conversation.participants,
        ]);
        const messageData = {
            message: {
                ...message,
                createdAt: message.createdAt instanceof Date ? message.createdAt.toISOString() : message.createdAt,
                updatedAt: message.updatedAt instanceof Date ? message.updatedAt.toISOString() : message.updatedAt,
            },
            conversation: {
                ...conversation,
                createdAt: conversation.createdAt instanceof Date ? conversation.createdAt.toISOString() : conversation.createdAt,
                updatedAt: conversation.updatedAt instanceof Date ? conversation.updatedAt.toISOString() : conversation.updatedAt,
            },
            timestamp: new Date().toISOString()
        };
        for (const room of targetRooms) {
            if (room) {
                this.server.to(room).emit('new-message', messageData);
            }
        }
        this.server.emit('new-message', messageData);
        this.logger.debug(`Broadcasted message ${message.id} to ${targetRooms.size} rooms`, {
            messageId: message.id,
            conversationId: conversation.id,
            targetRooms: Array.from(targetRooms),
            timestamp: new Date().toISOString()
        });
    }
    handleCheckUserStatus(body, socket) {
        this.ensureAuthenticated(socket);
        if (!body?.userId) {
            throw new websockets_1.WsException('userId is required');
        }
        const isOnline = this.isUserOnline(body.userId);
        const userInfo = this.connectedUsers.get(body.userId);
        return {
            event: 'user-status',
            data: {
                userId: body.userId,
                online: isOnline,
                lastActive: userInfo?.lastActive?.toISOString(),
                connectedAt: userInfo?.connectedAt?.toISOString(),
                timestamp: new Date().toISOString()
            }
        };
    }
    handleCheckUsersStatus(body, socket) {
        this.ensureAuthenticated(socket);
        if (!body?.userIds || !Array.isArray(body.userIds)) {
            throw new websockets_1.WsException('userIds array is required');
        }
        const statuses = body.userIds.map(userId => {
            const isOnline = this.isUserOnline(userId);
            const userInfo = this.connectedUsers.get(userId);
            return {
                userId,
                online: isOnline,
                lastActive: userInfo?.lastActive?.toISOString(),
                connectedAt: userInfo?.connectedAt?.toISOString()
            };
        });
        return {
            event: 'users-status',
            data: {
                statuses,
                timestamp: new Date().toISOString()
            }
        };
    }
    handleGetOnlineUsers(socket) {
        this.ensureAuthenticated(socket);
        const onlineUsers = Array.from(this.connectedUsers.entries()).map(([userId, user]) => ({
            userId,
            email: user.email,
            role: user.role,
            connectedAt: user.connectedAt?.toISOString(),
            lastActive: user.lastActive?.toISOString()
        }));
        return {
            event: 'online-users',
            data: {
                users: onlineUsers,
                count: onlineUsers.length,
                timestamp: new Date().toISOString()
            }
        };
    }
    handleHeartbeat(socket) {
        const user = this.ensureAuthenticated(socket);
        user.lastActive = new Date();
        this.connectedUsers.set(user.userId, user);
        return {
            event: 'heartbeat-ack',
            data: {
                timestamp: new Date().toISOString(),
                lastActive: user.lastActive.toISOString()
            }
        };
    }
    isUserOnline(userId) {
        return this.connectedUsers.has(userId);
    }
    getUserOnlineStatus(userId) {
        const user = this.connectedUsers.get(userId);
        return {
            online: !!user,
            lastActive: user?.lastActive,
            connectedAt: user?.connectedAt
        };
    }
    getOnlineUsers() {
        return Array.from(this.connectedUsers.keys());
    }
    getOnlineUsersCount() {
        return this.connectedUsers.size;
    }
    ensureAuthenticated(socket) {
        const user = socket.data?.user;
        if (!user?.userId) {
            this.logger.warn(`Unauthorized socket access attempt`, {
                socketId: socket.id,
                hasUserData: !!socket.data?.user,
                userId: socket.data?.user?.userId,
                ip: socket.handshake.address,
                headers: socket.handshake.headers
            });
            throw new websockets_1.WsException({
                status: 'error',
                code: 'UNAUTHORIZED',
                message: 'Authentication required',
                timestamp: new Date().toISOString()
            });
        }
        user.lastActive = new Date();
        return user;
    }
    extractToken(socket) {
        const authHeader = socket.handshake.headers?.authorization;
        if (typeof authHeader === 'string') {
            const [scheme, token] = authHeader.split(' ');
            if (scheme.toLowerCase() === 'bearer' && token) {
                this.logger.debug('Using Bearer token from Authorization header');
                return token.trim();
            }
        }
        const queryToken = socket.handshake.query?.token;
        if (typeof queryToken === 'string' && queryToken) {
            this.logger.debug('Using token from query parameter');
            return queryToken.trim();
        }
        if (Array.isArray(queryToken) && queryToken.length > 0 && queryToken[0]) {
            this.logger.debug('Using first token from query parameters array');
            return queryToken[0].trim();
        }
        const authToken = socket.handshake.auth?.token;
        if (typeof authToken === 'string' && authToken) {
            this.logger.debug('Using token from auth object');
            return authToken.trim();
        }
        const cookies = socket.handshake.headers.cookie;
        if (cookies) {
            const cookieToken = this.extractTokenFromCookies(cookies, 'jwt');
            if (cookieToken) {
                this.logger.debug('Using JWT from cookies');
                return cookieToken;
            }
        }
        const errorDetails = {
            socketId: socket.id,
            ip: socket.handshake.address,
            headers: Object.keys(socket.handshake.headers),
            auth: Object.keys(socket.handshake.auth),
            query: Object.keys(socket.handshake.query)
        };
        this.logger.warn('No authentication token found in request', errorDetails);
        throw new common_1.UnauthorizedException({
            status: 'error',
            code: 'MISSING_AUTH_TOKEN',
            message: 'No authentication token provided',
            timestamp: new Date().toISOString(),
            supportedAuthMethods: [
                'Authorization: Bearer <token>',
                '?token=<token>',
                'auth: { token: <token> }',
                'Cookie: jwt=<token>'
            ]
        });
    }
    extractTokenFromCookies(cookieHeader, cookieName) {
        try {
            const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
                const [name, value] = cookie.trim().split('=');
                acc[name] = value;
                return acc;
            }, {});
            return cookies[cookieName] || null;
        }
        catch (error) {
            this.logger.warn('Failed to parse cookies', { error: error.message });
            return null;
        }
    }
};
exports.MessagesGateway = MessagesGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], MessagesGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join-conversation'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], MessagesGateway.prototype, "handleJoinConversation", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leave-conversation'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], MessagesGateway.prototype, "handleLeaveConversation", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('send-message'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        forbidUnknownValues: true,
        skipMissingProperties: false,
        exceptionFactory: (errors) => {
            const result = errors.map((error) => ({
                property: error.property,
                value: error.value,
                constraints: error.constraints,
                children: error.children,
            }));
            return new websockets_1.WsException({
                status: 'error',
                message: 'Validation failed',
                code: 'VALIDATION_ERROR',
                errors: result,
                timestamp: new Date().toISOString()
            });
        }
    })),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], MessagesGateway.prototype, "handleSendMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('check-user-status'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], MessagesGateway.prototype, "handleCheckUserStatus", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('check-users-status'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], MessagesGateway.prototype, "handleCheckUsersStatus", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('get-online-users'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], MessagesGateway.prototype, "handleGetOnlineUsers", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('heartbeat'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], MessagesGateway.prototype, "handleHeartbeat", null);
exports.MessagesGateway = MessagesGateway = MessagesGateway_1 = __decorate([
    (0, common_1.Injectable)(),
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
            credentials: true,
            methods: ['GET', 'POST'],
        },
        namespace: '/ws/messages',
        transports: ['websocket', 'polling'],
        path: '/socket.io',
        pingTimeout: 10000,
        pingInterval: 5000,
        maxHttpBufferSize: 1e8,
        allowEIO3: true,
        allowEIO4: true,
        connectionStateRecovery: {
            maxDisconnectionDuration: 2 * 60 * 1000,
            skipMiddlewares: true,
        },
        allowRequest: (req, callback) => {
            callback(null, true);
        }
    }),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        config_1.ConfigService,
        messages_service_1.MessagesService])
], MessagesGateway);
//# sourceMappingURL=messages.gateway.js.map
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
var NotificationsGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
let NotificationsGateway = NotificationsGateway_1 = class NotificationsGateway {
    jwtService;
    configService;
    server;
    logger = new common_1.Logger(NotificationsGateway_1.name);
    connectedUsers = new Map();
    constructor(jwtService, configService) {
        this.jwtService = jwtService;
        this.configService = configService;
    }
    afterInit(server) {
        this.logger.log('Notifications WebSocket Gateway initialized');
    }
    async handleConnection(socket) {
        try {
            this.logger.debug(`New notification connection: ${socket.id}`);
            const token = this.extractToken(socket);
            const secret = this.configService.get('JWT_SECRET') || 'fallback-secret';
            const payload = this.jwtService.verify(token, { secret });
            if (!payload?.sub) {
                throw new Error('Invalid token payload');
            }
            const userId = payload.sub;
            const user = {
                userId,
                email: payload.email,
                role: payload.role,
                socketId: socket.id,
                connectedAt: new Date(),
            };
            this.connectedUsers.set(userId, user);
            socket.data.user = user;
            socket.join(userId);
            socket.emit('connected', {
                userId: user.userId,
                timestamp: new Date().toISOString(),
            });
            this.logger.log(`Notification client connected: ${userId} (${socket.id})`);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            this.logger.warn(`Notification connection rejected: ${errorMessage}`);
            socket.emit('error', {
                status: 'error',
                message: 'Authentication failed',
                code: 'AUTH_ERROR',
            });
            setTimeout(() => socket.disconnect(true), 100);
        }
    }
    handleDisconnect(socket) {
        const user = socket.data?.user;
        if (user?.userId) {
            this.connectedUsers.delete(user.userId);
            this.logger.log(`Notification client disconnected: ${user.userId} (${socket.id})`);
        }
        socket.removeAllListeners();
    }
    sendNotificationToUser(userId, notification) {
        this.server.to(userId).emit('notification', {
            ...notification,
            timestamp: new Date().toISOString(),
        });
        this.logger.debug(`Sent notification to user ${userId}`, {
            notificationId: notification.id,
            type: notification.type,
        });
    }
    broadcastNotification(userIds, notification) {
        userIds.forEach((userId) => {
            this.sendNotificationToUser(userId, notification);
        });
    }
    isUserConnected(userId) {
        return this.connectedUsers.has(userId);
    }
    getConnectedUsersCount() {
        return this.connectedUsers.size;
    }
    extractToken(socket) {
        const authHeader = socket.handshake.headers?.authorization;
        if (typeof authHeader === 'string') {
            const [scheme, token] = authHeader.split(' ');
            if (scheme.toLowerCase() === 'bearer' && token) {
                return token.trim();
            }
        }
        const queryToken = socket.handshake.query?.token;
        if (typeof queryToken === 'string' && queryToken) {
            return queryToken.trim();
        }
        if (Array.isArray(queryToken) && queryToken.length > 0 && queryToken[0]) {
            return queryToken[0].trim();
        }
        const authToken = socket.handshake.auth?.token;
        if (typeof authToken === 'string' && authToken) {
            return authToken.trim();
        }
        throw new common_1.UnauthorizedException('No authentication token provided');
    }
};
exports.NotificationsGateway = NotificationsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], NotificationsGateway.prototype, "server", void 0);
exports.NotificationsGateway = NotificationsGateway = NotificationsGateway_1 = __decorate([
    (0, common_1.Injectable)(),
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
            credentials: true,
            methods: ['GET', 'POST'],
        },
        namespace: '/ws/notifications',
        transports: ['websocket', 'polling'],
        path: '/socket.io',
    }),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        config_1.ConfigService])
], NotificationsGateway);
//# sourceMappingURL=notifications.gateway.js.map
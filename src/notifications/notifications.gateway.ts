import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

interface GatewayUser {
  userId: string;
  email?: string;
  role?: string;
  socketId?: string;
  connectedAt?: Date;
}

@Injectable()
@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
    credentials: true,
    methods: ['GET', 'POST'],
  },
  namespace: '/ws/notifications',
  transports: ['websocket', 'polling'],
  path: '/socket.io',
})
export class NotificationsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(NotificationsGateway.name);
  private connectedUsers = new Map<string, GatewayUser>();

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  afterInit(server: Server): void {
    this.logger.log('Notifications WebSocket Gateway initialized');
  }

  async handleConnection(socket: Socket): Promise<void> {
    try {
      this.logger.debug(`New notification connection: ${socket.id}`);

      // Extract and verify JWT token
      const token = this.extractToken(socket);
      const secret = this.configService.get<string>('JWT_SECRET') || 'fallback-secret';
      const payload = this.jwtService.verify(token, { secret });

      if (!payload?.sub) {
        throw new Error('Invalid token payload');
      }

      const userId = payload.sub as string;

      // Store user connection
      const user: GatewayUser = {
        userId,
        email: payload.email as string | undefined,
        role: payload.role as string | undefined,
        socketId: socket.id,
        connectedAt: new Date(),
      };

      this.connectedUsers.set(userId, user);
      socket.data.user = user;

      // Join user-specific room
      socket.join(userId);

      socket.emit('connected', {
        userId: user.userId,
        timestamp: new Date().toISOString(),
      });

      this.logger.log(`Notification client connected: ${userId} (${socket.id})`);
    } catch (error) {
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

  handleDisconnect(socket: Socket): void {
    const user = socket.data?.user as GatewayUser | undefined;

    if (user?.userId) {
      this.connectedUsers.delete(user.userId);
      this.logger.log(`Notification client disconnected: ${user.userId} (${socket.id})`);
    }

    socket.removeAllListeners();
  }

  /**
   * Send real-time notification to a specific user
   */
  sendNotificationToUser(userId: string, notification: any): void {
    this.server.to(userId).emit('notification', {
      ...notification,
      timestamp: new Date().toISOString(),
    });

    this.logger.debug(`Sent notification to user ${userId}`, {
      notificationId: notification.id,
      type: notification.type,
    });
  }

  /**
   * Broadcast notification to multiple users
   */
  broadcastNotification(userIds: string[], notification: any): void {
    userIds.forEach((userId) => {
      this.sendNotificationToUser(userId, notification);
    });
  }

  /**
   * Check if user is connected
   */
  isUserConnected(userId: string): boolean {
    return this.connectedUsers.has(userId);
  }

  /**
   * Get connected users count
   */
  getConnectedUsersCount(): number {
    return this.connectedUsers.size;
  }

  private extractToken(socket: Socket): string {
    // Check Authorization header
    const authHeader = socket.handshake.headers?.authorization;
    if (typeof authHeader === 'string') {
      const [scheme, token] = authHeader.split(' ');
      if (scheme.toLowerCase() === 'bearer' && token) {
        return token.trim();
      }
    }

    // Check query parameter
    const queryToken = socket.handshake.query?.token;
    if (typeof queryToken === 'string' && queryToken) {
      return queryToken.trim();
    }
    if (Array.isArray(queryToken) && queryToken.length > 0 && queryToken[0]) {
      return queryToken[0].trim();
    }

    // Check auth object
    const authToken = socket.handshake.auth?.token;
    if (typeof authToken === 'string' && authToken) {
      return authToken.trim();
    }

    throw new UnauthorizedException('No authentication token provided');
  }
}

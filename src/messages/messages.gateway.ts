import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {
  Injectable,
  Logger,
  UnauthorizedException,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SendMessageResult } from './interfaces/message.interface';
import { MessagesService } from './messages.service';
import { SendMessageDto } from './dto/message.dto';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

interface GatewayUser {
  userId: string;
  email?: string;
  role?: string;
  socketId?: string;
  connectedAt?: Date;
  lastActive?: Date;
}

@Injectable()
@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'https://mazicare-webapp.vercel.app', 'https://mazicare-website.vercel.app/'],
    credentials: true,
    methods: ['GET', 'POST'],
  },
  namespace: '/ws/messages',
  transports: ['websocket', 'polling'],
  path: '/socket.io',
  pingTimeout: 10000,  // 10 seconds
  pingInterval: 5000,   // 5 seconds
  maxHttpBufferSize: 1e8, // 100MB
  allowEIO3: true,
  allowEIO4: true,
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000, // 2 minutes
    skipMiddlewares: true,
  },
  allowRequest: (req, callback) => {
    // Additional security checks can be added here
    callback(null, true);
  }
})
export class MessagesGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(MessagesGateway.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly messagesService: MessagesService,
  ) { }

  afterInit(server: Server): void {
    this.logger.log('Messages WebSocket Gateway initialized');

    // Add error handler for the server
    server.on('connection_error', (err) => {
      this.logger.error(`WebSocket connection error: ${err.message}`, err.stack);
    });
  }

  // Track connected users
  private connectedUsers = new Map<string, GatewayUser>();
  private socketToUserId = new Map<string, string>();

  async handleConnection(socket: Socket): Promise<void> {
    const startTime = Date.now();

    try {
      this.logger.debug(`New connection attempt from socket: ${socket.id}`);

      // Socket.IO has built-in ping/pong mechanism (configured in gateway options)
      // No need for custom ping/pong implementation

      // Handle disconnection
      socket.on('disconnect', (reason) => {
        this.logger.debug(`Socket ${socket.id} disconnecting. Reason: ${reason}`);
        this.handleDisconnect(socket);
      });

      socket.on('error', (err) => {
        this.logger.error(`Socket error for ${socket.id}:`, err);
      });

      // Authentication
      const token = this.extractToken(socket);
      const secret = this.configService.get<string>('JWT_SECRET') || 'fallback-secret';

      const payload = this.jwtService.verify(token, { secret });
      if (!payload?.sub) {
        throw new Error('Invalid token payload: missing sub');
      }

      const userId = payload.sub as string;

      // Clean up any existing connection for this user
      const existingUser = this.connectedUsers.get(userId);
      if (existingUser?.socketId) {
        this.logger.warn(`Closing duplicate connection for user ${userId}`);
        const oldSocket = this.server.sockets.sockets.get(existingUser.socketId);
        oldSocket?.disconnect(true);
      }

      const user: GatewayUser = {
        userId,
        email: payload.email as string | undefined,
        role: payload.role as string | undefined,
        socketId: socket.id,
        connectedAt: new Date(),
        lastActive: new Date()
      };

      // Store user connection
      this.connectedUsers.set(userId, user);
      this.socketToUserId.set(socket.id, userId);
      socket.data.user = user;
      socket.join(userId);

      // Notify user about successful connection
      socket.emit('connected', {
        userId: user.userId,
        socketId: socket.id,
        timestamp: new Date().toISOString(),
        connectionTime: Date.now() - startTime,
        reconnect: !!existingUser
      });

      // Broadcast user online status to other connected users
      socket.broadcast.emit('user-online', {
        userId: user.userId,
        timestamp: new Date().toISOString(),
        online: true
      });

      this.logger.log(`Client connected: ${user.userId} (${socket.id}), Total: ${this.connectedUsers.size}`);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.warn(`Connection rejected for ${socket.id}: ${errorMessage}`,
        error instanceof Error ? error.stack : undefined);

      const errorResponse = {
        status: 'error',
        message: 'Authentication failed',
        details: errorMessage,
        code: 'AUTH_ERROR',
        timestamp: new Date().toISOString()
      };

      socket.emit('error', errorResponse);
      socket.emit('authentication_error', errorResponse);

      // Give client a moment to receive the error before disconnecting
      setTimeout(() => socket.disconnect(true), 100);
    }
  }

  handleDisconnect(socket: Socket): void {
    const user = socket.data?.user as GatewayUser | undefined;
    const userId = user?.userId;

    if (userId) {
      // Only remove if this is the most recent connection
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

      // Broadcast user offline status to other connected users
      socket.broadcast.emit('user-offline', {
        userId,
        timestamp: new Date().toISOString(),
        online: false
      });

      // Also emit the legacy event for backward compatibility
      socket.broadcast.emit('user-disconnected', { userId, socketId: socket.id });
    } else {
      this.logger.warn(`Unknown client disconnected: ${socket.id}`);
    }

    // Clean up any remaining references
    socket.removeAllListeners();
  }

  @SubscribeMessage('join-conversation')
  handleJoinConversation(
    @MessageBody() body: { conversationId: string },
    @ConnectedSocket() socket: Socket,
  ) {
    this.ensureAuthenticated(socket);
    if (!body?.conversationId) {
      throw new WsException('conversationId is required');
    }

    socket.join(body.conversationId);
    return {
      event: 'joined-conversation',
      data: { conversationId: body.conversationId },
    };
  }

  @SubscribeMessage('leave-conversation')
  handleLeaveConversation(
    @MessageBody() body: { conversationId: string },
    @ConnectedSocket() socket: Socket,
  ) {
    this.ensureAuthenticated(socket);
    if (!body?.conversationId) {
      throw new WsException('conversationId is required');
    }

    socket.leave(body.conversationId);
    return {
      event: 'left-conversation',
      data: { conversationId: body.conversationId },
    };
  }

  @SubscribeMessage('send-message')
  @UsePipes(new ValidationPipe({
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
      return new WsException({
        status: 'error',
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        errors: result,
        timestamp: new Date().toISOString()
      });
    }
  }))
  async handleSendMessage(
    @MessageBody() payload: unknown,
    @ConnectedSocket() socket: Socket,
  ) {
    const startTime = Date.now();
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`;
    const user = this.ensureAuthenticated(socket);

    // Update last active time
    user.lastActive = new Date();

    // Acknowledge message receipt immediately
    const ack = (data: any) => {
      socket.emit('message-ack', {
        messageId,
        status: 'received',
        timestamp: new Date().toISOString(),
        ...data
      });
    };

    // Log the incoming message
    this.logger.debug(`[${socket.id}] Received message from user ${user.userId}`, {
      messageId,
      payload,
      timestamp: new Date().toISOString()
    });

    // Send immediate acknowledgment
    ack({ status: 'processing' });

    try {
      // Validate payload structure
      if (typeof payload !== 'object' || payload === null) {
        throw new WsException({
          status: 'error',
          code: 'INVALID_PAYLOAD',
          message: 'Message must be an object'
        });
      }

      // Transform and validate DTO
      const dto: SendMessageDto = plainToInstance(SendMessageDto, payload);
      const errors = await validate(dto as object);

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

        throw new WsException({
          status: 'error',
          code: 'VALIDATION_ERROR',
          message: 'Message validation failed',
          errors: errorMessages,
          messageId
        });
      }

      // Log message processing
      this.logger.debug(`[${socket.id}] Processing message`, {
        messageId,
        userId: user.userId,
        recipientId: dto.recipientId,
        conversationId: dto.conversationId,
        contentLength: dto.content?.length
      });

      // Process message through service
      const result = await this.messagesService.sendMessage(user.userId, dto);

      // Log successful processing
      this.logger.debug(`[${socket.id}] Message processed successfully`, {
        messageId,
        serverMessageId: result.message.id,
        duration: `${Date.now() - startTime}ms`
      });

      // Broadcast to all relevant clients
      this.broadcastMessage(result);

      // Send success acknowledgment
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

    } catch (error) {
      const errorObj = error as Error;
      const isWsException = error instanceof WsException;
      const errorMessage = errorObj.message || 'Unknown error';
      const errorCode = isWsException && typeof errorObj['code'] === 'string'
        ? errorObj['code']
        : 'MESSAGE_PROCESSING_ERROR';

      // Log the error
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

      // Prepare error response
      const errorResponse = {
        status: 'error',
        code: errorCode,
        message: errorMessage,
        messageId,
        timestamp: new Date().toISOString(),
        ...(isWsException && errorObj['errors'] ? { errors: errorObj['errors'] } : {})
      };

      // Send error acknowledgment
      ack(errorResponse);

      // Re-throw to let the client know something went wrong
      throw new WsException(errorResponse);
    }
  }

  broadcastMessage(result: SendMessageResult): void {
    const { message, conversation } = result;
    const targetRooms = new Set<string>([
      conversation.id,
      ...conversation.participants,
    ]);

    const messageData = {
      message: {
        ...message,
        // Ensure dates are ISO strings
        createdAt: message.createdAt instanceof Date ? message.createdAt.toISOString() : message.createdAt,
        updatedAt: message.updatedAt instanceof Date ? message.updatedAt.toISOString() : message.updatedAt,
      },
      conversation: {
        ...conversation,
        // Ensure dates are ISO strings
        createdAt: conversation.createdAt instanceof Date ? conversation.createdAt.toISOString() : conversation.createdAt,
        updatedAt: conversation.updatedAt instanceof Date ? conversation.updatedAt.toISOString() : conversation.updatedAt,
      },
      timestamp: new Date().toISOString()
    };

    // Emit to specific rooms
    for (const room of targetRooms) {
      if (room) { // Skip empty/undefined room IDs
        this.server.to(room).emit('new-message', messageData);
      }
    }

    // Also emit to the global namespace for system-wide listeners
    this.server.emit('new-message', messageData);

    // Log the broadcast
    this.logger.debug(`Broadcasted message ${message.id} to ${targetRooms.size} rooms`, {
      messageId: message.id,
      conversationId: conversation.id,
      targetRooms: Array.from(targetRooms),
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Check if a specific user is online
   */
  @SubscribeMessage('check-user-status')
  handleCheckUserStatus(
    @MessageBody() body: { userId: string },
    @ConnectedSocket() socket: Socket,
  ) {
    this.ensureAuthenticated(socket);

    if (!body?.userId) {
      throw new WsException('userId is required');
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

  /**
   * Check multiple users' online status
   */
  @SubscribeMessage('check-users-status')
  handleCheckUsersStatus(
    @MessageBody() body: { userIds: string[] },
    @ConnectedSocket() socket: Socket,
  ) {
    this.ensureAuthenticated(socket);

    if (!body?.userIds || !Array.isArray(body.userIds)) {
      throw new WsException('userIds array is required');
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

  /**
   * Get all online users
   */
  @SubscribeMessage('get-online-users')
  handleGetOnlineUsers(
    @ConnectedSocket() socket: Socket,
  ) {
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

  /**
   * Update user's active status (heartbeat)
   */
  @SubscribeMessage('heartbeat')
  handleHeartbeat(
    @ConnectedSocket() socket: Socket,
  ) {
    const user = this.ensureAuthenticated(socket);

    // Update last active time
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

  /**
   * Helper method to check if a user is online
   */
  private isUserOnline(userId: string): boolean {
    return this.connectedUsers.has(userId);
  }

  /**
   * Public method to get online status (can be called from other services)
   */
  public getUserOnlineStatus(userId: string): {
    online: boolean;
    lastActive?: Date;
    connectedAt?: Date;
  } {
    const user = this.connectedUsers.get(userId);
    return {
      online: !!user,
      lastActive: user?.lastActive,
      connectedAt: user?.connectedAt
    };
  }

  /**
   * Public method to get all online users (can be called from other services)
   */
  public getOnlineUsers(): string[] {
    return Array.from(this.connectedUsers.keys());
  }

  /**
   * Public method to get online users count
   */
  public getOnlineUsersCount(): number {
    return this.connectedUsers.size;
  }

  private ensureAuthenticated(socket: Socket): GatewayUser {
    const user: GatewayUser | undefined = socket.data?.user;

    if (!user?.userId) {
      this.logger.warn(`Unauthorized socket access attempt`, {
        socketId: socket.id,
        hasUserData: !!socket.data?.user,
        userId: socket.data?.user?.userId,
        ip: socket.handshake.address,
        headers: socket.handshake.headers
      });

      throw new WsException({
        status: 'error',
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
        timestamp: new Date().toISOString()
      });
    }

    // Update last activity timestamp
    user.lastActive = new Date();

    return user;
  }

  private extractToken(socket: Socket): string {
    // 1. Check Authorization header (Bearer token)
    const authHeader = socket.handshake.headers?.authorization;
    if (typeof authHeader === 'string') {
      const [scheme, token] = authHeader.split(' ');
      if (scheme.toLowerCase() === 'bearer' && token) {
        this.logger.debug('Using Bearer token from Authorization header');
        return token.trim();
      }
    }

    // 2. Check query parameter
    const queryToken = socket.handshake.query?.token;
    if (typeof queryToken === 'string' && queryToken) {
      this.logger.debug('Using token from query parameter');
      return queryToken.trim();
    }
    if (Array.isArray(queryToken) && queryToken.length > 0 && queryToken[0]) {
      this.logger.debug('Using first token from query parameters array');
      return queryToken[0].trim();
    }

    // 3. Check auth object
    const authToken = socket.handshake.auth?.token;
    if (typeof authToken === 'string' && authToken) {
      this.logger.debug('Using token from auth object');
      return authToken.trim();
    }

    // 4. Check for JWT in cookies (if using cookie-based auth)
    const cookies = socket.handshake.headers.cookie;
    if (cookies) {
      const cookieToken = this.extractTokenFromCookies(cookies, 'jwt');
      if (cookieToken) {
        this.logger.debug('Using JWT from cookies');
        return cookieToken;
      }
    }

    // Log detailed error information
    const errorDetails = {
      socketId: socket.id,
      ip: socket.handshake.address,
      headers: Object.keys(socket.handshake.headers),
      auth: Object.keys(socket.handshake.auth),
      query: Object.keys(socket.handshake.query)
    };

    this.logger.warn('No authentication token found in request', errorDetails);

    throw new UnauthorizedException({
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

  private extractTokenFromCookies(cookieHeader: string, cookieName: string): string | null {
    try {
      const cookies = cookieHeader.split(';').reduce((acc: Record<string, string>, cookie) => {
        const [name, value] = cookie.trim().split('=');
        acc[name] = value;
        return acc;
      }, {});

      return cookies[cookieName] || null;
    } catch (error) {
      this.logger.warn('Failed to parse cookies', { error: error.message });
      return null;
    }
  }
}

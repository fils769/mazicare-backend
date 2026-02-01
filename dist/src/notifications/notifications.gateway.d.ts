import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
export declare class NotificationsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly jwtService;
    private readonly configService;
    server: Server;
    private readonly logger;
    private connectedUsers;
    constructor(jwtService: JwtService, configService: ConfigService);
    afterInit(server: Server): void;
    handleConnection(socket: Socket): Promise<void>;
    handleDisconnect(socket: Socket): void;
    sendNotificationToUser(userId: string, notification: any): void;
    broadcastNotification(userIds: string[], notification: any): void;
    isUserConnected(userId: string): boolean;
    getConnectedUsersCount(): number;
    private extractToken;
}

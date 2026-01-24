import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SendMessageResult } from './interfaces/message.interface';
import { MessagesService } from './messages.service';
export declare class MessagesGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly jwtService;
    private readonly configService;
    private readonly messagesService;
    server: Server;
    private readonly logger;
    constructor(jwtService: JwtService, configService: ConfigService, messagesService: MessagesService);
    afterInit(server: Server): void;
    private connectedUsers;
    private socketToUserId;
    handleConnection(socket: Socket): Promise<void>;
    handleDisconnect(socket: Socket): void;
    handleJoinConversation(body: {
        conversationId: string;
    }, socket: Socket): {
        event: string;
        data: {
            conversationId: string;
        };
    };
    handleLeaveConversation(body: {
        conversationId: string;
    }, socket: Socket): {
        event: string;
        data: {
            conversationId: string;
        };
    };
    handleSendMessage(payload: unknown, socket: Socket): Promise<{
        event: string;
        data: {
            message: {
                id: string;
                conversationId: string;
                senderId: string;
                recipientId: string;
                content: string;
                createdAt: Date | string;
                updatedAt?: Date | string;
            };
            conversation: {
                id: string;
                participants: string[];
                lastMessage: string | null;
                lastMessageTime: Date | string | null;
                createdAt: Date | string;
                updatedAt: Date | string;
            };
            messageId: string;
            timestamp: string;
        };
    }>;
    broadcastMessage(result: SendMessageResult): void;
    handleCheckUserStatus(body: {
        userId: string;
    }, socket: Socket): {
        event: string;
        data: {
            userId: string;
            online: boolean;
            lastActive: string | undefined;
            connectedAt: string | undefined;
            timestamp: string;
        };
    };
    handleCheckUsersStatus(body: {
        userIds: string[];
    }, socket: Socket): {
        event: string;
        data: {
            statuses: {
                userId: string;
                online: boolean;
                lastActive: string | undefined;
                connectedAt: string | undefined;
            }[];
            timestamp: string;
        };
    };
    handleGetOnlineUsers(socket: Socket): {
        event: string;
        data: {
            users: {
                userId: string;
                email: string | undefined;
                role: string | undefined;
                connectedAt: string | undefined;
                lastActive: string | undefined;
            }[];
            count: number;
            timestamp: string;
        };
    };
    handleHeartbeat(socket: Socket): {
        event: string;
        data: {
            timestamp: string;
            lastActive: string;
        };
    };
    private isUserOnline;
    getUserOnlineStatus(userId: string): {
        online: boolean;
        lastActive?: Date;
        connectedAt?: Date;
    };
    getOnlineUsers(): string[];
    getOnlineUsersCount(): number;
    private ensureAuthenticated;
    private extractToken;
    private extractTokenFromCookies;
}

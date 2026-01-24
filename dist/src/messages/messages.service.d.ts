import { PrismaService } from '../prisma/prisma.service';
import { SendMessageDto } from './dto/message.dto';
import { SendMessageResult } from './interfaces/message.interface';
export declare class MessagesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    sendMessage(senderId: string, messageData: SendMessageDto): Promise<SendMessageResult>;
    getMessages(userId: string, conversationId?: string): Promise<({
        sender: {
            id: string;
            email: string;
            role: import(".prisma/client").$Enums.UserRole;
            caregiver: {
                profilePicture: string | null;
                firstName: string | null;
                lastName: string | null;
            } | null;
            family: {
                profilePicture: string | null;
                familyName: string | null;
            } | null;
        };
        recipient: {
            id: string;
            email: string;
            role: import(".prisma/client").$Enums.UserRole;
            caregiver: {
                profilePicture: string | null;
                firstName: string | null;
                lastName: string | null;
            } | null;
            family: {
                profilePicture: string | null;
                familyName: string | null;
            } | null;
        };
    } & {
        id: string;
        createdAt: Date;
        senderId: string;
        recipientId: string;
        content: string;
        isRead: boolean;
        readAt: Date | null;
        conversationId: string;
    })[]>;
    getConversations(userId: string): Promise<{
        otherParticipant: {
            id: string;
            email: string;
            role: string;
            caregiver: {
                firstName: string | null;
                lastName: string | null;
                profilePicture: string | null;
            } | null;
            family: {
                familyName: string | null;
                profilePicture: string | null;
            } | null;
        } | null;
        messages: ({
            sender: {
                id: string;
                email: string;
                role: import(".prisma/client").$Enums.UserRole;
                caregiver: {
                    profilePicture: string | null;
                    firstName: string | null;
                    lastName: string | null;
                } | null;
                family: {
                    profilePicture: string | null;
                    familyName: string | null;
                } | null;
            };
            recipient: {
                id: string;
                email: string;
                role: import(".prisma/client").$Enums.UserRole;
                caregiver: {
                    profilePicture: string | null;
                    firstName: string | null;
                    lastName: string | null;
                } | null;
                family: {
                    profilePicture: string | null;
                    familyName: string | null;
                } | null;
            };
        } & {
            id: string;
            createdAt: Date;
            senderId: string;
            recipientId: string;
            content: string;
            isRead: boolean;
            readAt: Date | null;
            conversationId: string;
        })[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        participants: string[];
        lastMessage: string | null;
        lastMessageTime: Date | null;
    }[]>;
    getUnreadCount(userId: string): Promise<{
        unreadCount: number;
    }>;
    markAsRead(userId: string, messageId: string): Promise<{
        success: boolean;
        message: {
            id: string;
            createdAt: Date;
            senderId: string;
            recipientId: string;
            content: string;
            isRead: boolean;
            readAt: Date | null;
            conversationId: string;
        };
    }>;
    markConversationAsRead(userId: string, conversationId: string): Promise<{
        success: boolean;
        markedAsRead: number;
    }>;
}

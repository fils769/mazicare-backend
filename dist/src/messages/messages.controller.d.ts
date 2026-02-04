import { MessagesService } from './messages.service';
import { SendMessageDto } from './dto/message.dto';
import { MessagesGateway } from './messages.gateway';
export declare class MessagesController {
    private readonly messagesService;
    private readonly messagesGateway;
    constructor(messagesService: MessagesService, messagesGateway: MessagesGateway);
    getMessages(req: any, conversationId?: string): Promise<({
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
    sendMessage(req: any, messageData: SendMessageDto): Promise<{
        id: string;
        conversationId: string;
        senderId: string;
        recipientId: string;
        content: string;
        createdAt: Date | string;
        updatedAt?: Date | string;
    }>;
    getConversations(req: any): Promise<{
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
    getUnreadCount(req: any): Promise<{
        unreadCount: number;
    }>;
    markAsRead(req: any, messageId: string): Promise<{
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
    markConversationAsRead(req: any, conversationId: string): Promise<{
        success: boolean;
        markedAsRead: number;
    }>;
}

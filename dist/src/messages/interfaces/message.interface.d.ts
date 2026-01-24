export interface SendMessageResult {
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
}

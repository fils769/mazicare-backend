import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SendMessageDto } from './dto/message.dto';
import { SendMessageResult } from './interfaces/message.interface';

@Injectable()
export class MessagesService {
    constructor(private readonly prisma: PrismaService) { }

    async sendMessage(
        senderId: string,
        messageData: SendMessageDto,
    ): Promise<SendMessageResult> {
        const { recipientId, content, conversationId } = messageData;

        // Validate that sender and recipient exist
        const [sender, recipient] = await Promise.all([
            this.prisma.user.findUnique({ where: { id: senderId } }),
            this.prisma.user.findUnique({ where: { id: recipientId } }),
        ]);

        if (!sender) {
            throw new NotFoundException('Sender not found');
        }

        if (!recipient) {
            throw new NotFoundException('Recipient not found');
        }

        if (senderId === recipientId) {
            throw new BadRequestException('Cannot send message to yourself');
        }

        let conversation;

        // If conversationId is provided, use it; otherwise, find or create a conversation
        if (conversationId) {
            conversation = await this.prisma.conversation.findUnique({
                where: { id: conversationId },
            });

            if (!conversation) {
                throw new NotFoundException('Conversation not found');
            }

            // Verify that both users are participants
            if (
                !conversation.participants.includes(senderId) ||
                !conversation.participants.includes(recipientId)
            ) {
                throw new BadRequestException('Invalid conversation participants');
            }
        } else {
            // Find existing conversation between these two users
            const participants = [senderId, recipientId].sort();

            conversation = await this.prisma.conversation.findFirst({
                where: {
                    AND: [
                        { participants: { has: senderId } },
                        { participants: { has: recipientId } },
                    ],
                },
            });

            // Create new conversation if none exists
            if (!conversation) {
                conversation = await this.prisma.conversation.create({
                    data: {
                        participants,
                    },
                });
            }
        }

        // Create the message and update the conversation
        const [message, updatedConversation] = await Promise.all([
            this.prisma.message.create({
                data: {
                    conversationId: conversation.id,
                    senderId,
                    recipientId,
                    content,
                },
            }),
            this.prisma.conversation.update({
                where: { id: conversation.id },
                data: {
                    lastMessage: content,
                    lastMessageTime: new Date(),
                },
            }),
        ]);

        return {
            message,
            conversation: updatedConversation,
        };
    }

    async getMessages(userId: string, conversationId?: string) {
        if (conversationId) {
            // Get messages for a specific conversation
            const conversation = await this.prisma.conversation.findUnique({
                where: { id: conversationId },
                include: {
                    messages: {
                        orderBy: { createdAt: 'asc' },
                        include: {
                            sender: {
                                select: {
                                    id: true,
                                    email: true,
                                    role: true,
                                    caregiver: {
                                        select: {
                                            firstName: true,
                                            lastName: true,
                                            profilePicture: true,
                                        },
                                    },
                                    family: {
                                        select: {
                                            familyName: true,
                                            profilePicture: true,
                                        },
                                    },
                                },
                            },
                            recipient: {
                                select: {
                                    id: true,
                                    email: true,
                                    role: true,
                                    caregiver: {
                                        select: {
                                            firstName: true,
                                            lastName: true,
                                            profilePicture: true,
                                        },
                                    },
                                    family: {
                                        select: {
                                            familyName: true,
                                            profilePicture: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });

            if (!conversation) {
                throw new NotFoundException('Conversation not found');
            }

            // Verify user is a participant
            if (!conversation.participants.includes(userId)) {
                throw new BadRequestException('You are not a participant in this conversation');
            }

            return conversation.messages;
        }

        // Get all messages for the user
        const messages = await this.prisma.message.findMany({
            where: {
                OR: [{ senderId: userId }, { recipientId: userId }],
            },
            orderBy: { createdAt: 'desc' },
            include: {
                sender: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                        caregiver: {
                            select: {
                                firstName: true,
                                lastName: true,
                                profilePicture: true,
                            },
                        },
                        family: {
                            select: {
                                familyName: true,
                                profilePicture: true,
                            },
                        },
                    },
                },
                recipient: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                        caregiver: {
                            select: {
                                firstName: true,
                                lastName: true,
                                profilePicture: true,
                            },
                        },
                        family: {
                            select: {
                                familyName: true,
                                profilePicture: true,
                            },
                        },
                    },
                },
                conversation: true,
            },
        });

        return messages;
    }

    async getConversations(userId: string) {
        const conversations = await this.prisma.conversation.findMany({
            where: {
                participants: {
                    has: userId,
                },
            },
            orderBy: {
                lastMessageTime: 'desc',
            },
            include: {
                messages: {
                    take: 1,
                    orderBy: { createdAt: 'desc' },
                    include: {
                        sender: {
                            select: {
                                id: true,
                                email: true,
                                role: true,
                                caregiver: {
                                    select: {
                                        firstName: true,
                                        lastName: true,
                                        profilePicture: true,
                                    },
                                },
                                family: {
                                    select: {
                                        familyName: true,
                                        profilePicture: true,
                                    },
                                },
                            },
                        },
                        recipient: {
                            select: {
                                id: true,
                                email: true,
                                role: true,
                                caregiver: {
                                    select: {
                                        firstName: true,
                                        lastName: true,
                                        profilePicture: true,
                                    },
                                },
                                family: {
                                    select: {
                                        familyName: true,
                                        profilePicture: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        // Enrich conversations with participant details
        const enrichedConversations = await Promise.all(
            conversations.map(async (conversation) => {
                const otherParticipantId = conversation.participants.find(
                    (id) => id !== userId,
                );

                let otherParticipant: {
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
                } | null = null;

                if (otherParticipantId) {
                    otherParticipant = await this.prisma.user.findUnique({
                        where: { id: otherParticipantId },
                        select: {
                            id: true,
                            email: true,
                            role: true,
                            caregiver: {
                                select: {
                                    firstName: true,
                                    lastName: true,
                                    profilePicture: true,
                                },
                            },
                            family: {
                                select: {
                                    familyName: true,
                                    profilePicture: true,
                                },
                            },
                        },
                    });
                }

                return {
                    ...conversation,
                    otherParticipant,
                };
            }),
        );

        return enrichedConversations;
    }

    async getUnreadCount(userId: string) {
        const count = await this.prisma.message.count({
            where: {
                recipientId: userId,
                isRead: false,
            },
        });

        return { unreadCount: count };
    }

    async markAsRead(userId: string, messageId: string) {
        const message = await this.prisma.message.findUnique({
            where: { id: messageId },
        });

        if (!message) {
            throw new NotFoundException('Message not found');
        }

        if (message.recipientId !== userId) {
            throw new BadRequestException('You can only mark your own messages as read');
        }

        const updatedMessage = await this.prisma.message.update({
            where: { id: messageId },
            data: {
                isRead: true,
                readAt: new Date(),
            },
        });

        return {
            success: true,
            message: updatedMessage,
        };
    }

    async markConversationAsRead(userId: string, conversationId: string) {
        const conversation = await this.prisma.conversation.findUnique({
            where: { id: conversationId },
        });

        if (!conversation) {
            throw new NotFoundException('Conversation not found');
        }

        if (!conversation.participants.includes(userId)) {
            throw new BadRequestException('You are not a participant in this conversation');
        }

        const result = await this.prisma.message.updateMany({
            where: {
                conversationId,
                recipientId: userId,
                isRead: false,
            },
            data: {
                isRead: true,
                readAt: new Date(),
            },
        });

        return {
            success: true,
            markedAsRead: result.count,
        };
    }
}

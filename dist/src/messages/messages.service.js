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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let MessagesService = class MessagesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async sendMessage(senderId, messageData) {
        const { recipientId, content, conversationId } = messageData;
        const [sender, recipient] = await Promise.all([
            this.prisma.user.findUnique({ where: { id: senderId } }),
            this.prisma.user.findUnique({ where: { id: recipientId } }),
        ]);
        if (!sender) {
            throw new common_1.NotFoundException('Sender not found');
        }
        if (!recipient) {
            throw new common_1.NotFoundException('Recipient not found');
        }
        if (senderId === recipientId) {
            throw new common_1.BadRequestException('Cannot send message to yourself');
        }
        let conversation;
        if (conversationId) {
            conversation = await this.prisma.conversation.findUnique({
                where: { id: conversationId },
            });
            if (!conversation) {
                throw new common_1.NotFoundException('Conversation not found');
            }
            if (!conversation.participants.includes(senderId) ||
                !conversation.participants.includes(recipientId)) {
                throw new common_1.BadRequestException('Invalid conversation participants');
            }
        }
        else {
            const participants = [senderId, recipientId].sort();
            conversation = await this.prisma.conversation.findFirst({
                where: {
                    AND: [
                        { participants: { has: senderId } },
                        { participants: { has: recipientId } },
                    ],
                },
            });
            if (!conversation) {
                conversation = await this.prisma.conversation.create({
                    data: {
                        participants,
                    },
                });
            }
        }
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
    async getMessages(userId, conversationId) {
        if (conversationId) {
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
                throw new common_1.NotFoundException('Conversation not found');
            }
            if (!conversation.participants.includes(userId)) {
                throw new common_1.BadRequestException('You are not a participant in this conversation');
            }
            return conversation.messages;
        }
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
    async getConversations(userId) {
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
        const enrichedConversations = await Promise.all(conversations.map(async (conversation) => {
            const otherParticipantId = conversation.participants.find((id) => id !== userId);
            let otherParticipant = null;
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
        }));
        return enrichedConversations;
    }
    async getUnreadCount(userId) {
        const count = await this.prisma.message.count({
            where: {
                recipientId: userId,
                isRead: false,
            },
        });
        return { unreadCount: count };
    }
    async markAsRead(userId, messageId) {
        const message = await this.prisma.message.findUnique({
            where: { id: messageId },
        });
        if (!message) {
            throw new common_1.NotFoundException('Message not found');
        }
        if (message.recipientId !== userId) {
            throw new common_1.BadRequestException('You can only mark your own messages as read');
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
    async markConversationAsRead(userId, conversationId) {
        const conversation = await this.prisma.conversation.findUnique({
            where: { id: conversationId },
        });
        if (!conversation) {
            throw new common_1.NotFoundException('Conversation not found');
        }
        if (!conversation.participants.includes(userId)) {
            throw new common_1.BadRequestException('You are not a participant in this conversation');
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
};
exports.MessagesService = MessagesService;
exports.MessagesService = MessagesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MessagesService);
//# sourceMappingURL=messages.service.js.map
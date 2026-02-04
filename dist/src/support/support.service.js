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
exports.SupportService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const support_ticket_dto_1 = require("./dto/support-ticket.dto");
let SupportService = class SupportService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createTicket(userId, dto) {
        const ticket = await this.prisma.supportTicket.create({
            data: {
                userId,
                subject: dto.subject,
                description: dto.description,
                category: dto.category,
                priority: dto.priority || 'MEDIUM',
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                        caregiver: {
                            select: {
                                firstName: true,
                                lastName: true,
                            },
                        },
                        family: {
                            select: {
                                familyName: true,
                            },
                        },
                    },
                },
            },
        });
        return ticket;
    }
    async getUserTickets(userId) {
        const tickets = await this.prisma.supportTicket.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        email: true,
                        role: true,
                    },
                },
            },
        });
        return tickets;
    }
    async getTicketById(ticketId, userId) {
        const ticket = await this.prisma.supportTicket.findUnique({
            where: { id: ticketId },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                        caregiver: {
                            select: {
                                firstName: true,
                                lastName: true,
                            },
                        },
                        family: {
                            select: {
                                familyName: true,
                            },
                        },
                    },
                },
            },
        });
        if (!ticket) {
            throw new common_1.NotFoundException('Support ticket not found');
        }
        if (userId && ticket.userId !== userId) {
            throw new common_1.ForbiddenException('You can only view your own tickets');
        }
        return ticket;
    }
    async getAllTickets(status) {
        const where = status ? { status } : {};
        const tickets = await this.prisma.supportTicket.findMany({
            where,
            orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                        caregiver: {
                            select: {
                                firstName: true,
                                lastName: true,
                            },
                        },
                        family: {
                            select: {
                                familyName: true,
                            },
                        },
                    },
                },
            },
        });
        return tickets;
    }
    async updateTicketStatus(ticketId, dto) {
        const ticket = await this.prisma.supportTicket.findUnique({
            where: { id: ticketId },
        });
        if (!ticket) {
            throw new common_1.NotFoundException('Support ticket not found');
        }
        const updateData = {
            status: dto.status,
            updatedAt: new Date(),
        };
        if (dto.adminNotes) {
            updateData.adminNotes = dto.adminNotes;
        }
        if (dto.status === support_ticket_dto_1.TicketStatus.RESOLVED || dto.status === support_ticket_dto_1.TicketStatus.CLOSED) {
            updateData.resolvedAt = new Date();
        }
        const updatedTicket = await this.prisma.supportTicket.update({
            where: { id: ticketId },
            data: updateData,
            include: {
                user: {
                    select: {
                        email: true,
                        role: true,
                    },
                },
            },
        });
        return updatedTicket;
    }
    async updateTicket(ticketId, dto) {
        const ticket = await this.prisma.supportTicket.findUnique({
            where: { id: ticketId },
        });
        if (!ticket) {
            throw new common_1.NotFoundException('Support ticket not found');
        }
        const updatedTicket = await this.prisma.supportTicket.update({
            where: { id: ticketId },
            data: {
                ...dto,
                updatedAt: new Date(),
            },
            include: {
                user: {
                    select: {
                        email: true,
                        role: true,
                    },
                },
            },
        });
        return updatedTicket;
    }
    async deleteTicket(ticketId) {
        const ticket = await this.prisma.supportTicket.findUnique({
            where: { id: ticketId },
        });
        if (!ticket) {
            throw new common_1.NotFoundException('Support ticket not found');
        }
        await this.prisma.supportTicket.delete({
            where: { id: ticketId },
        });
        return { success: true, message: 'Ticket deleted successfully' };
    }
    async getTicketStats() {
        const [total, pending, inProgress, resolved, closed] = await Promise.all([
            this.prisma.supportTicket.count(),
            this.prisma.supportTicket.count({ where: { status: 'PENDING' } }),
            this.prisma.supportTicket.count({ where: { status: 'IN_PROGRESS' } }),
            this.prisma.supportTicket.count({ where: { status: 'RESOLVED' } }),
            this.prisma.supportTicket.count({ where: { status: 'CLOSED' } }),
        ]);
        return {
            total,
            pending,
            inProgress,
            resolved,
            closed,
        };
    }
};
exports.SupportService = SupportService;
exports.SupportService = SupportService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SupportService);
//# sourceMappingURL=support.service.js.map
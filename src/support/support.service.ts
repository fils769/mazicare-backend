import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
    CreateSupportTicketDto,
    UpdateTicketStatusDto,
    UpdateTicketDto,
    TicketStatus,
} from './dto/support-ticket.dto';

@Injectable()
export class SupportService {
    constructor(private prisma: PrismaService) { }

    async createTicket(userId: string, dto: CreateSupportTicketDto) {
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

    async getUserTickets(userId: string) {
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

    async getTicketById(ticketId: string, userId?: string) {
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
            throw new NotFoundException('Support ticket not found');
        }

        // If userId is provided (non-admin), verify ownership
        if (userId && ticket.userId !== userId) {
            throw new ForbiddenException('You can only view your own tickets');
        }

        return ticket;
    }

    async getAllTickets(status?: TicketStatus) {
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

    async updateTicketStatus(ticketId: string, dto: UpdateTicketStatusDto) {
        const ticket = await this.prisma.supportTicket.findUnique({
            where: { id: ticketId },
        });

        if (!ticket) {
            throw new NotFoundException('Support ticket not found');
        }

        const updateData: any = {
            status: dto.status,
            updatedAt: new Date(),
        };

        if (dto.adminNotes) {
            updateData.adminNotes = dto.adminNotes;
        }

        if (dto.status === TicketStatus.RESOLVED || dto.status === TicketStatus.CLOSED) {
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

    async updateTicket(ticketId: string, dto: UpdateTicketDto) {
        const ticket = await this.prisma.supportTicket.findUnique({
            where: { id: ticketId },
        });

        if (!ticket) {
            throw new NotFoundException('Support ticket not found');
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

    async deleteTicket(ticketId: string) {
        const ticket = await this.prisma.supportTicket.findUnique({
            where: { id: ticketId },
        });

        if (!ticket) {
            throw new NotFoundException('Support ticket not found');
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
}

import { PrismaService } from '../prisma/prisma.service';
import { CreateSupportTicketDto, UpdateTicketStatusDto, UpdateTicketDto, TicketStatus } from './dto/support-ticket.dto';
export declare class SupportService {
    private prisma;
    constructor(prisma: PrismaService);
    createTicket(userId: string, dto: CreateSupportTicketDto): Promise<{
        user: {
            id: string;
            email: string;
            role: import(".prisma/client").$Enums.UserRole;
            caregiver: {
                firstName: string | null;
                lastName: string | null;
            } | null;
            family: {
                familyName: string | null;
            } | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.TicketStatus;
        userId: string;
        description: string;
        category: string | null;
        subject: string;
        priority: import(".prisma/client").$Enums.TicketPriority;
        adminNotes: string | null;
        resolvedAt: Date | null;
    }>;
    getUserTickets(userId: string): Promise<({
        user: {
            email: string;
            role: import(".prisma/client").$Enums.UserRole;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.TicketStatus;
        userId: string;
        description: string;
        category: string | null;
        subject: string;
        priority: import(".prisma/client").$Enums.TicketPriority;
        adminNotes: string | null;
        resolvedAt: Date | null;
    })[]>;
    getTicketById(ticketId: string, userId?: string): Promise<{
        user: {
            id: string;
            email: string;
            role: import(".prisma/client").$Enums.UserRole;
            caregiver: {
                firstName: string | null;
                lastName: string | null;
            } | null;
            family: {
                familyName: string | null;
            } | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.TicketStatus;
        userId: string;
        description: string;
        category: string | null;
        subject: string;
        priority: import(".prisma/client").$Enums.TicketPriority;
        adminNotes: string | null;
        resolvedAt: Date | null;
    }>;
    getAllTickets(status?: TicketStatus): Promise<({
        user: {
            id: string;
            email: string;
            role: import(".prisma/client").$Enums.UserRole;
            caregiver: {
                firstName: string | null;
                lastName: string | null;
            } | null;
            family: {
                familyName: string | null;
            } | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.TicketStatus;
        userId: string;
        description: string;
        category: string | null;
        subject: string;
        priority: import(".prisma/client").$Enums.TicketPriority;
        adminNotes: string | null;
        resolvedAt: Date | null;
    })[]>;
    updateTicketStatus(ticketId: string, dto: UpdateTicketStatusDto): Promise<{
        user: {
            email: string;
            role: import(".prisma/client").$Enums.UserRole;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.TicketStatus;
        userId: string;
        description: string;
        category: string | null;
        subject: string;
        priority: import(".prisma/client").$Enums.TicketPriority;
        adminNotes: string | null;
        resolvedAt: Date | null;
    }>;
    updateTicket(ticketId: string, dto: UpdateTicketDto): Promise<{
        user: {
            email: string;
            role: import(".prisma/client").$Enums.UserRole;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.TicketStatus;
        userId: string;
        description: string;
        category: string | null;
        subject: string;
        priority: import(".prisma/client").$Enums.TicketPriority;
        adminNotes: string | null;
        resolvedAt: Date | null;
    }>;
    deleteTicket(ticketId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getTicketStats(): Promise<{
        total: number;
        pending: number;
        inProgress: number;
        resolved: number;
        closed: number;
    }>;
}

import { SupportService } from './support.service';
import { CreateSupportTicketDto, UpdateTicketStatusDto, UpdateTicketDto, TicketStatus } from './dto/support-ticket.dto';
export declare class SupportController {
    private readonly supportService;
    constructor(supportService: SupportService);
    createTicket(req: any, dto: CreateSupportTicketDto): Promise<{
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
    getUserTickets(req: any): Promise<({
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
    getTicketById(req: any, id: string): Promise<{
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
}
export declare class AdminSupportController {
    private readonly supportService;
    constructor(supportService: SupportService);
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
    getTicketStats(): Promise<{
        total: number;
        pending: number;
        inProgress: number;
        resolved: number;
        closed: number;
    }>;
    getTicketById(id: string): Promise<{
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
    updateTicketStatus(id: string, dto: UpdateTicketStatusDto): Promise<{
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
    updateTicket(id: string, dto: UpdateTicketDto): Promise<{
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
    deleteTicket(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}

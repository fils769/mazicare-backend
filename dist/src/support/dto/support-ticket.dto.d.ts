export declare enum TicketPriority {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    URGENT = "URGENT"
}
export declare enum TicketStatus {
    PENDING = "PENDING",
    IN_PROGRESS = "IN_PROGRESS",
    RESOLVED = "RESOLVED",
    CLOSED = "CLOSED"
}
export declare class CreateSupportTicketDto {
    subject: string;
    description: string;
    category?: string;
    priority?: TicketPriority;
}
export declare class UpdateTicketStatusDto {
    status: TicketStatus;
    adminNotes?: string;
}
export declare class UpdateTicketDto {
    subject?: string;
    description?: string;
    category?: string;
    priority?: TicketPriority;
    adminNotes?: string;
}

import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum TicketPriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    URGENT = 'URGENT',
}

export enum TicketStatus {
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN_PROGRESS',
    RESOLVED = 'RESOLVED',
    CLOSED = 'CLOSED',
}

export class CreateSupportTicketDto {
    @ApiProperty({
        description: 'Subject/title of the support ticket',
        example: 'Unable to access caregiver profile',
    })
    @IsString()
    @IsNotEmpty()
    subject: string;

    @ApiProperty({
        description: 'Detailed description of the issue',
        example: 'I am unable to view the caregiver profile page. It shows an error message.',
    })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiPropertyOptional({
        description: 'Category of the ticket',
        example: 'Technical',
        enum: ['Technical', 'Billing', 'General', 'Account', 'Feature Request'],
    })
    @IsString()
    @IsOptional()
    category?: string;

    @ApiPropertyOptional({
        description: 'Priority level',
        enum: TicketPriority,
        default: TicketPriority.MEDIUM,
    })
    @IsEnum(TicketPriority)
    @IsOptional()
    priority?: TicketPriority;
}

export class UpdateTicketStatusDto {
    @ApiProperty({
        description: 'New status for the ticket',
        enum: TicketStatus,
    })
    @IsEnum(TicketStatus)
    @IsNotEmpty()
    status: TicketStatus;

    @ApiPropertyOptional({
        description: 'Admin notes/comments about the resolution',
        example: 'Issue resolved. Profile access restored.',
    })
    @IsString()
    @IsOptional()
    adminNotes?: string;
}

export class UpdateTicketDto {
    @ApiPropertyOptional({
        description: 'Updated subject',
    })
    @IsString()
    @IsOptional()
    subject?: string;

    @ApiPropertyOptional({
        description: 'Updated description',
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiPropertyOptional({
        description: 'Updated category',
    })
    @IsString()
    @IsOptional()
    category?: string;

    @ApiPropertyOptional({
        description: 'Updated priority',
        enum: TicketPriority,
    })
    @IsEnum(TicketPriority)
    @IsOptional()
    priority?: TicketPriority;

    @ApiPropertyOptional({
        description: 'Admin notes',
    })
    @IsString()
    @IsOptional()
    adminNotes?: string;
}

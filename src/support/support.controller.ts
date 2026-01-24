import {
    Controller,
    Post,
    Get,
    Patch,
    Put,
    Delete,
    Body,
    Param,
    Query,
    Request,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiTags,
    ApiParam,
    ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { SupportService } from './support.service';
import {
    CreateSupportTicketDto,
    UpdateTicketStatusDto,
    UpdateTicketDto,
    TicketStatus,
} from './dto/support-ticket.dto';

@ApiTags('Support')
@Controller('support')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('bearer')
export class SupportController {
    constructor(private readonly supportService: SupportService) { }

    @Post()
    @ApiOperation({
        summary: 'Create a support ticket',
        description: 'Create a new support ticket for the authenticated user',
    })
    async createTicket(@Request() req, @Body() dto: CreateSupportTicketDto) {
        return this.supportService.createTicket(req.user.userId, dto);
    }

    @Get()
    @ApiOperation({
        summary: 'Get user tickets',
        description: 'Get all support tickets for the authenticated user',
    })
    async getUserTickets(@Request() req) {
        return this.supportService.getUserTickets(req.user.userId);
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Get ticket by ID',
        description: 'Get a specific support ticket by ID (only own tickets)',
    })
    @ApiParam({ name: 'id', description: 'Ticket ID' })
    async getTicketById(@Request() req, @Param('id') id: string) {
        return this.supportService.getTicketById(id, req.user.userId);
    }
}

@ApiTags('Admin - Support')
@Controller('admin/support')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth('bearer')
export class AdminSupportController {
    constructor(private readonly supportService: SupportService) { }

    @Get()
    @ApiOperation({
        summary: 'Get all support tickets',
        description: 'Get all support tickets with optional status filter',
    })
    @ApiQuery({
        name: 'status',
        required: false,
        enum: TicketStatus,
        description: 'Filter by ticket status',
    })
    async getAllTickets(@Query('status') status?: TicketStatus) {
        return this.supportService.getAllTickets(status);
    }

    @Get('stats')
    @ApiOperation({
        summary: 'Get support tickets statistics',
        description: 'Get statistics about support tickets',
    })
    async getTicketStats() {
        return this.supportService.getTicketStats();
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Get ticket by ID (Admin)',
        description: 'Get any support ticket by ID',
    })
    @ApiParam({ name: 'id', description: 'Ticket ID' })
    async getTicketById(@Param('id') id: string) {
        return this.supportService.getTicketById(id);
    }

    @Patch(':id/status')
    @ApiOperation({
        summary: 'Update ticket status',
        description: 'Update the status of a support ticket',
    })
    @ApiParam({ name: 'id', description: 'Ticket ID' })
    async updateTicketStatus(
        @Param('id') id: string,
        @Body() dto: UpdateTicketStatusDto,
    ) {
        return this.supportService.updateTicketStatus(id, dto);
    }

    @Put(':id')
    @ApiOperation({
        summary: 'Update ticket details',
        description: 'Update ticket details (subject, description, category, etc.)',
    })
    @ApiParam({ name: 'id', description: 'Ticket ID' })
    async updateTicket(@Param('id') id: string, @Body() dto: UpdateTicketDto) {
        return this.supportService.updateTicket(id, dto);
    }

    @Delete(':id')
    @ApiOperation({
        summary: 'Delete a support ticket',
        description: 'Permanently delete a support ticket',
    })
    @ApiParam({ name: 'id', description: 'Ticket ID' })
    async deleteTicket(@Param('id') id: string) {
        return this.supportService.deleteTicket(id);
    }
}

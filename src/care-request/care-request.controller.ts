// src/care-request/care-request.controller.ts
import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Patch,
  Delete,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CareRequestService } from './care-request.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { CreateCareRequestDto } from './dto/create-care-request.dto';
import { UpdateCareRequestDto } from './dto/update-care-request.dto';
import { RemoveCaregiverRelationDto } from './dto/remove-caregiver-relation.dto';

@ApiTags('care-requests')
@ApiBearerAuth()
@Controller('care-requests')
@UseGuards(JwtAuthGuard)
export class CareRequestController {
  constructor(private readonly careRequestService: CareRequestService) {}

  // Create a new care request
  @Post()
  @ApiOperation({ summary: 'Create a new care request' })
  @ApiResponse({ status: 201, description: 'Care request created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 404, description: 'Elder or Caregiver not found' })
  async create(
    @Request() req,
    @Body() createCareRequestDto: CreateCareRequestDto,
  ) {
    return this.careRequestService.createCareRequest(
      req.user.userId,
      createCareRequestDto,
    );
  }

  // Get all care requests for the logged-in user
  @Get()
  @ApiOperation({ summary: 'Get all care requests for the current user' })
  @ApiResponse({ status: 200, description: 'Care requests fetched successfully' })
  async findAll(@Request() req) {
    return this.careRequestService.findAllForUser(req.user.userId);
  }

  // Get a single care request by ID
  @Get(':id')
  @ApiOperation({ summary: 'Get a care request by ID' })
  @ApiParam({ name: 'id', description: 'Care request ID' })
  @ApiResponse({ status: 200, description: 'Care request fetched successfully' })
  @ApiResponse({ status: 404, description: 'Care request not found' })
  async findOne(@Param('id') id: string, @Request() req) {
    return this.careRequestService.findOne(req.user.userId, id);
  }

  // Update care request (e.g., status)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a care request' })
  @ApiParam({ name: 'id', description: 'Care request ID' })
  @ApiBody({ type: UpdateCareRequestDto })
  @ApiResponse({ status: 200, description: 'Care request updated successfully' })
  @ApiResponse({ status: 404, description: 'Care request not found' })
  async update(
    @Param('id') id: string,
    @Request() req,
    @Body() updateCareRequestDto: UpdateCareRequestDto,
  ) {
    return this.careRequestService.update(req.user.userId, id, updateCareRequestDto);
  }

  // Delete a care request
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a care request' })
  @ApiParam({ name: 'id', description: 'Care request ID' })
  @ApiResponse({ status: 200, description: 'Care request deleted successfully' })
  @ApiResponse({ status: 404, description: 'Care request not found' })
  async remove(@Param('id') id: string, @Request() req) {
    return this.careRequestService.remove(req.user.userId, id);
  }

  // Accept a care request
  @Post(':id/accept')
  @ApiOperation({ summary: 'Accept a care request' })
  @ApiParam({ name: 'id', description: 'Care request ID' })
  @ApiResponse({ status: 200, description: 'Care request accepted successfully' })
  @ApiResponse({ status: 404, description: 'Care request not found' })
  @ApiResponse({ status: 403, description: 'Not authorized to accept this request' })
  async accept(@Param('id') id: string, @Request() req) {
    return this.careRequestService.acceptCareRequest(req.user.userId, id);
  }

  // Reject a care request
  @Post(':id/reject')
  @ApiOperation({ summary: 'Reject a care request' })
  @ApiParam({ name: 'id', description: 'Care request ID' })
  @ApiResponse({ status: 200, description: 'Care request rejected successfully' })
  @ApiResponse({ status: 404, description: 'Care request not found' })
  @ApiResponse({ status: 403, description: 'Not authorized to reject this request' })
  async reject(@Param('id') id: string, @Request() req) {
    return this.careRequestService.rejectCareRequest(req.user.userId, id);
  }

  @Delete('caregiver/:caregiverId/remove')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove caregiver from family (end care relationship)' })
  @ApiResponse({ status: 200, description: 'Relationship ended successfully' })
  @ApiResponse({ status: 404, description: 'Caregiver or family not found' })
  @ApiResponse({ status: 400, description: 'No active relationship found' })
  @HttpCode(HttpStatus.OK)
  async removeCaregiverFromFamily(
    @Param('caregiverId') caregiverId: string,
    @Body() removeDto: RemoveCaregiverRelationDto,
    @Request() req
  ) {
    const actorId = req.user.id;
    
    return this.careRequestService.removeCaregiverFromFamily(
      caregiverId,
      removeDto.familyId,
      removeDto.reason,
      actorId
    );
  }

  // Cancel a care request
@Delete(':id/cancel')
@ApiOperation({ summary: 'Cancel a care request' })
@ApiParam({ name: 'id', description: 'Care request ID' })
@ApiResponse({ status: 200, description: 'Care request cancelled successfully' })
@ApiResponse({ status: 404, description: 'Care request not found' })
@ApiResponse({ status: 403, description: 'Not authorized to cancel this request' })
@ApiResponse({ status: 400, description: 'Cannot cancel request in current status' })
async cancel(@Param('id') id: string, @Request() req) {
  return this.careRequestService.cancelCareRequest(req.user.userId, id);
}
}

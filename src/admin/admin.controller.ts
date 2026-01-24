import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { AdminService } from './admin.service';
import { AdminActivityQueryDto } from './dto/admin-activity-query.dto';
import { AdminUpdateElderDto } from './dto/update-elder.dto';
import { UpdateCaregiverStatusDto } from './dto/update-caregiver-status.dto';
import { AdminProfileQueryDto } from './dto/admin-profile-query.dto';

@ApiTags('Admin')
@ApiBearerAuth('bearer')
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) { }

  @Get('activity')
  @ApiOperation({ summary: 'Fetch activity logs with optional filters' })
  async getActivityLogs(@Query() query: AdminActivityQueryDto) {
    return this.adminService.getActivityLogs(query);
  }

  @Get('families')
  @ApiOperation({ summary: 'Fetch family accounts with subscription progress' })
  async getFamilyAccounts() {
    return this.adminService.getFamilyAccounts();
  }

  @Get('caregivers')
  @ApiOperation({ summary: 'Fetch caregiver accounts with status information' })
  async getCaregivers() {
    return this.adminService.getCaregivers();
  }

  @Get('activity/feature')
  @ApiOperation({ summary: 'Fetch feature usage activity groups' })
  async getFeatureActivity() {
    return this.adminService.getFeatureActivity();
  }

  @Get('elders')
  @ApiOperation({ summary: 'Fetch all elders with relationship details' })
  async getElders() {
    return this.adminService.getElders();
  }

  @Put('elders/:elderId')
  @ApiOperation({ summary: 'Update elder details' })
  @ApiParam({ name: 'elderId', description: 'Elder identifier' })
  async updateElder(
    @Param('elderId') elderId: string,
    @Body() dto: AdminUpdateElderDto,
  ) {
    return this.adminService.updateElder(elderId, dto);
  }

  @Delete('elders/:elderId')
  @ApiOperation({ summary: 'Delete an elder record' })
  @ApiParam({ name: 'elderId', description: 'Elder identifier' })
  async deleteElder(@Param('elderId') elderId: string) {
    return this.adminService.deleteElder(elderId);
  }

  @Patch('caregivers/:caregiverId/status')
  @ApiOperation({ summary: 'Update caregiver account status' })
  @ApiParam({ name: 'caregiverId', description: 'Caregiver identifier' })
  async updateCaregiverStatus(
    @Param('caregiverId') caregiverId: string,
    @Body() dto: UpdateCaregiverStatusDto,
  ) {
    return this.adminService.updateCaregiverStatus(caregiverId, dto);
  }

  @Get('subscriptions/activity')
  @ApiOperation({ summary: 'Fetch recent subscription activity logs' })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Maximum number of records',
    type: Number,
  })
  async getSubscriptionActivity(@Query('limit') limit?: number) {
    const parsedLimit = limit ? Number(limit) : undefined;
    return this.adminService.getSubscriptionActivity(parsedLimit);
  }

  @Get('profile')
  @ApiOperation({
    summary: 'View profile details for family, elder, or caregiver',
  })
  async getProfile(@Query() query: AdminProfileQueryDto) {
    return this.adminService.getProfile(query);
  }

  @Get('stats/gender')
  @ApiOperation({ summary: 'Fetch counts grouped by gender' })
  async getGenderCounts() {
    return this.adminService.getGenderCounts();
  }

  @Get('reports')
  @ApiOperation({ summary: 'Fetch comprehensive admin reports and statistics' })
  async getReports() {
    return this.adminService.getReports();
  }

  @Get('stripe/balance')
  @ApiOperation({ summary: 'Fetch Stripe account balance and revenue' })
  async getStripeBalance() {
    return this.adminService.getStripeBalance();
  }
}

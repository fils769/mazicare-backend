import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ReportsService } from './reports.service';

@ApiTags('Reports')
@ApiBearerAuth('bearer')
@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private reportsService: ReportsService) { }

  @Get('family')
  @ApiOperation({
    summary: 'Generate comprehensive family report',
    description:
      'Returns detailed statistics for a family including elders, caregivers, schedule completion, subscription status, and recent requests.',
  })
  async generateFamilyReport(@Request() req) {
    return this.reportsService.generateFamilyReport(req.user.userId);
  }

  @Get('caregiver')
  @ApiOperation({
    summary: 'Generate comprehensive caregiver report',
    description:
      'Returns detailed statistics for a caregiver including assigned elders, families, schedule completion, ratings, and recent requests.',
  })
  async generateCaregiverReport(@Request() req) {
    return this.reportsService.generateCaregiverReport(req.user.userId);
  }
}
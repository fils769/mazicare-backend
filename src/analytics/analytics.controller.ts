import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { AnalyticsService } from './analytics.service';

@ApiTags('Analytics')
@Controller('admin/analytics')
@ApiBearerAuth('bearer')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminAnalyticsController {
    constructor(private readonly analyticsService: AnalyticsService) { }

    @Get('user-growth')
    @ApiOperation({
        summary: 'Get user growth analytics',
        description: 'Returns monthly caregiver and family registration trends',
    })
    @ApiQuery({
        name: 'period',
        required: false,
        enum: ['6months', '12months'],
        description: 'Time period for analytics',
    })
    async getUserGrowth(@Query('period') period?: string) {
        return this.analyticsService.getUserGrowth(period);
    }

    @Get('feature-usage')
    @ApiOperation({
        summary: 'Get feature usage analytics',
        description: 'Returns monthly usage statistics for platform features',
    })
    @ApiQuery({
        name: 'period',
        required: false,
        enum: ['6months', '12months'],
        description: 'Time period for analytics',
    })
    async getFeatureUsage(@Query('period') period?: string) {
        return this.analyticsService.getFeatureUsage(period);
    }

    @Get('gender-distribution')
    @ApiOperation({
        summary: 'Get gender distribution',
        description: 'Returns elder gender breakdown for pie chart',
    })
    async getGenderDistribution() {
        return this.analyticsService.getGenderDistribution();
    }

    @Get('recent-activity')
    @ApiOperation({
        summary: 'Get recent platform activity',
        description: 'Returns recent user activities across the platform',
    })
    @ApiQuery({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Maximum number of activities to return',
    })
    async getRecentActivity(@Query('limit') limit?: number) {
        const parsedLimit = limit ? Number(limit) : 10;
        return this.analyticsService.getRecentActivity(parsedLimit);
    }
}

@ApiTags('Family')
@Controller('family')
@ApiBearerAuth('bearer')
@UseGuards(JwtAuthGuard)
export class FamilyAnalyticsController {
    constructor(private readonly analyticsService: AnalyticsService) { }

    @Get('recent-activity')
    @ApiOperation({
        summary: 'Get family recent activity',
        description: 'Returns recent activities for the authenticated family user',
    })
    @ApiQuery({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Maximum number of activities to return',
    })
    async getRecentActivity(@Request() req, @Query('limit') limit?: number) {
        const parsedLimit = limit ? Number(limit) : 5;
        return this.analyticsService.getFamilyRecentActivity(
            req.user.userId,
            parsedLimit,
        );
    }
}

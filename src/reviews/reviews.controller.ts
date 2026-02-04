import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';

@ApiTags('Reviews')
@Controller('reviews')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('bearer')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @ApiOperation({
    summary: 'Submit a review for a caregiver',
    description:
      'Allows a user (typically a family member) to review a caregiver.',
  })
  async createReview(@Request() req, @Body() dto: CreateReviewDto) {
    return this.reviewsService.createReview(req.user.userId, dto);
  }

  @Get('caregiver/:caregiverId')
  @ApiOperation({
    summary: 'Get reviews for a caregiver',
    description: 'Publicly readable reviews for a specific caregiver',
  })
  @ApiParam({ name: 'caregiverId', description: 'ID of the caregiver' })
  async getCaregiverReviews(@Param('caregiverId') caregiverId: string) {
    return this.reviewsService.getCaregiverReviews(caregiverId);
  }

  @Get('caregiver/:caregiverId/stats')
  @ApiOperation({
    summary: 'Get rating stats for a caregiver',
    description: 'Get average rating, total count, and star distribution',
  })
  @ApiParam({ name: 'caregiverId', description: 'ID of the caregiver' })
  async getCaregiverStats(@Param('caregiverId') caregiverId: string) {
    return this.reviewsService.getCaregiverStats(caregiverId);
  }

  @Get('me')
  @ApiOperation({
    summary: 'Get my reviews',
    description: 'Get all reviews submitted by the authenticated user',
  })
  async getMyReviews(@Request() req) {
    return this.reviewsService.getMyReviews(req.user.userId);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a review',
    description: 'Delete a review. Only the author or an admin can do this.',
  })
  @ApiParam({ name: 'id', description: 'Review ID' })
  async deleteReview(@Request() req, @Param('id') id: string) {
    return this.reviewsService.deleteReview(id, req.user.userId, req.user.role);
  }

  @Get('worked-together/:familyId/:caregiverId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Check if a family has previously worked with a caregiver',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns true if they worked together, false otherwise',
    schema: {
      example: { workedTogether: true },
    },
  })
  async checkIfFamilyWorkedWithCaregiver(
    @Param('familyId') familyId: string,
    @Param('caregiverId') caregiverId: string,
  ) {
    const workedTogether =
      await this.reviewsService.checkIfFamilyWorkedWithCaregiver(
        familyId,
        caregiverId,
      );

    return { workedTogether };
  }
}

@ApiTags('Admin - Reviews')
@Controller('admin/reviews')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth('bearer')
export class AdminReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all reviews (Admin)',
    description: 'Get a list of all reviews in the system.',
  })
  async getAllReviews() {
    return this.reviewsService.getAllReviews();
  }
}

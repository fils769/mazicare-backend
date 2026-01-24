import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  UseGuards,
  Request,
  Query,
  Param,
  UseInterceptors,
  UploadedFile,
  BadRequestException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FamilyService } from './family.service';
import { FamilyOnboardingDto } from './dto/family.dto';
import { UploadThingService } from '../uploadthing/uploadthing.service';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Controller('family')
@UseGuards(JwtAuthGuard)
export class FamilyController {
  constructor(
    private familyService: FamilyService,
    private uploadThingService: UploadThingService
  ) {
    console.log('FamilyController initialized');
  }

  @Post('onboarding')
  @UseInterceptors(FileInterceptor('profilePicture'))
  async saveOnboardingData(
    @Request() req,
    @Body() rawData: any, // Accept as raw data first
    @UploadedFile() profilePicture?: Express.Multer.File
  ) {
    // Parse stringified values safely
    let careTypes = rawData.careTypes;
    
    // If careTypes is a string, try to parse it as JSON
    if (typeof careTypes === 'string') {
      try {
        careTypes = JSON.parse(careTypes);
      } catch (e) {
        // If it's not valid JSON, treat it as a single value or comma-separated
        careTypes = careTypes.includes(',') ? careTypes.split(',').map((s: string) => s.trim()) : [careTypes];
      }
    }
    
    // Ensure it's an array
    if (!Array.isArray(careTypes)) {
      careTypes = careTypes ? [careTypes] : [];
    }

    const parsedData = {
      ...rawData,
      careTypes,
      backgroundCheck: rawData.backgroundCheck === 'true' || rawData.backgroundCheck === true
    };

    // Validate the parsed data
    const data = await this.validateDto(FamilyOnboardingDto, parsedData);

    let profilePictureUrl: string | undefined;
    if (profilePicture) {
      const uploadResult = await this.uploadThingService.uploadFile(profilePicture);
      profilePictureUrl = uploadResult.url;
    }

    return this.familyService.saveOnboardingData(req.user.userId, data, profilePictureUrl);
  }

  private async validateDto(dtoClass: any, data: any): Promise<any> {
    const dtoInstance = plainToInstance(dtoClass, data);
    const errors = await validate(dtoInstance);

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    return dtoInstance;
  }

  @Get('caregivers')
  async getCaregivers(@Query() filters: any) {
    return this.familyService.getCaregivers(filters);
  }

  @Get('regions')
  async getRegions() {
    return this.familyService.getRegions();
  }

  @Get('languages')
  async getLanguages() {
    return this.familyService.getLanguages();
  }

  @Post('complete-onboarding')
  async completeOnboarding(@Request() req) {
    return this.familyService.completeOnboarding(req.user.userId);
  }

  @Get('profile-status')
  async getProfileStatus(@Request() req) {
    return this.familyService.getProfileStatus(req.user.userId);
  }

  @Get('onboarding-data')
  async getOnboardingData(@Request() req) {
    return this.familyService.getOnboardingData(req.user.userId);
  }

  // Elder Management
  @Get('elders')
  async getElders(@Request() req) {
    console.log('GET ELDERS METHOD CALLED');
    return this.familyService.getElders(req.user.userId);
  }

  @Post('elders')
  @UseInterceptors(FileInterceptor('profilePicture'))
  async registerElder(
    @Request() req,
    @Body() elderData: any,
    @UploadedFile() profilePicture?: Express.Multer.File
  ) {

    if (profilePicture) {
      console.log('File details:', {
        originalname: profilePicture.originalname,
        mimetype: profilePicture.mimetype,
        size: profilePicture.size
      });
    }

    let profilePictureUrl: string | undefined;
    if (profilePicture) {
      console.log('Uploading profile picture...');
      try {
        const uploadResult = await this.uploadThingService.uploadFile(profilePicture);
        profilePictureUrl = uploadResult.url;
        console.log('Upload successful, URL:', profilePictureUrl);
      } catch (error) {
        console.error('Upload failed:', error);
        throw new BadRequestException('Failed to upload profile picture');
      }
    } else {
      console.log('No profile picture to upload');
    }

    const result = await this.familyService.registerElder(req.user.userId, elderData, profilePictureUrl);
    return result;
  }

  @Put('elders/:id')
  async updateElder(@Request() req, @Param('id') id: string, @Body() elderData: any) {
    return this.familyService.updateElder(req.user.userId, id, elderData);
  }

  @Delete('elders/:id')
  async removeElder(@Request() req, @Param('id') id: string) {
    return this.familyService.removeElder(req.user.userId, id);
  }

  /**
   * Get all care requests for the family
   * @param req The request object containing user information
   * @param elderId Optional query parameter to filter requests by elder
   */
  @Get('requests')
  async getFamilyRequests(
    @Request() req,
    @Query('elderId') elderId?: string
  ) {
    return this.familyService.getFamilyRequests(req.user.userId, elderId);
  }

  /**
   * Get status of a specific care request
   * @param req The request object containing user information
   * @param requestId The ID of the request to check
   */
  @Get('requests/:requestId')
  async getRequestStatus(
    @Request() req,
    @Param('requestId') requestId: string
  ) {
    return this.familyService.getRequestStatus(req.user.userId, requestId);
  }
}

@Controller('families')
@UseGuards(JwtAuthGuard)
export class FamiliesController {
  constructor(private familyService: FamilyService) { }

  @Get('search')
  async searchFamilies(@Query('query') query: string, @Query() filters: any) {
    return this.familyService.searchFamilies({ ...filters, search: query });
  }
}
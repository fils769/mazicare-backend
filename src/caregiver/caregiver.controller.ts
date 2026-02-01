import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Param,
  Query,
  ValidationPipe
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';
import { CaregiverService } from './caregiver.service';
import { SaveDetailsDto, RegionSelectionDto, CareProgramDto, UpdateScheduleItemDto } from './dto/caregiver.dto';
import { UploadThingService } from '../uploadthing/uploadthing.service';

@Controller('caregiver')
@UseGuards(JwtAuthGuard)
export class CaregiverController {
  constructor(
    private caregiverService: CaregiverService,
    private uploadThingService: UploadThingService
  ) { }

  @Get('profile')
  async getMyProfile(@Request() req) {
    return this.caregiverService.getMyCaregiverProfile(req.user.userId);
  }

  @Post('details')
  @UseInterceptors(FileInterceptor('profilePicture'))
  async saveDetails(
    @Request() req,
    @Body(new ValidationPipe({ 
      whitelist: true, 
      forbidNonWhitelisted: false, // Allow extra properties for this endpoint
      transform: true 
    })) data: SaveDetailsDto,
    @UploadedFile() profilePicture?: Express.Multer.File
  ) {
    let profilePictureUrl: string | undefined;

    if (profilePicture) {
      const uploadResult = await this.uploadThingService.uploadFile(profilePicture);
      profilePictureUrl = uploadResult.url;
    }

    return this.caregiverService.saveDetails(req.user.userId, data, profilePictureUrl);
  }

  @Get('regions')
  @Public()
  async getRegions() {
    return this.caregiverService.getRegions();
  }

  @Post('regions')
  async saveRegionSelection(@Request() req, @Body() data: RegionSelectionDto) {
    return this.caregiverService.saveRegionSelection(req.user.userId, data);
  }

  @Post('documents')
  @UseInterceptors(FileInterceptor('document'))
  async uploadDocument(@Request() req, @UploadedFile() document: Express.Multer.File) {
    if (!document) {
      throw new BadRequestException('Document file is required');
    }

    const uploadResult = await this.uploadThingService.uploadFile(document);

    return this.caregiverService.uploadDocument(req.user.userId, uploadResult.url);
  }

  @Post('documents/id-passport')
  @UseInterceptors(FileInterceptor('idPassport'))
  async uploadIdPassport(@Request() req, @UploadedFile() idPassport: Express.Multer.File) {
    if (!idPassport) {
      throw new BadRequestException('ID/Passport file is required');
    }

    const uploadResult = await this.uploadThingService.uploadFile(idPassport);
    return this.caregiverService.uploadIdPassport(req.user.userId, uploadResult.url);
  }

  @Post('documents/recommendation')
  @UseInterceptors(FileInterceptor('recommendation'))
  async uploadRecommendation(@Request() req, @UploadedFile() recommendation: Express.Multer.File) {
    if (!recommendation) {
      throw new BadRequestException('Recommendation letter file is required');
    }

    const uploadResult = await this.uploadThingService.uploadFile(recommendation);
    return this.caregiverService.uploadRecommendation(req.user.userId, uploadResult.url);
  }

  @Post('documents/certificates')
  @UseInterceptors(FileInterceptor('certificate'))
  async uploadCertificate(@Request() req, @UploadedFile() certificate: Express.Multer.File) {
    if (!certificate) {
      throw new BadRequestException('Certificate file is required');
    }

    const uploadResult = await this.uploadThingService.uploadFile(certificate);
    return this.caregiverService.uploadCertificate(req.user.userId, uploadResult.url);
  }

  @Get('programs')
  @Public()
  async getCarePrograms() {
    return this.caregiverService.getCarePrograms();
  }

  @Post('programs')
  async saveCareProgram(@Request() req, @Body() data: CareProgramDto) {
    return this.caregiverService.saveCareProgram(req.user.userId, data);
  }


  @Post('complete-onboarding')
  async completeOnboarding(@Request() req) {
    return this.caregiverService.completeOnboarding(req.user.userId);
  }

  @Get('onboarding-status')
  async getOnboardingStatus(@Request() req) {
    return this.caregiverService.getOnboardingStatus(req.user.userId);
  }

  @Get('elders')
  async getMyElders(@Request() req) {
    return this.caregiverService.getMyElders(req.user.userId);
  }

  @Get('elders/count')
  async getMyElderCount(@Request() req) {
    return this.caregiverService.getMyElderCount(req.user.userId);
  }

  @Get('elders/:elderId/schedules')
  async getElderSchedules(@Request() req, @Param('elderId') elderId: string) {
    return this.caregiverService.getElderSchedules(req.user.userId, elderId);
  }

  @Get('rating')
  async getMyRating(@Request() req) {
    return this.caregiverService.getMyRating(req.user.userId);
  }

  @Get('schedules')
  async getMySchedules(@Request() req) {
    return this.caregiverService.getMySchedules(req.user.userId);
  }

  @Put('schedules/items/:itemId')
  async updateScheduleItem(
    @Request() req,
    @Param('itemId') itemId: string,
    @Body() data: UpdateScheduleItemDto
  ) {
    return this.caregiverService.updateScheduleItem(req.user.userId, itemId, data);
  }

  @Put('schedules/items/:itemId/status')
  async updateScheduleItemStatus(
    @Request() req,
    @Param('itemId') itemId: string,
    @Body('status') status: string
  ) {
    return this.caregiverService.updateScheduleItemStatus(req.user.userId, itemId, status);
  }

  @Get('requests')
  async getElderRequests(@Request() req) {
    return this.caregiverService.getElderRequests(req.user.userId);
  }

  // @Post('requests/:requestId/accept')
  // async acceptElderRequest(@Request() req, @Param('requestId') requestId: string) {
  //   return this.caregiverService.acceptElderRequest(req.user.userId, requestId);
  // }

  // @Post('requests/:requestId/reject')
  // async rejectElderRequest(@Request() req, @Param('requestId') requestId: string) {
  //   return this.caregiverService.rejectElderRequest(req.user.userId, requestId);
  // }

  @Get('families')
  async searchFamilies(@Query() filters: any) {
    return this.caregiverService.searchFamilies(filters);
  }

  @Get('activity')
  async getActivity(
    @Request() req,
    @Query('period') period: string = '7d'
  ) {
    // Map old period values to new ones
    const periodMap: Record<string, string> = {
      '24h': 'today',
      '7d': '7d',
      '30d': '30d',
      '12m': '90d'
    };
    
    const mappedPeriod = periodMap[period] || period || '7d';
    return this.caregiverService.getActivity(req.user.userId, mappedPeriod);
  }
}


@Controller('caregivers')
@UseGuards(JwtAuthGuard)
export class CaregiversController {
  constructor(private caregiverService: CaregiverService) { }

  @Get()
  async searchCaregivers(@Query() filters: any) {
    return this.caregiverService.searchCaregivers(filters);
  }

  @Get(':id')
  async getCaregiverProfile(@Param('id') id: string) {
    return this.caregiverService.getCaregiverProfile(id);
  }

  @Get(':id/reviews')
  async getCaregiverReviews(@Param('id') id: string) {
    return this.caregiverService.getCaregiverReviews(id);
  }

  @Post(':caregiverId/assign')
  async assignCaregiver(
    @Param('caregiverId') caregiverId: string,
    @Body('elderId') elderId: string,
    @Body('familyId') familyId: string
  ) {
    return this.caregiverService.assignCaregiver(caregiverId, elderId, familyId);
  }
}

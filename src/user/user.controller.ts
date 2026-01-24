import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  BadRequestException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserService } from './user.service';
import { UpdateProfileDto } from './dto/user.dto';
import { UploadThingService } from '../uploadthing/uploadthing.service';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(
    private userService: UserService,
    private uploadThingService: UploadThingService
  ) { }

  @Get('profile')
  async getProfile(@Request() req) {
    return this.userService.getProfile(req.user.userId);
  }

  @Put('profile')
  async updateProfile(@Request() req, @Body() data: UpdateProfileDto) {
    return this.userService.updateProfile(req.user.userId, data);
  }

  @Put('profile-picture')
  @UseInterceptors(FileInterceptor('profilePicture'))
  async updateProfilePicture(
    @Request() req,
    @UploadedFile() profilePicture?: Express.Multer.File
  ) {
    if (!profilePicture) {
      console.log('No profile picture file provided, skipping update');
      return this.userService.getProfile(req.user.userId);
    }

    console.log('Uploading profile picture:', {
      originalname: profilePicture.originalname,
      mimetype: profilePicture.mimetype,
      size: profilePicture.size
    });

    const uploadResult = await this.uploadThingService.uploadFile(profilePicture);
    const profilePictureUrl = uploadResult.url;

    console.log('Upload successful, URL:', profilePictureUrl);

    return this.userService.updateProfilePicture(req.user.userId, profilePictureUrl);
  }

}
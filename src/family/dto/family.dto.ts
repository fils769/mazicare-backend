import { IsString, IsArray, IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class FamilyOnboardingDto {

  @IsString()
  familyName: string;

  @IsString()
  careFor: string;

  @IsString()
  ageGroup: string;

  @IsString()
  region: string;

  @IsString()
  language: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsArray()
  @IsString({ each: true })
  careTypes: string[];

  @IsString()
  schedule: string;

  @IsString()
  daysHours: string;


  @IsString()
  genderPreference: string;

  @IsString()
  experienceLevel: string;

  @IsBoolean()
  backgroundCheck: boolean;

  profilePicture?: Express.Multer.File;
}
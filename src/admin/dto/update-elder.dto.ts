import { ApiPropertyOptional } from '@nestjs/swagger';
import { Gender } from '@prisma/client';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export class AdminUpdateElderDto {
  @ApiPropertyOptional({ description: 'Elder first name' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ description: 'Elder last name' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({ description: 'Associated caregiver identifier' })
  @IsOptional()
  @IsString()
  careGiverId?: string;

  @ApiPropertyOptional({ description: 'Associated care program identifier' })
  @IsOptional()
  @IsString()
  programId?: string;

  @ApiPropertyOptional({ description: 'Elder descriptive notes' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Gender', enum: Gender })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiPropertyOptional({ description: 'Date of birth in ISO format' })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;
}

import { IsString, IsOptional, IsDateString, IsEnum, IsArray, ValidateNested, Matches } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class SaveDetailsDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  region?: string;

  @Transform(({ value, obj }) => {
    // If regionIds exists, use the first one as regionId
    if (obj.regionIds && Array.isArray(obj.regionIds) && obj.regionIds.length > 0) {
      return obj.regionIds[0];
    }
    return value;
  })
  @IsOptional()
  @IsString({ message: 'regionId must be a string' })
  regionId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  regionIds?: string[];

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languages?: string[];

  @IsOptional()
  @IsString()
  idPassportPhoto?: string;

  @IsOptional()
  @IsString()
  recommendationLetter?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  certificates?: string[];
}


export class RegionSelectionDto {
  @IsString()
  regionId: string;
}

export class CareProgramDto {
  @IsArray()
  @IsString({ each: true })
  programIds: string[];
}

export class ElderRequestResponseDto {
  @IsString()
  elderId: string;
}

export enum ScheduleStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
}

export class UpdateScheduleItemDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @Matches(/^([01]?\d|2[0-3]):[0-5]\d$/, {
    message: 'startTime must be in HH:MM format (24-hour)',
  })
  startTime?: string;

  @IsOptional()
  @IsString()
  @Matches(/^([01]?\d|2[0-3]):[0-5]\d$/, {
    message: 'endTime must be in HH:MM format (24-hour)',
  })
  endTime?: string;

  @IsOptional()
  @IsEnum(ScheduleStatus)
  status?: ScheduleStatus;
}

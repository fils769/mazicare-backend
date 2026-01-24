import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  ValidateNested,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum Day {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}

export enum ScheduleStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
}

/* ---------------------- SCHEDULE ITEM DTO ---------------------- */
export class ScheduleItemDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  @Matches(/^([01]?\d|2[0-3]):[0-5]\d$/, {
    message: 'startTime must be in HH:MM format (24-hour)',
  })
  startTime: string;

  @IsString()
  @Matches(/^([01]?\d|2[0-3]):[0-5]\d$/, {
    message: 'endTime must be in HH:MM format (24-hour)',
  })
  endTime: string;

  @IsOptional()
  @IsEnum(ScheduleStatus)
  status?: ScheduleStatus = ScheduleStatus.PENDING;
}

/* ---------------------- SCHEDULE DTO ---------------------- */
export class ScheduleDto {
  @IsEnum(Day)
  day: Day;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScheduleItemDto)
  scheduleItems: ScheduleItemDto[];
}

/* ---------------------- CREATE & UPDATE  SCHEDULE ---------------------- */
export class CreateScheduleDto {
  @IsString()
  elderId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScheduleDto)
  schedules: ScheduleDto[];
}

export class UpdateScheduleDto {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScheduleDto)
  schedules?: ScheduleDto[];
}

/* ---------------------- RESPONSE DTOs ---------------------- */
export class ScheduleItemResponse {
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  status: ScheduleStatus;
}

export class ScheduleResponse {
  day: Day;
  start: string;
  end: string;
  scheduleItems: ScheduleItemResponse[];
}

export class WeekScheduleResponse {
  elderId: string;
  elderName: string;
  weekStart: string;
  weekEnd: string;
  schedules: ScheduleResponse[];
}

export class UpdateItemStatusDto {
  @IsEnum(ScheduleStatus)
  status: ScheduleStatus;
}


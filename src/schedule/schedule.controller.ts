import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseEnumPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ScheduleService } from './schedule.service';
import {
  CreateScheduleDto,
  UpdateScheduleDto,
  UpdateItemStatusDto,
  Day,
  ScheduleStatus,
} from './dto/schedule.dto';

@Controller('schedule')
@UseGuards(JwtAuthGuard)
export class ScheduleController {
  constructor(private scheduleService: ScheduleService) {}

  // Get today's schedule
  @Get(':elderId/today')
  getTodaySchedule(@Param('elderId') elderId: string) {
    return this.scheduleService.getTodaySchedule(elderId);
  }

  // Get weekly schedule
  @Get(':elderId/weekly')
  getWeeklySchedule(@Param('elderId') elderId: string) {
    return this.scheduleService.getWeeklySchedule(elderId);
  }

  // Get schedule for a specific day
  @Get(':elderId/day/:day')
  getDaySchedule(
    @Param('elderId') elderId: string,
    @Param('day', new ParseEnumPipe(Day)) day: Day,
  ) {
    return this.scheduleService.getDaySchedule(elderId, day);
  }

  // Get all schedules for elder
  @Get(':elderId')
  getElderSchedule(@Param('elderId') elderId: string) {
    return this.scheduleService.getElderSchedule(elderId);
  }

  // Create full schedule (multiple days, each with multiple items)
  @Post(':elderId')
  createSchedule(
    @Param('elderId') elderId: string,
    @Body() scheduleData: CreateScheduleDto,
  ) {
    return this.scheduleService.createSchedule(elderId, scheduleData);
  }

  // Update/Replace schedule
  @Put(':elderId')
  updateSchedule(
    @Param('elderId') elderId: string,
    @Body() scheduleData: UpdateScheduleDto,
  ) {
    return this.scheduleService.updateSchedule(elderId, scheduleData);
  }

  // Delete specific schedule
  @Delete('schedule/:scheduleId')
  deleteSchedule(@Param('scheduleId') scheduleId: string) {
    return this.scheduleService.deleteSchedule(scheduleId);
  }

  // Delete all schedules for a specific day
  @Delete(':elderId/day/:day')
  deleteAllDaySchedules(
    @Param('elderId') elderId: string,
    @Param('day', new ParseEnumPipe(Day)) day: Day,
  ) {
    return this.scheduleService.deleteAllDaySchedules(elderId, day);
  }

  // Update status only for a schedule item
  @Put('items/:itemId/status')
  updateItemStatus(
    @Param('itemId') itemId: string,
    @Body() statusData: UpdateItemStatusDto,
  ) {
    return this.scheduleService.updateItemStatus(itemId, statusData.status);
  }
  
}

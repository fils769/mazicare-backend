import { Controller, Get, Post, Param, Query, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EventsService } from './events.service';
import { EventFiltersDto } from './dto/event.dto';

@Controller('events')
@UseGuards(JwtAuthGuard)
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @Get()
  async getEvents(@Query() filters: EventFiltersDto) {
    return this.eventsService.getEvents(filters);
  }

  @Get(':id')
  async getEventDetails(@Param('id') id: string) {
    return this.eventsService.getEventDetails(id);
  }

  @Post(':id/register')
  async registerForEvent(@Request() req, @Param('id') id: string) {
    return this.eventsService.registerForEvent(req.user.userId, id);
  }
}
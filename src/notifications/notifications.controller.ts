import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  UseGuards,
  Request,
  Delete,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/notification.dto';

@ApiTags('Notifications')
@ApiBearerAuth('bearer')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'List notifications for current user' })
  async getNotifications(@Request() req) {
    return this.notificationsService.getNotifications(req.user.userId);
  }

    
  @Put('all/read')
  @ApiOperation({ summary: 'Mark all notifications as read for current user' })
  async markAllAsRead(@Request() req) {
    return this.notificationsService.markAllAsRead(req.user.userId);
  }

  @Put(':id/read')
  @ApiOperation({ summary: 'Mark a notification as read' })
  @ApiParam({ name: 'id', description: 'Notification identifier' })
  async markAsRead(@Request() req, @Param('id') id: string) {
    return this.notificationsService.markAsRead(req.user.userId, id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new notification' })
  @ApiBody({ type: CreateNotificationDto })
  async createNotification(
    @Request() req,
    @Body() notificationData: CreateNotificationDto,
  ) {
    return this.notificationsService.createNotification(
      req.user.userId,
      notificationData,
    );
  }

  @Delete('all')
  @ApiOperation({ summary: 'Delete all notifications for current user' })
  async deleteAllNotifications(@Request() req) {
    return this.notificationsService.deleteAllNotifications(req.user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a notification' })
  @ApiParam({ name: 'id', description: 'Notification identifier' })
  async deleteNotification(@Request() req, @Param('id') id: string) {
    return this.notificationsService.deleteNotification(req.user.userId, id);
  }


}

import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MessagesService } from './messages.service';
import { SendMessageDto } from './dto/message.dto';
import { MessagesGateway } from './messages.gateway';

@ApiTags('Messages')
@ApiBearerAuth('bearer')
@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly messagesGateway: MessagesGateway,
  ) { }

  @Get()
  @ApiOperation({ summary: 'Retrieve messages for a user' })
  @ApiQuery({ name: 'conversationId', required: false })
  async getMessages(
    @Request() req,
    @Query('conversationId') conversationId?: string,
  ) {
    return this.messagesService.getMessages(req.user.userId, conversationId);
  }

  @Post()
  @ApiOperation({ summary: 'Send a message to a conversation or user' })
  @ApiBody({ type: SendMessageDto })
  async sendMessage(@Request() req, @Body() messageData: SendMessageDto) {
    const result = await this.messagesService.sendMessage(
      req.user.userId,
      messageData,
    );
    this.messagesGateway.broadcastMessage(result);
    return result.message;
  }

  @Get('conversations')
  @ApiOperation({ summary: 'List conversations for a user' })
  async getConversations(@Request() req) {
    return this.messagesService.getConversations(req.user.userId);
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Get unread message count for the current user' })
  async getUnreadCount(@Request() req) {
    return this.messagesService.getUnreadCount(req.user.userId);
  }

  @Put(':messageId/read')
  @ApiOperation({ summary: 'Mark a message as read' })
  async markAsRead(@Request() req, @Param('messageId') messageId: string) {
    return this.messagesService.markAsRead(req.user.userId, messageId);
  }

  @Put('conversation/:conversationId/read-all')
  @ApiOperation({ summary: 'Mark all messages in a conversation as read' })
  async markConversationAsRead(
    @Request() req,
    @Param('conversationId') conversationId: string,
  ) {
    return this.messagesService.markConversationAsRead(
      req.user.userId,
      conversationId,
    );
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UseGuards,
  Param,
} from '@nestjs/common';
import { Message } from '@prisma/client';
import { AppGateway } from 'src/app.gateway';
import { CONVERSATION, MESSAGE } from 'src/constant/socket.constant';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { ConversationService } from './conversation.service';
import {
  ConversationDetail,
  ConversationWithUsers,
} from './entities/conversation.entity';
import { MessageDetail } from './entities/message.entity';
import messageDecoder from 'src/utils/message-decoder';

@Controller('conversation')
export class ConversationController {
  constructor(
    private readonly conversationService: ConversationService,
    private readonly appGateway: AppGateway,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getConversationsByUserId(@Req() req): Promise<ConversationDetail[]> {
    const conversations =
      await this.conversationService.getConversationsByUserId(req.user.id);
    return conversations;
  }

  @UseGuards(JwtAuthGuard)
  @Post('personal-message')
  async sendMessage(@Body() sendMessageDto): Promise<MessageDetail> {
    const rawMessage = await this.conversationService.sendMessage(
      sendMessageDto,
    );

    const message = messageDecoder(rawMessage);

    message.conversation.users
      .filter((u) => u.id !== message.senderId)
      .forEach((u) => {
        this.appGateway.server
          .to(u.socketId)
          .emit(MESSAGE['new-message'], message);
        this.appGateway.server
          .to(u.socketId)
          .emit(CONVERSATION['conversation-created'], message.conversation);
      });

    return message;
  }

  @UseGuards(JwtAuthGuard)
  @Post('new-group')
  async createGroupConversation(
    @Body() createGroupDto,
    @Req() req,
  ): Promise<ConversationWithUsers> {
    const conversation = await this.conversationService.createGroupConversation(
      createGroupDto,
    );

    conversation.users
      .filter((u) => u.id !== req.user.id)
      .forEach((u) => {
        this.appGateway.server
          .to(u.socketId)
          .emit(CONVERSATION['conversation-created'], conversation);
      });

    return conversation;
  }

  @UseGuards(JwtAuthGuard)
  @Post('broadcast')
  async broadcastMessage(
    @Body() broadcastMessageDto,
    @Req() req,
  ): Promise<{ conversation: ConversationWithUsers; message: Message }[]> {
    const res = await this.conversationService.sendBroadcastMessage(
      broadcastMessageDto,
    );

    res.forEach(({ conversation, message: rawMessage }) => {
      const message = messageDecoder(rawMessage);

      conversation.users
        .filter((u) => u.id !== req.user.id)
        .forEach((u) => {
          this.appGateway.server
            .to(u.socketId)
            .emit(CONVERSATION['broadcast-sent'], conversation);
          console.log(u.socketId);
          this.appGateway.server
            .to(u.socketId)
            .emit(MESSAGE['new-message'], message);
        });
    });

    return res;
  }

  @UseGuards(JwtAuthGuard)
  @Get('unseen-messages')
  async getUnseenMessage(@Req() req): Promise<number> {
    const conversation = await this.conversationService.getUnseenMessages(
      req.user.id,
    );
    return conversation;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':conversationId')
  async getConversationById(@Param() params): Promise<ConversationWithUsers> {
    const conversation = await this.conversationService.getConversationById(
      params.conversationId,
    );
    return conversation;
  }
}

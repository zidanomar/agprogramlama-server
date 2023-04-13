import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UseGuards,
  Param,
} from '@nestjs/common';
import { CONVERSATION } from 'src/constant/socket.constant';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { ConversationGateway } from './conversation.gateway';
import { ConversationService } from './conversation.service';
import {
  ConversationDetail,
  ConversationWithUsers,
} from './entities/conversation.entity';

@Controller('conversation')
export class ConversationController {
  constructor(
    private readonly conversationService: ConversationService,
    private readonly conversationGateway: ConversationGateway,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getConversationsByUserId(@Req() req): Promise<ConversationDetail[]> {
    const conversations =
      await this.conversationService.getConversationsByUserId(req.user.id);
    return conversations;
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
        console.log(u.socketId);
        this.conversationGateway.server
          .to(u.socketId)
          .emit(CONVERSATION['conversation-created'], conversation);
      });

    return conversation;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':conversationId')
  async getConversationById(@Param() params): Promise<ConversationDetail> {
    const conversation = await this.conversationService.getConversationById(
      params.conversationId,
    );
    return conversation;
  }
}

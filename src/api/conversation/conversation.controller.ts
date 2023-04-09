import { Controller, Get, Req, UseGuards, Param } from '@nestjs/common';
import { Conversation } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { ConversationService } from './conversation.service';

@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getConversationsByUserId(@Req() req): Promise<Conversation[]> {
    const conversations =
      await this.conversationService.getConversationsByUserId(req.user.id);
    return conversations;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':conversationId')
  async getConversationById(@Param() params): Promise<Conversation> {
    const conversation = await this.conversationService.getConversationById(
      params.conversationId,
    );
    return conversation;
  }
}

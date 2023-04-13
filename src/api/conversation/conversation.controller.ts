import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UseGuards,
  Param,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { ConversationService } from './conversation.service';
import {
  ConversationDetail,
  ConversationWithUsers,
} from './entities/conversation.entity';

@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

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
  ): Promise<ConversationWithUsers> {
    const conversation = await this.conversationService.createGroupConversation(
      createGroupDto,
    );
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

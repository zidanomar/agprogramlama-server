import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UseGuards,
  Param,
  ForbiddenException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { SendMessageDto } from './dto/send-message.dto';
import { MessageService } from './message.service';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  // ==================== CREATE ====================
  @UseGuards(JwtAuthGuard)
  @Post()
  async sendMessage(
    @Req() req,
    @Body() sendMessageDto: SendMessageDto,
  ): Promise<any> {
    if (sendMessageDto.sender.id !== req.user.id) {
      return new ForbiddenException(
        'You are not allowed to send message on behalf of other user',
      );
    }

    const newMessage = await this.messageService.sendMessage(sendMessageDto);
    return newMessage;
  }
}

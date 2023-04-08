import { Conversation, User } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';

export class SendMessageDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsString()
  sender: User;

  @IsNotEmpty()
  @IsString()
  receiver: User;

  @IsString()
  conversation: Conversation;
}

export class SendMessageBodyDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsString()
  sender: User;

  @IsNotEmpty()
  @IsString()
  receivers: User[];

  @IsString()
  conversation: Conversation;
}

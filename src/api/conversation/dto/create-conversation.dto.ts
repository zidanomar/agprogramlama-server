import { ConversationType, User } from '@prisma/client';
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
export class CreateConversationDto {
  sender: User;
  receiver: User;
  type = 'PERSONAL' as ConversationType;
}

export class CreateGroupConversationDto {
  @IsNotEmpty()
  sender: User;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  receivers: User[];

  @IsNotEmpty()
  name: string;

  type: ConversationType = 'GROUP';
}

export class SendBroadcastMessageDto {
  @IsNotEmpty()
  sender: User;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  receivers: User[];

  @IsNotEmpty()
  content: string;
}

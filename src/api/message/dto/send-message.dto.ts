// model Message {
//   id             String       @id @default(uuid())
//   text           String
//   sentAt         DateTime     @default(now())
//   seen           Boolean      @default(false)
//   sender         User         @relation(fields: [senderId], references: [id])
//   senderId       String
//   Conversation   Conversation @relation("ConversationMessage", fields: [ConversationId], references: [id])
//   ConversationId String
// }

import { User } from '@prisma/client';
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
  receivers: User[];
}

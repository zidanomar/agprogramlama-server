import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { MessageService } from '../message/message.service';
import { ConversationController } from './conversation.controller';
import { AppGateway } from 'src/app.gateway';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [
    AppGateway,
    ConversationService,
    MessageService,
    AuthService,
    UserService,
  ],
  controllers: [ConversationController],
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
})
export class ConversationModule {}

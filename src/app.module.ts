import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './api/user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './api/auth/auth.module';
import { ConversationModule } from './api/conversation/conversation.module';
import { MessageModule } from './api/message/message.module';
import { AppGateway } from './app.gateway';
import { AuthService } from './api/auth/auth.service';
import { UserService } from './api/user/user.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    UserModule,
    PrismaModule,
    AuthModule,
    ConversationModule,
    MessageModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppGateway, AuthService, UserService],
})
export class AppModule {}

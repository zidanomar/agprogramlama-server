import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './api/user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './api/auth/auth.module';

@Module({
  imports: [ConfigModule.forRoot(), UserModule, PrismaModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

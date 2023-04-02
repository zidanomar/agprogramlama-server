import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
} from '@nestjs/websockets/decorators';
import { UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

import { WsAuthGuard } from 'src/api/auth/guards/ws.guard';
import { IncomingMessage } from 'http';
import { User } from '@prisma/client';
import { WsException } from '@nestjs/websockets/errors';
import { AuthService } from 'src/api/auth/auth.service';
import { UserService } from './user.service';

interface RequestWithUser extends IncomingMessage {
  user: User;
}

interface WebSocketWithUser extends Socket {
  request: RequestWithUser;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class UserGateway {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @WebSocketServer() server: Server;

  @UseGuards(WsAuthGuard)
  async handleConnection(@ConnectedSocket() client: WebSocketWithUser) {
    const socketId = client.id;
    const token = client.handshake.headers.authorization.split(' ')[1];

    if (!token) {
      client.disconnect();
      console.log('client disconnected: ' + token);
      throw new WsException('Missing authentication token');
    }

    const decodedUser = await this.authService.verifyToken(token);

    if (!decodedUser) {
      client.disconnect();
      throw new WsException('Invalid authentication token');
    }

    client.request.user = decodedUser;

    this.userService.updateUserSocketId(decodedUser.id, socketId);
  }
  @UseGuards(WsAuthGuard)
  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody() data: any,
    @ConnectedSocket() client: WebSocketWithUser,
  ) {
    const reciever = await this.userService.getUserSocketId(data);

    this.server.to(reciever.socketId).emit('message', 'hola');
  }
}

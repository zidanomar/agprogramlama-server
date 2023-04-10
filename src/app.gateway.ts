import { IncomingMessage } from 'http';
import { UseGuards } from '@nestjs/common/decorators';
import {
  ConnectedSocket,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { User } from '@prisma/client';
import { WsAuthGuard } from './api/auth/guards/ws.guard';
import { AuthService } from './api/auth/auth.service';
import { UserService } from './api/user/user.service';
import { USER } from './constant/socket.constant';

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
@WebSocketGateway()
export class AppGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(WsAuthGuard)
  async handleConnection(@ConnectedSocket() client: WebSocketWithUser) {
    try {
      const socketId = client.id;
      const token = client.handshake.headers.authorization.split(' ')[1];
      const decodedUser = await this.authService.verifyToken(token);

      client.request.user = decodedUser;

      const updatedUser = await this.userService.updateUserSocketId(
        decodedUser.id,
        socketId,
      );

      console.log(`Client ${socketId} connected`);
      this.server.emit(USER['user-connected'], updatedUser);
    } catch (error) {
      console.log(`Error verifying token: ${error.message}`);
      client.disconnect();
    }
  }

  @UseGuards(WsAuthGuard)
  async handleDisconnect(client: Socket) {
    const user = await this.userService.userDisconnect(client.id);
    if (user) {
      this.server.emit(USER['user-disconnected'], user);
    }
    console.log(`Client ${client.id} disconnected`);
  }
}

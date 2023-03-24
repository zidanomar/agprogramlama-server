import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import {
  ConnectedSocket,
  SubscribeMessage,
} from '@nestjs/websockets/decorators';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class UserGateway {
  @WebSocketServer() server: Server;

  @SubscribeMessage('connection')
  async connection(@ConnectedSocket() client: Socket) {
    return client.id;
  }
}

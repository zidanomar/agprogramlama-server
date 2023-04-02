import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { AuthService } from '../auth.service';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient();
    const token = client.handshake.headers.authorization.split(' ')[1];
    if (!token) {
      throw new WsException('Missing authentication token');
    }
    try {
      const decoded = await this.authService.verifyToken(token);
      client.request.user = decoded;
      return true;
    } catch (err) {
      throw new WsException('Invalid authentication token');
    }
  }
}

import { Injectable } from '@nestjs/common';
import { parse } from 'cookie';
import { Socket } from 'socket.io';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable()
export class ChatService {
  constructor(private readonly authenticationService: AuthenticationService) {}

  async getUserFromSocket(client: Socket) {
    const cookie = client.handshake.headers.cookie;
    const { Authentication: authenticationToken } = parse(cookie);
    return await this.authenticationService.getUserFromAuthenticationToken(authenticationToken);
  }
}

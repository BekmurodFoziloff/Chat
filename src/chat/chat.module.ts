import { Module } from '@nestjs/common';
import { AuthenticationModule } from '../authentication/authentication.module';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { MessagesModule } from '../messages/messages.module';
import { RoomsModule } from 'src/rooms/rooms.module';

@Module({
  imports: [AuthenticationModule, MessagesModule, RoomsModule],
  providers: [ChatGateway, ChatService]
})
export class ChatModule {}

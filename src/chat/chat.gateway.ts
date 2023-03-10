import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsException,
  ConnectedSocket
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { MessagesService } from '../messages/messages.service';
import { CreateMessageDto } from '../messages/dto/createMessage.dto';
import { RoomsService } from '../rooms/rooms.service';
import { UpdateMessageDto } from '../messages/dto/updateMessage.dto';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly messagesService: MessagesService,
    private readonly roomsService: RoomsService
  ) {}

  async handleConnection(@ConnectedSocket() client: Socket) {
    const user = await this.chatService.getUserFromSocket(client);
    if (!user) {
      client.disconnect(true);
      throw new WsException('Invalid credentials');
    }
    console.log(`Client ${client.id} connected. Client: ${user}`);
  }

  @SubscribeMessage('join')
  async handleJoin(@ConnectedSocket() client: Socket, @MessageBody() roomId: number) {
    const user = await this.chatService.getUserFromSocket(client);
    if (!user) {
      client.disconnect(true);
      throw new WsException('Invalid credentials');
    }
    client.join(roomId.toString());
    client.to(roomId.toString()).emit('userJoined', client.id);
    await this.roomsService.addUserToRoom(Number(roomId), user);
    console.log(`Client ${client.id} joined room: ${roomId}`);
  }

  @SubscribeMessage('leave')
  async handleLeave(@ConnectedSocket() client: Socket, @MessageBody() roomId: number) {
    const user = await this.chatService.getUserFromSocket(client);
    if (!user) {
      client.disconnect(true);
      throw new WsException('Invalid credentials');
    }
    client.leave(roomId.toString());
    client.to(roomId.toString()).emit('userLeaved', client.id);
    await this.roomsService.deleteUserFromRoom(Number(roomId), user);
    console.log(`Client ${client.id} leaved room: ${roomId}`);
  }

  @SubscribeMessage('getMessages')
  async handleGetMessages(@ConnectedSocket() client: Socket, @MessageBody() roomId: number) {
    const messages = await this.messagesService.getMessages(Number(roomId));
    client.emit('getMessages', messages);
    client.to(roomId.toString()).emit('getMessages', messages);
  }

  @SubscribeMessage('createMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() messageData: CreateMessageDto,
    @MessageBody() roomId: number
  ) {
    const owner = await this.chatService.getUserFromSocket(client);
    if (!owner) {
      client.disconnect(true);
      throw new WsException('Invalid credentials');
    }
    const room = await this.roomsService.getRoom(Number(roomId));
    const newMessage = await this.messagesService.createMessage(messageData, room, owner);
    this.server.sockets.emit('createMessage', newMessage);
    this.server.sockets.to(roomId.toString()).emit('createMessage', newMessage);
    console.log(`Client ${client.id} created message: ${newMessage.content} to room: ${roomId}`);
  }

  @SubscribeMessage('updateMessage')
  async handleUpdateMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() messageData: UpdateMessageDto,
    @MessageBody() roomId: number
  ) {
    const user = await this.chatService.getUserFromSocket(client);
    if (!user) {
      client.disconnect(true);
      throw new WsException('Invalid credentials');
    }
    const updatedMessage = await this.messagesService.updateMessage(Number(roomId), messageData, Number(user.id));
    this.server.sockets.emit('updateMessage', updatedMessage);
    this.server.sockets.to(roomId.toString()).emit('updateMessage', updatedMessage);
  }

  @SubscribeMessage('deleteMessage')
  async handleDeleteMessage(@ConnectedSocket() client: Socket, @MessageBody() roomId: number) {
    const user = await this.chatService.getUserFromSocket(client);
    if (!user) {
      client.disconnect(true);
      throw new WsException('Invalid credentials');
    }
    const deletedMessage = await this.messagesService.deleteMessage(Number(roomId), Number(user.id));
    this.server.sockets.emit('deleteMessage', deletedMessage);
    this.server.sockets.to(roomId.toString()).emit('deleteMessage', deletedMessage);
  }

  @SubscribeMessage('isTyping')
  async handleTypingNotification(@ConnectedSocket() client: Socket, @MessageBody() roomId: number) {
    this.server.sockets.emit('isTyping', `Client ${client.id} typing message...`);
    this.server.sockets.to(roomId.toString()).emit('isTyping', `Client ${client.id} typing message...`);
    console.log(`Client ${client.id} typing message to room: ${roomId}`);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log(`Client ${client.id} disconnected`);
  }
}

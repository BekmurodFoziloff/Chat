import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { Room } from '../rooms/room.entity';
import User from '../users/user.entity';
import { CreateMessageDto } from './dto/createMessage.dto';
import { UpdateMessageDto } from './dto/updateMessage.dto';
import MessageNotFoundException from './exceptions/messageNotFound.exception';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messagesRepository: Repository<Message>
  ) {}

  async getMessages(roomId: number) {
    return await this.messagesRepository.findBy({ room: { id: roomId } });
  }

  async createMessage(messageData: CreateMessageDto, room: Room, owner: User) {
    const newMessage = this.messagesRepository.create({
      ...messageData,
      room,
      owner
    });
    await this.messagesRepository.save(newMessage);
    return newMessage;
  }

  async updateMessage(id: number, roomData: UpdateMessageDto, userId: number) {
    const updatedMessage = await this.messagesRepository.update({ id, owner: { id: userId } }, roomData);
    if (!updatedMessage.affected) {
      throw new MessageNotFoundException(id);
    }
  }

  async deleteMessage(id: number, userId: number) {
    const deletedMessage = await this.messagesRepository.delete({ id, owner: { id: userId } });
    if (!deletedMessage.affected) {
      throw new MessageNotFoundException(id);
    }
  }
}

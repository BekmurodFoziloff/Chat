import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './room.entity';
import { CreateRoomDto } from './dto/createRoom.dto';
import User from '../users/user.entity';
import { UpdateRoomDto } from './dto/updateRoom.dto';
import RoomNotFoundException from './exceptions/roomNotFound.exception';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private readonly roomsRepository: Repository<Room>
  ) {}

  async getAllRooms() {
    return await this.roomsRepository.find({ relations: ['messages', 'owner', 'members'] });
  }

  async getRoom(id: number) {
    const room = await this.roomsRepository.findOne({ where: { id }, relations: ['messages', 'owner', 'members'] });
    if (!room) {
      throw new RoomNotFoundException(id);
    }
    return room;
  }

  async createRoom(roomData: CreateRoomDto, owner: User) {
    const newRoom = this.roomsRepository.create({
      ...roomData,
      owner
    });
    await this.roomsRepository.save(newRoom);
    return newRoom;
  }

  async updateRoom(id: number, roomData: UpdateRoomDto, userId: number) {
    const updatedRoom = await this.roomsRepository.update({ id, owner: { id: userId } }, roomData);
    if (!updatedRoom.affected) {
      throw new RoomNotFoundException(id);
    }
  }

  async deleteRoom(id: number, userId: number) {
    const deletedRoom = await this.roomsRepository.delete({ id, owner: { id: userId } });
    if (!deletedRoom.affected) {
      throw new RoomNotFoundException(id);
    }
  }

  async addUserToRoom(id: number, user: User) {
    const room = await this.roomsRepository.findOne({ where: { id }, relations: ['messages', 'owner', 'members'] });
    if (!room) {
      throw new RoomNotFoundException(id);
    }
    room.members.push(user);
    await this.roomsRepository.manager.save(room);
    return room;
  }

  async deleteUserFromRoom(id: number, user: User) {
    const room = await this.roomsRepository.findOne({ where: { id }, relations: ['messages', 'owner', 'members'] });
    if (!room) {
      throw new RoomNotFoundException(id);
    }
    room.members.filter((member) => {
      return member.id !== user.id;
    });
    await this.roomsRepository.manager.save(room);
    return room;
  }
}

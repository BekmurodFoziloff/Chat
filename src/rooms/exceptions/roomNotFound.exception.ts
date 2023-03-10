import { NotFoundException } from '@nestjs/common';

class RoomNotFoundException extends NotFoundException {
  constructor(roomId: number) {
    super(`Room with id ${roomId} not found`);
  }
}

export default RoomNotFoundException;

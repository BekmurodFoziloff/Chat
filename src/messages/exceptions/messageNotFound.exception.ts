import { NotFoundException } from '@nestjs/common';

class MessageNotFoundException extends NotFoundException {
  constructor(messageId: number) {
    super(`Message with id ${messageId} not found`);
  }
}

export default MessageNotFoundException;

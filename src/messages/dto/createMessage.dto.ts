import { IsNotEmpty, IsNumber, MaxLength, MinLength } from 'class-validator';

export class CreateMessageDto {
  @MinLength(1)
  @MaxLength(500)
  @IsNotEmpty()
  content: string;

  @IsNumber()
  @IsNotEmpty()
  roomId: number
}

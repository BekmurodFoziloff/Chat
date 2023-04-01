import { IsNumber, IsOptional, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class UpdateMessageDto {
  @IsNumber()
  @IsOptional()
  id: number;

  @MinLength(1)
  @MaxLength(500)
  @IsNotEmpty()
  content: string;

  @IsNumber()
  @IsNotEmpty()
  roomId: number
}

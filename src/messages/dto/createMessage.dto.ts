import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateMessageDto {
  @MinLength(1)
  @MaxLength(500)
  @IsNotEmpty()
  content: string;
}

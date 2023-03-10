import { IsNumber, IsOptional, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateRoomDto {
  @IsNumber()
  @IsOptional()
  id: number;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  @IsNotEmpty()
  title: string;

  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  @IsNotEmpty()
  description: string;
}

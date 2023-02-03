import { IsString, IsNumber, IsNotEmpty, IsAlpha, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsNumber()
  @IsOptional()
  id: number;

  @IsOptional()
  @IsString()
  @IsAlpha()
  @IsNotEmpty()
  firstName: string;

  @IsOptional()
  @IsString()
  @IsAlpha()
  lastName: string;

  @IsOptional()
  @IsString()
  bio: string;
}

export default UpdateUserDto;

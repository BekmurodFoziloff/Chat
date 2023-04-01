import { IsEmail, IsString, IsNotEmpty, MinLength, MaxLength, IsAlpha, IsOptional, Matches } from 'class-validator';
import { IsUniqueEmail } from '../../validators/IsUniqueEmail.validator';
import { IsPasswordMatching } from '../../validators/IsPasswordMatching.validator';

export class RegisterDto {
  @IsEmail()
  @IsUniqueEmail()
  @Matches('[a-z0-9]+@[a-z]+.[a-z]{2,3}')
  email: string;

  @IsString()
  @IsAlpha()
  @IsNotEmpty()
  firstName: string;

  @IsOptional()
  @IsString()
  @IsAlpha()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(16)
  @Matches('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})')
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(16)
  @IsPasswordMatching('password')
  passwordConfirm: string;
}

export default RegisterDto;

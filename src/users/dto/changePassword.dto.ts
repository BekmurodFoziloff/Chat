import { IsString, IsNotEmpty, MinLength, MaxLength, Matches } from 'class-validator';
import { IsPasswordMatching } from '../../validators/IsPasswordMatching.validator';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(16)
  @Matches('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})')
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(16)
  @IsPasswordMatching('newPassword')
  newPasswordConfirm: string;
}

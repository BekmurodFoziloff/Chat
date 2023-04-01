import {
  Controller,
  Get,
  Patch,
  Body,
  Delete,
  Req,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor
} from '@nestjs/common';
import { UsersService } from './users.service';
import UpdateUserDto from './dto/updateUser.dto';
import JwtAuthenticationGuard from '../authentication/guards/jwt-authentication.guard';
import { ChangePasswordDto } from './dto/changePassword.dto';
import RequestWithUser from '../authentication/interfaces/requestWithUser.interface';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  async getUserById(@Req() req: RequestWithUser) {
    return this.usersService.getUserById(Number(req.user.id));
  }

  @Patch('edit')
  @UseGuards(JwtAuthenticationGuard)
  async updateUser(@Req() req: RequestWithUser, @Body() userData: UpdateUserDto) {
    return this.usersService.updateUser(Number(req.user.id), userData);
  }

  @Delete('delete')
  @UseGuards(JwtAuthenticationGuard)
  async deleteUser(@Req() req: RequestWithUser) {
    return this.usersService.deleteUser(Number(req.user.id));
  }

  @Patch('password')
  @UseGuards(JwtAuthenticationGuard)
  async changePassword(@Req() req: RequestWithUser, @Body() passwordData: ChangePasswordDto) {
    return this.usersService.changePassword(Number(req.user.id), passwordData);
  }
}

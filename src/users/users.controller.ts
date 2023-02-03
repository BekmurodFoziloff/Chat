import { Controller, Get, Param, Patch, Body, Delete, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import UpdateUserDto from './dto/updateUser.dto';
import FindOneParams from '../utils/findOneParams';
import JwtAuthenticationGuard from '../authentication/guards/jwt-authentication.guard';
import { ChangePassword } from './dto/changePassword.dto';
import RequestWithUser from '../authentication/interfaces/requestWithUser.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Get(':id')
  async getUserById(@Param() { id }: FindOneParams) {
    return this.usersService.getUserById(Number(id));
  }

  @Patch('edit/:id')
  @UseGuards(JwtAuthenticationGuard)
  async updateUser(@Param() { id }: FindOneParams, @Body() userData: UpdateUserDto) {
    return this.usersService.updateUser(Number(id), userData);
  }

  @Delete('delete/:id')
  @UseGuards(JwtAuthenticationGuard)
  async deleteUser(@Param() { id }: FindOneParams) {
    return this.usersService.deleteUser(Number(id));
  }

  @Patch('password')
  @UseGuards(JwtAuthenticationGuard)
  async changePassword(@Req() req: RequestWithUser, @Body() passwordData: ChangePassword) {
    return this.usersService.changePassword(Number(req.user.id), passwordData);
  }
}

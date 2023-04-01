import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Req,
  Patch,
  Delete,
  UseGuards,
  ClassSerializerInterceptor,
  UseInterceptors
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import FindOneParams from '../utils/findOneParams';
import { CreateRoomDto } from './dto/createRoom.dto';
import JwtAuthenticationGuard from '../authentication/guards/jwt-authentication.guard';
import RequestWithUser from '../authentication/interfaces/requestWithUser.interface';
import { UpdateRoomDto } from './dto/updateRoom.dto';

@Controller('rooms')
@UseInterceptors(ClassSerializerInterceptor)
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  getAllRooms() {
    return this.roomsService.getAllRooms();
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  getRoomById(@Param() { id }: FindOneParams) {
    return this.roomsService.getRoom(Number(id));
  }

  @Post('new')
  @UseGuards(JwtAuthenticationGuard)
  async createRoom(@Body() roomData: CreateRoomDto, @Req() req: RequestWithUser) {
    return this.roomsService.createRoom(roomData, req.user);
  }

  @Patch(':id/edit')
  @UseGuards(JwtAuthenticationGuard)
  async updateRoom(@Param() { id }: FindOneParams, @Body() roomData: UpdateRoomDto, @Req() req: RequestWithUser) {
    return this.roomsService.updateRoom(Number(id), roomData, Number(req.user.id));
  }

  @Delete(':id/delete')
  @UseGuards(JwtAuthenticationGuard)
  async deleteRoom(@Param() { id }: FindOneParams, @Req() req: RequestWithUser) {
    return this.roomsService.deleteRoom(Number(id), Number(req.user.id));
  }
}

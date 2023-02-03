import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from './user.entity';
import { UsersController } from './users.controller';
import { IsUniqueEmailValidator } from '../validators/IsUniqueEmail.validator';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, IsUniqueEmailValidator],
  exports: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}

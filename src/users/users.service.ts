import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import User from './user.entity';
import { CreateUserDto } from './dto/createUser.dto';
import UpdateUserDto from './dto/updateUser.dto';
import * as bcrypt from 'bcrypt';
import UserNotFoundException from './exceptions/userNotFound.exception';
import { ChangePassword } from './dto/changePassword.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  async getUserByEmail(email: string) {
    const user = await this.usersRepository.findOne({ where: { email }, relations: ['rooms', 'joinedRooms'] });
    if (user) {
      return user;
    }
    throw new HttpException('User with this email does not exist', HttpStatus.NOT_FOUND);
  }

  async getAllUsers() {
    return await this.usersRepository.find({ relations: ['rooms', 'joinedRooms'] });
  }

  async getUserById(id: number) {
    const user = await this.usersRepository.findOne({ where: { id }, relations: ['rooms', 'joinedRooms'] });
    if (user) {
      return user;
    }
    throw new UserNotFoundException(id);
  }

  async createUser(userData: CreateUserDto) {
    const newUser = this.usersRepository.create(userData);
    await this.usersRepository.save(newUser);
    return newUser;
  }

  async updateUser(id: number, userData: UpdateUserDto) {
    const updatedUser = await this.usersRepository.update(id, userData);
    if (!updatedUser.affected) {
      throw new UserNotFoundException(id);
    }
  }

  async deleteUser(id: number) {
    const deletedUser = await this.usersRepository.delete(id);
    if (!deletedUser.affected) {
      throw new UserNotFoundException(id);
    }
  }

  async findUserByEmail(email: string) {
    return await this.usersRepository.findOne({ where: { email } });
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersRepository.update(userId, {
      currentHashedRefreshToken
    });
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
    const user = await this.getUserById(userId);
    const isRefreshTokenMatching = await bcrypt.compare(refreshToken, user.currentHashedRefreshToken);
    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async removeRefreshToken(userId: number) {
    return await this.usersRepository.update(userId, {
      currentHashedRefreshToken: null
    });
  }

  async changePassword(userId: number, passwordData: ChangePassword) {
    const user = await this.getUserById(userId);
    const isPasswordMatching = await bcrypt.compare(passwordData.oldPassword, user.password);
    if (!isPasswordMatching) {
      throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
    }
    const hashedPassword = await bcrypt.hash(passwordData.newPassword, 10);
    const updatedPassword = await this.usersRepository.update(userId, {
      password: hashedPassword
    });
    if (!updatedPassword.affected) {
      throw new UserNotFoundException(userId);
    }
  }
}

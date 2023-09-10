import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Auth, AuthDocument } from 'src/auth/entities/auth.entity';
import { Role } from 'src/auth/entities/auth.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(Auth.name) private readonly userModel: Model<AuthDocument>,
  ) {}

  async findAll(page: number = 1, pageSize: number = 10): Promise<{ users: Auth[]; total: number }> {
    const skip = (page - 1) * pageSize;
    const query = this.userModel.find().skip(skip).limit(pageSize).exec();
    const total = await this.userModel.countDocuments().exec();
    const users = await query;
    return { users, total };
  }
  

  async findOne(userId: string): Promise<Auth> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }



  async update(
    userId: string,
    updatedUser: Partial<Auth>,
  ): Promise<Auth | null> {
    const user = await this.userModel.findById(userId);

    if (!user) {
      return null; // User not found
    }

    // Update user properties
    if (updatedUser.pin) {
      user.pin = updatedUser.pin;
    }

    // Add other properties as needed

    await user.save();

    return user;
  }

  async deleteUser(userId: string, userRole: Role): Promise<Auth> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if user is authorized to delete
    if (userRole !== Role.Admin && user._id.toString() !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to delete this user',
      );
    }

    return this.userModel.findByIdAndRemove(userId);
  }

  async getUser(id: string): Promise<Auth> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}

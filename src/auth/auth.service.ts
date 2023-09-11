import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Auth, AuthDocument } from './entities/auth.entity';
import * as crypto from 'crypto';


@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Auth.name) private readonly authModel: Model<AuthDocument>,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateAuthDto): Promise<Auth> {
    if (createUserDto.password && createUserDto.confirmPassword) {
      if (createUserDto.password !== createUserDto.confirmPassword) {
        throw new BadRequestException('Passwords do not match');
      }
    } else {
      throw new BadRequestException('Password and Confirm Password are required');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const existingUser = await this.authModel.findOne({
      email: createUserDto.email,
    });
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    // Generate an auto wallet ID using crypto
    const uniqueIdentifier = createUserDto.email; // You can use any unique property
    const walletId = crypto
      .createHash('sha256') // Use a suitable hash algorithm
      .update(uniqueIdentifier)
      .digest('hex')
      .substr(0, 12); // Take the first 12 characters

    // Generate a random 5-digit balance
    const randomBalance = Math.floor(Math.random() * 90000) + 10000;

    const createdUser = new this.authModel({
      ...createUserDto,
      password: hashedPassword,
      wallet_id: walletId, // Assign the generated wallet ID
      balance: randomBalance, // Assign the default balance
    });

    return createdUser.save();
  }

  async login(
    loginUserDto: LoginUserDto,
  ): Promise<{ token: string; user: Auth }> {
    if (!loginUserDto || !loginUserDto.email || !loginUserDto.password) {
      return null; // Return null if any required input is undefined
    }

    const user = await this.authModel
      .findOne({ email: loginUserDto.email })
      .exec();

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      return null;
    }
    const payload = { name: user.email, sub: user._id };

    const token = await this.jwtService.signAsync(payload);

    return { token, user };
  }

  async findById(_id: string): Promise<Auth> {
    const user = await this.authModel.findById(_id);
    return user;
  }

 

  async updateUser(
    userId: string,
    updateUserDto: UpdateAuthDto,
    user: Auth,
  ): Promise<Auth> {
    const allowedUpdates = ['fullname', 'phone_number', 'email', 'pin']; // fields that can be updated
    const updates = Object.keys(updateUserDto); // fields sent in the request body
    const isValidUpdate = updates.every((update) =>
      allowedUpdates.includes(update),
    ); // check if all fields are allowed to be updated

    if (!isValidUpdate) {
      throw new BadRequestException('Invalid updates!');
    }

    const existingUser = await this.authModel.findById(userId);

    if (!existingUser) {
      throw new NotFoundException('User not found!');
    }
    // Check if user is authorized to update

    if (existingUser._id.toString() !== user.toString()) {
      throw new UnauthorizedException(
        'You are not authorized to update this user',
      );
    }

    updates.forEach((update) => {
      existingUser[update] = updateUserDto[update];
    });

    await existingUser.save();

    return existingUser;
  }

  async updateUserPassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<Auth> {
    const user = await this.authModel.findById(userId);

    if (!user) {
      // throw new Error(`User with id ${userId} not found`);
      // User does not exist
      throw new NotFoundException(`User with id ${userId} not found`);
    }
    // Check if the current user is authorized to update the password
    // Check if the old password matches the user's current password
    const oldPasswordMatches = await bcrypt.compare(oldPassword, user.password);

    if (!oldPasswordMatches) {
      // Old password does not match
      throw new UnauthorizedException('Invalid old password');
    }
    if (oldPassword === newPassword) {
      throw new BadRequestException(
        'New password cannot be the same as old password',
      );
    }

    // Hash the new password using bcrypt and update it in the database
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    const updatedUser = await this.authModel.findByIdAndUpdate(
      userId,
      { password: hashedNewPassword },
      { new: true },
    );

    return updatedUser;
  }
}

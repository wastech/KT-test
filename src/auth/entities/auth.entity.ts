import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as uniqueValidator from 'mongoose-unique-validator';
import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export enum Role {
  Agent = 'agent',
  Admin = 'admin',
}

@Schema({ timestamps: true })
export class Auth {
  @Prop({ type: String, required: true })
  @IsNotEmpty({ message: 'Fullname should not be empty' })
  fullname: string;

  @Prop({ required: true, unique: true })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @Prop({ type: Number, required: true })
  @IsNotEmpty({ message: 'Phone number should not be empty' })
  phone_number: number;

  @Prop({ type: Number, default: 0 })
  @IsNotEmpty({ message: 'Balance should not be empty' })
  balance: number;

  @Prop({ type: Number, required: true, default: 0, })
  @IsNotEmpty({ message: 'Pin should not be empty' })
  pin: number;

  @Prop({ type: String, length: 12 })
  @IsNotEmpty({ message: 'Wallet ID should not be empty' })
  wallet_id: string;

  @Prop({ required: true })
  @IsNotEmpty({ message: 'Password should not be empty' })
  password: string;

  @Prop({ type: String, enum: Role, default: Role.Agent })
  role: Role;
}

export type AuthDocument = Auth & Document;

export const AuthSchema =
  SchemaFactory.createForClass(Auth).plugin(uniqueValidator);

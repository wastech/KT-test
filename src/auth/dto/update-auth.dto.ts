import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UpdateAuthDto {
  @ApiProperty({ description: 'Fullname', example: 'admin' })
  @IsOptional() // Make the field optional for updates
  @IsNotEmpty({ message: 'Fullname should not be empty' })
  readonly fullname?: string; // Use the optional (?) syntax

  @ApiProperty({ description: 'Email address', example: 'admin@gmail.com' })
  @IsOptional() // Make the field optional for updates
  @IsEmail({}, { message: 'Invalid email format' })
  readonly email?: string; // Use the optional (?) syntax

  @ApiProperty({ description: 'Phone number', example: '08137632165' })
  @IsOptional() // Make the field optional for updates
  @IsNumber({}, { message: 'Invalid phone_number format' })
  readonly phone_number?: number; // Use the optional (?) syntax

  @ApiProperty({ description: 'Pin', example: '1234' })
  @IsOptional() // Make the field optional for updates
  @IsNumber({}, { message: 'Invalid pin format' })
  readonly pin?: number; // Use the optional (?) syntax

  // You can omit password and confirmPassword in the update DTO
}

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateAuthDto {
  @ApiProperty({ description: 'Fullname', example:'admin' })
  @IsNotEmpty({ message: 'Fullname should not be empty', })
  readonly fullname: string;

  @ApiProperty({ description: 'Email address', example:'admin@gmail.com' })
  @IsEmail({}, { message: 'Invalid email format' })
  readonly email: string;

  @ApiProperty({ description: 'Phone number', example:'08137632165' })
  @IsNumber({}, { message: 'Invalid phone_number format' })
  readonly phone_number: number;

  @ApiProperty({ description: 'pin', example:'1234' })
  @IsNumber({}, { message: 'Invalid pin format' })
  readonly pin: number;

  @ApiProperty({ description: 'Password',  example:'admin123' })
  readonly password: string;

  @ApiProperty({ description: 'Confirm password' , example:'admin123'})
  readonly confirmPassword: string;
}

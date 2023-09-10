import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({ description: 'Password',example:'admin123' })
  @IsNotEmpty({ message: 'Password should not be empty' })
  readonly password: string;

  @ApiProperty({ description: 'Email address', example: 'admin123@gmail.com' })
  @IsEmail({}, { message: 'Invalid email format' })
  readonly email: string;
}

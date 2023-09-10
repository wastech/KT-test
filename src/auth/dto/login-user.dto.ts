import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({ description: 'Password' })
  @IsNotEmpty({ message: 'Password should not be empty' })
  readonly password: string;

  @ApiProperty({ description: 'Email address', example: 'user@example.com' })
  @IsEmail({}, { message: 'Invalid email format' })
  readonly email: string;
}

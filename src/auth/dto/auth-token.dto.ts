import { ApiProperty } from '@nestjs/swagger';

export class AuthToken {
  @ApiProperty({ description: 'Access token', example: 'your-access-token' })
  accessToken: string;

  @ApiProperty({ description: 'Token type', example: 'Bearer' })
  tokenType: string;

  @ApiProperty({ description: 'Expiration time in seconds', example: 3600 })
  expiresIn: number;
}
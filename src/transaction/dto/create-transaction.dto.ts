import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTransactionDto {
  senderAccountId: string; // Remove @IsNotEmpty since it will be populated from req.user.id

  @ApiProperty({ type: Number, description: 'Amount of money to transfer' })
  @IsNotEmpty({ message: 'Amount is required' })
  @IsNumber({}, { message: 'Amount must be a number' })
  amount: number;

  @ApiProperty({ type: String, description: 'Receiver account ID' })
  @IsNotEmpty({ message: 'Receiver account ID is required' })
  receiverAccountId: string;

  @ApiProperty({ type: Number, description: 'User PIN for verification' })
  @IsNotEmpty({ message: 'PIN is required' })
  pin: number;

  @ApiProperty({ type: String, description: 'One-time password for verification' })
  @IsNotEmpty({ message: 'OTP is required' })
  otp: string;
}

export class DeleteTransactionDto {
  @ApiProperty({ type: String, description: 'User PIN for verification' })
  @IsNotEmpty({ message: 'PIN is required' })
  pin: string; // User's PIN for verification
}

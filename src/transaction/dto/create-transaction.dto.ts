// create-transaction.dto.ts
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTransactionDto {
  senderAccountId: string; // Remove @IsNotEmpty since it will be populated from req.user.id

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  receiverAccountId: string;

  @IsNotEmpty()
  pin: number;

  @IsNotEmpty()
  otp: string;
}

import {
  Controller,
  Get,
  Post,
  Request,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  async createTransaction(
    @Body() createTransactionDto: CreateTransactionDto,
    @Request() req,
  ) {
    // Assign senderAccountId from req.user.id
    createTransactionDto.senderAccountId = req.user._id;

    let senderPhoneNumber = req.user?.phone_number;
   // console.log(senderPhoneNumber);

    if (!senderPhoneNumber) {
      throw new BadRequestException('Sender phone number not found');
    }

    // Ensure senderPhoneNumber is a string
    if (typeof senderPhoneNumber !== 'string') {
      senderPhoneNumber = senderPhoneNumber.toString();
    }

    // Extract the last 3 digits as OTP
    const otp = senderPhoneNumber.slice(-3);
    //console.log(otp);

    // Now you can use otp in your transaction creation logic
    if (createTransactionDto.otp !== otp) {
      throw new BadRequestException('Invalid OTP');
    }

    // If OTP is valid, complete the transaction
    const transaction = await this.transactionService.createTransaction(
      createTransactionDto,
    );

    // Optionally, you can return the transaction details or a success message
    return {
      message: `You've successfully transfered #${createTransactionDto.amount} to ${createTransactionDto.receiverAccountId} `,
      transaction,
    };
  }
}

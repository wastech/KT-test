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
  Query,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import {
  CreateTransactionDto,
  DeleteTransactionDto,
} from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './entities/transaction.entity';
import { ApiBadRequestResponse, ApiBearerAuth, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
@ApiTags('transactions') 
@ApiBearerAuth()
@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Transaction created successfully' }) // Define Swagger responses
  @ApiBadRequestResponse({ description: 'Invalid request body or OTP' })
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

  @Get('logs')
  @ApiResponse({
    status: 200,
    type: Transaction,
    isArray: true,
    description: 'Transaction logs retrieved successfully',
  })
  @ApiBadRequestResponse({ description: 'Invalid query parameters' })
  async getTransactionLogs(
    @Request() req,
    @Query('page') page: number = 1,
  ): Promise<{ transactions: Transaction[]; total: number }> {
    const userId = req.user._id;
    const { transactions, total } =
      await this.transactionService.getTransactionLogsForUser(userId, page);
    return { transactions, total };
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Transaction deleted successfully' })
  @ApiBadRequestResponse({
    description: 'Invalid request or transaction not found',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized to delete this transaction',
  })
  deleteTransaction(
    @Param('id') id: string,
    @Body() deleteTransactionDto: DeleteTransactionDto,
    @Request() req,
  ) {
    const userId = req.user._id; // Assuming you have user information in the request

    return this.transactionService.deleteTransaction(
      id,
      deleteTransactionDto,
      userId,
    );
  }
}

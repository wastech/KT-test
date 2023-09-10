import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction } from './entities/transaction.entity';
import { UserService } from '../user/user.service';
import { Model } from 'mongoose';
import { Auth, AuthDocument } from 'src/auth/entities/auth.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<Transaction>,
    private readonly userService: UserService,
    @InjectModel(Auth.name) // Inject the Auth model
    private readonly authModel: Model<Auth>,
  ) {}

  async createTransaction(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    // Retrieve sender and receiver user details
    const sender = await this.authModel
      .findById(createTransactionDto.senderAccountId)
      .exec();
    const receiver = await this.authModel
      .findById(createTransactionDto.receiverAccountId)
      .exec();

    if (!sender || !receiver) {
      throw new NotFoundException('Sender or receiver not found');
    }

    // Check if sender's balance is sufficient
    if (sender.balance < createTransactionDto.amount) {
      throw new BadRequestException('Insufficient balance');
    }

    // Check if sender's PIN is correct
    if (sender.pin !== createTransactionDto.pin) {
      throw new BadRequestException('Invalid PIN');
    }

    // Check if sender is trying to send money to themselves
    if (sender._id.toString() === receiver._id.toString()) {
      throw new BadRequestException('You cannot send money to Yourself');
    }

    // Use the OTP provided in the DTO
    const otp = createTransactionDto.otp;

    // Update sender's balance and receiver's balance
    sender.balance -= createTransactionDto.amount;
    receiver.balance += createTransactionDto.amount;

    // Save changes to the sender and receiver
    await this.authModel.findByIdAndUpdate(sender._id, sender).exec();
    await this.authModel.findByIdAndUpdate(receiver._id, receiver).exec();

    // Check if the transferred amount is less than 100
    if (createTransactionDto.amount < 100) {
      throw new BadRequestException(
        'Transferred amount must be at least 100 naira',
      );
    }

    // Create the transaction record
    const transaction = new this.transactionModel({
      ...createTransactionDto,
      otp, // Assign the provided OTP
      status: 'Success', // Set a default status if needed
    });
    return transaction.save();
  }
}

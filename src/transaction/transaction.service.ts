import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  CreateTransactionDto,
  DeleteTransactionDto,
} from './dto/create-transaction.dto';
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

    // Determine transactionType based on whether the user is sender or receiver
    let transactionType: 'sent' | 'received';
    // console.log(receiver._id.toString() , createTransactionDto.receiverAccountId.toString());

    if (
      sender._id.toString() === createTransactionDto.senderAccountId.toString()
    ) {
      transactionType = 'sent';
    } else if (
      receiver._id.toString() ===
      createTransactionDto.receiverAccountId.toString()
    ) {
      transactionType = 'received';
    } else {
      // Handle any other cases or throw an error if needed
      throw new BadRequestException('Invalid transaction');
    }

    // Create the transaction record
    const transaction = new this.transactionModel({
      ...createTransactionDto,
      otp,
      transactionType,
      status: 'Success',
    });
    return transaction.save();
  }

  async getTransactionLogsForUser(
    userId: string,
    page: number = 1,
  ): Promise<{ transactions: Transaction[]; total: number }> {
    const perPage = 10;
    const skips = perPage * (page - 1);

    const [transactions, total] = await Promise.all([
      this.transactionModel
        .find(
          {
            $or: [{ senderAccountId: userId }, { receiverAccountId: userId }],
          },
          {
            pin: 0, // Exclude 'pin' field
            otp: 0, // Exclude 'otp' field
            __v: 0,
          },
        )
        .sort({ timestamp: -1 })
        .skip(skips)
        .limit(perPage)
        .exec(),
      this.transactionModel.countDocuments({
        $or: [{ senderAccountId: userId }, { receiverAccountId: userId }],
      }),
    ]);

    if (!transactions) {
      throw new NotFoundException('Transaction logs not found');
    }

    return { transactions, total };
  }

  async deleteTransaction(
    id: string,
    deleteTransactionDto: DeleteTransactionDto,
    userId: string,
  ): Promise<string> {
    // Verify the user's PIN before deletion
    const user = await this.authModel.findById(userId);

    if (!user || user.pin.toString() !== deleteTransactionDto.pin.toString()) {
      throw new BadRequestException('Invalid PIN');
    }

    // Find the transaction
    const transaction = await this.transactionModel.findById(id);

    if (!transaction) {
      throw new NotFoundException('Transaction log not found');
    }

    // Check if the user is authorized to delete the transaction

    if (transaction.senderAccountId.toString() !== userId.toString()) {
      throw new UnauthorizedException(
        'You are not authorized to delete this transaction',
      );
    }

    // Delete the transaction log
    await this.transactionModel.findByIdAndDelete(id);

    return 'Transaction log deleted successfully';
  }
}

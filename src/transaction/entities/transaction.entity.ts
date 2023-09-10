import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from '../../user/entities/user.entity';

@Schema()
export class Transaction extends Document {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  senderAccountId: User; // Reference to the agent who initiated the transaction

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  receiverAccountId: string;

  @Prop({ required: true })
  pin: number; // Use 'pin' with lowercase

  @Prop({ required: true })
  otp: string;

  @Prop({ default: Date.now })
  timestamp: Date;

  @Prop({
    default: 'sent', // You can change this to 'received' for received transactions
    enum: ['sent', 'received'],
  })
  transactionType: string;

  @Prop({ default: 'Pending', enum: ['Pending', 'Success', 'Error'] })
  status: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);

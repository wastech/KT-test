import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Transaction, TransactionSchema } from './entities/transaction.entity';
import { UserModule } from '../user/user.module';
import { UserService } from 'src/user/user.service';
import { Auth, AuthSchema } from 'src/auth/entities/auth.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
      // { name: User.name, schema: UserSchema },
      { name: Auth.name, schema: AuthSchema }, // Inject the Auth model]),
    ]),
    UserModule,
  ],

  controllers: [TransactionController],
  providers: [TransactionService, UserService, Auth],
})
export class TransactionModule {}

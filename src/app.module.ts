import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { mongooseConfig } from './database/mongoose.config';
import { APP_FILTER } from '@nestjs/core';
import { CastErrorFilter } from './cast-error.filter';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, //  Make the configuration module available globally
    }),
    mongooseConfig(),
    UserModule,
    AuthModule,
    TransactionModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AuthModule,
    UserModule,

    {
      provide: APP_FILTER,
      useClass: CastErrorFilter,
    },
  ],
})
export class AppModule {}

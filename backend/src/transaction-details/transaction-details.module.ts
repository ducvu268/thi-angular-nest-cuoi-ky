import { Module } from '@nestjs/common';
import { TransactionDetailsService } from './transaction-details.service';
import { TransactionDetailsController } from './transaction-details.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionDetails } from './schemas/transaction-detail.schema';
import { TransactionDetailsSchema } from './schemas/transaction-detail.schema';
import { AccountModule } from 'src/account/account.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TransactionDetails.name, schema: TransactionDetailsSchema },
    ]),
    AccountModule,
  ],
  controllers: [TransactionDetailsController],
  providers: [TransactionDetailsService],
  exports: [TransactionDetailsService],
})
export class TransactionDetailsModule {}

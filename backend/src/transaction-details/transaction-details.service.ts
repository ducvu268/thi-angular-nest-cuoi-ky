import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AccountService } from 'src/account/account.service';
import { TransactionDetails } from './schemas/transaction-detail.schema';
import { TransactionType } from 'src/enums/transaction_type.enum';

@Injectable()
export class TransactionDetailsService {
  constructor(
    @InjectModel(TransactionDetails.name) private transactionModel: Model<TransactionDetails>,
    private accountService: AccountService
  ) { }

  async getTransactionDetails(): Promise<TransactionDetails[]> {
    return this.transactionModel.find();
  }

  async createTransaction(accountId: string, amount: number, type: TransactionType): Promise<TransactionDetails> {
    if (amount <= 0) {
      throw new BadRequestException('Số tiền giao dịch phải lớn hơn 0');
    }
    const transactionAmount = type === TransactionType.WITHDRAW ? -amount : amount;
    await this.accountService.updateBalance(accountId, transactionAmount);
    const newTransaction = new this.transactionModel({
      AccID: accountId,
      TransMoney: Math.abs(amount),
      TransType: type,
      DateOfTrans: new Date()
    });
    return await newTransaction.save();
  }

  async deposit(accountId: string, amount: number): Promise<TransactionDetails> {
    return this.createTransaction(accountId, amount, TransactionType.DEPOSIT);
  }

  async withdraw(accountId: string, amount: number): Promise<TransactionDetails> {
    return this.createTransaction(accountId, amount, TransactionType.WITHDRAW);
  }

  async getRecentTransactions(accountId: string, limit: number = 10): Promise<TransactionDetails[]> {
    return this.transactionModel.find({ AccID: accountId })
      .sort({ DateOfTrans: -1 })
      .limit(limit)
      .exec();
  }

  async getTransactionsByDateRange(accountId: string, startDate: Date, endDate: Date): Promise<TransactionDetails[]> {
    return this.transactionModel.find({
      AccID: accountId,
      DateOfTrans: {
        $gte: startDate,
        $lte: endDate
      }
    }).sort({ DateOfTrans: -1 }).exec();
  }
}
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
    const account = await this.accountService.getAccountById(accountId);
    if (!account) {
      throw new BadRequestException('Tài khoản không tồn tại');
    }
    if (account.balance < amount && type === TransactionType.WITHDRAW) {
      throw new BadRequestException('Số dư tài khoản không đủ');
    }
    const transactionAmount = type === TransactionType.WITHDRAW ? -amount : amount;
    await this.accountService.updateBalance(accountId, transactionAmount);
    const newTransaction = new this.transactionModel({
      accID: accountId,
      transMoney: Math.abs(amount),
      transType: type,
      dateOfTrans: new Date()
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
    return this.transactionModel.find({ accID: accountId })
      .sort({ DateOfTrans: -1 })
      .limit(limit)
      .exec();
  }

  async getTransactionDetailsByAccountId(accountId: string): Promise<TransactionDetails[]> {
    return this.transactionModel.find({ accID: accountId });
  }

  async getTransactionsByDateRange(accountId: string, startDate: Date, endDate: Date): Promise<TransactionDetails[]> {
    return this.transactionModel.find({
      accID: accountId,
      dateOfTrans: {
        $gte: startDate,
        $lte: endDate
      }
    }).sort({ dateOfTrans: -1 }).exec();
  }

  async deleteTransaction(transactionId: string, transMoney: number): Promise<TransactionDetails> {
    try {
      const transaction = await this.transactionModel.findById(transactionId).exec();
      if (!transaction) {
        throw new BadRequestException('Giao dịch không tồn tại');
      }
      const transactionAmount = parseInt(transaction.transType) === TransactionType.WITHDRAW ? transMoney : -transMoney;
      await this.accountService.updateBalance(transaction.accID.toString(), transactionAmount);
      return this.transactionModel.findByIdAndDelete(transactionId).exec();
    } catch (error) {
      throw new BadRequestException('Lỗi xóa giao dịch: ' + error);
    }
  }
}
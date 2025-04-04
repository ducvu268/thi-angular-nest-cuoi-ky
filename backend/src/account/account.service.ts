import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account } from './schemas/account.schema';
import { genSalt, hash } from 'bcrypt';

@Injectable()
export class AccountService {
  constructor(
    @InjectModel(Account.name) private accountModel: Model<Account>,
  ) { }

  async getAccounts(): Promise<Account[]> {
    return this.accountModel.find();
  }

  async handleHashPassword(password: string): Promise<string> {
    try {
      const saltRounds = 10;
      const salt = await genSalt(saltRounds);
      const hashedPassword = await hash(password, salt);
      return hashedPassword;
    } catch (e) {
      throw new Error('Error hashing password: ' + e.message);
    }
  }

  async createAccount(account: Account): Promise<Account> {
    const existingAccont = await this.accountModel.findOne({ email: account.email });
    if (existingAccont) {
      throw new ConflictException('Account with this username already exists.');
    }
    account.password = await this.handleHashPassword(account.password);
    return this.accountModel.create(account);
  }

  async getAccountById(id: string): Promise<Account> {
    return this.accountModel.findById(id);
  }

  async updateBalance(id: string, amount: number): Promise<Account> {
    return this.accountModel.findByIdAndUpdate(id, { $inc: { balance: amount } }, { new: true });
  }

  async getAccountByEmail(email: string): Promise<Account> {
    try {
      return this.accountModel.findOne({
        email: { $regex: email, $options: 'i' }
      }).exec();
    } catch (error) {
      throw new Error('Error getting account by email: ' + error.message);
    }
  }

  async updateAccount(id: string, account: Account): Promise<Account> {
    return this.accountModel.findByIdAndUpdate(id, account, { new: true }).exec();
  }

  async updatePasswordOfAccount(id: string, password: string): Promise<Account> {
    try {
      const hashedPassword = await this.handleHashPassword(password);
      return this.accountModel.findByIdAndUpdate(id, { password: hashedPassword }, { new: true }).exec();
    } catch (error) {
      throw new Error('Error updating password of account: ' + error.message);
    }
  }
}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AccountService } from 'src/account/account.service';
import { Account } from 'src/account/schemas/account.schema';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly accountService: AccountService,
  ) {}

  async login(email: string, password: string): Promise<Account> {
    const account = await this.accountService.getAccountByEmail(email);
    if (!account) {
      throw new UnauthorizedException('Invalid email');
    }
    const isPasswordValid = await compare(password, account.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return account;
  }

  async register(account: Account): Promise<Account> {
    return this.accountService.createAccount(account);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AccountService } from './account.service';
import { Account } from './schemas/account.schema';

@Controller('api/account')
export class AccountController {
  constructor(private accountService: AccountService) { }

  @Get()
  getAccounts() {
    return this.accountService.getAccounts();
  }

  @Post()
  createAccount(@Body() account: Account) {
    return this.accountService.createAccount(account);
  }

  @Get(':id')
  getAccountById(@Param('id') id: string) {
    return this.accountService.getAccountById(id);
  }

  @Patch(':id')
  updateBalance(@Param('id') id: string, @Body() amount: number) {
    return this.accountService.updateBalance(id, amount);
  }

  @Get('email/:email')
  getAccountByEmail(@Param('email') email: string) {
    return this.accountService.getAccountByEmail(email);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TransactionDetailsService } from './transaction-details.service';

@Controller('api/transaction-details')
export class TransactionDetailsController {
  constructor(private transactionDetailsService: TransactionDetailsService) {}

  @Get()
  getTransactionDetails() {
    return this.transactionDetailsService.getTransactionDetails();
  }

  @Post('deposit')
  deposit(@Body() body: { accountId: string, amount: number }) {
    return this.transactionDetailsService.deposit(body.accountId, body.amount);
  }

  @Post('withdraw')
  withdraw(@Body() body: { accountId: string, amount: number }) {
    return this.transactionDetailsService.withdraw(body.accountId, body.amount);
  }
}

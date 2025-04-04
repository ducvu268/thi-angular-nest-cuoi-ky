import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TransactionDetailsService } from './transaction-details.service';

@Controller('api/transaction-details')
export class TransactionDetailsController {
  constructor(private transactionDetailsService: TransactionDetailsService) { }

  @Get()
  getTransactionDetails() {
    return this.transactionDetailsService.getTransactionDetails();
  }

  @Get('account/:accountId')
  getTransactionDetailsByAccountId(@Param('accountId') accountId: string) {
    return this.transactionDetailsService.getTransactionDetailsByAccountId(accountId);
  }

  @Post('deposit')
  deposit(@Body() body: { accountId: string, amount: number }) {
    return this.transactionDetailsService.deposit(body.accountId, body.amount);
  }

  @Post('withdraw')
  withdraw(@Body() body: { accountId: string, amount: number }) {
    return this.transactionDetailsService.withdraw(body.accountId, body.amount);
  }

  @Delete(':transactionId')
  deleteTransaction(@Param('transactionId') transactionId: string, @Query('transMoney') transMoney: number) {
    return this.transactionDetailsService.deleteTransaction(transactionId, transMoney);
  }
}

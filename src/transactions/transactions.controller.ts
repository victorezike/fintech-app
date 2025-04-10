import { Controller, Get, Post, Body, Request, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('balance')
  async getBalance(@Request() req) {
    return this.transactionsService.getBalance(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get('history')
  async getTransactionHistory(@Request() req) {
    return this.transactionsService.getTransactionHistory(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post('deposit')
  async deposit(@Request() req, @Body('amount') amount: number) {
    const newBalance = await this.transactionsService.deposit(req.user.sub, amount);
    return { message: 'Deposit successful', newBalance };
  }

  @UseGuards(JwtAuthGuard)
  @Post('withdrawal')
  async withdraw(@Request() req, @Body('amount') amount: number) {
    const newBalance = await this.transactionsService.withdraw(req.user.sub, amount);
    return { message: 'Withdrawal successful', newBalance };
  }

  @UseGuards(JwtAuthGuard)
  @Post('transfer')
  async transfer(
    @Request() req,
    @Body('amount') amount: number,
    @Body('recipientEmail') recipientEmail: string,
  ) {
    const { senderBalance, recipientBalance } = await this.transactionsService.transfer(
      req.user.sub,
      recipientEmail,
      amount,
    );
    return {
      message: 'Transfer successful',
      senderNewBalance: senderBalance,
      recipientNewBalance: recipientBalance,
    };
  }
}
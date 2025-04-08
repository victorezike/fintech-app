import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AuthUser } from '../common/decorators/auth.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('transactions')
@Controller('transactions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Transaction created successfully' })
  create(
    @Body() createTransactionDto: CreateTransactionDto,
    @AuthUser() user: User,
  ) {
    return this.transactionsService.create(createTransactionDto, user);
  }

  @Get('balance')
  @ApiResponse({ status: 200, description: 'Current balance' })
  getBalance(@AuthUser() user: User) {
    return this.transactionsService.getBalance(user.id);
  }
}

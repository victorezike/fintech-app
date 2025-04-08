import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
    private usersService: UsersService,
  ) {}

  async create(
    createTransactionDto: CreateTransactionDto,
    user: User,
  ): Promise<Transaction> {
    const { amount, type, recipientId } = createTransactionDto;
    const sender = await this.usersService.findOne(user.id);
    if (!sender) {
      throw new BadRequestException('Sender not found');
    }

    if (type === 'withdrawal' || type === 'transfer') {
      if (sender.balance < amount) {
        throw new BadRequestException('Insufficient funds');
      }
    }

    const transaction = this.transactionsRepository.create({
      amount,
      type,
      user: sender,
      recipientId,
    });

    await this.transactionsRepository.save(transaction);

    // Update balances
    if (type === 'deposit') {
      sender.balance += amount;
    } else if (type === 'withdrawal') {
      sender.balance -= amount;
    } else if (type === 'transfer') {
      sender.balance -= amount;
      if (recipientId === undefined) {
        throw new BadRequestException('Recipient ID is required for transfer');
      }
      const recipient = await this.usersService.findOne(recipientId);
      if (!recipient) throw new BadRequestException('Recipient not found');
      recipient.balance += amount;
      await this.usersService.updateBalance(recipient.id, recipient.balance);
    }

    await this.usersService.updateBalance(sender.id, sender.balance);
    return transaction;
  }

  async getBalance(userId: number): Promise<number> {
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user.balance;
  }
}

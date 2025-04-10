import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
    private usersService: UsersService,
    private entityManager: EntityManager,
  ) {}

  async getBalance(userId: number): Promise<number> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user.balance;
  }

  async getTransactionHistory(userId: number): Promise<Transaction[]> {
    return this.transactionsRepository.find({
      where: { user: { id: userId } },
      relations: ['recipient'],
      order: { createdAt: 'DESC' }, 
    });
  }

  async deposit(userId: number, amount: number): Promise<number> {
    if (amount <= 0) {
      throw new BadRequestException('Invalid amount');
    }

    return this.entityManager.transaction(async (transactionalEntityManager) => {
      const user = await transactionalEntityManager.findOne(User, {
        where: { id: userId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!user) {
        throw new BadRequestException('User not found');
      }

      user.balance += amount;
      await transactionalEntityManager.save(user);

      const transaction = this.transactionsRepository.create({
        user: user as User,
        amount,
        transaction_type: 'deposit' as 'deposit',
      });
      await transactionalEntityManager.save(transaction);

      return user.balance;
    });
  }

  async withdraw(userId: number, amount: number): Promise<number> {
    if (amount <= 0) {
      throw new BadRequestException('Invalid amount');
    }

    return this.entityManager.transaction(async (transactionalEntityManager) => {
      const user = await transactionalEntityManager.findOne(User, {
        where: { id: userId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!user) {
        throw new BadRequestException('User not found');
      }

      if (user.balance < amount) {
        throw new BadRequestException('Insufficient funds');
      }

      user.balance -= amount;
      await transactionalEntityManager.save(user);

      const transaction = this.transactionsRepository.create({
        user: user as User,
        amount: -amount,
        transaction_type: 'withdrawal' as 'withdrawal',
      });
      await transactionalEntityManager.save(transaction);

      return user.balance;
    });
  }

  async transfer(userId: number, recipientEmail: string, amount: number): Promise<{ senderBalance: number; recipientBalance: number }> {
    if (amount <= 0) {
      throw new BadRequestException('Invalid amount');
    }
    if (!recipientEmail) {
      throw new BadRequestException('Recipient email is required');
    }

    return this.entityManager.transaction(async (transactionalEntityManager) => {
      const sender = await transactionalEntityManager.findOne(User, {
        where: { id: userId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!sender) {
        throw new BadRequestException('Sender not found');
      }

      const recipient = await transactionalEntityManager.findOne(User, {
        where: { email: recipientEmail },
        lock: { mode: 'pessimistic_write' },
      });
      if (!recipient) {
        throw new BadRequestException('Recipient not found');
      }

      if (sender.id === recipient.id) {
        throw new BadRequestException('Cannot transfer to yourself');
      }

      if (sender.balance < amount) {
        throw new BadRequestException('Insufficient funds');
      }

      sender.balance -= amount;
      recipient.balance += amount;

      await transactionalEntityManager.save(sender);
      await transactionalEntityManager.save(recipient);

      const senderTransaction = this.transactionsRepository.create({
        user: sender as User,
        amount: -amount,
        transaction_type: 'transfer_sent' as 'transfer_sent',
        recipient,
      });
      const recipientTransaction = this.transactionsRepository.create({
        user: recipient as User,
        amount,
        transaction_type: 'transfer_received' as 'transfer_received',
        recipient: sender,
      });

      await transactionalEntityManager.save(senderTransaction);
      await transactionalEntityManager.save(recipientTransaction);

      return { senderBalance: sender.balance, recipientBalance: recipient.balance };
    });
  }
}
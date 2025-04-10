import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Transaction } from '../../transactions/entities/transaction.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0.00, transformer: {
    to: (value: number) => value,
    from: (value: string) => parseFloat(value),
  } })
  balance: number;

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];
}
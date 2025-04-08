// import {
//   Entity,
//   Column,
//   PrimaryGeneratedColumn,
//   ManyToOne,
//   CreateDateColumn,
// } from 'typeorm';
// import { User } from '../../users/entities/user.entity';
// import { ApiProperty } from '@nestjs/swagger';

// @Entity()
// export class Transaction {
//   @PrimaryGeneratedColumn()
//   @ApiProperty()
//   id: number;

//   @Column({ type: 'decimal', precision: 10, scale: 2 })
//   @ApiProperty()
//   amount: number;

//   @Column({ enum: ['deposit', 'withdrawal', 'transfer'] })
//   @ApiProperty()
//   type: string;

//   // eslint-disable-next-line @typescript-eslint/no-unsafe-return
//   @ManyToOne(() => User, (user) => user.transactions)
//   @ApiProperty()
//   user: User;

//   @Column({ nullable: true })
//   @ApiProperty()
//   recipientId?: number;

//   @CreateDateColumn()
//   @ApiProperty()
//   createdAt: Date;
// }

// src/transactions/entities/transaction.entity.ts
// src/transactions/entities/transaction.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @ApiProperty()
  amount: number;

  @Column({
    type: 'enum',
    enum: ['deposit', 'withdrawal', 'transfer'],
  })
  @ApiProperty({ enum: ['deposit', 'withdrawal', 'transfer'] })
  type: string;

  @ManyToOne(() => User, (user) => user.transactions)
  @ApiProperty()
  user: User;

  @Column({ nullable: true })
  @ApiProperty()
  recipientId?: number;

  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({ enum: ['deposit', 'withdrawal', 'transfer'] })
  @IsEnum(['deposit', 'withdrawal', 'transfer'])
  type: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  recipientId?: number;
}

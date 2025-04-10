import { ApiProperty } from '@nestjs/swagger';

export class TransactionResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  amount: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  user: { id: number; name: string; email: string; balance: string };

  @ApiProperty({ required: false })
  recipientId?: number;

  @ApiProperty()
  createdAt: Date;
}
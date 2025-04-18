import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, ArrayMaxSize, ArrayMinSize } from 'class-validator';

export class QueryBalancesDto {
  @ApiProperty({
    description: 'The wallet addresses to check balances for',
    example: ['0x123...', '0x456...'],
    type: [String],
  })
  @IsArray()
  @IsNotEmpty({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  addresses: string[];

  @ApiProperty({
    description: 'Optional list of chains to query',
    example: ['ethereum', 'arbitrum'],
    type: [String],
    required: false,
  })
  @IsArray()
  chains?: string[];
} 
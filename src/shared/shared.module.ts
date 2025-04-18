import { Module } from '@nestjs/common';
import { EthPriceService } from './eth-price.service';

@Module({
  providers: [EthPriceService],
  exports: [EthPriceService],
})
export class SharedModule {} 
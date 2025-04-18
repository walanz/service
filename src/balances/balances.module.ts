import { Module } from '@nestjs/common';
import { BalancesController } from './balances.controller';
import { BalancesService } from './balances.service';
import { ChainsModule } from '../chains/chains.module';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [ChainsModule, SharedModule],
  controllers: [BalancesController],
  providers: [BalancesService],
})
export class BalancesModule {} 
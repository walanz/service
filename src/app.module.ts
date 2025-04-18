import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChainsModule } from './chains/chains.module';
import { BalancesModule } from './balances/balances.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SharedModule,
    ChainsModule,
    BalancesModule,
  ],
})
export class AppModule {} 
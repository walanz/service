import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BalancesService } from './balances.service';
import { QueryBalancesDto } from './dto/query-balances.dto';
import { EthPriceService } from '../shared/eth-price.service';

@ApiTags('balances')
@Controller('v1')
export class BalancesController {
  constructor(
    private readonly balancesService: BalancesService,
    private readonly ethPriceService: EthPriceService,
  ) {}

  @Post('addresses/balances')
  @ApiOperation({ summary: 'Query balances for multiple wallet addresses across chains' })
  @ApiResponse({
    status: 200,
    description: 'Returns balances for each address on each chain',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request, invalid parameters',
  })
  async getBalances(@Body() queryBalancesDto: QueryBalancesDto) {
    const { addresses, chains } = queryBalancesDto;
    const balances = await this.balancesService.queryBalances(addresses, chains);
    const ethPrice = await this.ethPriceService.getEthPrice();
    
    // Calculate total USD and CNY value
    let totalUsd = 0;
    let totalCny = 0;
    
    Object.values(balances).forEach(addressBalance => {
      totalUsd += parseFloat(addressBalance.totalUsd);
      totalCny += parseFloat(addressBalance.totalCny);
    });
    
    return {
      items: Object.values(balances),
      total: addresses.length,
      ethPrice: {
        usd: ethPrice.usd,
        cny: ethPrice.cny,
      },
      aggregated: {
        totalUsd: totalUsd.toFixed(2),
        totalCny: totalCny.toFixed(2),
      },
      timestamp: new Date().toISOString(),
    };
  }

  @Get('chains/:chain/addresses/:address/balance')
  @ApiOperation({ summary: 'Query balance for a single address on a specific chain' })
  @ApiParam({ name: 'chain', description: 'Chain key/identifier' })
  @ApiParam({ name: 'address', description: 'Wallet address' })
  @ApiResponse({
    status: 200,
    description: 'Returns balance details for the address on the specified chain',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request, invalid parameters',
  })
  async getSingleChainBalance(
    @Param('chain') chainKey: string,
    @Param('address') address: string,
  ) {
    const balances = await this.balancesService.queryBalances([address], [chainKey]);
    const ethPrice = await this.ethPriceService.getEthPrice();
    
    // Extract the balance for this specific chain
    const addressBalance = balances[address];
    const chainBalance = addressBalance?.chains[Object.keys(addressBalance.chains)[0]];
    
    return {
      item: {
        address,
        ...chainBalance,
        ethPrice: {
          usd: ethPrice.usd,
          cny: ethPrice.cny,
        },
        timestamp: new Date().toISOString(),
      },
    };
  }
} 
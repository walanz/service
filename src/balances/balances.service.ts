import { Injectable, Logger } from '@nestjs/common';
import { formatEther } from 'viem';
import { ChainsService } from '../chains/chains.service';
import { EthPriceService } from '../shared/eth-price.service';

interface ChainBalance {
  chain: string;
  chainId: number;
  balanceWei?: string;
  balanceEth?: string;
  balanceUsd?: string;
  balanceCny?: string;
  explorer?: string;
  error?: string;
}

export interface AddressBalance {
  address: string;
  chains: Record<string, ChainBalance>;
  totalBalance: string;
  totalUsd: string;
  totalCny: string;
}

@Injectable()
export class BalancesService {
  private readonly logger = new Logger(BalancesService.name);

  constructor(
    private readonly chainsService: ChainsService,
    private readonly ethPriceService: EthPriceService,
  ) {}

  /**
   * Query balances for multiple addresses across multiple chains
   */
  async queryBalances(
    addresses: string[],
    requestedChains?: string[],
  ): Promise<Record<string, AddressBalance>> {
    // Determine which chains to query
    const chainsToQuery = requestedChains && requestedChains.length > 0
      ? requestedChains.map(chain => this.chainsService.getChainConfig(chain)).filter(Boolean)
      : this.chainsService.getAllChains().map(chain => this.chainsService.getChainConfig(chain.key)).filter(Boolean);

    // Query all addresses on all chains in parallel
    const allPromises = addresses.flatMap(address =>
      chainsToQuery.map(chain => this.queryChainBalance(address, chain)),
    );

    const results = await Promise.allSettled(allPromises);

    // Process results
    const balances: Record<string, AddressBalance> = {};
    let totalUsd = 0;
    let totalCny = 0;
    
    addresses.forEach((address, addressIndex) => {
      balances[address] = {
        address,
        chains: {},
        totalBalance: '0',
        totalUsd: '0',
        totalCny: '0',
      };

      chainsToQuery.forEach((_, chainIndex) => {
        const result = results[addressIndex * chainsToQuery.length + chainIndex];
        if (result.status === 'fulfilled') {
          const data = result.value;
          if (!data.error) {
            balances[address].chains[data.chain] = data;
            balances[address].totalBalance = (
              parseFloat(balances[address].totalBalance) + parseFloat(data.balanceEth)
            ).toString();
            balances[address].totalUsd = (
              parseFloat(balances[address].totalUsd) + parseFloat(data.balanceUsd)
            ).toFixed(2);
            balances[address].totalCny = (
              parseFloat(balances[address].totalCny) + parseFloat(data.balanceCny)
            ).toFixed(2);
            
            // Add to the overall totals
            totalUsd += parseFloat(data.balanceUsd);
            totalCny += parseFloat(data.balanceCny);
          }
        }
      });
    });

    return balances;
  }

  /**
   * Query balance for a single address on a single chain
   */
  private async queryChainBalance(
    walletAddress: string,
    chainConfig: any,
  ): Promise<ChainBalance> {
    try {
      const publicClient = this.chainsService.createPublicClient(chainConfig);

      const balance = await publicClient.getBalance({
        address: walletAddress as `0x${string}`,
      });

      const explorerUrl = this.chainsService.getExplorerUrl(chainConfig);
      const balanceEth = formatEther(balance);
      
      // Get ETH price
      const ethPrice = await this.ethPriceService.getEthPrice();
      
      // Calculate USD and CNY values
      const balanceUsd = (parseFloat(balanceEth) * ethPrice.usd).toFixed(2);
      const balanceCny = (parseFloat(balanceEth) * ethPrice.cny).toFixed(2);
      
      return {
        chain: chainConfig.name,
        chainId: chainConfig.id,
        balanceWei: balance.toString(),
        balanceEth,
        balanceUsd,
        balanceCny,
        explorer: explorerUrl ? `${explorerUrl}/address/${walletAddress}` : null,
      };
    } catch (error) {
      this.logger.error(`Error querying balance for ${walletAddress} on ${chainConfig.name}: ${error.message}`);
      return {
        chain: chainConfig.name,
        chainId: chainConfig.id,
        error: error.message,
      };
    }
  }
}
import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

interface EthPriceCache {
  usd: number;
  cny: number;
  lastUpdated: number;
}

@Injectable()
export class EthPriceService {
  private readonly logger = new Logger(EthPriceService.name);
  private ethPriceCache: EthPriceCache = {
    usd: 0,
    cny: 0,
    lastUpdated: 0,
  };

  /**
   * Get current ETH price in USD and CNY
   */
  async getEthPrice(): Promise<EthPriceCache> {
    const now = Date.now();
    // If cache doesn't exist or has expired (5 minutes), refresh it
    if (now - this.ethPriceCache.lastUpdated > 5 * 60 * 1000) {
      try {
        const response = await axios.get(
          'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd,cny',
        );
        this.ethPriceCache = {
          usd: response.data.ethereum.usd,
          cny: response.data.ethereum.cny,
          lastUpdated: now,
        };
      } catch (error) {
        this.logger.error(`Failed to get ETH price: ${error.message}`);
        // If fetching fails but we have old cache, continue using it
        if (this.ethPriceCache.lastUpdated === 0) {
          // No old cache, set default values
          this.ethPriceCache = {
            usd: 0,
            cny: 0,
            lastUpdated: now,
          };
        }
      }
    }
    return this.ethPriceCache;
  }
} 
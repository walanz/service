import { Injectable } from '@nestjs/common';
import * as chains from 'viem/chains';
import { createPublicClient, http } from 'viem';

export interface ChainInfo {
  id: number;
  name: string;
  key: string;
}

@Injectable()
export class ChainsService {
  private readonly supportedChains: ChainInfo[];
  private readonly uniqueSupportedChains: ChainInfo[];

  constructor() {
    // Get all supported chain names
    this.supportedChains = Object.entries(chains)
      .filter(([_, value]) => typeof value === 'object' && value.id && value.name)
      .map(([key, value]) => ({
        id: value.id,
        name: value.name,
        key: key.toLowerCase(),
      }));

    // Apply de-duplication to get unique chains
    this.uniqueSupportedChains = this.removeDuplicateChains(this.supportedChains);
  }

  /**
   * Get all supported chains
   */
  getAllChains(): ChainInfo[] {
    return this.uniqueSupportedChains;
  }

  /**
   * Find chains by keyword (fuzzy search)
   */
  findChains(keyword?: string): ChainInfo[] {
    if (!keyword) return this.uniqueSupportedChains;
    
    const lowerSearchTerm = keyword.toLowerCase();
    return this.uniqueSupportedChains.filter(
      (item) =>
        item.name.toLowerCase().includes(lowerSearchTerm) ||
        item.key.toLowerCase().includes(lowerSearchTerm),
    );
  }

  /**
   * Get paginated chains
   */
  getPaginatedChains(chains: ChainInfo[], offset = 0, limit = 10): ChainInfo[] {
    return chains.slice(offset, offset + limit);
  }

  /**
   * Get chain configuration by key
   */
  getChainConfig(chainKey: string): any {
    const chainEntry = Object.entries(chains).find(
      ([key]) => key.toLowerCase() === chainKey.toLowerCase(),
    );
    if (!chainEntry) return null;
    const [_, chainConfig] = chainEntry;
    return chainConfig;
  }

  /**
   * Get RPC URL for a chain
   */
  getRpcUrl(chain: any): string {
    if (!chain || !chain.rpcUrls?.default?.http?.[0]) {
      throw new Error(`No RPC URL found for chain ${chain?.name || 'unknown'}`);
    }
    return chain.rpcUrls.default.http[0];
  }

  /**
   * Get block explorer URL for a chain
   */
  getExplorerUrl(chain: any): string | null {
    if (!chain || !chain.blockExplorers?.default?.url) {
      return null;
    }
    return chain.blockExplorers.default.url;
  }

  /**
   * Create public client for a chain
   */
  createPublicClient(chainConfig: any) {
    return createPublicClient({
      chain: chainConfig,
      transport: http(this.getRpcUrl(chainConfig)),
    });
  }

  // Helper function to remove duplicate chains based on chainId
  private removeDuplicateChains(chainsList: ChainInfo[]): ChainInfo[] {
    // Use Map to store unique chainId
    const uniqueChains = new Map<number, ChainInfo>();
    
    // For duplicate chainIds, keep the one with shorter key (usually the main network)
    chainsList.forEach((chain) => {
      if (
        !uniqueChains.has(chain.id) ||
        chain.key.length < uniqueChains.get(chain.id).key.length
      ) {
        uniqueChains.set(chain.id, chain);
      }
    });
    
    // Convert Map back to array
    return Array.from(uniqueChains.values());
  }
}
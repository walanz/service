import express from 'express';
import cors from 'cors';
import { createPublicClient, http, formatEther } from 'viem';
import * as chains from 'viem/chains';
import axios from 'axios';

const app = express();
const port = process.env.PORT || 3000;

// 启用CORS和JSON解析中间件
app.use(cors());
app.use(express.json());

// 缓存ETH价格和过期时间
let ethPriceCache = {
  usd: 0,
  cny: 0,
  lastUpdated: 0
};

// 获取ETH价格的函数
async function getEthPrice() {
  // 如果缓存不存在或已过期（5分钟），则重新获取
  const now = Date.now();
  if (now - ethPriceCache.lastUpdated > 5 * 60 * 1000) {
    try {
      const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd,cny');
      ethPriceCache = {
        usd: response.data.ethereum.usd,
        cny: response.data.ethereum.cny,
        lastUpdated: now
      };
    } catch (error) {
      console.error('获取ETH价格失败:', error.message);
      // 如果获取失败但有旧缓存，继续使用旧缓存
      if (ethPriceCache.lastUpdated === 0) {
        // 没有旧缓存时设置默认值
        ethPriceCache = {
          usd: 0,
          cny: 0,
          lastUpdated: now
        };
      }
    }
  }
  return ethPriceCache;
}

// 获取所有支持的链名称
const supportedChains = Object.entries(chains)
  .filter(([_, value]) => typeof value === 'object' && value.id && value.name)
  .map(([key, value]) => ({
    id: value.id,
    name: value.name,
    key: key.toLowerCase()
  }));

// 去重函数 - 基于chainId去重
const removeDuplicateChains = (chainsList) => {
  // 使用Map存储唯一的chainId对应的链
  const uniqueChains = new Map();
  
  // 遍历所有链，对于相同chainId，保留键名更短的（通常是主要网络）
  chainsList.forEach(chain => {
    if (!uniqueChains.has(chain.id) || 
        chain.key.length < uniqueChains.get(chain.id).key.length) {
      uniqueChains.set(chain.id, chain);
    }
  });
  
  // 将Map转换回数组
  return Array.from(uniqueChains.values());
};

// 应用去重函数得到最终的链列表
const uniqueSupportedChains = removeDuplicateChains(supportedChains);

// 模糊搜索函数
const fuzzySearch = (items, searchTerm) => {
  if (!searchTerm) return items;
  const lowerSearchTerm = searchTerm.toLowerCase();
  return items.filter(item => 
    item.name.toLowerCase().includes(lowerSearchTerm) ||
    item.key.toLowerCase().includes(lowerSearchTerm)
  );
};

// 分页函数
const paginate = (items, offset = 0, limit = 10) => {
  return items.slice(offset, offset + limit);
};

// 获取链配置
const getChainConfig = (chainKey) => {
  const chainEntry = Object.entries(chains).find(
    ([key]) => key.toLowerCase() === chainKey.toLowerCase()
  );
  if (!chainEntry) return null;
  const [_, chainConfig] = chainEntry;
  return chainConfig;
};

// 获取RPC URL
const getRpcUrl = (chain) => {
  if (!chain || !chain.rpcUrls?.default?.http?.[0]) {
    throw new Error(`No RPC URL found for chain ${chain?.name || 'unknown'}`);
  }
  return chain.rpcUrls.default.http[0];
};

// 获取区块浏览器URL
const getExplorerUrl = (chain) => {
  if (!chain || !chain.blockExplorers?.default?.url) {
    return null;
  }
  return chain.blockExplorers.default.url;
};

// 查询单个链上的余额
async function queryChainBalance(walletAddress, chainConfig) {
  try {
    const publicClient = createPublicClient({
      chain: chainConfig,
      transport: http(getRpcUrl(chainConfig))
    });

    const balance = await publicClient.getBalance({
      address: walletAddress
    });

    const explorerUrl = getExplorerUrl(chainConfig);
    const balanceEth = formatEther(balance);
    
    // 获取ETH价格
    const ethPrice = await getEthPrice();
    
    // 计算美元和人民币价值
    const balanceUsd = (parseFloat(balanceEth) * ethPrice.usd).toFixed(2);
    const balanceCny = (parseFloat(balanceEth) * ethPrice.cny).toFixed(2);
    
    return {
      chain: chainConfig.name,
      chainId: chainConfig.id,
      balanceWei: balance.toString(),
      balanceEth: balanceEth,
      balanceUsd: balanceUsd,
      balanceCny: balanceCny,
      explorer: explorerUrl ? `${explorerUrl}/address/${walletAddress}` : null
    };
  } catch (error) {
    return {
      chain: chainConfig.name,
      chainId: chainConfig.id,
      error: error.message
    };
  }
}

// API路由

// 获取支持的链列表（支持模糊搜索和分页）
app.get('/v1/chains', (req, res) => {
  const { keyword, offset = 0, limit = 10 } = req.query;
  const offsetNum = parseInt(offset);
  const limitNum = parseInt(limit);

  // 先进行模糊搜索
  const filteredChains = keyword ? fuzzySearch(uniqueSupportedChains, keyword) : uniqueSupportedChains;
  
  // 然后进行分页
  const paginatedChains = paginate(filteredChains, offsetNum, limitNum);

  res.json({
    items: paginatedChains,
    total: filteredChains.length
  });
});

// 批量查询钱包地址余额
app.post('/v1/addresses/balances', async (req, res) => {
  try {
    const { addresses, chains: requestedChains } = req.body;

    if (!addresses || !Array.isArray(addresses) || addresses.length === 0) {
      return res.status(400).json({
        error: 'At least one wallet address is required'
      });
    }

    if (addresses.length > 50) { // 修改为支持最多50个地址
      return res.status(400).json({
        error: 'Maximum 50 addresses allowed per request'
      });
    }

    // 确定要查询的链
    const chainsToQuery = requestedChains && requestedChains.length > 0
      ? requestedChains.map(chain => getChainConfig(chain)).filter(Boolean)
      : Object.values(chains).filter(chain => typeof chain === 'object' && chain.id);

    if (chainsToQuery.length === 0) {
      return res.status(400).json({
        error: 'No valid chains specified'
      });
    }

    // 并行查询所有地址在所有链上的余额
    const allPromises = addresses.flatMap(address =>
      chainsToQuery.map(chain => queryChainBalance(address, chain))
    );

    const results = await Promise.allSettled(allPromises);

    // 处理结果
    const balances = {};
    let totalUsd = 0;
    let totalCny = 0;
    
    addresses.forEach((address, addressIndex) => {
      balances[address] = {
        address,
        chains: {},
        totalBalance: 0,
        totalUsd: 0,
        totalCny: 0
      };

      chainsToQuery.forEach((_, chainIndex) => {
        const result = results[addressIndex * chainsToQuery.length + chainIndex];
        if (result.status === 'fulfilled') {
          const data = result.value;
          if (!data.error) {
            balances[address].chains[data.chain] = data;
            balances[address].totalBalance += parseFloat(data.balanceEth);
            balances[address].totalUsd += parseFloat(data.balanceUsd);
            balances[address].totalCny += parseFloat(data.balanceCny);
            
            // 累加所有地址的总价值
            totalUsd += parseFloat(data.balanceUsd);
            totalCny += parseFloat(data.balanceCny);
          }
        }
      });

      balances[address].totalBalance = balances[address].totalBalance.toString();
      balances[address].totalUsd = balances[address].totalUsd.toFixed(2);
      balances[address].totalCny = balances[address].totalCny.toFixed(2);
    });

    // 获取当前ETH价格
    const ethPrice = await getEthPrice();

    res.json({
      items: Object.values(balances),
      total: addresses.length,
      ethPrice: {
        usd: ethPrice.usd,
        cny: ethPrice.cny
      },
      aggregated: {
        totalUsd: totalUsd.toFixed(2),
        totalCny: totalCny.toFixed(2)
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

// 查询单个链上的余额
app.get('/v1/chains/:chain/addresses/:address/balance', async (req, res) => {
  try {
    const { chain: chainKey, address } = req.params;
    
    if (!address) {
      return res.status(400).json({
        error: 'Wallet address is required'
      });
    }

    const chainConfig = getChainConfig(chainKey);
    if (!chainConfig) {
      return res.status(400).json({
        error: `Chain '${chainKey}' not supported`
      });
    }

    const balance = await queryChainBalance(address, chainConfig);
    const ethPrice = await getEthPrice();
    
    res.json({
      item: {
        address,
        ...balance,
        ethPrice: {
          usd: ethPrice.usd,
          cny: ethPrice.cny
        },
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

// 启动服务器
app.listen(port, () => {
  console.log(`Balance service running on port ${port}`);
  console.log(`Supported chains: ${uniqueSupportedChains.length} (after deduplication from ${supportedChains.length})`);
});
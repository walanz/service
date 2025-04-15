pn# 多链ETH余额查询服务

这是一个基于Node.js的RESTful API服务，用于查询以太坊钱包地址在多个链上的ETH余额。该服务支持viem/chains中定义的所有链。

## 功能特点

- 支持查询单个或多个链上的ETH余额
- 支持所有viem/chains中定义的链
- 提供余额汇总和详细信息
- 包含区块浏览器链接

## API接口

### 1. 获取支持的链列表

```
GET /api/chains
```

返回所有支持的链及其信息。

### 2. 查询多链余额

```
POST /api/balances
```

请求体：
```json
{
  "address": "0x...",
  "chains": ["arbitrum", "zksync"] // 可选，不提供则查询所有支持的链
}
```

### 3. 查询单链余额

```
GET /api/balance/:chain/:address
```

示例：`/api/balance/arbitrum/0x...`

## 使用方法

1. 安装依赖：
```bash
npm install
```

2. 启动服务：
```bash
npm start
```

服务将在 http://localhost:3000 启动

## 示例请求

```bash
# 获取支持的链列表
curl http://localhost:3000/api/chains

# 查询多链余额
curl -X POST http://localhost:3000/api/balances \
  -H "Content-Type: application/json" \
  -d '{"address":"0x123...","chains":["arbitrum","zksync"]}'

# 查询单链余额
curl http://localhost:3000/api/balance/arbitrum/0x123...
```
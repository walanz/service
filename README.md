# Balance Service API

ETH 余额查询服务 - 支持多链查询

## 技术栈

- NestJS
- TypeScript
- Viem (以太坊库)

## 安装

```bash
# 安装依赖
pnpm install
```

## 运行

```bash
# 开发模式
pnpm start:dev

# 生产模式
pnpm build
pnpm start:prod
```

## API 文档

启动服务后，访问 http://localhost:3000/api 查看 Swagger API 文档。

## 主要功能

1. 查询支持的链列表
   - `GET /v1/chains`
   - 参数：keyword (搜索关键词)、offset (分页)、limit (每页数量)

2. 批量查询钱包地址余额
   - `POST /v1/addresses/balances`
   - 请求体: `{ "addresses": ["0x..."], "chains": ["ethereum", "arbitrum"] }`

3. 查询单个链上的地址余额
   - `GET /v1/chains/:chain/addresses/:address/balance`

## 特性

- 支持多链查询
- 支持批量钱包地址查询
- 自动转换 ETH 价格到 USD 和 CNY
- 缓存 ETH 价格减少 API 调用
- Swagger API 文档

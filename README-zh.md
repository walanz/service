<p align="center">
  <img src="./icons/icon-128.png" width="128" height="128" alt="Walanz Logo">
</p>

<h1 align="center">Walanz Balance Service</h1>

<p align="center">多链以太坊余额查询服务</p>

<div align="center">
  <a href="#功能特性">功能特性</a> •
  <a href="#技术栈">技术栈</a> •
  <a href="#开发指南">开发指南</a> •
  <a href="#部署">部署</a> •
  <a href="#接口文档">接口文档</a> •
  <a href="#许可证">许可证</a>
</div>

---

## 功能特性

- ✅ 支持多链查询：通过 [viem](https://viem.sh/) 提供对多种以太坊兼容链的支持
- ✅ 批量地址查询：同时查询多个钱包地址在多条链上的余额
- ✅ 价格转换：自动将 ETH 余额转换为 USD 和 CNY
- ✅ Serverless 部署：针对 Vercel 平台进行了优化
- ✅ RESTful API：提供用于查询链和余额的完整 API
- ✅ Swagger 文档：自动生成的 API 文档

## 技术栈

- **NestJS**: 用于构建可扩展的后端服务
- **Viem**: 提供多链支持和区块链交互
- **TypeScript**: 类型安全的代码库
- **Swagger**: 用于 API 文档

## 开发指南

### 安装依赖

```bash
pnpm install
```

### 开发环境运行

```bash
pnpm start:dev
```

### 构建项目

```bash
pnpm build
```

### 运行测试

```bash
pnpm test
```

## 部署

本项目已针对 Vercel 平台进行了优化，请参考 `VERCEL_DEPLOYMENT.md` 获取详细部署说明。

### 基本部署

```bash
vercel deploy
```

## 接口文档

API 文档由 Swagger 提供，开发模式下可访问：`http://localhost:3000/api`

### 主要接口

- **GET /chains**: 获取所有支持的区块链
- **POST /addresses/balances**: 查询多个地址在多条链上的余额

## 许可证

[MIT 许可证](LICENSE) 
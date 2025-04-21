<p align="center">
  <img src="./icons/icon-128.png" width="128" height="128" alt="Walanz Logo">
</p>

<h1 align="center">Walanz Balance Service</h1>

<p align="center">Multi-chain Ethereum Balance Query Service</p>

<div align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#development-guide">Development Guide</a> •
  <a href="#deployment">Deployment</a> •
  <a href="#api-documentation">API Documentation</a> •
  <a href="#license">License</a>
</div>

---

## Features

- ✅ Multi-chain support: Query multiple Ethereum-compatible chains via [viem](https://viem.sh/)
- ✅ Batch address queries: Query multiple wallet addresses across multiple chains simultaneously
- ✅ Price conversion: Automatically convert ETH balances to USD and CNY
- ✅ Serverless deployment: Optimized for Vercel platform
- ✅ RESTful API: Complete API for querying chains and balances
- ✅ Swagger documentation: Auto-generated API documentation

## Tech Stack

- **NestJS**: For building scalable backend services
- **Viem**: Provides multi-chain support and blockchain interactions
- **TypeScript**: Type-safe codebase
- **Swagger**: For API documentation

## Development Guide

### Install Dependencies

```bash
pnpm install
```

### Run Development Environment

```bash
pnpm start:dev
```

### Build Project

```bash
pnpm build
```

### Run Tests

```bash
pnpm test
```

## Deployment

This project is optimized for the Vercel platform. See `VERCEL_DEPLOYMENT.md` for detailed deployment instructions.

### Basic Deployment

```bash
vercel deploy
```

## API Documentation

API documentation is provided by Swagger, accessible in development mode at: `http://localhost:3000/api`

### Main Endpoints

- **GET /chains**: Get all supported chains
- **POST /addresses/balances**: Query balances for multiple addresses across multiple chains

## License

[MIT License](LICENSE)

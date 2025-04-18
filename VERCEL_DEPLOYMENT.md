# 在Vercel上部署NestJS服务

本文档提供了如何将此NestJS服务部署到Vercel平台的步骤指南。

## 准备工作

1. 确保你已经有一个[Vercel账户](https://vercel.com/signup)
2. 确保你的项目已经推送到Git仓库（GitHub, GitLab或Bitbucket）

## 部署步骤

### 1. 构建项目

在部署之前，确保你的项目可以正确构建：

```bash
pnpm run build:vercel
```

这个命令会生成不包含sourcemap的生产构建文件。

### 2. 使用Vercel CLI部署

如果你想使用命令行部署，可以按照以下步骤操作：

```bash
# 安装Vercel CLI
pnpm install -g vercel

# 登录到你的Vercel账户
vercel login

# 部署项目
vercel
```

### 3. 通过Vercel网站部署

1. 登录到[Vercel控制台](https://vercel.com/dashboard)
2. 点击「New Project」
3. 导入你的Git仓库
4. 配置项目：
   - 构建命令：`pnpm run build:vercel`
   - 输出目录：`dist`
   - 安装命令：`pnpm install`
5. 点击「Deploy」

## 环境变量

如果你的应用需要环境变量，可以在Vercel项目设置中添加：

1. 在项目控制台中，点击「Settings」
2. 选择「Environment Variables」
3. 添加所需的环境变量

## 自定义域名

部署成功后，你可以在Vercel项目设置中添加自定义域名：

1. 在项目控制台中，点击「Settings」
2. 选择「Domains」
3. 添加你的域名并按照指示完成DNS配置

## 注意事项

- 确保你的应用监听正确的端口。Vercel会自动设置`PORT`环境变量。
- 本项目已配置`vercel.json`文件，指定了构建和路由规则。
- 禁用了sourcemap生成，以减小部署包的大小并提高性能。
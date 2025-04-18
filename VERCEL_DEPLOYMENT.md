# Vercel 部署说明

## 1. vercel.json 配置

确保 `service/vercel.json` 内容如下：

```
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/main.js",
      "methods": ["GET", "POST", "PUT", "DELETE", "PATCH"]
    }
  ]
}
```

- 不要配置 `builds` 字段，否则 Vercel 不会自动执行构建脚本。
- `buildCommand` 必须为 `pnpm run build`，确保会生成 `dist` 目录。
- `outputDirectory` 必须为 `dist`，与 NestJS 默认输出一致。

## 2. package.json 脚本

确保 `package.json` 中有如下构建命令：

```
"scripts": {
  "build": "nest build",
  "start:prod": "node dist/main"
}
```

## 3. 部署流程

1. 推送代码到 GitHub。
2. 在 Vercel 项目设置中选择 `service` 目录作为根目录（Root Directory）。
3. Vercel 会自动检测 `vercel.json` 并执行 `npm run build`，生成 `dist` 目录。
4. 部署完成后，访问 Vercel 分配的域名即可。

## 4. 常见问题

- 如果部署日志没有 `dist` 相关输出，检查 vercel.json 是否有 `builds` 字段，需移除。
- 若访问接口 404，确认 `outputDirectory` 和 `routes.dest` 指向 `dist/main.js`。

如有疑问可参考本文件或联系开发者。
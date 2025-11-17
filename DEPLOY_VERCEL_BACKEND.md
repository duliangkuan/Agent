# 部署后端到 Vercel

## ⚠️ 重要说明

将后端部署到 Vercel 有以下限制：

1. **SQLite 不可用**：Vercel 的 serverless 环境不支持文件系统，必须使用 PostgreSQL
2. **Socket.io 不支持**：Serverless 函数是无状态的，不支持 WebSocket 持久连接
3. **需要重构**：Express 应用需要适配为 serverless functions

## 解决方案

### 选项 1：使用 Vercel Postgres（推荐）

1. **在 Vercel 项目中添加 Postgres 数据库**：
   - 访问 Vercel Dashboard
   - 选择项目 → Storage → Create Database → Postgres
   - 创建数据库

2. **获取数据库连接字符串**：
   - 在 Vercel 项目设置中，找到 `POSTGRES_URL` 环境变量
   - 复制连接字符串

3. **配置环境变量**：
   ```
   DATABASE_URL=<your-postgres-url>
   DB_TYPE=postgres
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend.vercel.app
   ```

4. **部署**：
   ```bash
   vercel --prod
   ```

### 选项 2：使用外部 PostgreSQL 数据库

可以使用以下服务：
- **Supabase**（免费）：https://supabase.com
- **Neon**（免费）：https://neon.tech
- **Railway Postgres**：https://railway.app

## 部署步骤

### 1. 准备代码

代码已经准备好，`api/serverless.js` 是适配后的版本（移除了 Socket.io）。

### 2. 设置数据库

**使用 Vercel Postgres**：
1. 在 Vercel Dashboard 中创建 Postgres 数据库
2. 获取 `POSTGRES_URL`

**或使用外部数据库**：
1. 创建 PostgreSQL 数据库（Supabase/Neon/Railway）
2. 获取连接字符串

### 3. 初始化数据库

```bash
# 设置环境变量
export DATABASE_URL="your-postgres-connection-string"
export DB_TYPE="postgres"

# 运行迁移
cd backend
npm run db:migrate
npm run db:seed
```

### 4. 部署到 Vercel

```bash
# 在项目根目录
vercel --prod
```

### 5. 配置环境变量

在 Vercel Dashboard 中设置：
- `DATABASE_URL` = 你的 PostgreSQL 连接字符串
- `DB_TYPE` = `postgres`
- `NODE_ENV` = `production`
- `FRONTEND_URL` = 你的前端 Vercel URL

## Socket.io 替代方案

由于 Vercel 不支持 WebSocket，需要：

1. **使用轮询**：前端定期请求 API 获取状态
2. **使用 Server-Sent Events (SSE)**：Vercel 支持 SSE
3. **使用外部 WebSocket 服务**：如 Pusher、Ably

## 推荐架构

```
前端 (Vercel)
  ↓
后端 API (Vercel Serverless Functions)
  ↓
PostgreSQL (Vercel Postgres 或外部服务)
  ↓
WebSocket 服务 (可选，用于实时更新)
```

## 快速开始

### 使用 Vercel Postgres

1. **创建数据库**：
   ```bash
   # 在 Vercel Dashboard 中创建 Postgres 数据库
   ```

2. **部署**：
   ```bash
   vercel --prod
   ```

3. **初始化数据库**：
   ```bash
   # 使用 Vercel CLI 运行迁移
   vercel env pull .env.local
   cd backend
   npm run db:migrate
   npm run db:seed
   ```

## 注意事项

- ⚠️ Socket.io 功能将不可用（实时更新需要替代方案）
- ⚠️ 必须使用 PostgreSQL，不能使用 SQLite
- ⚠️ 冷启动可能较慢（首次请求）
- ✅ 自动扩展
- ✅ 全球 CDN
- ✅ 免费额度充足

## 需要帮助？

如果遇到问题，可以：
1. 查看 Vercel 日志：`vercel logs`
2. 检查环境变量是否正确设置
3. 确认数据库连接字符串格式正确


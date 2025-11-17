# Railway 后端部署指南

## 快速部署步骤

### 1. 访问 Railway

1. 打开 [railway.app](https://railway.app)
2. 点击 **"Login"** 或 **"Start a New Project"**
3. 使用 **GitHub** 账号登录

### 2. 创建新项目

1. 点击 **"New Project"**
2. 选择 **"Deploy from GitHub repo"**
3. 授权 Railway 访问你的 GitHub 仓库
4. 选择仓库：**`duliangkuan/Agent`**
5. 点击 **"Deploy Now"**

### 3. 配置项目设置

Railway 会自动检测到 Node.js 项目，但需要配置：

1. 点击项目进入详情页
2. 点击 **"Settings"** 标签
3. 找到 **"Root Directory"**，设置为：`backend`
4. 找到 **"Start Command"**，设置为：`npm start`

### 4. 配置环境变量

1. 在项目页面，点击 **"Variables"** 标签
2. 添加以下环境变量：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `DB_TYPE` | `sqlite` | 数据库类型 |
| `DB_PATH` | `./data/agent_security.db` | SQLite 数据库路径 |
| `PORT` | (Railway 自动设置) | 端口号，Railway 会自动提供 |
| `NODE_ENV` | `production` | 环境模式 |
| `FRONTEND_URL` | `https://frontend-96fljnqrt-duliangkuans-projects.vercel.app` | 前端 URL（用于 CORS） |

**重要提示**：
- Railway 会自动设置 `PORT` 环境变量，你的代码已经使用 `process.env.PORT`
- `FRONTEND_URL` 需要更新为你实际的前端 Vercel URL

### 5. 初始化数据库

部署后，需要初始化数据库。有两种方法：

#### 方法 A：使用 Railway CLI（推荐）

```bash
# 安装 Railway CLI
npm install -g @railway/cli

# 登录
railway login

# 链接到项目
railway link

# 运行数据库初始化
railway run npm run db:init
```

#### 方法 B：使用 Railway 的 Web Terminal

1. 在 Railway 项目页面，点击 **"Deployments"**
2. 找到最新的部署，点击 **"..."** → **"View Logs"**
3. 或者使用 **"Settings"** → **"Service"** → **"Connect"** 获取 SSH 连接信息

### 6. 获取后端 URL

部署完成后：

1. 在 Railway 项目页面，点击 **"Settings"**
2. 找到 **"Domains"** 部分
3. Railway 会自动生成一个域名，例如：`your-project.up.railway.app`
4. 复制这个 URL，这就是你的后端 API 地址

### 7. 更新前端环境变量

现在需要告诉前端后端 API 的地址：

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择你的前端项目：`frontend`
3. 点击 **"Settings"** → **"Environment Variables"**
4. 添加环境变量：
   - **Name**: `REACT_APP_API_URL`
   - **Value**: `https://your-railway-url.up.railway.app/api`
   - **Environment**: Production, Preview, Development（全部勾选）
5. 点击 **"Save"**
6. 重新部署前端：
   ```bash
   cd frontend
   vercel --prod
   ```

### 8. 验证部署

1. **检查后端健康状态**：
   - 访问：`https://your-railway-url.up.railway.app/api/health`
   - 应该返回：`{"status":"ok","message":"API is running"}`

2. **检查数据库连接**：
   - 访问：`https://your-railway-url.up.railway.app/api/health/db`
   - 应该返回：`{"status":"ok","message":"Database connected"}`

3. **测试前端**：
   - 访问你的 Vercel 前端 URL
   - 尝试访问 Dashboard 页面，应该能正常加载数据

## 常见问题

### Q: 数据库初始化失败？

**A**: 确保：
- `DB_PATH` 环境变量设置为 `./data/agent_security.db`
- Railway 有写入权限（通常没问题）
- 运行 `npm run db:init` 命令

### Q: CORS 错误？

**A**: 检查：
- `FRONTEND_URL` 环境变量是否正确设置为你的 Vercel 前端 URL
- 后端代码中的 CORS 配置是否正确

### Q: 如何查看日志？

**A**: 
- Railway 项目页面 → **"Deployments"** → 点击部署 → **"View Logs"**
- 或使用 Railway CLI: `railway logs`

### Q: 如何更新代码？

**A**: 
- 推送代码到 GitHub：`git push origin main`
- Railway 会自动检测并重新部署

## 下一步

部署完成后，你的应用架构：

```
前端 (Vercel)
  ↓
https://frontend-96fljnqrt-duliangkuans-projects.vercel.app
  ↓
后端 API (Railway)
  ↓
https://your-project.up.railway.app/api
  ↓
SQLite 数据库
```

## 需要帮助？

- Railway 文档：https://docs.railway.app
- Vercel 文档：https://vercel.com/docs
- 项目 GitHub：https://github.com/duliangkuan/Agent


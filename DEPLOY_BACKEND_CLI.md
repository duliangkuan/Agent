# Railway CLI 一键部署后端指南

## 快速部署步骤

### 方法 1：使用 PowerShell 脚本（推荐）

1. **运行部署脚本**：
   ```powershell
   .\deploy-backend.ps1
   ```

2. **如果遇到登录提示**：
   - 脚本会自动打开浏览器
   - 在浏览器中完成 GitHub 登录
   - 授权 Railway 访问你的 GitHub 账号

3. **按照脚本提示完成部署**

### 方法 2：手动执行命令

#### 步骤 1：安装 Railway CLI（如果未安装）

```powershell
npm install -g @railway/cli
```

#### 步骤 2：登录 Railway

```powershell
cd backend
railway login
```

这会打开浏览器，使用 GitHub 账号登录。

#### 步骤 3：初始化项目

```powershell
railway init
```

选择：
- **"Empty Project"** 或 **"Deploy from GitHub repo"**
- 如果选择 GitHub，选择仓库：`duliangkuan/Agent`
- 项目名称：`agent-backend`（或你喜欢的名称）

#### 步骤 4：设置工作目录

```powershell
railway service
```

在 Railway Dashboard 中：
1. 进入项目设置
2. 设置 **Root Directory** 为：`backend`

或者使用 CLI：
```powershell
railway variables set RAILWAY_SERVICE_NAME=backend
```

#### 步骤 5：配置环境变量

```powershell
railway variables set DB_TYPE=sqlite
railway variables set DB_PATH=./data/agent_security.db
railway variables set NODE_ENV=production
railway variables set FRONTEND_URL=https://frontend-96fljnqrt-duliangkuans-projects.vercel.app
```

#### 步骤 6：部署

```powershell
railway up
```

这会：
- 构建项目
- 部署到 Railway
- 显示部署 URL

#### 步骤 7：获取部署 URL

```powershell
railway domain
```

复制显示的 URL（例如：`your-project.up.railway.app`）

#### 步骤 8：初始化数据库

```powershell
railway run npm run db:init
```

#### 步骤 9：更新前端环境变量

1. 访问 Vercel Dashboard：https://vercel.com/duliangkuans-projects/frontend/settings
2. 进入 **Environment Variables**
3. 添加：
   - **Name**: `REACT_APP_API_URL`
   - **Value**: `https://your-railway-url.up.railway.app/api`
   - **Environment**: Production, Preview, Development（全部勾选）
4. 保存并重新部署前端：
   ```powershell
   cd ..\frontend
   vercel --prod
   ```

## 验证部署

### 检查后端健康状态

```powershell
# 替换为你的 Railway URL
curl https://your-project.up.railway.app/api/health
```

应该返回：
```json
{"status":"ok","message":"API is running"}
```

### 检查数据库连接

```powershell
curl https://your-project.up.railway.app/api/health/db
```

应该返回：
```json
{"status":"ok","message":"Database connected"}
```

## 常用 Railway CLI 命令

```powershell
# 查看当前登录用户
railway whoami

# 查看项目信息
railway status

# 查看日志
railway logs

# 查看环境变量
railway variables

# 运行命令
railway run <command>

# 打开 Railway Dashboard
railway open
```

## 故障排除

### 问题：登录失败

**解决方案**：
- 确保已安装 Railway CLI：`npm install -g @railway/cli`
- 清除缓存：`railway logout` 然后重新 `railway login`
- 检查网络连接

### 问题：部署失败

**解决方案**：
- 查看日志：`railway logs`
- 检查环境变量是否正确设置：`railway variables`
- 确保 `package.json` 中有 `start` 脚本

### 问题：数据库初始化失败

**解决方案**：
- 确保 `DB_PATH` 环境变量正确
- 检查 Railway 是否有写入权限（通常没问题）
- 手动运行：`railway run npm run db:init`

## 下一步

部署完成后：
1. ✅ 后端已部署到 Railway
2. ✅ 数据库已初始化
3. ⏳ 更新前端环境变量
4. ⏳ 重新部署前端

完成后，你的应用就可以在线上运行了！


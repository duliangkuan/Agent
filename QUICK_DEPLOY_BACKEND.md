# 快速部署后端到 Railway

## 一键部署步骤

### 步骤 1：手动登录 Railway（必需）

在 PowerShell 中运行：

```powershell
cd backend
railway login
```

这会打开浏览器，使用 GitHub 账号登录并授权。

### 步骤 2：初始化项目（首次部署）

```powershell
railway init
```

选择：
- **选项 2**: Deploy from GitHub repo
- 选择仓库：**duliangkuan/Agent**
- 项目名称：`agent-backend`（或你喜欢的名称）

### 步骤 3：运行部署脚本

返回项目根目录，运行：

```powershell
cd ..
.\deploy-backend-simple.ps1
```

脚本会自动：
- ✅ 检查登录状态
- ✅ 设置环境变量
- ✅ 部署到 Railway
- ✅ 获取部署 URL
- ✅ 初始化数据库

### 步骤 4：更新前端环境变量

1. 复制脚本输出的后端 URL（例如：`your-project.up.railway.app`）

2. 访问 Vercel Dashboard：
   https://vercel.com/duliangkuans-projects/frontend/settings

3. 进入 **Environment Variables**

4. 添加：
   - **Name**: `REACT_APP_API_URL`
   - **Value**: `https://your-project.up.railway.app/api`
   - **Environment**: Production, Preview, Development（全部勾选）

5. 保存

6. 重新部署前端：
   ```powershell
   cd frontend
   vercel --prod
   ```

## 完整命令序列

```powershell
# 1. 登录 Railway
cd backend
railway login

# 2. 初始化项目（首次）
railway init
# 选择: Deploy from GitHub repo -> duliangkuan/Agent

# 3. 返回根目录并运行部署脚本
cd ..
.\deploy-backend-simple.ps1

# 4. 复制输出的 URL，更新 Vercel 环境变量
# 5. 重新部署前端
cd frontend
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

### 检查数据库

```powershell
curl https://your-project.up.railway.app/api/health/db
```

应该返回：
```json
{"status":"ok","message":"Database connected"}
```

## 故障排除

### 问题：登录失败

**解决**：
- 确保网络连接正常
- 手动访问 https://railway.app 登录
- 然后运行 `railway whoami` 验证

### 问题：部署失败

**解决**：
- 查看日志：`railway logs`
- 检查环境变量：`railway variables`
- 确保 `package.json` 中有 `start` 脚本

### 问题：数据库初始化失败

**解决**：
- 手动运行：`railway run npm run db:init`
- 查看日志：`railway logs`

## 常用命令

```powershell
# 查看当前用户
railway whoami

# 查看项目状态
railway status

# 查看日志
railway logs

# 查看环境变量
railway variables

# 打开 Railway Dashboard
railway open
```

## 完成！

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

现在你的应用已经可以在线上运行了！🎉


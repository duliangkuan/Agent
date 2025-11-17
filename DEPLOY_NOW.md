# 🚀 立即部署后端

由于 Railway CLI 需要在你已登录的终端中运行，请按照以下步骤操作：

## 方法 1：使用批处理脚本（推荐）

1. **双击运行** `deploy-backend.bat`
   
   或者在 PowerShell 中运行：
   ```powershell
   .\deploy-backend.bat
   ```

## 方法 2：手动执行命令

在你的终端中（确保已登录 Railway），运行：

```powershell
cd backend

# 1. 初始化项目（如果还没做）
railway init
# 选择: Deploy from GitHub repo -> duliangkuan/Agent

# 2. 设置环境变量
railway variables set DB_TYPE=sqlite
railway variables set DB_PATH=./data/agent_security.db
railway variables set NODE_ENV=production
railway variables set FRONTEND_URL=https://frontend-96fljnqrt-duliangkuans-projects.vercel.app

# 3. 部署
railway up

# 4. 获取域名（复制这个 URL）
railway domain

# 5. 初始化数据库
railway run npm run db:init
```

## 方法 3：使用 PowerShell 脚本

如果你已经在 backend 目录且已登录：

```powershell
cd C:\Users\23303\OneDrive\Desktop\Agent\backend

# 检查登录
railway whoami

# 如果已登录，运行：
railway init  # 如果还没初始化
railway variables set DB_TYPE=sqlite
railway variables set DB_PATH=./data/agent_security.db
railway variables set NODE_ENV=production
railway variables set FRONTEND_URL=https://frontend-96fljnqrt-duliangkuans-projects.vercel.app
railway up
railway domain
railway run npm run db:init
```

## 部署完成后

1. **复制 Railway 输出的域名**（例如：`your-project.up.railway.app`）

2. **更新 Vercel 环境变量**：
   - 访问：https://vercel.com/duliangkuans-projects/frontend/settings
   - 进入 "Environment Variables"
   - 添加：`REACT_APP_API_URL` = `https://your-project.up.railway.app/api`
   - 保存

3. **重新部署前端**：
   ```powershell
   cd frontend
   vercel --prod
   ```

## 验证部署

```powershell
# 检查后端健康状态
curl https://your-project.up.railway.app/api/health

# 应该返回: {"status":"ok","message":"API is running"}
```

---

**提示**：如果你在另一个终端窗口已经登录了 Railway，请在那个窗口中运行上述命令。


# 一键部署脚本 - 请在已登录 Railway 的终端中运行
# 使用方法: cd backend; .\..\deploy-now.ps1

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Railway Backend Deployment" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# 检查是否在 backend 目录
if (-not (Test-Path "package.json") -or -not (Test-Path "src")) {
    Write-Host "ERROR: Please run this script from the backend directory" -ForegroundColor Red
    Write-Host "Run: cd backend" -ForegroundColor Yellow
    exit 1
}

# 检查登录
Write-Host "Step 1: Checking Railway login..." -ForegroundColor Cyan
$whoami = railway whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Not logged in to Railway!" -ForegroundColor Red
    Write-Host "Please run: railway login" -ForegroundColor Yellow
    exit 1
}
Write-Host "Logged in as: $whoami" -ForegroundColor Green

# 检查项目
Write-Host ""
Write-Host "Step 2: Checking project..." -ForegroundColor Cyan
if (-not (Test-Path ".railway\project.json")) {
    Write-Host "Project not initialized. Running railway init..." -ForegroundColor Yellow
    Write-Host "Please select: Deploy from GitHub repo -> duliangkuan/Agent" -ForegroundColor Yellow
    railway init
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Initialization failed!" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "Project already initialized" -ForegroundColor Green
    railway link
}

# 设置环境变量
Write-Host ""
Write-Host "Step 3: Setting environment variables..." -ForegroundColor Cyan
railway variables set DB_TYPE=sqlite
railway variables set DB_PATH=./data/agent_security.db
railway variables set NODE_ENV=production
railway variables set FRONTEND_URL=https://frontend-96fljnqrt-duliangkuans-projects.vercel.app
Write-Host "Environment variables set" -ForegroundColor Green

# 部署
Write-Host ""
Write-Host "Step 4: Deploying to Railway..." -ForegroundColor Cyan
Write-Host "This may take a few minutes..." -ForegroundColor Yellow
railway up
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Deployment failed!" -ForegroundColor Red
    exit 1
}

# 等待部署
Write-Host ""
Write-Host "Waiting for deployment..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# 获取域名
Write-Host ""
Write-Host "Step 5: Getting deployment domain..." -ForegroundColor Cyan
$domain = railway domain 2>&1
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Deployment URL: $domain" -ForegroundColor Cyan
Write-Host "API URL: $domain/api" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Green

# 初始化数据库
Write-Host ""
Write-Host "Step 6: Initializing database..." -ForegroundColor Cyan
railway run npm run db:init
if ($LASTEXITCODE -eq 0) {
    Write-Host "Database initialized successfully" -ForegroundColor Green
} else {
    Write-Host "Warning: Database initialization may have failed" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Deployment completed!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Copy the API URL above: $domain/api" -ForegroundColor White
Write-Host "2. Go to: https://vercel.com/duliangkuans-projects/frontend/settings" -ForegroundColor White
Write-Host "3. Add environment variable: REACT_APP_API_URL = $domain/api" -ForegroundColor White
Write-Host "4. Redeploy frontend: cd ..\frontend; vercel --prod" -ForegroundColor White
Write-Host ""


# Railway 后端一键部署脚本 (PowerShell)
# 使用方法：在项目根目录运行 .\deploy-backend.ps1

param(
    [switch]$SkipLogin
)

Write-Host "`n🚀 Railway 后端一键部署脚本" -ForegroundColor Green
Write-Host "=" * 50 -ForegroundColor Cyan

# 检查 Railway CLI
Write-Host "`n📦 检查 Railway CLI..." -ForegroundColor Cyan
if (-not (Get-Command railway -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Railway CLI 未安装，正在安装..." -ForegroundColor Yellow
    npm install -g @railway/cli
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ 安装失败，请手动运行: npm install -g @railway/cli" -ForegroundColor Red
        exit 1
    }
}
Write-Host "✅ Railway CLI 已安装" -ForegroundColor Green

# 进入后端目录
$backendPath = Join-Path $PSScriptRoot "backend"
if (-not (Test-Path $backendPath)) {
    Write-Host "❌ 找不到 backend 目录" -ForegroundColor Red
    exit 1
}
Set-Location $backendPath
Write-Host "✅ 已进入 backend 目录" -ForegroundColor Green

# 登录 Railway（如果需要）
Write-Host "`n🔐 检查 Railway 登录状态..." -ForegroundColor Cyan
try {
    $whoami = railway whoami 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ 已登录 Railway: $whoami" -ForegroundColor Green
    } else {
        throw "Not logged in"
    }
} catch {
    if (-not $SkipLogin) {
        Write-Host "⚠️  需要登录 Railway" -ForegroundColor Yellow
        Write-Host "   正在打开浏览器进行登录..." -ForegroundColor Yellow
        Write-Host "   如果浏览器没有自动打开，请访问: https://railway.app" -ForegroundColor Yellow
        railway login
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ 登录失败，请手动运行: railway login" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "❌ 未登录，请先运行: railway login" -ForegroundColor Red
        exit 1
    }
}

# 检查是否已链接项目
Write-Host "`n🔗 检查项目链接..." -ForegroundColor Cyan
$railwayConfig = Join-Path $backendPath ".railway\project.json"
if (-not (Test-Path $railwayConfig)) {
    Write-Host "📝 未找到项目配置，需要初始化..." -ForegroundColor Yellow
    Write-Host "   请选择以下选项之一:" -ForegroundColor Yellow
    Write-Host "   1. Empty Project (创建新项目)" -ForegroundColor Cyan
    Write-Host "   2. Deploy from GitHub repo (从 GitHub 部署)" -ForegroundColor Cyan
    Write-Host "`n   推荐选择选项 2，然后选择仓库: duliangkuan/Agent" -ForegroundColor Yellow
    railway init
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ 初始化失败" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✅ 项目已链接" -ForegroundColor Green
    railway link
}

# 设置环境变量
Write-Host "`n⚙️  配置环境变量..." -ForegroundColor Cyan
$envVars = @{
    "DB_TYPE" = "sqlite"
    "DB_PATH" = "./data/agent_security.db"
    "NODE_ENV" = "production"
    "FRONTEND_URL" = "https://frontend-96fljnqrt-duliangkuans-projects.vercel.app"
}

foreach ($key in $envVars.Keys) {
    Write-Host "   设置 $key = $($envVars[$key])" -ForegroundColor Gray
    railway variables set "$key=$($envVars[$key])" | Out-Null
}
Write-Host "✅ 环境变量配置完成" -ForegroundColor Green

# 部署
Write-Host "`n🚀 开始部署到 Railway..." -ForegroundColor Green
Write-Host "   这可能需要几分钟时间..." -ForegroundColor Yellow
railway up

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 部署失败，请查看上面的错误信息" -ForegroundColor Red
    exit 1
}

# 等待部署完成
Write-Host "`n⏳ 等待部署完成..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# 获取部署 URL
Write-Host "`n📋 获取部署域名..." -ForegroundColor Cyan
$domain = railway domain 2>&1
Write-Host "`n✅ 部署完成！" -ForegroundColor Green
Write-Host "`n🌐 后端 URL: $domain" -ForegroundColor Cyan
Write-Host "   API 地址: $domain/api" -ForegroundColor Cyan

# 初始化数据库
Write-Host "`n🗄️  初始化数据库..." -ForegroundColor Cyan
railway run npm run db:init

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ 数据库初始化完成" -ForegroundColor Green
} else {
    Write-Host "⚠️  数据库初始化可能失败，请检查日志" -ForegroundColor Yellow
}

# 返回原目录
Set-Location $PSScriptRoot

Write-Host "`n" + ("=" * 50) -ForegroundColor Cyan
Write-Host "✅ 部署流程完成！" -ForegroundColor Green
Write-Host "`n📝 下一步操作:" -ForegroundColor Yellow
Write-Host "   1. 复制上面的后端 URL" -ForegroundColor White
Write-Host "   2. 访问 Vercel Dashboard: https://vercel.com/duliangkuans-projects/frontend/settings" -ForegroundColor White
Write-Host "   3. 添加环境变量 REACT_APP_API_URL = $domain/api" -ForegroundColor White
Write-Host "   4. 重新部署前端: cd frontend && vercel --prod" -ForegroundColor White
Write-Host "`n"

# Railway Backend Deployment Script
# Usage: .\deploy-backend.ps1

param(
    [switch]$SkipLogin
)

Write-Host ""
Write-Host "Railway Backend Deployment Script" -ForegroundColor Green
Write-Host ("=" * 50) -ForegroundColor Cyan

# Check Railway CLI
Write-Host ""
Write-Host "Checking Railway CLI..." -ForegroundColor Cyan
if (-not (Get-Command railway -ErrorAction SilentlyContinue)) {
    Write-Host "Installing Railway CLI..." -ForegroundColor Yellow
    npm install -g @railway/cli
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to install Railway CLI" -ForegroundColor Red
        exit 1
    }
}
Write-Host "Railway CLI installed" -ForegroundColor Green

# Navigate to backend directory
$backendPath = Join-Path $PSScriptRoot "backend"
if (-not (Test-Path $backendPath)) {
    Write-Host "Backend directory not found" -ForegroundColor Red
    exit 1
}
Set-Location $backendPath
Write-Host "Entered backend directory" -ForegroundColor Green

# Check Railway login
Write-Host ""
Write-Host "Checking Railway login status..." -ForegroundColor Cyan
$whoamiResult = railway whoami 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "Logged in to Railway: $whoamiResult" -ForegroundColor Green
} else {
    if (-not $SkipLogin) {
        Write-Host "Need to login to Railway" -ForegroundColor Yellow
        Write-Host "Opening browser for login..." -ForegroundColor Yellow
        railway login
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Login failed. Please run: railway login" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "Not logged in. Please run: railway login" -ForegroundColor Red
        exit 1
    }
}

# Check project link
Write-Host ""
Write-Host "Checking project link..." -ForegroundColor Cyan
$railwayConfig = Join-Path $backendPath ".railway\project.json"
if (-not (Test-Path $railwayConfig)) {
    Write-Host "Project not configured. Initializing..." -ForegroundColor Yellow
    Write-Host "Please select:" -ForegroundColor Yellow
    Write-Host "1. Empty Project" -ForegroundColor Cyan
    Write-Host "2. Deploy from GitHub repo" -ForegroundColor Cyan
    Write-Host "Recommended: Option 2, then select repo: duliangkuan/Agent" -ForegroundColor Yellow
    railway init
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Initialization failed" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "Project already linked" -ForegroundColor Green
    railway link
}

# Set environment variables
Write-Host ""
Write-Host "Configuring environment variables..." -ForegroundColor Cyan
railway variables set DB_TYPE=sqlite
railway variables set DB_PATH=./data/agent_security.db
railway variables set NODE_ENV=production
railway variables set FRONTEND_URL=https://frontend-96fljnqrt-duliangkuans-projects.vercel.app
Write-Host "Environment variables configured" -ForegroundColor Green

# Deploy
Write-Host ""
Write-Host "Deploying to Railway..." -ForegroundColor Green
Write-Host "This may take a few minutes..." -ForegroundColor Yellow
railway up

if ($LASTEXITCODE -ne 0) {
    Write-Host "Deployment failed. Check error messages above." -ForegroundColor Red
    exit 1
}

# Wait for deployment
Write-Host ""
Write-Host "Waiting for deployment to complete..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Get deployment URL
Write-Host ""
Write-Host "Getting deployment domain..." -ForegroundColor Cyan
$domainOutput = railway domain 2>&1
Write-Host ""
Write-Host "Deployment completed!" -ForegroundColor Green
Write-Host "Backend URL: $domainOutput" -ForegroundColor Cyan
Write-Host "API URL: $domainOutput/api" -ForegroundColor Cyan

# Initialize database
Write-Host ""
Write-Host "Initializing database..." -ForegroundColor Cyan
railway run npm run db:init

if ($LASTEXITCODE -eq 0) {
    Write-Host "Database initialized" -ForegroundColor Green
} else {
    Write-Host "Database initialization may have failed. Check logs." -ForegroundColor Yellow
}

# Return to original directory
Set-Location $PSScriptRoot

Write-Host ""
Write-Host ("=" * 50) -ForegroundColor Cyan
Write-Host "Deployment process completed!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Copy the backend URL above" -ForegroundColor White
Write-Host "2. Go to Vercel Dashboard: https://vercel.com/duliangkuans-projects/frontend/settings" -ForegroundColor White
Write-Host "3. Add environment variable REACT_APP_API_URL = $domainOutput/api" -ForegroundColor White
Write-Host "4. Redeploy frontend: cd frontend && vercel --prod" -ForegroundColor White
Write-Host ""

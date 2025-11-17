# Simple Railway Backend Deployment
# Step 1: Login manually first: railway login
# Step 2: Run this script: .\deploy-backend-simple.ps1

Write-Host ""
Write-Host "Railway Backend Deployment" -ForegroundColor Green
Write-Host ("=" * 50) -ForegroundColor Cyan

# Check login
Write-Host ""
Write-Host "Checking Railway login..." -ForegroundColor Cyan
$whoami = railway whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Not logged in to Railway!" -ForegroundColor Red
    Write-Host "Please run: railway login" -ForegroundColor Yellow
    Write-Host "Then run this script again." -ForegroundColor Yellow
    exit 1
}
Write-Host "Logged in as: $whoami" -ForegroundColor Green

# Go to backend
Set-Location backend
Write-Host "Changed to backend directory" -ForegroundColor Green

# Check if project exists
$hasProject = Test-Path ".railway\project.json"
if (-not $hasProject) {
    Write-Host ""
    Write-Host "No Railway project found. Please run:" -ForegroundColor Yellow
    Write-Host "  railway init" -ForegroundColor Cyan
    Write-Host "Then select: Deploy from GitHub repo -> duliangkuan/Agent" -ForegroundColor Yellow
    Write-Host "After that, run this script again." -ForegroundColor Yellow
    exit 1
}

Write-Host "Project linked" -ForegroundColor Green

# Set variables
Write-Host ""
Write-Host "Setting environment variables..." -ForegroundColor Cyan
railway variables set DB_TYPE=sqlite
railway variables set DB_PATH=./data/agent_security.db
railway variables set NODE_ENV=production
railway variables set FRONTEND_URL=https://frontend-96fljnqrt-duliangkuans-projects.vercel.app
Write-Host "Environment variables set" -ForegroundColor Green

# Deploy
Write-Host ""
Write-Host "Deploying..." -ForegroundColor Green
railway up

if ($LASTEXITCODE -ne 0) {
    Write-Host "Deployment failed!" -ForegroundColor Red
    exit 1
}

# Get domain
Write-Host ""
Write-Host "Getting domain..." -ForegroundColor Cyan
railway domain

# Init database
Write-Host ""
Write-Host "Initializing database..." -ForegroundColor Cyan
railway run npm run db:init

Write-Host ""
Write-Host "Done! Copy the domain above and update Vercel environment variables." -ForegroundColor Green
Set-Location ..


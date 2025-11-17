@echo off
echo ========================================
echo Railway Backend Deployment
echo ========================================
echo.

cd backend

echo Step 1: Checking Railway login...
railway whoami
if %errorlevel% neq 0 (
    echo ERROR: Not logged in to Railway!
    echo Please run: railway login
    pause
    exit /b 1
)

echo.
echo Step 2: Checking project initialization...
if not exist ".railway\project.json" (
    echo Project not initialized. Running railway init...
    railway init
    if %errorlevel% neq 0 (
        echo ERROR: Initialization failed!
        pause
        exit /b 1
    )
) else (
    echo Project already initialized.
)

echo.
echo Step 3: Setting environment variables...
railway variables set DB_TYPE=sqlite
railway variables set DB_PATH=./data/agent_security.db
railway variables set NODE_ENV=production
railway variables set FRONTEND_URL=https://frontend-96fljnqrt-duliangkuans-projects.vercel.app

echo.
echo Step 4: Deploying to Railway...
railway up
if %errorlevel% neq 0 (
    echo ERROR: Deployment failed!
    pause
    exit /b 1
)

echo.
echo Step 5: Getting deployment domain...
railway domain

echo.
echo Step 6: Initializing database...
railway run npm run db:init

echo.
echo ========================================
echo Deployment completed!
echo ========================================
echo.
echo Next steps:
echo 1. Copy the domain URL above
echo 2. Go to Vercel Dashboard and add REACT_APP_API_URL environment variable
echo 3. Redeploy frontend: cd frontend ^&^& vercel --prod
echo.
pause


# Manual Deployment Steps
# Run these commands one by one in the backend directory

Write-Host "Manual Railway Deployment Steps" -ForegroundColor Green
Write-Host ("=" * 50) -ForegroundColor Cyan
Write-Host ""
Write-Host "Please run these commands in the backend directory:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Check login:" -ForegroundColor Cyan
Write-Host "   railway whoami" -ForegroundColor White
Write-Host ""
Write-Host "2. If not logged in, login:" -ForegroundColor Cyan
Write-Host "   railway login" -ForegroundColor White
Write-Host ""
Write-Host "3. Initialize project (if not done):" -ForegroundColor Cyan
Write-Host "   railway init" -ForegroundColor White
Write-Host "   Select: Deploy from GitHub repo -> duliangkuan/Agent" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Set environment variables:" -ForegroundColor Cyan
Write-Host "   railway variables set DB_TYPE=sqlite" -ForegroundColor White
Write-Host "   railway variables set DB_PATH=./data/agent_security.db" -ForegroundColor White
Write-Host "   railway variables set NODE_ENV=production" -ForegroundColor White
Write-Host "   railway variables set FRONTEND_URL=https://frontend-96fljnqrt-duliangkuans-projects.vercel.app" -ForegroundColor White
Write-Host ""
Write-Host "5. Deploy:" -ForegroundColor Cyan
Write-Host "   railway up" -ForegroundColor White
Write-Host ""
Write-Host "6. Get domain:" -ForegroundColor Cyan
Write-Host "   railway domain" -ForegroundColor White
Write-Host ""
Write-Host "7. Initialize database:" -ForegroundColor Cyan
Write-Host "   railway run npm run db:init" -ForegroundColor White
Write-Host ""


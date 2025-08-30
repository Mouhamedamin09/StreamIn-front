# 🚀 StreamIn Complete Deployment Script
# This script uploads everything needed to run your app on the droplet

param(
    [Parameter(Mandatory=$false)]
    [string]$DropletIP = "159.89.137.41"
)

Write-Host "🚀 Deploying StreamIn to Droplet..." -ForegroundColor Green
Write-Host ""

# Check if dist folder exists
if (-not (Test-Path "dist")) {
    Write-Host "❌ Error: dist/ folder not found!" -ForegroundColor Red
    Write-Host "   Run 'npm run build' first to create the dist folder." -ForegroundColor Yellow
    exit 1
}

# Check if backend folder exists
if (-not (Test-Path "backend")) {
    Write-Host "❌ Error: backend/ folder not found!" -ForegroundColor Red
    exit 1
}

Write-Host "📤 Step 1: Uploading frontend (dist/ folder)..." -ForegroundColor Cyan
try {
    scp -r dist/ "streamin@${DropletIP}:/home/streamin/StreamIn/"
    Write-Host "✅ Frontend uploaded successfully!" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend upload failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📤 Step 2: Uploading backend files..." -ForegroundColor Cyan
try {
    scp -r backend/ "streamin@${DropletIP}:/home/streamin/StreamIn/"
    Write-Host "✅ Backend uploaded successfully!" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend upload failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📤 Step 3: Uploading package files..." -ForegroundColor Cyan
try {
    scp package*.json "streamin@${DropletIP}:/home/streamin/StreamIn/"
    Write-Host "✅ Package files uploaded successfully!" -ForegroundColor Green
} catch {
    Write-Host "❌ Package files upload failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎉 Deployment completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Your StreamIn website should now be accessible at:" -ForegroundColor Yellow
Write-Host "   http://$DropletIP" -ForegroundColor White
Write-Host ""
Write-Host "📱 Admin Dashboard: http://$DropletIP/admin" -ForegroundColor White
Write-Host "🔍 API Health: http://$DropletIP/health" -ForegroundColor White
Write-Host ""
Write-Host "📋 Next steps on your droplet:" -ForegroundColor Cyan
Write-Host "   1. SSH into your droplet: ssh streamin@$DropletIP" -ForegroundColor White
Write-Host "   2. Navigate to: cd StreamIn" -ForegroundColor White
Write-Host "   3. Install backend: cd backend && npm install --production" -ForegroundColor White
Write-Host "   4. Set environment variables in backend/.env" -ForegroundColor White
Write-Host "   5. Start server: pm2 start server.js --name 'streamin-backend'" -ForegroundColor White
Write-Host "   6. Test: curl http://localhost:8080" -ForegroundColor White
Write-Host ""

Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# StreamIn Frontend Deployment Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    StreamIn Frontend Deployment" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Build production version
Write-Host "Building production version..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed! Please fix errors first." -ForegroundColor Red
    Read-Host "Press Enter to continue"
    exit 1
}

Write-Host ""
Write-Host "Build successful! Uploading to droplet..." -ForegroundColor Green
Write-Host ""

# Upload to droplet
Write-Host "Uploading dist/ folder to droplet..." -ForegroundColor Yellow
scp -r dist/* streamin@159.89.137.41:/home/streamin/StreamIn/

if ($LASTEXITCODE -ne 0) {
    Write-Host "Upload failed! Please check your connection." -ForegroundColor Red
    Read-Host "Press Enter to continue"
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "    Deployment Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Your StreamIn app is now deployed at:" -ForegroundColor White
Write-Host "http://159.89.137.41" -ForegroundColor Cyan
Write-Host ""
Write-Host "To test the app, open the URL above." -ForegroundColor White
Write-Host ""
Read-Host "Press Enter to continue"

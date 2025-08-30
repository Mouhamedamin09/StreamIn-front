# One-Command StreamIn Deployment
Write-Host "🚀 Deploying StreamIn to DigitalOcean..." -ForegroundColor Green

# Build
Write-Host "📦 Building production version..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful!" -ForegroundColor Green
    
    # Deploy
    Write-Host "🚀 Uploading to droplet..." -ForegroundColor Yellow
    scp -r dist/* streamin@159.89.137.41:/home/streamin/StreamIn/
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "🎉 Deployment complete!" -ForegroundColor Green
        Write-Host "🌐 Your app is live at: http://159.89.137.41" -ForegroundColor Cyan
    } else {
        Write-Host "❌ Upload failed!" -ForegroundColor Red
    }
} else {
    Write-Host "❌ Build failed!" -ForegroundColor Red
}

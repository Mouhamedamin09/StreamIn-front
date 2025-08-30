# 🚀 StreamIn Droplet Upload Script
# Replace YOUR_DROPLET_IP with your actual droplet IP address

param(
    [Parameter(Mandatory=$true)]
    [string]$DropletIP
)

Write-Host "🚀 Uploading StreamIn to Droplet..." -ForegroundColor Green
Write-Host ""

# Check if dist folder exists
if (-not (Test-Path "dist")) {
    Write-Host "❌ Error: dist/ folder not found!" -ForegroundColor Red
    Write-Host "   Run 'npm run build' first to create the dist folder." -ForegroundColor Yellow
    exit 1
}

Write-Host "📤 Uploading dist/ folder to droplet $DropletIP..." -ForegroundColor Cyan
Write-Host ""

try {
    # Upload the dist folder
    scp -r dist/ "streamin@${DropletIP}:/home/streamin/StreamIn/"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Upload successful!" -ForegroundColor Green
        Write-Host ""
        Write-Host "🌐 Your StreamIn website is now accessible at:" -ForegroundColor Yellow
        Write-Host "   http://$DropletIP" -ForegroundColor White
        Write-Host ""
        Write-Host "📱 Admin Dashboard: http://$DropletIP/admin" -ForegroundColor White
        Write-Host "🔍 API Health: http://$DropletIP/api/health" -ForegroundColor White
    } else {
        Write-Host "❌ Upload failed!" -ForegroundColor Red
        Write-Host "   Check your droplet IP and SSH access." -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Error during upload: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

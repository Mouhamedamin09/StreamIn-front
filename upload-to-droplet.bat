@echo off
echo 🚀 Uploading StreamIn to Droplet...
echo.

REM Replace YOUR_DROPLET_IP with your actual droplet IP
set DROPLET_IP=YOUR_DROPLET_IP_HERE

echo 📤 Uploading dist/ folder to droplet %DROPLET_IP%...
echo.

REM Upload the dist folder
scp -r dist/ streamin@%DROPLET_IP%:/home/streamin/StreamIn/

if %ERRORLEVEL% EQU 0 (
    echo ✅ Upload successful!
    echo.
    echo 🌐 Your StreamIn website is now accessible at:
    echo    http://%DROPLET_IP%
    echo.
    echo 📱 Admin Dashboard: http://%DROPLET_IP%/admin
) else (
    echo ❌ Upload failed! Check your droplet IP and SSH access.
)

pause

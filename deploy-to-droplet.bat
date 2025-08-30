@echo off
echo 🚀 Deploying StreamIn to Droplet...
echo.

REM Set your droplet IP
set DROPLET_IP=159.89.137.41

echo 📤 Step 1: Uploading dist/ folder...
scp -r dist/ streamin@%DROPLET_IP%:/home/streamin/StreamIn/

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Upload failed! Check your SSH connection.
    pause
    exit /b 1
)

echo ✅ Frontend uploaded successfully!
echo.

echo 📤 Step 2: Uploading backend files...
scp -r backend/ streamin@%DROPLET_IP%:/home/streamin/StreamIn/

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Backend upload failed!
    pause
    exit /b 1
)

echo ✅ Backend uploaded successfully!
echo.

echo 📤 Step 3: Uploading package files...
scp package*.json streamin@%DROPLET_IP%:/home/streamin/StreamIn/

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Package files upload failed!
    pause
    exit /b 1
)

echo ✅ Package files uploaded successfully!
echo.

echo 🎉 Deployment completed!
echo.
echo 🌐 Your StreamIn website should now be accessible at:
echo    http://%DROPLET_IP%
echo.
echo 📱 Admin Dashboard: http://%DROPLET_IP%/admin
echo 🔍 API Health: http://%DROPLET_IP%/health
echo.
echo 📋 Next steps on your droplet:
echo    1. SSH into your droplet: ssh streamin@%DROPLET_IP%
echo    2. Navigate to: cd StreamIn
echo    3. Install backend: cd backend && npm install --production
echo    4. Set environment variables in backend/.env
echo    5. Start server: pm2 start server.js --name "streamin-backend"
echo    6. Test: curl http://localhost:8080
echo.

pause

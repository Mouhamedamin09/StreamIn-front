@echo off
echo ========================================
echo    StreamIn Frontend Deployment
echo ========================================
echo.

echo Building production version...
call npm run build

if %ERRORLEVEL% NEQ 0 (
    echo Build failed! Please fix errors first.
    pause
    exit /b 1
)

echo.
echo Build successful! Uploading to droplet...
echo.

echo Uploading dist/ folder to droplet...
scp -r dist/* streamin@159.89.137.41:/home/streamin/StreamIn/

if %ERRORLEVEL% NEQ 0 (
    echo Upload failed! Please check your connection.
    pause
    exit /b 1
)

echo.
echo ========================================
echo    Deployment Complete!
echo ========================================
echo.
echo Your StreamIn app is now deployed at:
echo http://159.89.137.41
echo.
echo To test the app, open the URL above.
echo.
pause

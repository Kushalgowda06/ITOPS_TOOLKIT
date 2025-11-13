@echo off
echo === ITOPS Deployment Script ===

echo Step 1: Building and pushing images to ECR...
bash build-and-push.sh

if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to build and push images
    pause
    exit /b 1
)

echo.
echo Step 2: Deploying to server...
bash deploy-to-server.sh

if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to deploy to server
    pause
    exit /b 1
)

echo.
echo === Deployment Complete ===
pause
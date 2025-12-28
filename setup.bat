@echo off
echo ========================================
echo MOPONS Project Setup
echo ========================================
echo.

REM Check if .env exists
if exist ".env" (
    echo [OK] .env file already exists
) else (
    echo [INFO] Creating .env file from template...
    copy .env.template .env
    echo [OK] .env file created
    echo [ACTION REQUIRED] Please edit .env file with your configuration
)

echo.
echo ========================================
echo Checking MongoDB...
echo ========================================

REM Check if MongoDB is running
net start | findstr /i "MongoDB" >nul
if %errorlevel%==0 (
    echo [OK] MongoDB service is running
) else (
    echo [WARNING] MongoDB service is not running
    echo.
    echo Attempting to start MongoDB...
    net start MongoDB
    if %errorlevel%==0 (
        echo [OK] MongoDB started successfully
    ) else (
        echo [ERROR] Could not start MongoDB
        echo.
        echo Please do one of the following:
        echo 1. Install MongoDB from https://www.mongodb.com/try/download/community
        echo 2. Use MongoDB Atlas (cloud) - Update MONGODB_URI in .env
        echo 3. Start MongoDB manually
        echo.
    )
)

echo.
echo ========================================
echo Installing Dependencies...
echo ========================================
if exist "node_modules" (
    echo [OK] Dependencies already installed
) else (
    echo [INFO] Installing npm packages...
    call npm install
)

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Edit .env file with your configuration (if needed)
echo 2. Run: npm run seed (to seed categories)
echo 3. Run: npm run dev (to start server)
echo.
pause

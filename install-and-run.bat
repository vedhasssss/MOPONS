@echo off
echo ===================================================
echo 🚀 MOPONS - Team Setup & Start Script
echo ===================================================
echo.

:: Check for Node.js
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed! Please install Node.js first.
    pause
    exit /b
)

echo ✅ Node.js is installed.
echo.

echo 📦 Installing Backend Dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install backend dependencies.
    pause
    exit /b
)

echo.
echo 📦 Installing Frontend Dependencies...
cd client
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies.
    cd ..
    pause
    exit /b
)
cd ..

echo.
echo 🌱 Seeding Database (Setting up initial data)...
call npm run seed
echo.

echo ===================================================
echo 🎉 Setup Complete! Starting MOPONS...
echo ===================================================
echo.
echo 1. Backend will start on port 5000
echo 2. Frontend will start on port 3000
echo.
echo Press any key to launch...
pause >nul

start cmd /k "npm run dev"
start cmd /k "cd client && npm start"

echo.
echo 🚀 Application launched! Check the new windows.
echo.
pause

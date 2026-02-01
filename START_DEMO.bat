@echo off
echo ========================================
echo    MOPONS - Starting All Services
echo ========================================
echo.

REM Check if MongoDB is running
echo [1/4] Checking MongoDB...
sc query MongoDB | find "RUNNING" >nul
if errorlevel 1 (
    echo Starting MongoDB...
    net start MongoDB
) else (
    echo MongoDB is already running
)
echo.

REM Start Python OCR Service in new window
echo [2/4] Starting Python OCR Service...
start "MOPONS - Python OCR" cmd /k "cd python-ocr-service && SET FLASK_SKIP_DOTENV=1 && python app.py"
timeout /t 5 /nobreak >nul
echo.

REM Start Node.js Backend in new window
echo [3/4] Starting Node.js Backend...
start "MOPONS - Backend" cmd /k "npm run dev all"
timeout /t 5 /nobreak >nul
echo.

REM Start React Frontend in new window
echo [4/4] Starting React Frontend...
start "MOPONS - Frontend" cmd /k "cd client && npm start"
echo.

echo ========================================
echo    All Services Starting!
echo ========================================
echo.
echo Python OCR:  http://localhost:5001
echo Backend:     http://localhost:5000
echo Frontend:    http://localhost:3000
echo.
echo Wait 30 seconds for everything to load...
echo Then open: http://localhost:3000
echo.
echo Press any key to open browser...
pause >nul

start http://localhost:3000

echo.
echo Demo is ready!
echo.
pause

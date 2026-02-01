@echo off
echo ================================
echo Starting Python OCR Service
echo ================================
echo.

cd python-ocr-service

echo Installing dependencies (if needed)...
pip install -r requirements.txt --quiet

echo.
echo Starting OCR service on port 5001...
echo.
python app.py

pause

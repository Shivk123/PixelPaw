@echo off
echo Starting PixelPaw Application...
echo.

echo [1/2] Starting Backend Server...
start "PixelPaw Backend" cmd /k "start_backend.bat"

timeout /t 5 /nobreak > nul

echo [2/2] Starting Frontend Server...
start "PixelPaw Frontend" cmd /k "start_frontend.bat"

echo.
echo PixelPaw is starting up!
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
echo.
pause
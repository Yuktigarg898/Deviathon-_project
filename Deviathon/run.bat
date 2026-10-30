@echo off
title CareConnect - Connected Healthcare and Elder Support System
echo =======================================================================
echo          Starting CareConnect (Deviathon Project)
echo =======================================================================
echo Launching local server and opening web browser...
echo.

cd /d "%~dp0"

REM Free port 5000 if an old instance is still lingering
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000 ^| findstr LISTENING') do taskkill /F /PID %%a >nul 2>&1

REM 1. Prefer Python launcher 'py' (recommended for Windows)
py -V >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Using Python 'py' launcher...
    start "" http://127.0.0.1:5000
    py server.py
    goto end
)

REM 2. Check local Python 3.14 install
if exist "%LOCALAPPDATA%\Python\pythoncore-3.14-64\python.exe" (
    echo Using local Python 3.14...
    start "" http://127.0.0.1:5000
    "%LOCALAPPDATA%\Python\pythoncore-3.14-64\python.exe" server.py
    goto end
)

REM 3. Check AppData Python bin
if exist "%LOCALAPPDATA%\Python\bin\python.exe" (
    echo Using AppData Python...
    start "" http://127.0.0.1:5000
    "%LOCALAPPDATA%\Python\bin\python.exe" server.py
    goto end
)

REM 4. Check system 'python' command
python -c "import sys" >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Using system Python...
    start "" http://127.0.0.1:5000
    python server.py
    goto end
)

echo Python not detected. Opening index.html directly in browser...
start "" index.html

:end
pause

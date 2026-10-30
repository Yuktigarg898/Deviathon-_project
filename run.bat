@echo off
title CareConnect - Connected Healthcare & Elder Support System
echo =======================================================================
echo          Starting CareConnect (Deviathon Project)
echo =======================================================================
echo Launching local server and opening web browser...
echo.

cd /d "%~dp0"

REM Free port 5000 if an old zombie instance is still lingering
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000 ^| findstr LISTENING') do taskkill /F /PID %%a >nul 2>&1

REM Launch Python Server
where py >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Using 'py' launcher...
    start "" http://127.0.0.1:5000
    py server.py
    goto end
where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    start http://localhost:5000
    python server.py
) else (
    where py >nul 2>nul
    if %ERRORLEVEL% EQU 0 (
        start http://localhost:5000
        py server.py
    ) else if exist "%LOCALAPPDATA%\Python\bin\python.exe" (
        start http://localhost:5000
        "%LOCALAPPDATA%\Python\bin\python.exe" server.py
    ) else (
        echo Python not found in PATH. Opening index.html directly in browser...
        start index.html
    )
)

where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Using 'python' in PATH...
    start "" http://127.0.0.1:5000
    python server.py
    goto end
)

if exist "%LOCALAPPDATA%\Python\pythoncore-3.14-64\python.exe" (
    echo Using local Python 3.14...
    start "" http://127.0.0.1:5000
    "%LOCALAPPDATA%\Python\pythoncore-3.14-64\python.exe" server.py
    goto end
)

if exist "%LOCALAPPDATA%\Python\bin\python.exe" (
    echo Using local AppData Python...
    start "" http://127.0.0.1:5000
    "%LOCALAPPDATA%\Python\bin\python.exe" server.py
    goto end
)

echo Python not found. Opening index.html directly in browser...
start index.html

:end
pause

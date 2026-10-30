@echo off
title CareConnect - Connected Healthcare & Elder Support System
echo =======================================================================
echo          Starting CareConnect (Deviathon Project)
echo =======================================================================
echo Launching local server and opening web browser...
echo.

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
pause

@echo off
title CareConnect - Connected Healthcare & Elder Support System
echo =======================================================================
echo          Starting CareConnect (Deviathon Project)
echo =======================================================================
echo Launching local server and opening web browser...
echo.

<<<<<<< Updated upstream
REM Try to launch python server using py launcher, python in PATH, or local Python directory
where py >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    start http://localhost:5000
    py server.py
) else (
    where python >nul 2>nul
    if %ERRORLEVEL% EQU 0 (
        start http://localhost:5000
        python server.py
    ) else (
        if exist "%LOCALAPPDATA%\Python\pythoncore-3.14-64\python.exe" (
            start http://localhost:5000
            "%LOCALAPPDATA%\Python\pythoncore-3.14-64\python.exe" server.py
        ) else if exist "%LOCALAPPDATA%\Python\bin\python.exe" (
            start http://localhost:5000
            "%LOCALAPPDATA%\Python\bin\python.exe" server.py
        ) else (
            echo Python not found. Opening index.html directly in browser...
=======
REM Try local AppData Python first, then py launcher, then python
if exist "%LOCALAPPDATA%\Python\bin\python.exe" (
    "%LOCALAPPDATA%\Python\bin\python.exe" server.py
) else (
    where py >nul 2>nul
    if %ERRORLEVEL% EQU 0 (
        py server.py
    ) else (
        where python >nul 2>nul
        if %ERRORLEVEL% EQU 0 (
            python server.py
        ) else (
            echo Python not found in PATH. Opening index.html directly in browser...
>>>>>>> Stashed changes
            start index.html
        )
    )
)
pause

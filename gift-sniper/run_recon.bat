@echo off
chcp 65001 >nul
cd /d "%~dp0"

set "PY=python"
where py >nul 2>nul && set "PY=py -3"

if not exist ".venv\Scripts\python.exe" (
    echo Creating virtual environment...
    %PY% -m venv .venv
    if errorlevel 1 goto nopython
)

echo Installing packages...
".venv\Scripts\python.exe" -m pip install -q --disable-pip-version-check -r requirements.txt
if errorlevel 1 goto failed

".venv\Scripts\python.exe" recon.py
pause
exit /b 0

:nopython
echo.
echo Python not found. Install Python 3.12 from https://www.python.org/downloads/
echo and tick "Add python.exe to PATH" during installation.
pause
exit /b 1

:failed
echo.
echo Package installation failed. Send this window text to Claude.
pause
exit /b 1

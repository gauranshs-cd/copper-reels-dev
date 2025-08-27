@echo off
echo Starting YouTube Scraper API...

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Python is not installed or not in PATH
    echo Please install Python and add it to PATH
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo Node.js is not installed or not in PATH
    echo Please install Node.js and add it to PATH
    pause
    exit /b 1
)

REM Install Python dependencies if needed
if not exist "node_modules" (
    echo Installing Node.js dependencies...
    npm install express cors
)

REM Check if Playwright is installed
python -c "import playwright" >nul 2>&1
if errorlevel 1 (
    echo Installing Python dependencies...
    pip install -r requirements.txt
    echo Installing Playwright browsers...
    playwright install chromium
)

REM Start the API server
echo Starting YouTube Analysis API on http://localhost:3001
node youtube-video-api.js

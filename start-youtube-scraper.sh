#!/bin/bash

echo "Starting YouTube Scraper API..."

# Check if Python is installed
if ! command -v python3 &> /dev/null && ! command -v python &> /dev/null; then
    echo "Python is not installed or not in PATH"
    echo "Please install Python and add it to PATH"
    exit 1
fi

# Use python3 if available, otherwise python
PYTHON_CMD="python3"
if ! command -v python3 &> /dev/null; then
    PYTHON_CMD="python"
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed or not in PATH"
    echo "Please install Node.js and add it to PATH"
    exit 1
fi

# Install Node.js dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing Node.js dependencies..."
    npm install express cors
fi

# Check if Playwright is installed
$PYTHON_CMD -c "import playwright" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "Installing Python dependencies..."
    pip install -r requirements.txt
    echo "Installing Playwright browsers..."
    playwright install chromium
fi

# Start the API server
echo "Starting YouTube Analysis API on http://localhost:3001"
node youtube-video-api.js

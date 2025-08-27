const express = require('express');
const cors = require('cors');
const { execSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Check if dependencies are installed
function checkDependencies() {
  try {
    // Check if Python is available
    execSync('python --version', { stdio: 'ignore' });
  } catch {
    try {
      execSync('python3 --version', { stdio: 'ignore' });
    } catch {
      console.error('Python is not installed or not in PATH');
      return false;
    }
  }
  
  // Check if playwright is installed
  try {
    execSync('python -c "import playwright"', { stdio: 'ignore' });
  } catch {
    try {
      execSync('python3 -c "import playwright"', { stdio: 'ignore' });
    } catch {
      console.log('Installing playwright...');
      try {
        execSync('pip install playwright', { stdio: 'inherit' });
        execSync('playwright install chromium', { stdio: 'inherit' });
      } catch {
        try {
          execSync('pip3 install playwright', { stdio: 'inherit' });
          execSync('playwright install chromium', { stdio: 'inherit' });
        } catch (error) {
          console.error('Failed to install playwright:', error.message);
          return false;
        }
      }
    }
  }
  
  return true;
}

// YouTube video analysis endpoint
app.post('/api/analyze-video', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'YouTube URL is required' });
    }
    
    console.log(`Analyzing YouTube video: ${url}`);
    
    // Check dependencies
    if (!checkDependencies()) {
      return res.status(500).json({ 
        error: 'Required dependencies not available',
        details: 'Please install Python and pip'
      });
    }
    
    // Call Python scraper
    const pythonScript = path.join(__dirname, 'youtube_video_scraper.py');
    
    // Try python3 first, then python
    let pythonCmd = 'python3';
    try {
      execSync('python3 --version', { stdio: 'ignore' });
    } catch {
      pythonCmd = 'python';
    }
    
    const pythonProcess = spawn(pythonCmd, [pythonScript, url]);
    
    let output = '';
    let errorOutput = '';
    
    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });
    
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error('Python script error:', errorOutput);
        return res.status(500).json({ 
          error: 'Failed to analyze video',
          details: errorOutput 
        });
      }
      
      try {
        const result = JSON.parse(output);
        
        if (result.error) {
          return res.status(400).json(result);
        }
        
        console.log('Video analysis completed successfully');
        res.json(result);
      } catch (parseError) {
        console.error('Failed to parse Python output:', parseError);
        console.error('Raw output:', output);
        res.status(500).json({ 
          error: 'Failed to parse analysis results',
          details: parseError.message 
        });
      }
    });
    
    // Set timeout for long-running requests
    setTimeout(() => {
      pythonProcess.kill();
      if (!res.headersSent) {
        res.status(408).json({ error: 'Request timeout - video analysis took too long' });
      }
    }, 45000); // 45 second timeout
    
  } catch (error) {
    console.error('API error:', error);
    if (!res.headersSent) {
      res.status(500).json({ 
        error: 'Internal server error',
        details: error.message 
      });
    }
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'YouTube Video Analysis API is running' });
});

// Auto-install dependencies on startup
console.log('Checking dependencies...');
if (checkDependencies()) {
  console.log('Dependencies OK');
} else {
  console.log('Some dependencies missing, but API will try to install them on first request');
}

// Start server
app.listen(port, () => {
  console.log(`YouTube Video Analysis API running on http://localhost:${port}`);
  console.log('Endpoints:');
  console.log('  POST /api/analyze-video - Analyze YouTube video');
  console.log('  GET /health - Health check');
});

module.exports = app;

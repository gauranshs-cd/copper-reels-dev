const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// YouTube video analysis endpoint
app.post('/api/analyze-video', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'YouTube URL is required' });
    }
    
    console.log(`Analyzing YouTube video: ${url}`);
    
    // Call Python scraper
    const pythonScript = path.join(__dirname, 'youtube_video_scraper.py');
    const pythonProcess = spawn('python', [pythonScript, url]);
    
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
      res.status(408).json({ error: 'Request timeout - video analysis took too long' });
    }, 60000); // 60 second timeout
    
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'YouTube Video Analysis API is running' });
});

// Start server
app.listen(port, () => {
  console.log(`YouTube Video Analysis API running on http://localhost:${port}`);
  console.log('Endpoints:');
  console.log('  POST /api/analyze-video - Analyze YouTube video');
  console.log('  GET /health - Health check');
});

module.exports = app;

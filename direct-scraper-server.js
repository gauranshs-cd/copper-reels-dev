const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const { promisify } = require('util');
const path = require('path');

const execAsync = promisify(exec);
const app = express();
const port = 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Direct Python scraper endpoint (no subprocess spawning)
app.post('/api/scrape-direct', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'YouTube URL is required' });
    }
    
    console.log(`Direct scraping YouTube video: ${url}`);
    
    // Path to Python scraper
    const pythonScript = path.join(__dirname, 'youtube_video_scraper.py');
    
    // Try different Python commands
    const pythonCommands = ['python', 'python3', 'py'];
    let result = null;
    let lastError = null;
    
    for (const pythonCmd of pythonCommands) {
      try {
        console.log(`Trying ${pythonCmd}...`);
        
        const command = `${pythonCmd} "${pythonScript}" "${url}"`;
        const { stdout, stderr } = await execAsync(command, {
          timeout: 60000, // 60 second timeout
          maxBuffer: 1024 * 1024 // 1MB buffer
        });

        if (stderr && !stderr.includes('warning')) {
          console.warn(`${pythonCmd} warnings:`, stderr);
        }

        result = JSON.parse(stdout);
        
        if (result.error) {
          throw new Error(result.error);
        }

        console.log(`Successfully scraped with ${pythonCmd}`);
        break;
      } catch (error) {
        console.log(`${pythonCmd} failed:`, error.message);
        lastError = error;
        continue;
      }
    }
    
    if (!result) {
      throw new Error(`All Python commands failed. Last error: ${lastError?.message || 'Unknown error'}`);
    }
    
    res.json(result);
    
  } catch (error) {
    console.error('Direct scraper API error:', error);
    
    if (error.code === 'TIMEOUT') {
      return res.status(408).json({ error: 'Request timeout - video analysis took too long' });
    }
    
    res.status(500).json({ 
      error: 'Failed to scrape video',
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Direct YouTube Scraper API is running' });
});

// Start server
app.listen(port, () => {
  console.log(`Direct YouTube Scraper API running on http://localhost:${port}`);
  console.log('Endpoints:');
  console.log('  POST /api/scrape-direct - Direct YouTube video scraping');
  console.log('  GET /health - Health check');
});

module.exports = app;

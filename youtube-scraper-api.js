const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// YouTube video analysis endpoint
app.post('/api/analyze-video', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    console.log(`Analyzing YouTube video: ${url}`);

    // Call Python scraper
    const pythonProcess = spawn('python', ['youtube_video_scraper.py', url], {
      cwd: __dirname
    });

    let output = '';
    let errorOutput = '';

    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        try {
          const result = JSON.parse(output);
          console.log('Video analysis completed successfully');
          res.json(result);
        } catch (parseError) {
          console.error('Failed to parse Python output:', parseError);
          res.status(500).json({ error: 'Failed to parse scraper output' });
        }
      } else {
        console.error('Python scraper failed:', errorOutput);
        res.status(500).json({ error: 'Failed to scrape video data' });
      }
    });

    pythonProcess.on('error', (error) => {
      console.error('Failed to start Python process:', error);
      res.status(500).json({ error: 'Failed to start scraper process' });
    });

  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'YouTube Scraper API is running' });
});

app.listen(PORT, () => {
  console.log(`YouTube Scraper API running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

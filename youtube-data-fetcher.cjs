const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');
const fetch = require('node-fetch');

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Extract video ID from YouTube URL
function extractVideoId(url) {
  const patterns = [
    /(?:youtube-data-fetcher.cjs\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }
  return null;
}

// Fallback using YouTube oEmbed API
async function getVideoDataFromOEmbed(url) {
  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
    const response = await fetch(oembedUrl);
    
    if (response.ok) {
      const data = await response.json();
      const videoId = extractVideoId(url);
      
      return {
        video_id: videoId,
        url: url,
        title: data.title || `YouTube Video ${videoId}`,
        channel: data.author_name || 'Unknown Channel',
        views: 'N/A',
        publishedAt: 'Unknown',
        duration: 'N/A',
        description: 'Description not available via oEmbed',
        transcript: 'Transcript not available'
      };
    }
  } catch (error) {
    console.error('oEmbed API error:', error);
  }
  return null;
}

// Enhanced YouTube video analysis endpoint
app.post('/api/analyze-video', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'YouTube URL is required' });
    }
    
    const videoId = extractVideoId(url);
    if (!videoId) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }
    
    console.log(`Analyzing YouTube video: ${url}`);
    
    // Try Python scraper first
    try {
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
      
      const result = await new Promise((resolve, reject) => {
        pythonProcess.on('close', (code) => {
          if (code !== 0) {
            console.error('Python script error:', errorOutput);
            reject(new Error('Python scraper failed'));
            return;
          }
          
          try {
            const result = JSON.parse(output);
            if (result.error) {
              reject(new Error(result.error));
            } else {
              resolve(result);
            }
          } catch (parseError) {
            console.error('Failed to parse Python output:', parseError);
            reject(parseError);
          }
        });
        
        // Set timeout for long-running requests
        setTimeout(() => {
          pythonProcess.kill();
          reject(new Error('Request timeout'));
        }, 30000); // 30 second timeout
      });
      
      console.log('Video analysis completed successfully via Python scraper');
      res.json(result);
      
    } catch (scraperError) {
      console.log('Python scraper failed, trying oEmbed fallback:', scraperError.message);
      
      // Fallback to oEmbed API
      const oembedData = await getVideoDataFromOEmbed(url);
      
      if (oembedData) {
        console.log('Video analysis completed via oEmbed fallback');
        res.json(oembedData);
      } else {
        // Final fallback with basic data
        const basicData = {
          video_id: videoId,
          url: url,
          title: `YouTube Video ${videoId}`,
          channel: 'Unknown Channel',
          views: 'N/A',
          publishedAt: 'Unknown',
          duration: 'N/A',
          description: 'Unable to fetch video details',
          transcript: 'Transcript not available'
        };
        
        console.log('Using basic fallback data');
        res.json(basicData);
      }
    }
    
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

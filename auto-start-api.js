const express = require('express');
const cors = require('cors');
const apiManager = require('./api-manager');

const app = express();
const port = 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Auto-start API endpoint
app.post('/api/start-youtube-scraper', async (req, res) => {
  try {
    console.log('Received request to start YouTube scraper...');
    
    // Check if already running
    const isRunning = await apiManager.isAPIRunning();
    if (isRunning) {
      return res.json({ 
        success: true, 
        message: 'YouTube scraper API is already running',
        status: 'running'
      });
    }

    // Start the API
    const started = await apiManager.startYouTubeAPI();
    
    if (started) {
      res.json({ 
        success: true, 
        message: 'YouTube scraper API started successfully',
        status: 'started'
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: 'Failed to start YouTube scraper API',
        status: 'failed'
      });
    }
  } catch (error) {
    console.error('Error starting YouTube scraper:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal error starting YouTube scraper',
      error: error.message,
      status: 'error'
    });
  }
});

// Check API status endpoint
app.get('/api/youtube-scraper-status', async (req, res) => {
  try {
    const isRunning = await apiManager.isAPIRunning();
    res.json({ 
      running: isRunning,
      status: isRunning ? 'running' : 'stopped'
    });
  } catch (error) {
    res.json({ 
      running: false,
      status: 'error',
      error: error.message
    });
  }
});

// Stop API endpoint
app.post('/api/stop-youtube-scraper', async (req, res) => {
  try {
    const stopped = await apiManager.stopYouTubeAPI();
    res.json({ 
      success: stopped, 
      message: stopped ? 'YouTube scraper API stopped' : 'API was not running',
      status: 'stopped'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error stopping YouTube scraper API',
      error: error.message
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Auto-start API is running' });
});

// Start server
app.listen(port, () => {
  console.log(`Auto-start API running on http://localhost:${port}`);
  console.log('Endpoints:');
  console.log('  POST /api/start-youtube-scraper - Start YouTube scraper');
  console.log('  GET /api/youtube-scraper-status - Check scraper status');
  console.log('  POST /api/stop-youtube-scraper - Stop YouTube scraper');
});

module.exports = app;

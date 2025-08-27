# YouTube Video Scraper Setup

This document explains how to set up and use the YouTube video scraper for the Copper Reels application.

## Overview

The YouTube scraper extracts comprehensive video data including:
- Video title
- Channel name
- View count
- Publishing date
- Video duration
- Description
- Video transcript

## Files Created

1. **`youtube_video_scraper.py`** - Python scraper using Playwright
2. **`youtube-video-api.js`** - Node.js API wrapper
3. **`requirements.txt`** - Python dependencies

## Setup Instructions

### 1. Install Python Dependencies

```bash
pip install -r requirements.txt
playwright install chromium
```

### 2. Install Node.js Dependencies

```bash
npm install express cors
```

### 3. Start the YouTube Analysis API

```bash
node youtube-video-api.js
```

The API will run on `http://localhost:3001`

## API Endpoints

### POST /api/analyze-video

Analyzes a YouTube video and returns comprehensive data.

**Request:**
```json
{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

**Response:**
```json
{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID",
  "video_id": "VIDEO_ID",
  "title": "Video Title",
  "channel": "Channel Name",
  "views": "1.2M views",
  "publishedAt": "2 weeks ago",
  "duration": "10:24",
  "description": "Video description...",
  "transcript": "Video transcript content..."
}
```

### GET /health

Health check endpoint to verify the API is running.

## Usage in Frontend

The frontend automatically calls the scraper API when you paste a YouTube URL in the skyscraper research section. The scraped data includes:

- Real video title (not sample text)
- Actual channel name
- Current view count
- Publishing date
- Video transcript (expandable section)

## Testing

1. Start the API server:
   ```bash
   node youtube-video-api.js
   ```

2. Test with a YouTube URL:
   ```bash
   python youtube_video_scraper.py "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
   ```

3. Or test via the API:
   ```bash
   curl -X POST http://localhost:3001/api/analyze-video \
     -H "Content-Type: application/json" \
     -d '{"url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}'
   ```

## Troubleshooting

- **Python script fails**: Ensure Playwright browsers are installed with `playwright install chromium`
- **API timeout**: Some videos may take longer to analyze. The API has a 60-second timeout.
- **Transcript unavailable**: Not all videos have transcripts. The scraper will return "Transcript not available" in such cases.
- **Rate limiting**: YouTube may rate limit requests. The scraper includes delays and user agent rotation to minimize this.

## Integration

The scraper is now integrated with the video planning page. When you:
1. Go to Planning → Research tab
2. Paste a YouTube URL
3. Click "Add Video"

The system will automatically fetch real video data instead of showing sample text.

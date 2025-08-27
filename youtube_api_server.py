#!/usr/bin/env python3
"""
YouTube Video Analysis API Server
CORS proxy implementation for YouTube metadata extraction
"""

import json
import sys
import re
import traceback
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import os
from urllib.parse import urlparse, parse_qs

app = Flask(__name__)
CORS(app)

class YouTubeAnalyzer:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        
    def extract_video_id(self, url):
        """Extract video ID from YouTube URL"""
        patterns = [
            r'(?:v=|\/)([0-9A-Za-z_-]{11}).*',
            r'(?:embed\/)([0-9A-Za-z_-]{11})',
            r'(?:v\/|youtu\.be\/)([0-9A-Za-z_-]{11})'
        ]
        
        for pattern in patterns:
            match = re.search(pattern, url)
            if match:
                return match.group(1)
        return None
    
    def extract_video_data(self, url):
        """Extract video data from YouTube URL using CORS proxy"""
        try:
            video_id = self.extract_video_id(url)
            if not video_id:
                return {
                    "success": False,
                    "error": "Invalid YouTube URL - could not extract video ID"
                }
            
            print(f"Extracting data for video ID: {video_id}")
            
            # Use multiple methods to get video data
            data = self.get_video_metadata(video_id, url)
            
            return {
                "success": True,
                "data": data
            }
            
        except Exception as e:
            print(f"Error extracting video data: {str(e)}")
            traceback.print_exc()
            return {
                "success": False,
                "error": f"Failed to extract video data: {str(e)}"
            }
    
    def get_video_metadata(self, video_id, original_url):
        """Get video metadata using various methods"""
        try:
            # Method 1: Try oEmbed API
            oembed_data = self.get_oembed_data(original_url)
            if oembed_data:
                return oembed_data
            
            # Method 2: Try YouTube page scraping via proxy
            scraped_data = self.scrape_youtube_page(video_id, original_url)
            if scraped_data:
                return scraped_data
            
            # Method 3: Fallback with basic info
            return {
                "title": f"YouTube Video {video_id}",
                "channel": "Unknown Channel",
                "views": "Views not available",
                "duration": "Duration not available", 
                "description": "Description not available",
                "transcript": "Transcript not available",
                "url": original_url
            }
            
        except Exception as e:
            print(f"Metadata extraction error: {e}")
            return {
                "title": f"YouTube Video {video_id}",
                "channel": "Unknown Channel",
                "views": "Error extracting views",
                "duration": "Error extracting duration",
                "description": "Error extracting description", 
                "transcript": "Error extracting transcript",
                "url": original_url
            }
    
    def get_oembed_data(self, url):
        """Try to get video data using YouTube oEmbed API"""
        try:
            oembed_url = f"https://www.youtube.com/oembed?url={url}&format=json"
            response = self.session.get(oembed_url, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                return {
                    "title": data.get('title', 'Title not available'),
                    "channel": data.get('author_name', 'Channel not available'),
                    "views": "Views not available via oEmbed",
                    "duration": "Duration not available via oEmbed",
                    "description": "Description not available via oEmbed",
                    "transcript": "Transcript not available via oEmbed",
                    "url": url
                }
        except Exception as e:
            print(f"oEmbed error: {e}")
            return None
    
    def scrape_youtube_page(self, video_id, url):
        """Scrape YouTube page via CORS proxy"""
        try:
            # Use a CORS proxy to fetch YouTube page
            proxy_urls = [
                f"https://api.allorigins.win/raw?url={url}",
                f"https://corsproxy.io/?{url}",
                f"https://cors-anywhere.herokuapp.com/{url}"
            ]
            
            for proxy_url in proxy_urls:
                try:
                    print(f"Trying proxy: {proxy_url}")
                    response = self.session.get(proxy_url, timeout=15)
                    
                    if response.status_code == 200:
                        html_content = response.text
                        return self.parse_youtube_html(html_content, url)
                        
                except Exception as e:
                    print(f"Proxy {proxy_url} failed: {e}")
                    continue
            
            # Direct request as fallback (may be blocked by CORS)
            try:
                response = self.session.get(url, timeout=10)
                if response.status_code == 200:
                    return self.parse_youtube_html(response.text, url)
            except Exception as e:
                print(f"Direct request failed: {e}")
                
        except Exception as e:
            print(f"Page scraping error: {e}")
            
        return None
    
    def parse_youtube_html(self, html_content, url):
        """Parse YouTube HTML to extract metadata"""
        try:
            data = {
                "title": self.extract_title_from_html(html_content),
                "channel": self.extract_channel_from_html(html_content),
                "views": self.extract_views_from_html(html_content),
                "duration": self.extract_duration_from_html(html_content),
                "description": self.extract_description_from_html(html_content),
                "transcript": "Transcript not available via scraping",
                "url": url
            }
            return data
            
        except Exception as e:
            print(f"HTML parsing error: {e}")
            return None
    
    def extract_title_from_html(self, html):
        """Extract title from HTML"""
        patterns = [
            r'<title>([^<]+) - YouTube</title>',
            r'"title":"([^"]+)"',
            r'<meta property="og:title" content="([^"]+)"',
            r'name="title" content="([^"]+)"'
        ]
        
        for pattern in patterns:
            match = re.search(pattern, html, re.IGNORECASE)
            if match:
                title = match.group(1).strip()
                if title and title != "YouTube":
                    return title
        
        return "Title not found"
    
    def extract_channel_from_html(self, html):
        """Extract channel name from HTML"""
        patterns = [
            r'"author":"([^"]+)"',
            r'"channelName":"([^"]+)"',
            r'<meta property="og:video:tag" content="([^"]+)"',
            r'"ownerChannelName":"([^"]+)"'
        ]
        
        for pattern in patterns:
            match = re.search(pattern, html, re.IGNORECASE)
            if match:
                channel = match.group(1).strip()
                if channel:
                    return channel
        
        return "Channel not found"
    
    def extract_views_from_html(self, html):
        """Extract view count from HTML"""
        patterns = [
            r'"viewCount":"([^"]+)"',
            r'([\d,]+)\s*views?',
            r'"views":"([^"]+)"',
            r'viewCount.*?([\d,]+)'
        ]
        
        for pattern in patterns:
            match = re.search(pattern, html, re.IGNORECASE)
            if match:
                views = match.group(1).strip()
                if views:
                    return views if 'view' in views.lower() else f"{views} views"
        
        return "Views not found"
    
    def extract_duration_from_html(self, html):
        """Extract duration from HTML"""
        patterns = [
            r'"lengthSeconds":"(\d+)"',
            r'"duration":"([^"]+)"',
            r'"approxDurationMs":"(\d+)"'
        ]
        
        for pattern in patterns:
            match = re.search(pattern, html)
            if match:
                if 'lengthSeconds' in pattern:
                    seconds = int(match.group(1))
                    minutes = seconds // 60
                    seconds = seconds % 60
                    return f"{minutes}:{seconds:02d}"
                else:
                    return match.group(1)
        
        return "Duration not found"
    
    def extract_description_from_html(self, html):
        """Extract description from HTML"""
        patterns = [
            r'"description":"([^"]+)"',
            r'<meta property="og:description" content="([^"]+)"',
            r'name="description" content="([^"]+)"'
        ]
        
        for pattern in patterns:
            match = re.search(pattern, html, re.IGNORECASE)
            if match:
                desc = match.group(1).strip()
                if desc:
                    return desc[:500] + "..." if len(desc) > 500 else desc
        
        return "Description not available"
    
    

# Global analyzer instance
analyzer = YouTubeAnalyzer()

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "OK", "message": "YouTube Analysis API is running"})

@app.route('/api/analyze-video', methods=['POST'])
def analyze_video():
    """Analyze YouTube video endpoint"""
    try:
        data = request.get_json()
        if not data or 'url' not in data:
            return jsonify({"error": "YouTube URL is required"}), 400
        
        url = data['url']
        
        # Validate YouTube URL
        if 'youtube.com/watch' not in url and 'youtu.be/' not in url:
            return jsonify({"error": "Invalid YouTube URL"}), 400
        
        print(f"Analyzing video: {url}")
        
        # Run synchronous analysis (no async needed)
        result = analyzer.extract_video_data(url)
        return jsonify(result)
            
    except Exception as e:
        print(f"API Error: {str(e)}")
        traceback.print_exc()
        return jsonify({
            "success": False,
            "error": f"Internal server error: {str(e)}"
        }), 500

def install_dependencies():
    """Install required Python packages"""
    required_packages = ['flask', 'flask-cors', 'requests']
    
    for package in required_packages:
        try:
            __import__(package.replace('-', '_'))
            print(f"✓ {package} is already installed")
        except ImportError:
            print(f"Installing {package}...")
            try:
                subprocess.check_call([sys.executable, '-m', 'pip', 'install', package])
                print(f"✓ {package} installed successfully")
            except subprocess.CalledProcessError as e:
                print(f"✗ Failed to install {package}: {e}")
                return False
    
    return True

if __name__ == '__main__':
    print("YouTube Video Analysis API Server")
    print("=" * 40)
    
    # Check and install dependencies
    print("Checking dependencies...")
    if not install_dependencies():
        print("Failed to install dependencies. Exiting.")
        sys.exit(1)
    
    print("\nStarting server...")
    print("API Endpoints:")
    print("  POST /api/analyze-video - Analyze YouTube video")
    print("  GET /health - Health check")
    print("\nServer running on http://localhost:3001")
    print("Press Ctrl+C to stop")
    
    try:
        app.run(host='0.0.0.0', port=3001, debug=False)
    except KeyboardInterrupt:
        try:
            print("Shutting down server...")
            print("Server stopped.")
        except Exception as e:
            print(f"Error shutting down server: {e}")

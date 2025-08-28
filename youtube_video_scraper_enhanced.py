#!/usr/bin/env python3
"""
Enhanced YouTube Video Scraper using pytube and BeautifulSoup
Extracts comprehensive video data including title, channel, views, posting time, and more
"""

import asyncio
import json
import sys
import re
from urllib.parse import urlparse, parse_qs
from playwright.async_api import async_playwright
import argparse
from pytube import YouTube
import requests
from bs4 import BeautifulSoup
from datetime import datetime

class YouTubeVideoScraper:
    def __init__(self):
        self.playwright = None
        self.browser = None
        self.page = None
    
    async def init_browser(self):
        """Initialize browser and page"""
        self.playwright = await async_playwright().start()
        self.browser = await self.playwright.chromium.launch(headless=True)
        self.page = await self.browser.new_page()
        
        # Set user agent using the correct method
        await self.page.set_extra_http_headers({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        })
    
    async def close_browser(self):
        """Close browser"""
        if self.browser:
            await self.browser.close()
        if self.playwright:
            await self.playwright.stop()
    
    def extract_video_id(self, url):
        """Extract video ID from YouTube URL"""
        patterns = [
            r'(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)',
            r'youtube\.com\/v\/([^&\n?#]+)',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, url)
            if match:
                return match.group(1)
        
        return None
    
    def scrape_video_data_pytube(self, url):
        """Enhanced scrape using pytube and BeautifulSoup"""
        try:
            # Initialize YouTube object
            yt = YouTube(url)

            # Basic details from pytube
            video_data = {
                "url": url,
                "video_id": self.extract_video_id(url),
                "title": yt.title,
                "channel": yt.author,
                "views": f"{yt.views:,} views" if yt.views else "N/A",
                "description": yt.description if yt.description else "No description available",
                "duration": f"{yt.length // 60}:{yt.length % 60:02d}" if yt.length else "N/A",
                "thumbnail_url": yt.thumbnail_url,
                "publishedAt": yt.publish_date.strftime("%Y-%m-%d") if yt.publish_date else "Unknown",
                "length_seconds": yt.length
            }

            # Fetch additional metadata using BeautifulSoup
            try:
                response = requests.get(url, timeout=10)
                if response.status_code == 200:
                    soup = BeautifulSoup(response.text, "html.parser")

                    # Try to get subscriber count
                    subs_meta = soup.find("yt-formatted-string", {"id": "owner-sub-count"})
                    if subs_meta:
                        video_data["subscribers"] = subs_meta.text
                    else:
                        video_data["subscribers"] = "Unknown"

                    # Additional metadata from page source
                    page_text = response.text
                    
                    # Try to extract more precise view count
                    view_match = re.search(r'"viewCount":{"simpleText":"([^"]+)"', page_text)
                    if view_match:
                        video_data["views"] = view_match.group(1)
                    
                    # Try to extract like count
                    like_match = re.search(r'"accessibilityText":"([^"]*like[^"]*)"', page_text, re.IGNORECASE)
                    if like_match:
                        video_data["likes"] = like_match.group(1)
                    else:
                        video_data["likes"] = "N/A"

            except Exception as e:
                print(f"BeautifulSoup extraction failed: {e}")
                video_data["subscribers"] = "Unknown"
                video_data["likes"] = "N/A"

            return video_data

        except Exception as e:
            return {"error": str(e)}

    async def scrape_video_data(self, url):
        """Primary scrape method - tries pytube first, falls back to Playwright"""
        try:
            # Try pytube method first (faster and more reliable)
            pytube_result = self.scrape_video_data_pytube(url)
            if "error" not in pytube_result:
                # Add transcript using Playwright if needed
                try:
                    await self.init_browser()
                    await self.page.goto(url, wait_until='domcontentloaded', timeout=30000)
                    transcript = await self.extract_simple_transcript()
                    pytube_result["transcript"] = transcript
                    await self.close_browser()
                except:
                    pytube_result["transcript"] = "Transcript not available"
                
                return pytube_result
            
            # Fallback to original Playwright method
            return await self.scrape_video_data_playwright(url)
            
        except Exception as e:
            return {"error": f"Failed to scrape video: {str(e)}"}

    async def scrape_video_data_playwright(self, url):
        """Original Playwright scraping method as fallback"""
        try:
            video_id = self.extract_video_id(url)
            if not video_id:
                return {"error": "Invalid YouTube URL"}
            
            # Navigate to video page
            await self.page.goto(url, wait_until='domcontentloaded', timeout=30000)
            await self.page.wait_for_timeout(2000)
            
            video_data = {
                "url": url,
                "video_id": video_id,
                "title": None,
                "channel": None,
                "views": None,
                "publishedAt": None,
                "transcript": None,
                "duration": None,
                "description": None
            }
            
            # Extract title - simple selector
            try:
                title = await self.page.locator('h1 yt-formatted-string').first.inner_text(timeout=5000)
                video_data["title"] = title
            except:
                try:
                    title = await self.page.locator('h1').first.inner_text(timeout=3000)
                    video_data["title"] = title
                except:
                    video_data["title"] = f"YouTube Video {video_id}"
            
            # Extract channel name - simple selector
            try:
                channel = await self.page.locator('ytd-channel-name a').first.inner_text(timeout=3000)
                video_data["channel"] = channel
            except:
                try:
                    channel = await self.page.locator('#owner-text a').first.inner_text(timeout=3000)
                    video_data["channel"] = channel
                except:
                    video_data["channel"] = "Unknown Channel"
            
            # Extract views - simple text search
            try:
                page_text = await self.page.content()
                view_patterns = [
                    r'([0-9,\.]+[KMB]?)\s+views',
                    r'([0-9,\.]+)\s+views',
                    r'"viewCount":{"simpleText":"([^"]+)"}'
                ]
                
                for pattern in view_patterns:
                    match = re.search(pattern, page_text, re.IGNORECASE)
                    if match:
                        video_data["views"] = match.group(1) + " views"
                        break
                
                if not video_data["views"]:
                    video_data["views"] = "N/A"
            except:
                video_data["views"] = "N/A"
            
            # Extract publish date - simple text search
            try:
                page_text = await self.page.content()
                date_patterns = [
                    r'([0-9]+\s+(day|week|month|year)s?\s+ago)',
                    r'(Premiered\s+[^"]+)',
                    r'"publishDate":"([^"]+)"'
                ]
                
                for pattern in date_patterns:
                    match = re.search(pattern, page_text, re.IGNORECASE)
                    if match:
                        video_data["publishedAt"] = match.group(1)
                        break
                
                if not video_data["publishedAt"]:
                    video_data["publishedAt"] = "Unknown"
            except:
                video_data["publishedAt"] = "Unknown"
            
            # Extract duration from page source
            try:
                page_text = await self.page.content()
                duration_patterns = [
                    r'"lengthSeconds":"([0-9]+)"',
                    r'([0-9]+:[0-9]+:[0-9]+)',
                    r'([0-9]+:[0-9]+)'
                ]
                
                for pattern in duration_patterns:
                    match = re.search(pattern, page_text)
                    if match:
                        if pattern == duration_patterns[0]:  # seconds
                            seconds = int(match.group(1))
                            minutes = seconds // 60
                            seconds = seconds % 60
                            video_data["duration"] = f"{minutes}:{seconds:02d}"
                        else:
                            video_data["duration"] = match.group(1)
                        break
                
                if not video_data["duration"]:
                    video_data["duration"] = "N/A"
            except:
                video_data["duration"] = "N/A"
            
            # Extract description - simple approach
            try:
                # Try to click show more button
                try:
                    show_more = self.page.locator('tp-yt-paper-button#expand').first
                    if await show_more.is_visible(timeout=2000):
                        await show_more.click()
                        await self.page.wait_for_timeout(1000)
                except:
                    pass
                
                desc = await self.page.locator('#description-text').first.inner_text(timeout=3000)
                if desc and len(desc.strip()) > 10:
                    video_data["description"] = desc.strip()[:300] + "..." if len(desc) > 300 else desc.strip()
                else:
                    video_data["description"] = "No description available"
            except:
                video_data["description"] = "No description available"
            
            # Simple transcript extraction
            try:
                transcript = await self.extract_simple_transcript()
                video_data["transcript"] = transcript
            except:
                video_data["transcript"] = "Transcript not available"
            
            return video_data
            
        except Exception as e:
            return {"error": f"Failed to scrape video: {str(e)}"}
    
    async def extract_simple_transcript(self):
        """Simple transcript extraction"""
        try:
            # Look for transcript button with simple selector
            transcript_button = self.page.locator('button:has-text("Show transcript")').first
            
            if await transcript_button.is_visible(timeout=3000):
                await transcript_button.click()
                await self.page.wait_for_timeout(2000)
                
                # Get transcript segments
                segments = self.page.locator('.ytd-transcript-segment-renderer')
                count = await segments.count()
                
                if count > 0:
                    transcript_text = ""
                    for i in range(min(count, 20)):  # Limit to first 20 segments
                        try:
                            text = await segments.nth(i).inner_text()
                            if text and text.strip():
                                transcript_text += text.strip() + " "
                        except:
                            continue
                    
                    return transcript_text.strip() if transcript_text.strip() else "Transcript not available"
            
            return "Transcript not available"
            
        except:
            return "Transcript not available"

async def main():
    parser = argparse.ArgumentParser(description='Scrape YouTube video data')
    parser.add_argument('url', help='YouTube video URL')
    parser.add_argument('--output', help='Output file path (optional)')
    
    args = parser.parse_args()
    
    scraper = YouTubeVideoScraper()
    
    try:
        await scraper.init_browser()
        result = await scraper.scrape_video_data(args.url)
        
        # Output result
        json_result = json.dumps(result, indent=2, ensure_ascii=False)
        
        if args.output:
            with open(args.output, 'w', encoding='utf-8') as f:
                f.write(json_result)
        else:
            print(json_result)
            
    except Exception as e:
        error_result = {"error": f"Scraping failed: {str(e)}"}
        print(json.dumps(error_result, indent=2))
    finally:
        await scraper.close_browser()

if __name__ == "__main__":
    asyncio.run(main())

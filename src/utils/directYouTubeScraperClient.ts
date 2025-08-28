// Client-side utility for direct YouTube scraping
// This runs in the browser and makes requests to a backend endpoint

export interface YouTubeVideoData {
  url: string;
  title: string;
  channel: string;
  views: string;
  description: string;
  duration: string;
  thumbnail_url?: string;
  publishedAt: string;
  length_seconds?: number;
  subscribers?: string;
  likes?: string;
  error?: string;
}

export class DirectYouTubeScraperClient {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:3002') {
    this.baseUrl = baseUrl;
  }

  async scrapeVideo(url: string): Promise<YouTubeVideoData> {
    try {
      console.log(`Scraping YouTube video: ${url}`);
      
      const response = await fetch(`${this.baseUrl}/api/scrape-direct`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }

      console.log('Video scraping completed successfully');
      return result as YouTubeVideoData;
    } catch (error: any) {
      console.error('Direct scraper client error:', error);
      throw new Error(`Failed to scrape video: ${error.message}`);
    }
  }
}

// Singleton instance
export const directYouTubeScraperClient = new DirectYouTubeScraperClient();

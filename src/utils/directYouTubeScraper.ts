import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

export interface YouTubeVideoData {
  url: string;
  video_id: string;
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
  transcript?: string;
  error?: string;
}

export class DirectYouTubeScraper {
  private pythonScriptPath: string;

  constructor() {
    // Path to the Python scraper script
    this.pythonScriptPath = path.join(process.cwd(), 'youtube_video_scraper.py');
  }

  async scrapeVideo(url: string): Promise<YouTubeVideoData> {
    try {
      console.log(`Scraping YouTube video: ${url}`);
      
      // Execute Python script directly
      const command = `python "${this.pythonScriptPath}" "${url}"`;
      const { stdout, stderr } = await execAsync(command, {
        timeout: 60000, // 60 second timeout
        maxBuffer: 1024 * 1024 // 1MB buffer
      });

      if (stderr) {
        console.warn('Python script warnings:', stderr);
      }

      try {
        const result = JSON.parse(stdout);
        
        if (result.error) {
          throw new Error(result.error);
        }

        console.log('Video scraping completed successfully');
        return result as YouTubeVideoData;
      } catch (parseError) {
        console.error('Failed to parse Python output:', parseError);
        console.error('Raw output:', stdout);
        throw new Error(`Failed to parse scraper results: ${parseError}`);
      }
    } catch (error: any) {
      console.error('Direct scraper error:', error);
      
      if (error.code === 'TIMEOUT') {
        throw new Error('Request timeout - video analysis took too long');
      }
      
      throw new Error(`Failed to scrape video: ${error.message}`);
    }
  }

  // Alternative method using different Python commands
  async scrapeVideoWithFallback(url: string): Promise<YouTubeVideoData> {
    const pythonCommands = ['python', 'python3', 'py'];
    
    for (const pythonCmd of pythonCommands) {
      try {
        console.log(`Trying ${pythonCmd} command...`);
        
        const command = `${pythonCmd} "${this.pythonScriptPath}" "${url}"`;
        const { stdout, stderr } = await execAsync(command, {
          timeout: 60000,
          maxBuffer: 1024 * 1024
        });

        if (stderr && !stderr.includes('warning')) {
          console.warn(`${pythonCmd} warnings:`, stderr);
        }

        const result = JSON.parse(stdout);
        
        if (result.error) {
          throw new Error(result.error);
        }

        console.log(`Successfully scraped with ${pythonCmd}`);
        return result as YouTubeVideoData;
      } catch (error: any) {
        console.log(`${pythonCmd} failed:`, error.message);
        continue;
      }
    }
    
    throw new Error('All Python commands failed. Please ensure Python is installed and accessible.');
  }
}

// Singleton instance
export const directYouTubeScraper = new DirectYouTubeScraper();

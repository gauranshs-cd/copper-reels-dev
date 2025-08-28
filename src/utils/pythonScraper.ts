import { spawn } from 'child_process';
import path from 'path';

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

export class PythonYouTubeScraper {
  private pythonScriptPath: string;

  constructor() {
    // Assuming the script is in the root directory
    this.pythonScriptPath = path.join(process.cwd(), 'youtube_video_scraper.py');
  }

  async scrapeVideo(url: string): Promise<YouTubeVideoData> {
    return new Promise((resolve, reject) => {
      const pythonProcess = spawn('python', [this.pythonScriptPath, url]);
      
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
          reject(new Error(`Python script failed with code ${code}: ${errorOutput}`));
          return;
        }

        try {
          const result = JSON.parse(output);
          
          if (result.error) {
            reject(new Error(result.error));
            return;
          }

          resolve(result as YouTubeVideoData);
        } catch (parseError) {
          console.error('Failed to parse Python output:', parseError);
          console.error('Raw output:', output);
          reject(new Error(`Failed to parse scraper results: ${parseError}`));
        }
      });

      // Set timeout for long-running requests
      setTimeout(() => {
        pythonProcess.kill();
        reject(new Error('Request timeout - video analysis took too long'));
      }, 60000); // 60 second timeout
    });
  }
}

// Singleton instance
export const pythonScraper = new PythonYouTubeScraper();

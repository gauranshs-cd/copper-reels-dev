import { toast } from 'sonner';

class ScraperManager {
  private isStarting = false;
  private isRunning = false;

  async checkApiHealth(): Promise<boolean> {
    try {
      const response = await fetch('http://localhost:3001/health', {
        method: 'GET',
        signal: AbortSignal.timeout(3000)
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  async ensureApiRunning(): Promise<boolean> {
    // Check if already running
    if (await this.checkApiHealth()) {
      this.isRunning = true;
      return true;
    }

    // Since we can't reliably start processes from browser, 
    // show instructions to user instead
    toast.error('YouTube scraper API not running', { 
      id: 'scraper-startup',
      description: 'Please run: python youtube_api_server.py',
      duration: 10000
    });
    
    return false;
  }
}

export const scraperManager = new ScraperManager();

// Error handling and logging utilities for build pipeline

export interface BuildError {
  type: 'script_generation' | 'api_error' | 'validation_error' | 'build_error';
  message: string;
  details?: any;
  timestamp: Date;
  context?: string;
}

export class BuildLogger {
  private static logs: BuildError[] = [];
  
  static log(error: BuildError) {
    this.logs.push(error);
    console.error(`[${error.type}] ${error.message}`, error.details);
    
    // Store in localStorage for debugging
    const storedLogs = localStorage.getItem('copper_build_logs') || '[]';
    const allLogs = JSON.parse(storedLogs);
    allLogs.push(error);
    // Keep only last 50 logs
    if (allLogs.length > 50) {
      allLogs.shift();
    }
    localStorage.setItem('copper_build_logs', JSON.stringify(allLogs));
  }
  
  static getLogs(): BuildError[] {
    return this.logs;
  }
  
  static clearLogs() {
    this.logs = [];
    localStorage.removeItem('copper_build_logs');
  }
  
  static getStoredLogs(): BuildError[] {
    const storedLogs = localStorage.getItem('copper_build_logs') || '[]';
    return JSON.parse(storedLogs);
  }
}

export function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  context: string
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      BuildLogger.log({
        type: 'build_error',
        message: error instanceof Error ? error.message : 'Unknown error',
        details: error,
        timestamp: new Date(),
        context
      });
      throw error;
    }
  }) as T;
}
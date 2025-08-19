import type { HistoryItem } from '@/components/HistorySidebar';

const HISTORY_KEY = 'copper_reels_history';
const MAX_HISTORY_ITEMS = 100;

export class HistoryService {
  static addItem(item: Omit<HistoryItem, 'id' | 'timestamp'>): void {
    const history = this.getHistory();
    
    const newItem: HistoryItem = {
      ...item,
      id: `history-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    };
    
    // Add to beginning of array (most recent first)
    history.unshift(newItem);
    
    // Keep only the most recent items
    if (history.length > MAX_HISTORY_ITEMS) {
      history.pop();
    }
    
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }
  
  static getHistory(): HistoryItem[] {
    const saved = localStorage.getItem(HISTORY_KEY);
    if (!saved) return [];
    
    try {
      const items = JSON.parse(saved);
      return items.map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp)
      }));
    } catch (error) {
      console.error('Failed to parse history:', error);
      return [];
    }
  }
  
  static clearHistory(): void {
    localStorage.removeItem(HISTORY_KEY);
  }
  
  static deleteItem(id: string): void {
    const history = this.getHistory();
    const filtered = history.filter(item => item.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered));
  }
  
  static searchHistory(query: string): HistoryItem[] {
    const history = this.getHistory();
    const lowercaseQuery = query.toLowerCase();
    
    return history.filter(item => 
      item.title.toLowerCase().includes(lowercaseQuery) ||
      (item.description && item.description.toLowerCase().includes(lowercaseQuery))
    );
  }
}

export const historyService = HistoryService;
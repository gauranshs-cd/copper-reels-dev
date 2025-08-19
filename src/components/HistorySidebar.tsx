import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  Search, 
  Trash2, 
  ChevronRight,
  Video,
  Lightbulb,
  FileText,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

export interface HistoryItem {
  id: string;
  type: 'foundation' | 'idea' | 'script' | 'search' | 'pattern';
  title: string;
  description?: string;
  timestamp: Date;
  data?: any;
}

interface HistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectItem?: (item: HistoryItem) => void;
}

export function HistorySidebar({ isOpen, onClose, onSelectItem }: HistorySidebarProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const saved = localStorage.getItem('copper_reels_history');
    if (saved) {
      const items = JSON.parse(saved);
      setHistory(items.map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp)
      })));
    }
  };

  const clearHistory = () => {
    localStorage.removeItem('copper_reels_history');
    setHistory([]);
    toast.success('History cleared');
  };

  const deleteItem = (id: string) => {
    const updated = history.filter(item => item.id !== id);
    setHistory(updated);
    localStorage.setItem('copper_reels_history', JSON.stringify(updated));
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'foundation': return <FileText className="w-4 h-4" />;
      case 'idea': return <Lightbulb className="w-4 h-4" />;
      case 'script': return <Video className="w-4 h-4" />;
      case 'search': return <Search className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'foundation': return 'bg-blue-500';
      case 'idea': return 'bg-green-500';
      case 'script': return 'bg-purple-500';
      case 'search': return 'bg-orange-500';
      case 'pattern': return 'bg-pink-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredHistory = filter === 'all' 
    ? history 
    : history.filter(item => item.type === filter);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-40"
            onClick={onClose}
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed left-0 top-0 h-full w-80 bg-background border-r shadow-xl z-50"
          >
            <div className="p-4 border-b">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  History
                </h2>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onClose}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Filter Tabs */}
              <div className="flex gap-1 p-1 bg-muted rounded-lg">
                {['all', 'idea', 'script', 'pattern'].map(type => (
                  <Button
                    key={type}
                    size="sm"
                    variant={filter === type ? 'default' : 'ghost'}
                    className="flex-1 capitalize"
                    onClick={() => setFilter(type)}
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>

            <ScrollArea className="flex-1 p-4">
              {filteredHistory.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <Clock className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>No history yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredHistory.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="group"
                    >
                      <div
                        className="p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => onSelectItem?.(item)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${getTypeColor(item.type)} text-white`}>
                            {getIcon(item.type)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-sm truncate">
                              {item.title}
                            </h3>
                            {item.description && (
                              <p className="text-xs text-muted-foreground truncate">
                                {item.description}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatDistanceToNow(item.timestamp, { addSuffix: true })}
                            </p>
                          </div>
                          
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteItem(item.id);
                              }}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </ScrollArea>

            {history.length > 0 && (
              <div className="p-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={clearHistory}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All History
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
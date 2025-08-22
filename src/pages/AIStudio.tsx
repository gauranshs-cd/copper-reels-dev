import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Send, 
  Sparkles, 
  FileText, 
  Lightbulb,
  Image,
  Hash,
  Video,
  TrendingUp,
  Code,
  BarChart3,
  Search,
  MessageSquare,
  User,
  Bot,
  Plus
} from 'lucide-react';
import { toast } from 'sonner';
import { copperReelsGemini } from '@/lib/gemini';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/auth/AuthProvider';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface QuickAction {
  icon: any;
  label: string;
  prompt: string;
  color: string;
}

export default function AIStudio() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const quickActions: QuickAction[] = [
    { icon: FileText, label: 'Write a script', prompt: 'Write a YouTube script about ', color: 'hover:bg-blue-50' },
    { icon: Lightbulb, label: 'Generate ideas', prompt: 'Generate 10 viral YouTube video ideas about ', color: 'hover:bg-yellow-50' },
    { icon: Image, label: 'Design thumbnail', prompt: 'Create a thumbnail concept for ', color: 'hover:bg-purple-50' },
    { icon: Hash, label: 'Find hashtags', prompt: 'Generate trending hashtags for ', color: 'hover:bg-green-50' },
    { icon: Video, label: 'Analyze video', prompt: 'Analyze this YouTube video: ', color: 'hover:bg-red-50' },
    { icon: TrendingUp, label: 'Research trends', prompt: 'What are the current trends in ', color: 'hover:bg-orange-50' },
    { icon: Code, label: 'Write code', prompt: 'Write code to ', color: 'hover:bg-gray-50' },
    { icon: BarChart3, label: 'Analyze data', prompt: 'Analyze the following data: ', color: 'hover:bg-indigo-50' },
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Welcome message
    if (messages.length === 0) {
      setMessages([{
        id: '1',
        role: 'assistant',
        content: `Hey ${user?.email?.split('@')[0] || 'there'}! I'm your AI assistant for YouTube content creation. What would you like to create today?`,
        timestamp: new Date()
      }]);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleQuickAction = (action: QuickAction) => {
    setInput(action.prompt);
    textareaRef.current?.focus();
  };

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);

    try {
      const response = await copperReelsGemini.generateContent(input);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to get response. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNewChat = () => {
    setMessages([{
      id: Date.now().toString(),
      role: 'assistant',
      content: 'Starting a new conversation. What would you like to create?',
      timestamp: new Date()
    }]);
    setInput('');
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div className="w-64 bg-gray-50 border-r border-gray-200 p-4 flex flex-col">
        <Button 
          onClick={handleNewChat}
          className="w-full mb-4 bg-black hover:bg-gray-800 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </Button>
        
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-2">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Recent Chats
            </div>
            {/* Chat history would go here */}
            <div className="text-sm text-gray-400">No recent chats</div>
          </div>
        </div>

        <div className="border-t pt-4 mt-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="w-4 h-4" />
            <span className="truncate">{user?.email}</span>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-gray-600" />
            <h1 className="text-lg font-semibold">AI Studio</h1>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 px-6">
          <div className="max-w-3xl mx-auto py-6">
            {messages.length === 1 && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-6">What can I help you create?</h2>
                <div className="grid grid-cols-4 gap-3">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickAction(action)}
                      className={cn(
                        "p-4 rounded-lg border border-gray-200 text-left transition-all",
                        "hover:shadow-md hover:border-gray-300",
                        action.color
                      )}
                    >
                      <action.icon className="w-5 h-5 mb-2 text-gray-700" />
                      <div className="text-sm font-medium text-gray-900">{action.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={cn(
                    "mb-6 flex gap-3",
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-gray-600" />
                    </div>
                  )}
                  
                  <div className={cn(
                    "max-w-[70%] rounded-2xl px-4 py-3",
                    message.role === 'user' 
                      ? 'bg-black text-white' 
                      : 'bg-gray-100 text-gray-900'
                  )}>
                    <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                  </div>

                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {isProcessing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-gray-600" />
                </div>
                <div className="bg-gray-100 rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t border-gray-200 p-4">
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask me anything..."
                className="w-full resize-none rounded-2xl border-gray-300 pr-12 min-h-[52px] max-h-32"
                rows={1}
                disabled={isProcessing}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isProcessing}
                size="icon"
                className="absolute right-2 bottom-2 rounded-full bg-black hover:bg-gray-800 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <div className="text-xs text-gray-500 text-center mt-2">
              AI Studio can make mistakes. Check important info.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { 
  Send, 
  Sparkles, 
  Video, 
  FileText, 
  Image, 
  TrendingUp,
  Lightbulb,
  Target,
  Mic,
  Paperclip,
  Code,
  RotateCcw,
  ChevronDown,
  User,
  Bot,
  ArrowRight,
  Search,
  Zap,
  Brain,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';
import { copperReelsGemini } from '@/lib/gemini';
import { useAppStore } from '@/store/useAppStore';
import { PromptEditor } from '@/components/PromptEditor';
import { SkyscraperAnalysis } from '@/components/SkyscraperAnalysis';
import { PromptManager, DEFAULT_YTGS_TEMPLATE } from '@/lib/prompts/ytgs-system';
import { supabase } from '@/integrations/supabase/client';
import { BrickScriptEditor, ScriptBrick } from '@/components/BrickScriptEditor';
import { VideoIdeaGenerator } from '@/components/VideoIdeaGenerator';
import { ThumbnailGenerator } from '@/components/ThumbnailGenerator';
import { FoundationBuilder } from '@/components/FoundationBuilder';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  actions?: Array<{
    label: string;
    action: () => void;
    icon?: any;
  }>;
  component?: React.ReactNode;
  componentType?: 'script' | 'ideas' | 'thumbnail' | 'research' | 'foundation';
}

interface QuickAction {
  label: string;
  description: string;
  icon: any;
  prompt: string;
  color: string;
}

export default function ChatInterface() {
  const navigate = useNavigate();
  const { setUmbrellaStatement, setSelectedIdea, setFoundationData } = useAppStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPromptEditor, setShowPromptEditor] = useState(false);
  const [showSkyscraper, setShowSkyscraper] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const quickActions: QuickAction[] = [
    {
      label: 'Generate Video Script',
      description: 'Create a complete YouTube script',
      icon: FileText,
      prompt: 'Generate a YouTube script about',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      label: 'Brainstorm Ideas',
      description: 'Get viral video concepts',
      icon: Lightbulb,
      prompt: 'Give me 10 viral YouTube video ideas about',
      color: 'from-purple-500 to-pink-500'
    },
    {
      label: 'Analyze Competition',
      description: 'Research top performers',
      icon: Search,
      prompt: 'Analyze the top YouTube videos about',
      color: 'from-green-500 to-emerald-500'
    },
    {
      label: 'Create Thumbnail',
      description: 'Design concepts & titles',
      icon: Image,
      prompt: 'Create thumbnail concepts and titles for a video about',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const starterPrompts = [
    "I help entrepreneurs achieve financial freedom through YouTube",
    "I help fitness enthusiasts build muscle without a gym",
    "I help developers learn AI and machine learning",
    "I help parents raise confident children",
    "I help students ace their exams with less stress"
  ];

  useEffect(() => {
    // Add welcome message
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: `Welcome to Copper Reels! I'm your AI content strategist. 

I can help you:
• Generate viral YouTube scripts (1400+ words)
• Create compelling thumbnails and titles
• Research top-performing content
• Develop your channel strategy

How can I help you grow your YouTube channel today?`,
        timestamp: new Date(),
        suggestions: starterPrompts
      }
    ]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
      // Check for special commands
      if (input.toLowerCase().includes('script')) {
        await generateScript(input);
      } else if (input.toLowerCase().includes('analyze') || input.toLowerCase().includes('research')) {
        handleSkyscraperAnalysis(input);
      } else if (input.toLowerCase().includes('idea') || input.toLowerCase().includes('brainstorm')) {
        await generateIdeas(input);
      } else if (input.toLowerCase().includes('thumbnail') || input.toLowerCase().includes('title')) {
        await generateThumbnails(input);
      } else {
        // General conversation
        await handleGeneralQuery(input);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      addAssistantMessage('I encountered an error. Please try again or rephrase your request.');
    } finally {
      setIsProcessing(false);
    }
  };

  const generateScript = async (prompt: string) => {
    addAssistantMessage('Generating your YouTube script using YTGS methodology...', true);
    
    // Show script editor inline
    const scriptBricks: ScriptBrick[] = [];

    // Get user's custom prompt template
    const { data: { user } } = await supabase.auth.getUser();
    let template = DEFAULT_YTGS_TEMPLATE;
    if (user) {
      const userPrompt = await PromptManager.getUserPrompt(user.id);
      if (userPrompt) {
        template = userPrompt;
      }
    }

    // Extract topic from prompt
    const topic = prompt.replace(/generate.*script.*about/i, '').trim();

    // Compile prompt with variables
    const variables = {
      runtimeMinutes: '10',
      hook: `Discover the truth about ${topic}`,
      problemStatement: `Most people fail at ${topic} because they don't know this one secret`,
      valueProp1: 'The exact framework used by top performers',
      valueProp2: 'Common mistakes to avoid',
      valueProp3: 'Step-by-step implementation guide',
      credibilityStatement: 'Based on analyzing 100+ successful examples',
      transitionPoint: 'the first crucial step',
      currentTopic: topic,
      nextProblem: 'how to scale your results',
      nextVideoTopic: 'advanced strategies',
      callToAction: 'Subscribe for more growth strategies'
    };

    const compiledPrompt = PromptManager.compilePrompt(template, variables);
    setCurrentPrompt(compiledPrompt);

    // Generate script
    const result = await copperReelsGemini.generateScriptAndStoryboard({
      chosenTitle: topic,
      viewerType: 'LEARNER',
      avatarSummary: 'Content creators looking to grow their YouTube channel',
      ideaConcept: prompt,
      selectedThumbBrief: {},
      targetMinutes: 10
    });

    const scriptText = result.bricks.map(brick => brick.narration).join('\n\n');
    const wordCount = scriptText.split(' ').length;

    // Convert result to ScriptBricks
    const bricks: ScriptBrick[] = result.bricks.map((brick, index) => ({
      id: `brick-${index}`,
      type: brick.type as ScriptBrick['type'],
      estimatedSec: brick.estimatedSec,
      narration: brick.narration,
      onScreen: brick.onScreen,
      callouts: brick.callouts || [],
      broll: brick.broll || [],
      beats: brick.beats || [],
      isExpanded: index === 0
    }));

    // Add message with embedded script editor
    const scriptEditor = (
      <div className="mt-4 border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Generated Script ({wordCount} words)</h3>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setShowPromptEditor(true)}>
              <Eye className="w-4 h-4 mr-2" />
              View Prompt
            </Button>
            <Button size="sm" onClick={() => navigate('/script-builder')}>
              <Edit3 className="w-4 h-4 mr-2" />
              Full Editor
            </Button>
          </div>
        </div>
        <BrickScriptEditor
          bricks={bricks}
          onChange={(updatedBricks) => console.log('Updated bricks:', updatedBricks)}
        />
      </div>
    );

    addAssistantMessage(
      `✅ Script generated successfully! Your ${wordCount}-word script is ready. You can edit it directly below or open the full editor for more options.`,
      false,
      ['Generate thumbnail', 'Create different version', 'Research competition'],
      [
        {
          label: 'Download Script',
          action: () => downloadScript(scriptText, topic),
          icon: Download
        }
      ],
      scriptEditor,
      'script'
    );
  };

  const generateIdeas = async (prompt: string) => {
    addAssistantMessage('Brainstorming viral video ideas...', true);

    const topic = prompt.replace(/.*ideas.*about/i, '').trim();
    
    // Simulate idea generation
    const ideas = [
      `The Hidden Truth About ${topic} Nobody Talks About`,
      `${topic} Mistakes That Cost Me $10,000`,
      `How I Mastered ${topic} in 30 Days (Full System)`,
      `Why 99% Fail at ${topic} (And How to Be the 1%)`,
      `The ${topic} Strategy That Changed Everything`,
      `${topic}: What I Wish I Knew 5 Years Ago`,
      `The Controversial ${topic} Method That Actually Works`,
      `${topic} Transformation: My 6-Month Journey`,
      `Breaking Down the Perfect ${topic} Framework`,
      `${topic} Secrets From a 7-Figure Expert`
    ];

    addAssistantMessage(
      `Here are 10 viral video ideas for "${topic}":

${ideas.map((idea, i) => `${i + 1}. **${idea}**`).join('\n')}

Each title uses psychological triggers like curiosity gaps, social proof, and transformation promises.`,
      false,
      ['Generate scripts for these ideas', 'Analyze competition for these topics', 'Create thumbnails'],
      [
        {
          label: 'Start Ideation',
          action: () => navigate('/ideation'),
          icon: Lightbulb
        }
      ]
    );
  };

  const generateThumbnails = async (prompt: string) => {
    addAssistantMessage('Creating thumbnail concepts...', true);

    const topic = prompt.replace(/.*thumbnail.*for|.*about/gi, '').trim();

    const concepts = [
      {
        title: `${topic} = EASY`,
        thumbnail: 'Split screen: Struggle (left) vs Success (right), bold arrow pointing right',
        colors: 'High contrast - dark left, bright right'
      },
      {
        title: `The ${topic} Lie`,
        thumbnail: 'Shocked face, red X over common belief, question marks',
        colors: 'Red and yellow for urgency'
      },
      {
        title: `$0 to $100K`,
        thumbnail: 'Graph going up, your face showing excitement, money symbols',
        colors: 'Green gradient with gold accents'
      }
    ];

    addAssistantMessage(
      `Thumbnail concepts for "${topic}":

${concepts.map((c, i) => `
**Concept ${i + 1}:**
Title: ${c.title}
Visual: ${c.thumbnail}
Colors: ${c.colors}
`).join('\n')}

Each concept uses proven psychological triggers and high-contrast visuals for maximum CTR.`,
      false,
      ['Generate more concepts', 'Create the script', 'Test different angles']
    );
  };

  const handleGeneralQuery = async (prompt: string) => {
    addAssistantMessage('Let me help you with that...', true);

    // Parse intent
    if (prompt.toLowerCase().includes('i help')) {
      // Handle umbrella statement
      setUmbrellaStatement(prompt);
      addAssistantMessage(
        `Great umbrella statement! "${prompt}"

This positions you perfectly in your niche. Let me help you build content around this.

Based on your statement, here's what we should focus on:
1. **Target Audience**: Clearly defined and specific
2. **Transformation**: Clear value proposition
3. **Content Pillars**: Build authority in key areas

What would you like to create first?`,
        false,
        ['Generate video ideas', 'Create a script', 'Research competition'],
        [
          {
            label: 'Set Foundation',
            action: () => navigate('/foundation'),
            icon: Target
          },
          {
            label: 'Start Creating',
            action: () => navigate('/ideation'),
            icon: Sparkles
          }
        ]
      );
    } else {
      // General response
      addAssistantMessage(
        `I understand you want to know about "${prompt}".

Let me help you turn this into actionable YouTube content. Would you like me to:
• Generate video ideas around this topic
• Create a script for this subject
• Research what's already performing well
• Design thumbnail concepts

What's your main goal with this topic?`,
        false,
        ['Generate ideas', 'Create script', 'Analyze competition']
      );
    }
  };

  const handleSkyscraperAnalysis = (prompt: string) => {
    const topic = prompt.replace(/.*analyze.*|.*research.*/gi, '').trim();
    
    // Embed research component directly in chat
    const researchComponent = (
      <div className="mt-4 border rounded-lg overflow-hidden">
        <div className="bg-muted/30 p-3 border-b">
          <h3 className="font-semibold flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Skyscraper Analysis
          </h3>
        </div>
        <div className="p-4">
          <SkyscraperAnalysis
            onInsightsGenerated={(insights) => {
              addAssistantMessage(
                `Analysis complete! I found ${insights.topPatterns.length} winning patterns and ${insights.contentGaps.length} content opportunities.\n\n**Top Patterns:**\n${insights.topPatterns.join('\n')}\n\n**Content Gaps:**\n${insights.contentGaps.join('\n')}`,
                false,
                ['Create script based on gaps', 'Generate ideas from patterns']
              );
            }}
          />
        </div>
      </div>
    );
    
    addAssistantMessage(
      `I'm analyzing the top YouTube videos about "${topic}" to find patterns and opportunities. The analysis will appear below:`,
      false,
      [],
      [],
      researchComponent,
      'research'
    );
  };

  const downloadScript = (script: string, title: string) => {
    const blob = new Blob([script], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '-')}-script.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Script downloaded');
  };

  const addAssistantMessage = (
    content: string, 
    isTyping = false,
    suggestions: string[] = [],
    actions: Message['actions'] = [],
    component?: React.ReactNode,
    componentType?: Message['componentType']
  ) => {
    const message: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: isTyping ? '...' : content,
      timestamp: new Date(),
      suggestions,
      actions,
      component,
      componentType
    };

    if (isTyping) {
      setMessages(prev => [...prev, message]);
      // Simulate typing
      setTimeout(() => {
        setMessages(prev => prev.map(m => 
          m.id === message.id ? { ...m, content } : m
        ));
      }, 1000);
    } else {
      setMessages(prev => [...prev, message]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    textareaRef.current?.focus();
  };

  const handleQuickAction = (action: QuickAction) => {
    setInput(action.prompt + ' ');
    textareaRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="/cr-logo-new.svg" 
                alt="Copper Reels" 
                className="h-10 w-auto"
                style={{ maxWidth: '200px' }}
              />
              <Badge variant="secondary">
                <Brain className="w-3 h-3 mr-1" />
                AI Studio
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPromptEditor(true)}
              >
                <Code className="w-4 h-4 mr-2" />
                View Prompts
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSkyscraper(true)}
              >
                <Search className="w-4 h-4 mr-2" />
                Research
              </Button>
              <Button
                size="sm"
                onClick={() => navigate('/dashboard')}
              >
                <Zap className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="container mx-auto max-w-4xl">
          {messages.length === 1 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {quickActions.map((action) => (
                <Card
                  key={action.label}
                  className="p-4 cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1"
                  onClick={() => handleQuickAction(action)}
                >
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center mb-3`}>
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-medium text-sm mb-1">{action.label}</h3>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </Card>
              ))}
            </div>
          )}

          <div className="space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center shrink-0">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  )}
                  
                  <div className={`max-w-[80%] ${message.role === 'user' ? 'order-1' : ''}`}>
                    <Card className={`p-4 ${
                      message.role === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-card'
                    }`}>
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        {message.content.split('\n').map((line, i) => (
                          <p key={i} className="mb-2 last:mb-0">
                            {line}
                          </p>
                        ))}
                      </div>

                      {message.suggestions && message.suggestions.length > 0 && (
                        <div className="mt-3 pt-3 border-t space-y-2">
                          <p className="text-xs font-medium mb-2">Suggested actions:</p>
                          <div className="flex flex-wrap gap-2">
                            {message.suggestions.map((suggestion, i) => (
                              <Button
                                key={i}
                                size="sm"
                                variant="outline"
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="text-xs"
                              >
                                {suggestion}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}

                      {message.actions && message.actions.length > 0 && (
                        <div className="mt-3 pt-3 border-t">
                          <div className="flex flex-wrap gap-2">
                            {message.actions.map((action, i) => (
                              <Button
                                key={i}
                                size="sm"
                                onClick={action.action}
                                className="gap-2"
                              >
                                {action.icon && <action.icon className="w-4 h-4" />}
                                {action.label}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                    </Card>
                    
                    {message.component && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-3"
                      >
                        {message.component}
                      </motion.div>
                    )}
                    
                    <p className="text-xs text-muted-foreground mt-1 px-2">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>

                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0 order-2">
                      <User className="w-5 h-5" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto max-w-4xl p-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask me anything about YouTube growth, scripts, thumbnails..."
                className="min-h-[60px] pr-12 resize-none"
                disabled={isProcessing}
              />
              <div className="absolute bottom-2 right-2 flex gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  disabled
                >
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  disabled
                >
                  <Mic className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isProcessing}
              className="self-end"
            >
              {isProcessing ? (
                <RotateCcw className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Press Enter to send, Shift+Enter for new line. 
            Type "I help [audience] achieve [result]" to set your foundation.
          </p>
        </div>
      </div>

      {/* Modals */}
      <PromptEditor
        isOpen={showPromptEditor}
        onClose={() => setShowPromptEditor(false)}
        currentPrompt={currentPrompt}
        onSave={(prompt) => {
          setCurrentPrompt(prompt);
          toast.success('Prompt saved successfully');
        }}
      />

      {showSkyscraper && (
        <Dialog open={showSkyscraper} onOpenChange={setShowSkyscraper}>
          <DialogContent className="max-w-6xl h-[90vh]">
            <SkyscraperAnalysis
              onInsightsGenerated={(insights) => {
                console.log('Insights generated:', insights);
                toast.success('Analysis complete!');
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// Add missing imports for Dialog
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Edit3, Download } from 'lucide-react';

// Placeholder components - these would be the actual components
const VideoIdeaGenerator = ({ onIdeasGenerated }: any) => (
  <div className="p-4 border rounded">
    <p>Video Idea Generator Component</p>
  </div>
);

const ThumbnailGenerator = ({ topic }: any) => (
  <div className="p-4 border rounded">
    <p>Thumbnail Generator for: {topic}</p>
  </div>
);

const FoundationBuilder = ({ onComplete }: any) => (
  <div className="p-4 border rounded">
    <p>Foundation Builder Component</p>
  </div>
);
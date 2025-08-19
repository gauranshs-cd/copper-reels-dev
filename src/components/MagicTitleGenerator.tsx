import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand2, Sparkles, Copy, RefreshCw, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { toast } from 'sonner';
import { copperReelsGemini } from '@/lib/gemini';
import { useAppStore } from '@/store/useAppStore';
import { historyService } from '@/lib/history';
import { generateTitleIdeas, getViralTitlePatterns } from '@/lib/pattern-bank';

interface MagicTitleGeneratorProps {
  ideaTitle?: string;
  onTitleSelect?: (title: string) => void;
}

export function MagicTitleGenerator({ ideaTitle, onTitleSelect }: MagicTitleGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTitles, setGeneratedTitles] = useState<string[]>([]);
  const [copiedTitle, setCopiedTitle] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const { foundationData, umbrellaStatement } = useAppStore();

  const generateMagicTitles = async () => {
    if (!foundationData) {
      toast.error('Please complete foundation setup first');
      return;
    }

    setIsGenerating(true);
    setIsExpanded(true);

    try {
      // Get custom patterns
      const customPatterns = JSON.parse(localStorage.getItem('custom_patterns') || '[]');
      const viralPatterns = getViralTitlePatterns();
      
      // Combine topic with niche
      const enhancedTopic = ideaTitle 
        ? `${ideaTitle} for ${foundationData.avatar.demographics.roles.join(', ')}`
        : `${umbrellaStatement} content`;

      // Generate titles using pattern bank
      const patternTitles = generateTitleIdeas(enhancedTopic);
      
      // Also generate with Gemini for more variety
      const geminiTitles = await copperReelsGemini.generateTitles({
        ideaConcept: enhancedTopic,
        pillarName: foundationData.pillars[0]?.title || 'general',
        viewerType: foundationData.viewerType,
        patternBank: {
          viralTitles: viralPatterns.slice(0, 10),
          customPatterns: customPatterns.filter((p: any) => p.type === 'title')
        }
      });

      // Combine and deduplicate
      const allTitles = [
        ...patternTitles.slice(0, 3),
        ...geminiTitles.titles.map(t => t.text).slice(0, 3)
      ];
      
      const uniqueTitles = Array.from(new Set(allTitles)).slice(0, 5);
      setGeneratedTitles(uniqueTitles);

      // Save to history
      historyService.addItem({
        type: 'pattern',
        title: 'Magic Title Generation',
        description: `Generated ${uniqueTitles.length} titles for ${enhancedTopic}`,
        data: { titles: uniqueTitles, topic: enhancedTopic }
      });

      toast.success(`Generated ${uniqueTitles.length} magic titles!`);
    } catch (error) {
      console.error('Failed to generate magic titles:', error);
      toast.error('Failed to generate titles. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (title: string) => {
    navigator.clipboard.writeText(title);
    setCopiedTitle(title);
    toast.success('Title copied to clipboard!');
    setTimeout(() => setCopiedTitle(null), 2000);
  };

  const handleSelect = (title: string) => {
    onTitleSelect?.(title);
    toast.success('Title selected!');
  };

  return (
    <div className="relative">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={generateMagicTitles}
              disabled={isGenerating}
              className="fixed right-6 bottom-24 z-30 bg-gradient-primary hover:shadow-glow rounded-full w-14 h-14 p-0"
            >
              {isGenerating ? (
                <RefreshCw className="w-6 h-6 animate-spin" />
              ) : (
                <Wand2 className="w-6 h-6" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Generate Magic Titles</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <AnimatePresence>
        {isExpanded && generatedTitles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed right-6 bottom-44 z-30 w-96"
          >
            <Card className="p-4 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Magic Titles
                </h3>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsExpanded(false)}
                >
                  ×
                </Button>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {generatedTitles.map((title, index) => (
                  <motion.div
                    key={title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                  >
                    <p className="text-sm mb-2">{title}</p>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCopy(title)}
                      >
                        {copiedTitle === title ? (
                          <CheckCircle className="w-3 h-3 text-green-500" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </Button>
                      {onTitleSelect && (
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleSelect(title)}
                        >
                          Use This
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              <Button
                className="w-full mt-3"
                variant="outline"
                onClick={generateMagicTitles}
                disabled={isGenerating}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Generate More
              </Button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
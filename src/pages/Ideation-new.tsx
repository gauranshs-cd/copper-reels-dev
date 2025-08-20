import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Wand2, ArrowRight, Check, Lightbulb, TrendingUp, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { copperReelsGemini } from '@/lib/gemini';
import { historyService } from '@/lib/history';

interface VideoIdea {
  id: string;
  title: string;
  concept: string;
  pillar: string;
  angle: string;
  whyItWillClick: string;
  thumbnailBrief: string;
  difficulty: number;
  selected?: boolean;
}

export function IdeationPage() {
  const navigate = useNavigate();
  const { foundationData, setCurrentIdea } = useAppStore();
  const [ideas, setIdeas] = useState<VideoIdea[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<VideoIdea | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    // Load history
    const items = historyService.getHistory();
    setHistory(items.filter(item => item.type === 'idea'));
  }, []);

  const generateIdeas = async () => {
    if (!foundationData) {
      toast.error('Please set up your foundation first');
      navigate('/foundation');
      return;
    }

    setIsGenerating(true);
    try {
      const result = await copperReelsGemini.generateIdeas({
        umbrella: foundationData.avatar.demographics.roles.join(', '),
        viewerType: foundationData.viewerType,
        avatarSummary: JSON.stringify(foundationData.avatar),
        pillars: foundationData.pillars,
        keyword: keyword || undefined
      });

      const newIdeas = result.map((idea: any, index: number) => ({
        id: `idea-${Date.now()}-${index}`,
        title: idea.concept,
        concept: idea.concept,
        pillar: idea.pillar,
        angle: idea.angle,
        whyItWillClick: idea.whyItWillClick,
        thumbnailBrief: idea.thumbnailHint,
        difficulty: idea.difficulty || 3
      }));

      setIdeas(newIdeas);
      
      // Save to history
      newIdeas.forEach(idea => {
        historyService.addItem({
          type: 'idea',
          title: idea.title,
          description: idea.whyItWillClick,
          data: idea
        });
      });

      toast.success(`Generated ${newIdeas.length} video ideas!`);
    } catch (error) {
      console.error('Failed to generate ideas:', error);
      toast.error('Failed to generate ideas. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const selectIdea = (idea: VideoIdea) => {
    setSelectedIdea(idea);
    setCurrentIdea({
      title: idea.title,
      concept: idea.concept,
      pillar: idea.pillar,
      angle: idea.angle,
      whyItWillClick: idea.whyItWillClick,
      thumbnailBrief: idea.thumbnailBrief
    });
    
    // Auto-navigate to script generation
    setTimeout(() => {
      navigate('/script');
    }, 500);
  };

  const regenerateIdeas = () => {
    setIdeas([]);
    setSelectedIdea(null);
    generateIdeas();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Video Ideation
        </h1>
        <p className="text-xl text-muted-foreground">
          Generate viral video ideas tailored to your audience
        </p>
      </motion.div>

      {/* Keyword Input */}
      <Card className="p-6">
        <div className="flex gap-4">
          <Input
            placeholder="Enter a topic or keyword (optional)..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="flex-1"
            onKeyPress={(e) => e.key === 'Enter' && generateIdeas()}
          />
          <Button 
            size="lg"
            onClick={generateIdeas}
            disabled={isGenerating}
            className="bg-gradient-primary hover:shadow-glow min-w-[200px]"
          >
            {isGenerating ? (
              <>
                <Wand2 className="w-5 h-5 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Generate Ideas
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Big Generate Button (when no ideas) */}
      {ideas.length === 0 && !isGenerating && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex justify-center py-12"
        >
          <Button
            size="lg"
            onClick={generateIdeas}
            className="bg-gradient-primary hover:shadow-glow text-2xl px-12 py-8 h-auto"
          >
            <Lightbulb className="w-8 h-8 mr-3" />
            Generate Video Ideas
          </Button>
        </motion.div>
      )}

      {/* Ideas Grid */}
      <AnimatePresence>
        {ideas.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid gap-6 md:grid-cols-3"
          >
            {ideas.map((idea, index) => (
              <motion.div
                key={idea.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card
                  className={`p-6 cursor-pointer transition-all hover:shadow-xl ${
                    selectedIdea?.id === idea.id 
                      ? 'ring-2 ring-primary border-primary' 
                      : 'hover:border-primary/50'
                  }`}
                  onClick={() => selectIdea(idea)}
                >
                  {/* Selected Badge */}
                  {selectedIdea?.id === idea.id && (
                    <div className="absolute -top-3 -right-3 bg-primary text-primary-foreground rounded-full p-2">
                      <Check className="w-4 h-4" />
                    </div>
                  )}

                  {/* Pillar Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="secondary">{idea.pillar}</Badge>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < idea.difficulty 
                              ? 'fill-yellow-500 text-yellow-500' 
                              : 'text-muted-foreground'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold mb-3 line-clamp-2">
                    {idea.title}
                  </h3>

                  {/* Angle */}
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {idea.angle}
                  </p>

                  {/* Why It Will Click */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-xs font-semibold text-green-500">Why it'll work:</span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-3">
                      {idea.whyItWillClick}
                    </p>
                  </div>

                  {/* Thumbnail Hint */}
                  <div className="pt-3 border-t">
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      <span className="font-semibold">Thumbnail:</span> {idea.thumbnailBrief}
                    </p>
                  </div>

                  {/* Select Button */}
                  <Button 
                    className="w-full mt-4"
                    variant={selectedIdea?.id === idea.id ? "default" : "outline"}
                    onClick={(e) => {
                      e.stopPropagation();
                      selectIdea(idea);
                    }}
                  >
                    {selectedIdea?.id === idea.id ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Selected - Continue
                      </>
                    ) : (
                      <>
                        Select & Continue
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Regenerate Button */}
      {ideas.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center"
        >
          <Button
            variant="outline"
            size="lg"
            onClick={regenerateIdeas}
            disabled={isGenerating}
          >
            <Wand2 className="w-5 h-5 mr-2" />
            Generate New Ideas
          </Button>
        </motion.div>
      )}

      {/* History Section */}
      {history.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Recent Ideas
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {history.slice(0, 5).map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                onClick={() => {
                  if (item.data) {
                    selectIdea(item.data);
                  }
                }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-sm">{item.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
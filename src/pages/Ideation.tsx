import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Plus, Search, TrendingUp, Sparkles, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ProgressIndicator } from '@/components/ui/progress-indicator';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useAppStore } from '@/store/useAppStore';
import type { IdeaCard } from '@/store/useAppStore';
import { copperReelsGemini } from '@/lib/gemini';
import { toast } from 'sonner';
import { MagicTitleGenerator } from '@/components/MagicTitleGenerator';
import { historyService } from '@/lib/history';

const columns = [
  { id: 'ideas', title: 'Ideas', count: 12 },
  { id: 'in-progress', title: 'In Progress', count: 3 },
  { id: 'scheduled', title: 'Scheduled', count: 2 }
];

export default function Ideation() {
  const navigate = useNavigate();
  const { 
    foundationData, 
    selectedIdea, 
    setSelectedIdea, 
    setCurrentStep,
    setLoading 
  } = useAppStore();
  
  const [ideas, setIdeas] = useState<IdeaCard[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [thumbnailBriefs, setThumbnailBriefs] = useState<Map<string, any>>(new Map());

  useEffect(() => {
    setCurrentStep('ideation');
    // Auto-generate ideas on first visit
    if (!hasGenerated && foundationData && ideas.length === 0) {
      generateNewIdeas();
      setHasGenerated(true);
    }
  }, [setCurrentStep, foundationData]);

  const generateNewIdeas = async () => {
    if (!foundationData) {
      toast.error('Please complete foundation setup first');
      navigate('/foundation');
      return;
    }

    setIsGenerating(true);
    setLoading(true, "Generating fresh video ideas with AI...");
    
    try {
      // Generate only 3 ideas at a time instead of 15
      const allGeneratedIdeas = await copperReelsGemini.generateIdeas({
        umbrella: useAppStore.getState().umbrellaStatement || '',
        viewerType: foundationData.viewerType,
        avatarSummary: `${foundationData.avatar.demographics}. ${foundationData.avatar.psychographics}`,
        pillars: foundationData.pillars.map(p => ({
          name: p.title,
          summary: p.description
        }))
      });
      
      // Limit to 3 ideas
      const generatedIdeas = allGeneratedIdeas.slice(0, 3);

      // Transform Gemini ideas to IdeaCard format
      const newIdeas: IdeaCard[] = generatedIdeas.map((idea, index) => ({
        id: `gemini-${Date.now()}-${index}`,
        title: idea.concept,
        thumbnail: '/api/placeholder/300/200',
        pillar: idea.pillar,
        pillarColor: foundationData.pillars.find(p => p.title === idea.pillar)?.color || 'bg-gray-500',
        ctrScore: Math.round(idea.difficulty * 2), // Convert 1-5 to approximate CTR score
        description: idea.whyItWillClick
      }));
      
      // Generate thumbnail briefs for each idea with enhanced context
      for (const idea of newIdeas) {
        try {
          // Build enhanced context from foundation data (all are strings in the current structure)
          const demographics = foundationData.avatar?.demographics || '';
          const psychographics = foundationData.avatar?.psychographics || '';
          const painPoints = foundationData.avatar?.painPoints || '';
          const goals = foundationData.avatar?.goals || '';
          
          // Get selected content pillar for this idea
          const selectedPillar = foundationData.pillars?.find(p => p.title === idea.pillar);
          const pillarDescription = selectedPillar?.description || '';
          
          // Create enhanced prompt context for more relevant thumbnails
          const enhancedContext = `
            Target Audience: ${demographics}
            Psychographics: ${psychographics}
            Pain Points: ${painPoints}
            Goals: ${goals}
            Content Pillar: ${idea.pillar} - ${pillarDescription}
            Video Concept: ${idea.description}
          `.trim();
          
          const thumbnailBrief = await copperReelsGemini.generateThumbnailBriefs({
            titleText: idea.title,
            ideaConcept: `${idea.description}\n\nContext for thumbnail design: ${enhancedContext}`,
            patternBank: {
              audienceType: foundationData.viewerType,
              contentPillar: idea.pillar,
              targetDemo: demographics
            }
          });
          
          if (thumbnailBrief && thumbnailBrief.length > 0) {
            setThumbnailBriefs(prev => new Map(prev).set(idea.id, thumbnailBrief[0]));
          }
        } catch (error) {
          console.error(`Failed to generate thumbnail for ${idea.title}:`, error);
        }
      }
      
      setIdeas(prev => [...newIdeas, ...prev]);
      
      // Save to history
      newIdeas.forEach(idea => {
        historyService.addItem({
          type: 'idea',
          title: idea.title,
          description: idea.description,
          data: { idea, thumbnailBrief: thumbnailBriefs.get(idea.id) }
        });
      });
      
      toast.success(`Generated ${newIdeas.length} new video ideas with thumbnails!`);
    } catch (error) {
      console.error('Failed to generate ideas:', error);
      toast.error('Failed to generate ideas. Please try again.');
    } finally {
      setIsGenerating(false);
      setLoading(false);
    }
  };

  const handleIdeaSelect = (idea: IdeaCard) => {
    setSelectedIdea(idea);
  };

  const filteredIdeas = ideas.filter(idea =>
    idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    idea.pillar.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show a full-page loader only while this page is actively generating ideas
  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <LoadingSpinner size="lg" message="Generating fresh video ideas..." />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-6 text-muted-foreground max-w-md"
          >
            Our AI is analyzing trending topics in your niche and creating video ideas tailored to your content pillars.
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        <ProgressIndicator currentStep="ideation" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto mt-8"
        >
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Ideation Hub</h1>
              <p className="text-muted-foreground">
                AI-generated video ideas based on your content pillars
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search ideas or pillars..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-full sm:w-64"
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={() => navigate('/pattern-bank')}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Pattern Bank
                </Button>
                
                <Button
                  onClick={generateNewIdeas}
                  disabled={isGenerating}
                  className="bg-gradient-primary hover:shadow-glow"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Generate New Ideas
                </Button>
              </div>
            </div>
          </div>

          {/* Kanban Board */}
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {columns.map((column, columnIndex) => (
              <motion.div
                key={column.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: columnIndex * 0.1 }}
              >
                <Card className="p-4 h-fit shadow-elegant">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg">{column.title}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {column.id === 'ideas' ? filteredIdeas.length : column.count}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3 min-h-[400px]">
                    {column.id === 'ideas' && (
                      <AnimatePresence>
                        {filteredIdeas.map((idea, index) => (
                          <motion.div
                            key={idea.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleIdeaSelect(idea)}
                            className={`cursor-pointer transition-all duration-200 ${
                              selectedIdea?.id === idea.id ? 'ring-2 ring-primary shadow-glow' : ''
                            }`}
                          >
                            <Card className="p-4 hover:shadow-md">
                              <div className="aspect-video bg-muted rounded-lg mb-3 overflow-hidden relative">
                                {thumbnailBriefs.get(idea.id) ? (
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <div className="w-full h-full relative bg-gradient-to-br from-purple-600 to-blue-600 cursor-help">
                                          <div className="absolute inset-0 flex flex-col justify-between p-3">
                                            <div className="text-white font-bold text-sm drop-shadow-lg">
                                              {thumbnailBriefs.get(idea.id).overlayText}
                                            </div>
                                            <div className="text-white/80 text-[10px]">
                                              {thumbnailBriefs.get(idea.id).subject}
                                            </div>
                                          </div>
                                          <div className="absolute bottom-0 right-0 p-2 text-white/60 text-[8px]">
                                            {thumbnailBriefs.get(idea.id).colorMood}
                                          </div>
                                          <div className="absolute top-2 right-2">
                                            <Info className="w-3 h-3 text-white/60" />
                                          </div>
                                        </div>
                                      </TooltipTrigger>
                                      <TooltipContent className="max-w-xs">
                                        <div className="space-y-1 text-xs">
                                          <p><strong>Background:</strong> {thumbnailBriefs.get(idea.id).background}</p>
                                          <p><strong>Composition:</strong> {thumbnailBriefs.get(idea.id).composition}</p>
                                          <p><strong>Expression:</strong> {thumbnailBriefs.get(idea.id).expressionOrHero}</p>
                                        </div>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                ) : (
                                  <img 
                                    src={idea.thumbnail} 
                                    alt={idea.title}
                                    className="w-full h-full object-cover"
                                  />
                                )}
                              </div>
                              
                              <h4 className="font-medium text-sm mb-2 line-clamp-2">
                                {idea.title}
                              </h4>
                              
                              <div className="flex items-center justify-between mb-2">
                                <Badge 
                                  variant="secondary" 
                                  className="text-xs px-2 py-1"
                                >
                                  {idea.pillar}
                                </Badge>
                                
                                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                  <TrendingUp className="w-3 h-3" />
                                  <span>{idea.ctrScore}</span>
                                </div>
                              </div>
                              
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {idea.description}
                              </p>
                            </Card>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    )}
                    
                    {column.id !== 'ideas' && (
                      <div className="text-center text-muted-foreground py-8">
                        <p className="text-sm">No items yet</p>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex justify-between"
          >
            <Button
              variant="outline"
              onClick={() => navigate('/foundation')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Foundation</span>
            </Button>
            
            <Button
              onClick={() => navigate('/plan')}
              disabled={!selectedIdea}
              className="flex items-center space-x-2 bg-gradient-primary hover:shadow-glow disabled:opacity-50"
            >
              <span>Plan Video</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Magic Title Generator */}
      <MagicTitleGenerator 
        ideaTitle={selectedIdea?.title}
        onTitleSelect={(title) => {
          if (selectedIdea) {
            // Update the selected idea with the new title
            const updatedIdea = { ...selectedIdea, title };
            setSelectedIdea(updatedIdea);
            setIdeas(prev => prev.map(idea => 
              idea.id === selectedIdea.id ? updatedIdea : idea
            ));
            toast.success('Idea title updated!');
          }
        }}
      />
    </div>
  );
}
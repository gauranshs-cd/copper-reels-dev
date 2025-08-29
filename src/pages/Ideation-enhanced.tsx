import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { InlineEditingCTA } from '@/components/VideoEditingUpsell';
import { 
  Sparkles, 
  RefreshCw, 
  ArrowRight, 
  Eye, 
  Target, 
  TrendingUp,
  HelpCircle,
  Check,
  Image as ImageIcon,
  AlertCircle,
  ChevronRight,
  Lightbulb,
  Hash,
  MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { NavigationFlow } from '@/components/NavigationFlow';
import { FloatingNextButton } from '@/components/FloatingNextButton';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useLayout } from '@/contexts/LayoutContext';
import { useAuth } from '@/components/auth/AuthProvider';
import { useAppStore } from '@/store/useAppStore';
import { copperReelsGemini } from '@/lib/gemini';
import { generateRealThumbnail } from '@/lib/thumbnail-generator';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface IdeaWithThumbnail {
  id: string;
  concept: string;
  pillar: string;
  angle: string;
  whyItWillClick: string;
  thumbnailHint: string;
  thumbnailUrl?: string;
  difficulty: number;
  stage?: string;
  notes?: string;
  selected?: boolean;
  metadata?: {
    targetAudience?: string;
    estimatedViews?: string;
    keywords?: string[];
  };
}

interface QuestionPrompt {
  id: string;
  question: string;
  field: string;
  placeholder: string;
  required: boolean;
}

export default function IdeationEnhanced() {
  const navigate = useNavigate();
  const { hasSidebar } = useLayout();
  const { user } = useAuth();
  const { 
    foundationData, 
    ideas, 
    setIdeas, 
    selectedIdea, 
    setSelectedIdea,
    setCurrentStep,
    setLoading 
  } = useAppStore();

  const [isGenerating, setIsGenerating] = useState(false);
  const [ideasWithThumbnails, setIdeasWithThumbnails] = useState<IdeaWithThumbnail[]>([]);
  const [showQuestions, setShowQuestions] = useState(false);
  const [questions, setQuestions] = useState<QuestionPrompt[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [generatingThumbnails, setGeneratingThumbnails] = useState(false);
  const [missingInfo, setMissingInfo] = useState<string[]>([]);
  const [contextInput, setContextInput] = useState('');
  const [addedContexts, setAddedContexts] = useState<string[]>([]);

  useEffect(() => {
    setCurrentStep('ideation');
    
    // Force clear all cached ideas data to prevent showing irrelevant content
    setIdeasWithThumbnails([]);
    setIdeas([]);
    
    // Clear any persisted ideas from localStorage
    localStorage.removeItem('ideas_data');
    localStorage.removeItem('cached_ideas');
    
    // Check for missing information
    if (foundationData) {
      const missing = [];
      
      // Check if statement contains unknown terms
      const statement = foundationData.pillars?.[0]?.title || '';
      const unknownTerms = detectUnknownTerms(statement);
      
      if (unknownTerms.length > 0) {
        missing.push(...unknownTerms);
        
        // Generate questions for unknown terms
        const questionsToAsk: QuestionPrompt[] = unknownTerms.map(term => ({
          id: term,
          question: `What is ${term}? Please provide context.`,
          field: term,
          placeholder: `Explain what ${term} means in your context...`,
          required: true
        }));
        
        setQuestions(questionsToAsk);
        setMissingInfo(missing);
      }
    }
    
    // Always generate fresh ideas when foundation data exists
    if (foundationData) {
      // Small delay to ensure state is cleared before generating
      setTimeout(() => {
        generateIdeas();
      }, 100);
    }
  }, [foundationData]);

  const detectUnknownTerms = (text: string): string[] => {
    // Common acronyms/terms that might need clarification
    const potentialUnknowns = ['HHA', 'SaaS', 'B2B', 'B2C', 'SMB', 'MVP', 'ROI', 'KPI', 'CRM'];
    const found = [];
    
    for (const term of potentialUnknowns) {
      if (text.includes(term)) {
        found.push(term);
      }
    }
    
    return found;
  };

  const addContext = () => {
    if (contextInput.trim()) {
      setAddedContexts(prev => [...prev, contextInput.trim()]);
      setContextInput('');
      // Regenerate ideas with new context
      generateIdeas();
    }
  };

  const removeContext = (index: number) => {
    setAddedContexts(prev => prev.filter((_, i) => i !== index));
    // Regenerate ideas without removed context
    generateIdeas();
  };

  const generateIdeas = async (additionalContext?: string) => {
    if (!foundationData) return;
    
    // Reset used hashtags for each new generation
    usedHashtags.clear();
    
    setIsGenerating(true);
    setLoading(true, 'Generating viral video ideas...');
    
    try {
      // Get selected demographics and pillars
      const selectedDemographics = foundationData.avatar.demographics;
      const selectedPillars = foundationData.pillars.filter((p: any) => p.selected);
      
      // Build context with answers to questions and added contexts
      let context = additionalContext || '';
      if (Object.keys(answers).length > 0) {
        context += '\nAdditional context:\n';
        for (const [key, value] of Object.entries(answers)) {
          context += `${key}: ${value}\n`;
        }
      }
      
      // Add user-provided contexts
      if (addedContexts.length > 0) {
        context += '\nUser Context:\n';
        addedContexts.forEach(ctx => {
          context += `- ${ctx}\n`;
        });
      }
      
      const generatedIdeas = await copperReelsGemini.generateIdeas({
        umbrella: context || 'Content creation',
        viewerType: foundationData.viewerType,
        avatarSummary: `Demographics: ${selectedDemographics}. ${foundationData.avatar.psychographics}`,
        pillars: selectedPillars,
        keyword: context
      });
      
      // Generate thumbnails for each idea
      setGeneratingThumbnails(true);
      const ideasWithThumbs: IdeaWithThumbnail[] = await Promise.all(
        generatedIdeas.map(async (idea, index) => {
          try {
            // Enhanced thumbnail prompt using successful format structure
            const demographics = foundationData.avatar?.demographics || '';
            const psychographics = foundationData.avatar?.psychographics || '';
            const painPoints = foundationData.avatar?.painPoints || '';
            const goals = foundationData.avatar?.goals || '';
            
            // Create structured prompt similar to successful example
            const structuredPrompt = `${idea.concept}

${idea.whyItWillClick}

Addresses key pain points: ${painPoints}. Provides actionable value for ${demographics} audience.

${idea.pillar.toLowerCase().replace(/\s+/g, '')}${idea.concept.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 20)}`;
            
            const enhancedPrompt = structuredPrompt;
            
            const thumbnailUrl = await generateRealThumbnail({
              prompt: enhancedPrompt,
              style: 'photorealistic',
              aspectRatio: '16:9'
            });
            
            return {
              ...idea,
              id: `idea-${index}`,
              thumbnailUrl,
              selected: index === 0, // Select first by default
              metadata: {
                targetAudience: selectedDemographics,
                estimatedViews: calculateEstimatedViews(idea.difficulty),
                keywords: extractKeywords(idea.concept, idea.pillar, index)
              }
            };
          } catch (error) {
            console.error('Failed to generate thumbnail:', error);
            return {
              ...idea,
              id: `idea-${index}`,
              selected: index === 0,
              metadata: {
                targetAudience: selectedDemographics,
                estimatedViews: calculateEstimatedViews(idea.difficulty),
                keywords: extractKeywords(idea.concept, idea.pillar, index)
              }
            };
          }
        })
      );
      
      setIdeasWithThumbnails(ideasWithThumbs);
      setIdeas(generatedIdeas);
      setGeneratingThumbnails(false);
      setIsGenerating(false);
      setLoading(false);
      
      toast.success('Ideas generated successfully!');
    } catch (error) {
      console.error('Failed to generate ideas:', error);
      toast.error('Failed to generate ideas. Please try again.');
      setGeneratingThumbnails(false);
      setIsGenerating(false);
      setLoading(false);
    }
  };

  const calculateEstimatedViews = (difficulty: number): string => {
    const base = 10000;
    const multiplier = 6 - difficulty; // Higher difficulty = lower views initially
    const estimated = base * multiplier;
    
    if (estimated >= 1000000) {
      return `${(estimated / 1000000).toFixed(1)}M`;
    } else if (estimated >= 1000) {
      return `${(estimated / 1000).toFixed(0)}K`;
    }
    return estimated.toString();
  };

  // Track used hashtags across all ideas to ensure uniqueness
  const usedHashtags = new Set<string>();
  
  const extractKeywords = (concept: string, pillar?: string, ideaIndex?: number): string[] => {
    // YTGS-based hashtag generation using foundation context
    const foundationContext = foundationData?.avatar?.demographics || '';
    const niche = foundationContext.toLowerCase();
    
    // Core YTGS hashtag categories with expanded options for diversity
    const ytgsHashtags = {
      // Niche-specific tags based on foundation
      niche: generateNicheHashtags(niche),
      // Content pillar tags
      pillar: pillar ? generatePillarHashtags(pillar) : [],
      // Engagement-focused tags (expanded for variety)
      engagement: ['howto', 'tutorial', 'tips', 'guide', 'learn', 'beginner', 'stepbystep', 'quicktips', 'masterclass', 'basics'],
      // Authority tags (expanded)
      authority: ['expert', 'pro', 'advanced', 'secrets', 'insider', 'professional', 'mastery', 'elite', 'specialist'],
      // Viral potential tags (expanded)
      viral: ['viral', 'trending', 'popular', 'mustsee', 'gamechanging', 'breakthrough', 'revolutionary', 'amazing', 'incredible'],
      // Action-oriented tags
      action: ['diy', 'create', 'build', 'make', 'achieve', 'transform', 'improve', 'upgrade', 'optimize'],
      // Time-based tags
      time: ['quick', 'fast', 'instant', 'daily', 'weekly', 'ultimate', 'complete', 'simple']
    };
    
    // Extract concept-specific keywords
    const conceptWords = concept.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(' ')
      .filter(word => word.length > 3 && !['that', 'this', 'with', 'from', 'they', 'have', 'will', 'your', 'more'].includes(word));
    
    // Strategy: Use different hashtag combinations for each idea
    let selectedTags: string[] = [];
    
    if (ideaIndex === 0) {
      // First idea: Focus on niche + engagement + concept
      selectedTags = [
        ...ytgsHashtags.niche.slice(0, 2),
        ...ytgsHashtags.engagement.slice(0, 1),
        ...ytgsHashtags.pillar.slice(0, 1),
        ...conceptWords.slice(0, 2)
      ];
    } else if (ideaIndex === 1) {
      // Second idea: Focus on authority + action + concept
      selectedTags = [
        ...ytgsHashtags.niche.slice(2, 3),
        ...ytgsHashtags.authority.slice(0, 1),
        ...ytgsHashtags.action.slice(0, 1),
        ...ytgsHashtags.pillar.slice(0, 1),
        ...conceptWords.slice(1, 3)
      ];
    } else {
      // Third idea: Focus on viral + time + concept
      selectedTags = [
        ...ytgsHashtags.niche.slice(1, 2),
        ...ytgsHashtags.viral.slice(0, 1),
        ...ytgsHashtags.time.slice(0, 1),
        ...ytgsHashtags.pillar.slice(0, 1),
        ...conceptWords.slice(0, 2)
      ];
    }
    
    // Remove duplicates and filter out already used hashtags
    const uniqueTags = [...new Set(selectedTags)]
      .filter(tag => !usedHashtags.has(tag))
      .slice(0, 5);
    
    // If we don't have enough unique tags, add fallback options
    if (uniqueTags.length < 5) {
      const allAvailableTags = [
        ...ytgsHashtags.niche,
        ...ytgsHashtags.engagement,
        ...ytgsHashtags.authority,
        ...ytgsHashtags.viral,
        ...ytgsHashtags.action,
        ...ytgsHashtags.time,
        ...conceptWords
      ].filter(tag => !usedHashtags.has(tag));
      
      const additionalTags = allAvailableTags.slice(0, 5 - uniqueTags.length);
      uniqueTags.push(...additionalTags);
    }
    
    // Mark these hashtags as used
    uniqueTags.forEach(tag => usedHashtags.add(tag));
    
    return uniqueTags.slice(0, 5);
  };
  
  const generateNicheHashtags = (niche: string): string[] => {
    const nicheMap: { [key: string]: string[] } = {
      'fitness': ['fitness', 'workout', 'health', 'gym', 'training'],
      'business': ['business', 'entrepreneur', 'startup', 'marketing', 'success'],
      'tech': ['tech', 'technology', 'coding', 'programming', 'software'],
      'cooking': ['cooking', 'recipe', 'food', 'kitchen', 'chef'],
      'education': ['education', 'learning', 'study', 'academic', 'knowledge'],
      'lifestyle': ['lifestyle', 'life', 'productivity', 'motivation', 'mindset'],
      'finance': ['finance', 'money', 'investing', 'wealth', 'financial'],
      'travel': ['travel', 'adventure', 'explore', 'destination', 'journey'],
      'gaming': ['gaming', 'gamer', 'gameplay', 'esports', 'streaming'],
      'beauty': ['beauty', 'makeup', 'skincare', 'style', 'fashion']
    };
    
    // Find matching niche or return generic tags
    for (const [key, tags] of Object.entries(nicheMap)) {
      if (niche.includes(key)) {
        return tags;
      }
    }
    
    return ['content', 'creator', 'youtube', 'video', 'online'];
  };
  
  const generatePillarHashtags = (pillar: string): string[] => {
    return [pillar.toLowerCase().replace(/\s+/g, ''), `${pillar.toLowerCase().replace(/\s+/g, '')}tips`];
  };

  const selectIdea = (idea: IdeaWithThumbnail) => {
    setIdeasWithThumbnails(prev => 
      prev.map(i => ({ ...i, selected: i.id === idea.id }))
    );
    // Transform to IdeaCard format for the store
    const ideaCard = {
      id: idea.id,
      title: idea.concept,
      thumbnail: idea.thumbnailUrl || '/api/placeholder/300/200',
      pillar: idea.pillar,
      pillarColor: 'bg-blue-500',
      ctrScore: Math.round(idea.difficulty * 2),
      description: idea.whyItWillClick,
      concept: idea.concept,
      angle: idea.angle,
      whyItWillClick: idea.whyItWillClick,
      thumbnailBrief: idea.thumbnailHint
    };
    setSelectedIdea(ideaCard);
  };

  const proceedToPlanning = () => {
    const selected = ideasWithThumbnails.find(i => i.selected);
    if (selected) {
      // Transform to IdeaCard format for the store
      const ideaCard = {
        id: selected.id,
        title: selected.concept,
        thumbnail: selected.thumbnailUrl || '/api/placeholder/300/200',
        pillar: selected.pillar,
        pillarColor: 'bg-blue-500',
        ctrScore: Math.round(selected.difficulty * 2),
        description: selected.whyItWillClick,
        concept: selected.concept,
        angle: selected.angle,
        whyItWillClick: selected.whyItWillClick,
        thumbnailBrief: selected.thumbnailHint
      };
      setSelectedIdea(ideaCard);
      navigate('/plan');
    }
  };

  const handleAnswerQuestions = () => {
    // Validate required questions
    const unanswered = questions
      .filter(q => q.required && !answers[q.field])
      .map(q => q.field);
    
    if (unanswered.length > 0) {
      toast.error(`Please answer all required questions: ${unanswered.join(', ')}`);
      return;
    }
    
    setShowQuestions(false);
    generateIdeas(JSON.stringify(answers));
  };

  // Show questions dialog if missing info
  if (showQuestions || (missingInfo.length > 0 && !ideasWithThumbnails.length)) {
    return (
      <Dialog open={true} onOpenChange={() => setShowQuestions(false)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Help Us Understand Better</DialogTitle>
            <DialogDescription>
              We detected some terms that need clarification to generate better ideas
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 max-h-96 overflow-y-auto py-4">
            {questions.map(q => (
              <div key={q.id} className="space-y-2">
                <Label className="flex items-center gap-2">
                  {q.question}
                  {q.required && <span className="text-red-500">*</span>}
                </Label>
                <Textarea
                  placeholder={q.placeholder}
                  value={answers[q.field] || ''}
                  onChange={(e) => setAnswers(prev => ({
                    ...prev,
                    [q.field]: e.target.value
                  }))}
                  className="min-h-20"
                />
              </div>
            ))}
            
            {missingInfo.length > 0 && (
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
                      Unknown terms detected: {missingInfo.join(', ')}
                    </p>
                    <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                      Providing context will help generate more relevant ideas
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowQuestions(false);
                generateIdeas();
              }}
            >
              Skip Questions
            </Button>
            <Button onClick={handleAnswerQuestions}>
              Generate Ideas
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle pb-32">
      <div className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto mt-8"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold mb-4"
            >
              Video Idea Generator
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              AI-generated ideas based on your selected foundation elements
            </motion.p>
            
            {/* Selected Foundation Info */}
            {foundationData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-6 flex flex-wrap justify-center gap-2"
              >
                <Badge variant="secondary" className="px-3 py-1">
                  {foundationData.viewerType}
                </Badge>
                {foundationData.pillars.slice(0, 3).map((pillar: any) => (
                  <Badge key={pillar.id} variant="outline" className="px-3 py-1">
                    {pillar.title}
                  </Badge>
                ))}
              </motion.div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mb-8">
            <Button
              onClick={() => generateIdeas()}
              disabled={isGenerating}
              className="bg-gradient-primary"
            >
              {isGenerating ? (
                <>
                  <LoadingSpinner className="w-4 h-4 mr-2" />
                  Generating Ideas...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Generate New Ideas
                </>
              )}
            </Button>
            
            {questions.length > 0 && (
              <Button
                variant="outline"
                onClick={() => setShowQuestions(true)}
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                Answer Questions
              </Button>
            )}
          </div>

          {/* Loading State for Thumbnails */}
          {generatingThumbnails && (
            <div className="text-center mb-8">
              <LoadingSpinner size="sm" />
              <p className="text-sm text-muted-foreground mt-2">
                Generating thumbnails for your ideas...
              </p>
            </div>
          )}

          {/* Ideas Grid with Thumbnails */}
          <div className="grid lg:grid-cols-3 gap-6 mb-12">
            {ideasWithThumbnails.map((idea, index) => (
              <motion.div
                key={idea.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => selectIdea(idea)}
                className={cn(
                  "cursor-pointer transition-all",
                  idea.selected && "ring-2 ring-primary ring-offset-2"
                )}
              >
                <Card className="overflow-hidden h-full">
                  {/* Thumbnail */}
                  <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-primary/10">
                    {idea.thumbnailUrl ? (
                      <img 
                        src={idea.thumbnailUrl} 
                        alt={idea.concept}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-12 h-12 text-muted-foreground" />
                      </div>
                    )}
                    
                    {/* Selected Indicator */}
                    {idea.selected && (
                      <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-2">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                    
                    {/* Difficulty Badge */}
                    <Badge 
                      className="absolute bottom-2 left-2"
                      variant={idea.difficulty <= 2 ? "secondary" : idea.difficulty <= 4 ? "default" : "destructive"}
                    >
                      Difficulty: {idea.difficulty}/5
                    </Badge>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant="outline" className="text-xs">
                        {idea.pillar}
                      </Badge>
                      {idea.metadata?.estimatedViews && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Eye className="w-3 h-3" />
                          {idea.metadata.estimatedViews}
                        </div>
                      )}
                    </div>
                    
                    <h3 className="font-bold text-lg mb-2 line-clamp-2">
                      {idea.concept}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {idea.angle}
                    </p>
                    
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <TrendingUp className="w-4 h-4 text-primary mt-0.5" />
                        <p className="text-sm">{idea.whyItWillClick}</p>
                      </div>
                      
                      {idea.metadata?.keywords && (
                        <div className="flex items-start gap-2">
                          <Hash className="w-4 h-4 text-muted-foreground mt-0.5" />
                          <div className="flex flex-wrap gap-1">
                            {idea.metadata.keywords.map((keyword, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {idea.notes && (
                      <p className="text-xs text-muted-foreground mt-3 italic">
                        {idea.notes}
                      </p>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {!isGenerating && ideasWithThumbnails.length === 0 && (
            <div className="text-center py-12">
              <Lightbulb className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No ideas generated yet</h3>
              <p className="text-muted-foreground mb-6">
                Click "Generate New Ideas" to get started
              </p>
              <Button onClick={() => generateIdeas()} className="bg-gradient-primary">
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Ideas
              </Button>
            </div>
          )}

          {/* Additional Context Section */}
          {ideasWithThumbnails.length > 0 && (
            <>
              <Card className="p-6 mb-8">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-primary" />
                  Additional Context
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Add any additional information to refine your ideas
                </p>
                <div className="flex gap-2">
                  <Input
                    placeholder="E.g., trending topics, specific angles, competitor videos..."
                    className="flex-1"
                    value={contextInput}
                    onChange={(e) => setContextInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        addContext();
                      }
                    }}
                  />
                  <Button variant="outline" onClick={addContext}>
                    Add Context
                  </Button>
                </div>
                
                {/* Display added contexts */}
                {addedContexts.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Added Context:</p>
                    {addedContexts.map((context, index) => (
                      <div key={index} className="flex items-center justify-between bg-muted/50 rounded-lg p-3">
                        <span className="text-sm">{context}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeContext(index)}
                          className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
              
              {/* Video Editing Upsell */}
              <div className="mb-8">
                <InlineEditingCTA variant="compact" />
              </div>
            </>
          )}
        </motion.div>
      </div>
      
      {/* Navigation Flow - only show when sidebar is not present */}
      <NavigationFlow
        canProceed={ideasWithThumbnails.some(i => i.selected)}
        nextLabel="Plan Video"
        onNext={proceedToPlanning}
      />
      
      {/* Floating Next Button - show for authenticated users */}
      {user && (
        <FloatingNextButton
          show={ideasWithThumbnails.some(i => i.selected)}
          onClick={proceedToPlanning}
          label="Plan Video"
          nextPath="/plan"
        />
      )}
    </div>
  );
}
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  Users, 
  Eye, 
  Lightbulb, 
  RefreshCw, 
  Plus, 
  Check, 
  Sparkles,
  Target,
  Brain,
  Heart,
  AlertCircle,
  ChevronDown,
  FileText,
  Bookmark
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { NavigationFlow } from '@/components/NavigationFlow';
import { FloatingNextButton } from '@/components/FloatingNextButton';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { FoundationModal } from '@/components/FoundationModal';
import { useLayout } from '@/contexts/LayoutContext';
import { useAuth } from '@/components/auth/AuthProvider';
import { useAppStore } from '@/store/useAppStore';
import { copperReelsGemini } from '@/lib/gemini';
import { sessionService } from '@/lib/supabase/session-service';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { historyService } from '@/lib/history';
import { cn } from '@/lib/utils';
import type { Avatar, ContentPillar, FoundationData } from '@/store/useAppStore';

interface SelectableBlock {
  id: string;
  label: string;
  value: string;
  selected: boolean;
  icon?: any;
  color?: string;
}

interface EnhancedPillar extends ContentPillar {
  topics?: string[];
  selected?: boolean;
}

export default function Foundation() {
  const navigate = useNavigate();
  const { hasSidebar } = useLayout();
  const { user } = useAuth();
  const { 
    umbrellaStatement, 
    foundationData, 
    setFoundationData, 
    setCurrentStep,
    setLoading 
  } = useAppStore();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSelector, setShowSelector] = useState(false);
  const [showFoundationModal, setShowFoundationModal] = useState(false);
  const [previousFoundations, setPreviousFoundations] = useState<any[]>([]);
  const [demographicBlocks, setDemographicBlocks] = useState<SelectableBlock[]>([]);
  const [psychographicBlocks, setPsychographicBlocks] = useState<SelectableBlock[]>([]);
  const [painPointBlocks, setPainPointBlocks] = useState<SelectableBlock[]>([]);
  const [enhancedPillars, setEnhancedPillars] = useState<EnhancedPillar[]>([]);
  const [enhancedHeading, setEnhancedHeading] = useState('');

  const generateFoundation = async (useUmbrella?: string) => {
    const statementToUse = useUmbrella || umbrellaStatement;
    if (!statementToUse) return;
    
    console.log('Starting foundation generation for:', statementToUse);
    
    setIsGenerating(true);
    setLoading(true, 'Generating your content foundation...');
    
    try {
      const foundation = await copperReelsGemini.generateFoundation({
        umbrella: statementToUse
      });
      
      // Generate enhanced heading
      const enhanced = `${statementToUse} - Building Your YouTube Empire`;
      setEnhancedHeading(enhanced);
      
      // Parse demographics into selectable blocks
      const demoBlocks: SelectableBlock[] = [
        {
          id: 'age',
          label: 'Age Range',
          value: foundation.avatar.demographics.ageRange,
          selected: true,
          icon: Users,
          color: 'bg-blue-500'
        },
        ...foundation.avatar.demographics.locations.map((loc, i) => ({
          id: `location-${i}`,
          label: 'Location',
          value: loc,
          selected: true,
          icon: Target,
          color: 'bg-green-500'
        })),
        ...foundation.avatar.demographics.roles.map((role, i) => ({
          id: `role-${i}`,
          label: 'Role',
          value: role,
          selected: true,
          icon: Bookmark,
          color: 'bg-purple-500'
        }))
      ];
      
      if (foundation.avatar.demographics.incomeRange) {
        demoBlocks.push({
          id: 'income',
          label: 'Income',
          value: foundation.avatar.demographics.incomeRange,
          selected: true,
          icon: Target,
          color: 'bg-yellow-500'
        });
      }
      
      setDemographicBlocks(demoBlocks);
      
      // Parse psychographics into selectable blocks
      const psychoBlocks: SelectableBlock[] = foundation.avatar.psychographics.goals.map((goal, i) => ({
        id: `goal-${i}`,
        label: 'Goal',
        value: goal,
        selected: true,
        icon: Brain,
        color: 'bg-indigo-500'
      }));
      
      setPsychographicBlocks(psychoBlocks);
      
      // Parse pain points into selectable blocks
      const painBlocks: SelectableBlock[] = foundation.avatar.psychographics.rankedProblems.map((problem, i) => ({
        id: `pain-${i}`,
        label: 'Pain Point',
        value: `${problem.problem}: ${problem.whyItMatters}`,
        selected: true,
        icon: AlertCircle,
        color: 'bg-red-500'
      }));
      
      setPainPointBlocks(painBlocks);
      
      // Generate more content pillars with topics
      const pillarsWithTopics: EnhancedPillar[] = [
        ...foundation.pillars.map((pillar, index) => ({
          ...pillar,
          selected: index === 0, // Select first by default
          topics: generateTopicsForPillar(pillar.name, statementToUse)
        })),
        // Add more pillars
        {
          id: `pillar-${foundation.pillars.length + 1}`,
          title: 'Case Studies & Success Stories',
          description: 'Real-world examples and transformations',
          color: 'bg-cyan-500',
          topics: ['Client transformations', 'Before/after scenarios', 'Success metrics'],
          selected: false
        },
        {
          id: `pillar-${foundation.pillars.length + 2}`,
          title: 'Tools & Resources',
          description: 'Practical tools and templates',
          color: 'bg-amber-500',
          topics: ['Software reviews', 'Templates', 'Checklists', 'Frameworks'],
          selected: false
        },
        {
          id: `pillar-${foundation.pillars.length + 3}`,
          title: 'Mistakes & Lessons',
          description: 'Common pitfalls and how to avoid them',
          color: 'bg-rose-500',
          topics: ['Common mistakes', 'Lessons learned', 'What not to do'],
          selected: false
        },
        {
          id: `pillar-${foundation.pillars.length + 4}`,
          title: 'Industry Insights',
          description: 'Trends and analysis in your niche',
          color: 'bg-teal-500',
          topics: ['Market trends', 'Industry news', 'Future predictions'],
          selected: false
        }
      ];
      
      setEnhancedPillars(pillarsWithTopics);
      
      // Transform to store format
      const transformedData: FoundationData = {
        avatar: {
          demographics: demoBlocks.filter(b => b.selected).map(b => b.value).join(', '),
          psychographics: psychoBlocks.filter(b => b.selected).map(b => b.value).join('. '),
          painPoints: painBlocks.filter(b => b.selected).map(b => b.value).join('. '),
          goals: psychoBlocks.filter(b => b.selected).map(b => b.value).join('. ')
        },
        viewerType: foundation.viewerType,
        viewerTypeRationale: foundation.notes.rationale,
        pillars: pillarsWithTopics.filter(p => p.selected).slice(0, 5)
      };
      
      setFoundationData(transformedData);
      
      // Save to history
      historyService.addItem({
        type: 'foundation',
        title: enhanced,
        description: `${pillarsWithTopics.length} content pillars for ${foundation.viewerType.toLowerCase()} viewers`,
        data: transformedData
      });
      
      // Save to localStorage for future selection
      const saved = JSON.parse(localStorage.getItem('previous_foundations') || '[]');
      saved.push({
        id: Date.now(),
        statement: statementToUse,
        enhanced: enhanced,
        data: transformedData,
        created: new Date().toISOString()
      });
      localStorage.setItem('previous_foundations', JSON.stringify(saved));
      
      toast.success('Foundation generated successfully!');
      setIsGenerating(false);
      setLoading(false);
    } catch (error: any) {
      console.error('Failed to generate foundation:', error);
      const errorMessage = error?.message || 'Unknown error';
      
      // More specific error messages
      if (errorMessage.includes('quota') || errorMessage.includes('429')) {
        toast.error('API quota exceeded. Please try again later or contact support.');
      } else if (errorMessage.includes('API key')) {
        toast.error('API key issue. Please contact support.');
      } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
        toast.error('Network error. Please check your connection and try again.');
      } else {
        toast.error(`Failed to generate foundation: ${errorMessage}`);
      }
      
      setIsGenerating(false);
      setLoading(false);
    }
  };

  const generateTopicsForPillar = (pillarName: string, statement: string): string[] => {
    // Generate relevant topics based on pillar and statement
    const baseTopics = {
      'Getting Started': ['First steps', 'Beginner mistakes', 'Essential tools', 'Quick wins'],
      'Advanced Strategies': ['Pro techniques', 'Scaling methods', 'Optimization', 'Advanced tools'],
      'Mindset': ['Overcoming fears', 'Building confidence', 'Success habits', 'Mental models'],
      'Case Studies': ['Success stories', 'Failures analyzed', 'Before/after', 'Client results'],
      'Tools': ['Software reviews', 'Templates', 'Automation', 'Workflows'],
      'Mistakes': ['Common errors', 'What to avoid', 'Lessons learned', 'Troubleshooting']
    };
    
    return baseTopics[pillarName] || ['Topic 1', 'Topic 2', 'Topic 3', 'Topic 4'];
  };

  const handleFoundationModalSubmit = async (data: { niche: string; audience: string; goals: string }) => {
    // Save the foundation data from modal
    const newFoundationData: FoundationData = {
      avatar: {
        demographics: data.audience,
        psychographics: data.goals,
        painPoints: '', // Will be generated later
        goals: data.goals
      },
      viewerType: 'LEARNER', // Default, will be determined by AI
      viewerTypeRationale: '',
      pillars: []
    };
    
    // Save to localStorage for persistence
    localStorage.setItem('foundation_basic_data', JSON.stringify(data));
    localStorage.setItem('foundation_data', JSON.stringify(newFoundationData));
    
    // Update store
    setFoundationData(newFoundationData);
    
    // Close modal and generate full foundation
    setShowFoundationModal(false);
    
    // Use the niche as the umbrella statement and generate foundation
    await generateFoundation(data.niche);
    
    toast.success('Foundation data saved! Generating content pillars...');
  };

  useEffect(() => {
    setCurrentStep('foundation');
    
    // Check if we have foundation data in localStorage or store
    const savedFoundationData = localStorage.getItem('foundation_data');
    const savedBasicData = localStorage.getItem('foundation_basic_data');
    
    if (!foundationData && !savedFoundationData && !savedBasicData && !umbrellaStatement) {
      // No foundation data at all - show the modal
      setShowFoundationModal(true);
      return;
    }
    
    // Load previous foundations
    const saved = localStorage.getItem('previous_foundations');
    if (saved) {
      const foundations = JSON.parse(saved);
      setPreviousFoundations(foundations);
      
      // Check if current umbrella matches any previous
      const match = foundations.find((f: any) => 
        f.statement.toLowerCase() === umbrellaStatement?.toLowerCase()
      );
      
      if (match) {
        // Auto-select matching foundation
        setFoundationData(match.data);
        setEnhancedHeading(match.enhanced);
        toast.info('Using existing foundation for this statement');
      } else if (!foundationData && umbrellaStatement) {
        // Show selector if no match
        setShowSelector(true);
      }
    } else if (!foundationData && umbrellaStatement) {
      // Generate new if no previous foundations
      generateFoundation();
    }
  }, []);

  const toggleBlock = (blocks: SelectableBlock[], setBlocks: any, id: string) => {
    setBlocks(blocks.map(b => 
      b.id === id ? { ...b, selected: !b.selected } : b
    ));
  };

  const togglePillar = (id: string) => {
    setEnhancedPillars(pillars => 
      pillars.map(p => p.id === id ? { ...p, selected: !p.selected } : p)
    );
  };

  const proceedToIdeas = () => {
    // Update foundation data with current selections
    const updatedData: FoundationData = {
      avatar: {
        demographics: demographicBlocks.filter(b => b.selected).map(b => b.value).join(', '),
        psychographics: psychographicBlocks.filter(b => b.selected).map(b => b.value).join('. '),
        painPoints: painPointBlocks.filter(b => b.selected).map(b => b.value).join('. '),
        goals: psychographicBlocks.filter(b => b.selected).map(b => b.value).join('. ')
      },
      viewerType: foundationData?.viewerType || 'LEARNER',
      viewerTypeRationale: foundationData?.viewerTypeRationale || '',
      pillars: enhancedPillars.filter(p => p.selected).slice(0, 5)
    };
    
    setFoundationData(updatedData);
    navigate('/ideation');
  };

  // Show foundation selector
  if (showSelector && previousFoundations.length > 0) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full"
        >
          <Card className="p-6 shadow-xl">
            <h2 className="text-2xl font-bold mb-4">Select Foundation</h2>
            <p className="text-muted-foreground mb-6">
              Choose an existing foundation or create a new one
            </p>
            
            <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
              {previousFoundations.map(f => (
                <div
                  key={f.id}
                  className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => {
                    setFoundationData(f.data);
                    setEnhancedHeading(f.enhanced);
                    setShowSelector(false);
                    toast.success('Foundation loaded');
                  }}
                >
                  <div className="font-medium">{f.enhanced}</div>
                  <div className="text-sm text-muted-foreground">{f.statement}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Created: {new Date(f.created).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
            
            <Button
              onClick={() => {
                setShowSelector(false);
                generateFoundation();
              }}
              className="w-full bg-gradient-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Foundation
            </Button>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Show loading state
  if (isGenerating || (!foundationData && umbrellaStatement)) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <LoadingSpinner size="lg" />
          <h2 className="text-2xl font-bold">Generating Foundation Data</h2>
          <p className="text-muted-foreground max-w-md">
            Analyzing your statement and creating content pillars...
          </p>
        </motion.div>
      </div>
    );
  }

  // Show empty state if no data
  if (!foundationData && !umbrellaStatement) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center space-y-4">
          <Sparkles className="w-16 h-16 text-primary mx-auto" />
          <h2 className="text-2xl font-bold">Let's Set Up Your Foundation</h2>
          <p className="text-muted-foreground max-w-md">
            Define your channel's core identity and content strategy
          </p>
          <Button onClick={() => navigate('/onboarding')} className="bg-gradient-primary">
            <ArrowRight className="w-4 h-4 mr-2" />
            Start Setup
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Foundation Modal with Overlay */}
      {showFoundationModal && (
        <div className="fixed inset-0 z-50">
          {/* Grey overlay */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          {/* Modal */}
          <FoundationModal 
            open={showFoundationModal}
            onSubmit={handleFoundationModalSubmit}
          />
        </div>
      )}
      
      <div className={cn(
        "min-h-screen bg-gradient-subtle pb-32",
        showFoundationModal && "pointer-events-none opacity-50"
      )}>
        <div className="container mx-auto px-4 py-6">
          <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto mt-8"
        >
          {/* Enhanced Header */}
          <div className="text-center mb-12">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold mb-4"
            >
              {enhancedHeading || 'Your Content Foundation'}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-muted-foreground max-w-3xl mx-auto mb-4"
            >
              Original: <em>"{umbrellaStatement}"</em>
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center gap-4"
            >
              <Button
                variant="outline"
                onClick={() => generateFoundation()}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <LoadingSpinner className="w-4 h-4 mr-2" />
                    Regenerating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Regenerate Foundation
                  </>
                )}
              </Button>
              {previousFoundations.length > 0 && (
                <Button
                  variant="outline"
                  onClick={() => setShowSelector(true)}
                >
                  <ChevronDown className="w-4 h-4 mr-2" />
                  Load Previous
                </Button>
              )}
            </motion.div>
          </div>

          {/* Selectable Blocks Section */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Demographics */}
            <Card className="p-6 shadow-elegant">
              <div className="flex items-center gap-2 mb-6">
                <Users className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold">Demographics</h2>
                <Badge variant="outline" className="ml-auto">
                  {demographicBlocks.filter(b => b.selected).length} selected
                </Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                {demographicBlocks.map(block => (
                  <motion.div
                    key={block.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleBlock(demographicBlocks, setDemographicBlocks, block.id)}
                    className={cn(
                      "px-4 py-2 rounded-lg border-2 cursor-pointer transition-all",
                      block.selected 
                        ? "border-primary bg-primary/10" 
                        : "border-muted hover:border-muted-foreground"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {block.selected && <Check className="w-4 h-4 text-primary" />}
                      <span className="text-sm font-medium">{block.value}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Psychographics */}
            <Card className="p-6 shadow-elegant">
              <div className="flex items-center gap-2 mb-6">
                <Brain className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold">Psychographics & Goals</h2>
                <Badge variant="outline" className="ml-auto">
                  {psychographicBlocks.filter(b => b.selected).length} selected
                </Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                {psychographicBlocks.map(block => (
                  <motion.div
                    key={block.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleBlock(psychographicBlocks, setPsychographicBlocks, block.id)}
                    className={cn(
                      "px-4 py-2 rounded-lg border-2 cursor-pointer transition-all",
                      block.selected 
                        ? "border-primary bg-primary/10" 
                        : "border-muted hover:border-muted-foreground"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {block.selected && <Check className="w-4 h-4 text-primary" />}
                      <span className="text-sm font-medium">{block.value}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>

          {/* Pain Points */}
          <Card className="p-6 shadow-elegant mb-12">
            <div className="flex items-center gap-2 mb-6">
              <AlertCircle className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold">Pain Points</h2>
              <Badge variant="outline" className="ml-auto">
                {painPointBlocks.filter(b => b.selected).length} selected
              </Badge>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              {painPointBlocks.map(block => (
                <motion.div
                  key={block.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleBlock(painPointBlocks, setPainPointBlocks, block.id)}
                  className={cn(
                    "p-4 rounded-lg border-2 cursor-pointer transition-all",
                    block.selected 
                      ? "border-primary bg-primary/10" 
                      : "border-muted hover:border-muted-foreground"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {block.selected ? (
                        <Check className="w-5 h-5 text-primary" />
                      ) : (
                        <div className="w-5 h-5 border-2 rounded" />
                      )}
                    </div>
                    <p className="text-sm">{block.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Enhanced Content Pillars */}
          <Card className="p-6 shadow-elegant mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Lightbulb className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold">Content Pillars</h2>
              <Badge variant="outline" className="ml-auto">
                {enhancedPillars.filter(p => p.selected).length} selected
              </Badge>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {enhancedPillars.map((pillar, index) => (
                <motion.div
                  key={pillar.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => togglePillar(pillar.id)}
                  className={cn(
                    "border-2 rounded-lg p-4 cursor-pointer transition-all",
                    pillar.selected 
                      ? "border-primary bg-primary/10" 
                      : "border-muted hover:border-muted-foreground"
                  )}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-3 h-3 rounded-full ${pillar.color}`} />
                    {pillar.selected ? (
                      <Check className="w-5 h-5 text-primary" />
                    ) : (
                      <div className="w-5 h-5 border-2 rounded" />
                    )}
                  </div>
                  <h3 className="font-semibold mb-2">{pillar.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{pillar.description}</p>
                  {pillar.topics && (
                    <div className="space-y-1">
                      <div className="text-xs font-medium text-muted-foreground mb-1">Topics:</div>
                      <div className="flex flex-wrap gap-1">
                        {pillar.topics.map((topic, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Viewer Type */}
          <Card className="p-6 shadow-elegant mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Eye className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold">Viewer Type</h2>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <Badge 
                variant="secondary" 
                className="px-4 py-2 text-lg font-semibold bg-primary/10 text-primary"
              >
                {foundationData?.viewerType}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              {foundationData?.viewerTypeRationale}
            </p>
          </Card>
        </motion.div>
      </div>
      
      {/* Navigation Flow - only show when sidebar is not present */}
      <NavigationFlow
        canProceed={enhancedPillars.some(p => p.selected)}
        nextLabel="Generate Ideas"
        onNext={proceedToIdeas}
      />
      
      {/* Floating Next Button - show for authenticated users */}
      {user && (
        <FloatingNextButton
          show={enhancedPillars.some(p => p.selected)}
          onClick={proceedToIdeas}
          label="Generate Ideas"
          nextPath="/ideation"
        />
      )}
      </div>
    </>
  );
}
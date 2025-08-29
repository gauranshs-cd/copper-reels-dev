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
  Bookmark,
  X
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
import { useTeamStore } from '@/store/useTeamStore';
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
    setLoading,
    resetStore
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

  // Custom input states
  const [showDemographicInput, setShowDemographicInput] = useState(false);
  const [showPsychographicInput, setShowPsychographicInput] = useState(false);
  const [showPainPointInput, setShowPainPointInput] = useState(false);
  const [newDemographic, setNewDemographic] = useState('');
  const [newPsychographic, setNewPsychographic] = useState('');
  const [newPainPoint, setNewPainPoint] = useState('');

  const generateFoundation = async (useUmbrella?: string) => {
    const statementToUse = useUmbrella || umbrellaStatement;
    if (!statementToUse) return;
    
    console.log('Starting foundation generation for:', statementToUse);
    
    setIsGenerating(true);
    setLoading(true, 'Generating your content foundation...');
    
    try {
      // Collect custom data from current state
      const customData = {
        demographics: demographicBlocks
          .filter(block => block.selected && block.id.startsWith('custom-'))
          .map(block => block.value),
        psychographics: psychographicBlocks
          .filter(block => block.selected && block.id.startsWith('custom-'))
          .map(block => block.value),
        painPoints: painPointBlocks
          .filter(block => block.selected && block.id.startsWith('custom-'))
          .map(block => block.value)
      };

      const foundation = await copperReelsGemini.generateFoundation({
        umbrella: statementToUse,
        customData: customData
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
      const pillarsWithTopics: EnhancedPillar[] = await Promise.all([
        ...foundation.pillars.map(async (pillar, index) => ({
          id: `pillar-${index}`,
          title: pillar.name,
          description: pillar.summary,
          color: `bg-${['blue', 'green', 'purple', 'orange', 'red'][index % 5]}-500`,
          selected: index === 0, // Select first by default
          topics: await generateTopicsForPillar(pillar.name, statementToUse)
        })),
        // Add more pillars with async topic generation
        Promise.resolve({
          id: `pillar-${foundation.pillars.length + 1}`,
          title: 'Case Studies & Success Stories',
          description: 'Real-world examples and transformations',
          color: 'bg-cyan-500',
          topics: await generateTopicsForPillar('Case Studies & Success Stories', statementToUse),
          selected: false
        }),
        Promise.resolve({
          id: `pillar-${foundation.pillars.length + 2}`,
          title: 'Tools & Resources',
          description: 'Practical tools and templates',
          color: 'bg-amber-500',
          topics: await generateTopicsForPillar('Tools & Resources', statementToUse),
          selected: false
        }),
        Promise.resolve({
          id: `pillar-${foundation.pillars.length + 3}`,
          title: 'Mistakes & Lessons',
          description: 'Common pitfalls and how to avoid them',
          color: 'bg-rose-500',
          topics: await generateTopicsForPillar('Mistakes & Lessons', statementToUse),
          selected: false
        }),
        Promise.resolve({
          id: `pillar-${foundation.pillars.length + 4}`,
          title: 'Industry Insights',
          description: 'Trends and analysis in your niche',
          color: 'bg-teal-500',
          topics: await generateTopicsForPillar('Industry Insights', statementToUse),
          selected: false
        })
      ]);
      
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
      
      toast.success('Foundation regenerated successfully! Review your updated foundation below.');
      setIsGenerating(false);
      setLoading(false);
    } catch (error: any) {
      console.error('Failed to generate foundation:', error);
      const errorMessage = error?.message || 'Unknown error';
      
      // More specific error messages
      if (errorMessage.includes('quota') || errorMessage.includes('429')) {
        toast.error('API quota exceeded. Please try again later or contact support.');
      } else if (errorMessage.includes('API key') || errorMessage.includes('not configured')) {
        toast.error('API configuration issue. Using fallback data for now.');
        // Provide fallback foundation data
        const fallbackData: FoundationData = {
          avatar: {
            demographics: 'Adults aged 25-45, primarily in English-speaking countries',
            psychographics: 'Goal-oriented individuals seeking improvement and growth',
            painPoints: 'Struggling with implementation and consistency in their goals',
            goals: 'Achieve meaningful progress and build sustainable habits'
          },
          viewerType: 'LEARNER',
          viewerTypeRationale: 'Based on your statement, your audience consists of learners who want practical guidance and actionable advice.',
          pillars: [
            {
              id: 'pillar-1',
              title: 'Getting Started',
              description: 'Foundation concepts and first steps',
              color: 'bg-blue-500'
            },
            {
              id: 'pillar-2', 
              title: 'Advanced Strategies',
              description: 'Deep-dive techniques and optimization',
              color: 'bg-green-500'
            },
            {
              id: 'pillar-3',
              title: 'Common Mistakes',
              description: 'Pitfalls to avoid and troubleshooting',
              color: 'bg-red-500'
            }
          ]
        };
        setFoundationData(fallbackData);
        setEnhancedHeading(`${statementToUse} - Building Your YouTube Empire`);
        
        // Set enhanced pillars for the UI
        const fallbackPillars: EnhancedPillar[] = fallbackData.pillars.map((pillar, index) => ({
            ...pillar,
            selected: index === 0,
            topics: getFallbackTopics(pillar.title, statementToUse)
          }));
        setEnhancedPillars(fallbackPillars);
        
        // Set basic demographic blocks
        setDemographicBlocks([
          {
            id: 'age',
            label: 'Age Range', 
            value: 'Adults aged 25-45',
            selected: true,
            icon: Users,
            color: 'bg-blue-500'
          }
        ]);
        
        setPsychographicBlocks([
          {
            id: 'goal-1',
            label: 'Goal',
            value: 'Achieve meaningful progress',
            selected: true,
            icon: Brain,
            color: 'bg-indigo-500'
          }
        ]);
        
        setPainPointBlocks([
          {
            id: 'pain-1',
            label: 'Pain Point',
            value: 'Struggling with implementation and consistency',
            selected: true,
            icon: AlertCircle,
            color: 'bg-red-500'
          }
        ]);
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
    // Multiple diverse topic pools with different language styles
    const diverseTopicPools: Record<string, string[][]> = {
      'Nutrition Strategies': [
        ['Meal prep mastery', 'Macro magic', 'Supplement scandals', 'Cheat day chemistry'],
        ['Kitchen shortcuts', 'Calorie confusion', 'Nutrient timing', 'Food psychology'],
        ['Prep like a pro', 'Macro mysteries', 'Supplement science', 'Indulgence rules'],
        ['Cooking hacks', 'Counting calories', 'Vitamin myths', 'Treat yourself']
      ],
      'Workout Plans': [
        ['Home gym genius', 'Quick burn sessions', 'Injury-proof training', 'Plateau smashing'],
        ['Living room workouts', 'Express routines', 'Body maintenance', 'Progress unlocked'],
        ['No-gym solutions', 'Time-crunch fitness', 'Safe training', 'Breaking barriers'],
        ['Apartment workouts', 'Micro sessions', 'Bulletproof body', 'Next level gains']
      ],
      'Mindset & Motivation': [
        ['Mental blocks', 'Habit architecture', 'Confidence codes', 'Vision boarding'],
        ['Mind games', 'Routine building', 'Self-belief systems', 'Dream mapping'],
        ['Psychological barriers', 'Behavior design', 'Inner strength', 'Future planning'],
        ['Thought patterns', 'Daily rituals', 'Personal power', 'Goal setting']
      ],
      'Case Studies & Success Stories': [
        ['Real transformations', 'Behind the scenes', 'Journey deep-dive', 'Results revealed'],
        ['Client spotlights', 'Success breakdowns', 'Progress stories', 'Win analysis'],
        ['Transformation tales', 'Victory dissection', 'Achievement autopsy', 'Triumph tracking'],
        ['Change chronicles', 'Success secrets', 'Winner profiles', 'Growth stories']
      ],
      'Tools & Resources': [
        ['App battles', 'Gear guides', 'Budget builds', 'Efficiency engines'],
        ['Software showdown', 'Equipment essentials', 'Cheap alternatives', 'Productivity boosters'],
        ['Tech reviews', 'Tool comparisons', 'Frugal solutions', 'Speed enhancers'],
        ['Digital helpers', 'Hardware heroes', 'Money savers', 'Time multipliers']
      ],
      'Mistakes & Lessons': [
        ['Epic fails', 'Expensive errors', 'Learning curves', 'Warning signs'],
        ['Rookie mistakes', 'Costly blunders', 'Hard lessons', 'Danger zones'],
        ['Beginner traps', 'Money pits', 'Wisdom gained', 'Risk factors'],
        ['Common pitfalls', 'Budget busters', 'Experience earned', 'Alert signals']
      ],
      'Industry Insights': [
        ['Market pulse', 'Future forecasts', 'Industry shifts', 'Expert takes'],
        ['Trend watch', 'Crystal ball', 'Sector changes', 'Pro opinions'],
        ['Market radar', 'Predictions', 'Business evolution', 'Insider views'],
        ['Industry intel', 'Forecasting', 'Market dynamics', 'Authority insights']
      ]
    };

    // Contextual topic pools for different pillar types
    const contextualPools: Record<string, string[][]> = {
      nutrition: [
        ['Eating windows', 'Calorie mysteries', 'Superfood myths', 'Hunger psychology'],
        ['Meal timing', 'Hidden calories', 'Nutrient density', 'Food cravings'],
        ['Fasting benefits', 'Calorie cycling', 'Micronutrients', 'Emotional eating'],
        ['Digestion hacks', 'Metabolic boost', 'Vitamin absorption', 'Mindful eating']
      ],
      fitness: [
        ['Movement quality', 'Intensity waves', 'Recovery science', 'Equipment hacks'],
        ['Exercise form', 'Training zones', 'Rest protocols', 'Gear alternatives'],
        ['Biomechanics', 'Workout density', 'Sleep recovery', 'DIY equipment'],
        ['Body mechanics', 'Effort levels', 'Regeneration', 'Budget gear']
      ],
      mindset: [
        ['Thought loops', 'Behavior chains', 'Self-image work', 'Vision crafting'],
        ['Mental models', 'Habit loops', 'Identity shifts', 'Future self'],
        ['Cognitive bias', 'Routine stacking', 'Belief systems', 'Goal architecture'],
        ['Mind patterns', 'System building', 'Confidence work', 'Dream design']
      ],
      business: [
        ['Income streams', 'Expense audits', 'ROI hunting', 'Market timing'],
        ['Revenue models', 'Cost analysis', 'Profit margins', 'Trend riding'],
        ['Money flows', 'Budget cuts', 'Investment wins', 'Opportunity windows'],
        ['Cash generation', 'Spending review', 'Return rates', 'Market cycles']
      ],
      tech: [
        ['Platform wars', 'Automation wizardry', 'System optimization', 'Future tech'],
        ['Software duels', 'Process automation', 'Workflow tuning', 'Tech trends'],
        ['App comparisons', 'Robot helpers', 'Efficiency gains', 'Innovation watch'],
        ['Digital tools', 'Smart systems', 'Performance boost', 'Tech evolution']
      ]
    };

    // Random selection function
    const getRandomTopics = (pools: string[][]): string[] => {
      const randomPool = pools[Math.floor(Math.random() * pools.length)];
      return [...randomPool];
    };

    // Check for exact pillar match first
    if (diverseTopicPools[pillarName]) {
      return getRandomTopics(diverseTopicPools[pillarName]);
    }

    // Generate contextual topics based on pillar type with randomness
    const pillarLower = pillarName.toLowerCase();
    
    if (pillarLower.includes('nutrition') || pillarLower.includes('diet') || pillarLower.includes('food')) {
      return getRandomTopics(contextualPools.nutrition);
    }
    
    if (pillarLower.includes('workout') || pillarLower.includes('exercise') || pillarLower.includes('fitness')) {
      return getRandomTopics(contextualPools.fitness);
    }
    
    if (pillarLower.includes('mindset') || pillarLower.includes('motivation') || pillarLower.includes('mental')) {
      return getRandomTopics(contextualPools.mindset);
    }
    
    if (pillarLower.includes('business') || pillarLower.includes('money') || pillarLower.includes('finance')) {
      return getRandomTopics(contextualPools.business);
    }
    
    if (pillarLower.includes('tech') || pillarLower.includes('software') || pillarLower.includes('digital')) {
      return getRandomTopics(contextualPools.tech);
    }

    // Highly diverse fallback patterns with randomization
    const diversePatterns = [
      [`${pillarName} decoded`, `${pillarName} unleashed`, `${pillarName} mastery`, `${pillarName} revolution`],
      [`${pillarName} secrets`, `${pillarName} wizardry`, `${pillarName} genius`, `${pillarName} breakthrough`],
      [`${pillarName} hacks`, `${pillarName} magic`, `${pillarName} systems`, `${pillarName} evolution`],
      [`${pillarName} insights`, `${pillarName} power`, `${pillarName} methods`, `${pillarName} transformation`],
      [`${pillarName} mysteries`, `${pillarName} science`, `${pillarName} art`, `${pillarName} innovation`]
    ];
    
    return getRandomTopics(diversePatterns);
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
    
    console.log('Foundation useEffect - umbrellaStatement:', umbrellaStatement);
    console.log('Foundation useEffect - foundationData exists:', !!foundationData);
    
    // Check if user came from onboarding or accessed foundation directly
    const cameFromOnboarding = sessionStorage.getItem('came_from_onboarding');
    console.log('Came from onboarding:', cameFromOnboarding);
    
    // Force clear all foundation-related data if:
    // 1. No umbrella statement OR umbrella is empty string
    // 2. OR user accessed foundation page directly (not from onboarding flow)
    if (!umbrellaStatement || umbrellaStatement.trim() === '' || !cameFromOnboarding) {
      console.log('Clearing all foundation data - invalid access or no umbrella statement');
      
      // Reset the entire Zustand store
      resetStore();
      
      // Clear all localStorage items including Zustand persistence
      localStorage.removeItem('copper-reels-storage');
      localStorage.removeItem('foundation_data');
      localStorage.removeItem('foundation_basic_data');
      localStorage.removeItem('previous_foundations');
      
      // Clear session storage flag
      sessionStorage.removeItem('came_from_onboarding');
      
      // Clear local state
      setEnhancedPillars([]);
      setDemographicBlocks([]);
      setPsychographicBlocks([]);
      setPainPointBlocks([]);
      setEnhancedHeading('');
      setShowFoundationModal(true);
      return;
    }
    
    // Clear the session flag since we've used it
    sessionStorage.removeItem('came_from_onboarding');
    
    // Clear any existing foundation data when component mounts to prevent showing old data
    if (foundationData && !umbrellaStatement) {
      setFoundationData(null);
    }
    
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
    setBlocks(blocks.map(block => 
      block.id === id ? { ...block, selected: !block.selected } : block
    ));
  };

  // Add custom block functions
  const addCustomDemographic = () => {
    if (newDemographic.trim()) {
      const newBlock: SelectableBlock = {
        id: `custom-demo-${Date.now()}`,
        label: newDemographic.trim(),
        value: newDemographic.trim(),
        selected: true,
        color: 'blue'
      };
      setDemographicBlocks([...demographicBlocks, newBlock]);
      setNewDemographic('');
      setShowDemographicInput(false);
    }
  };

  const addCustomPsychographic = () => {
    if (newPsychographic.trim()) {
      const newBlock: SelectableBlock = {
        id: `custom-psycho-${Date.now()}`,
        label: newPsychographic.trim(),
        value: newPsychographic.trim(),
        selected: true,
        color: 'green'
      };
      setPsychographicBlocks([...psychographicBlocks, newBlock]);
      setNewPsychographic('');
      setShowPsychographicInput(false);
    }
  };

  const addCustomPainPoint = () => {
    if (newPainPoint.trim()) {
      const newBlock: SelectableBlock = {
        id: `custom-pain-${Date.now()}`,
        label: newPainPoint.trim(),
        value: newPainPoint.trim(),
        selected: true,
        color: 'red'
      };
      setPainPointBlocks([...painPointBlocks, newBlock]);
      setNewPainPoint('');
      setShowPainPointInput(false);
    }
  };

  const removeCustomBlock = (blocks: SelectableBlock[], setBlocks: any, id: string) => {
    setBlocks(blocks.filter(block => block.id !== id));
  };

  const togglePillar = (id: string) => {
    setEnhancedPillars(pillars => {
      const currentSelected = pillars.filter(p => p.selected).length;
      const pillarToToggle = pillars.find(p => p.id === id);
      
      // If trying to select and already at limit of 3, prevent selection
      if (pillarToToggle && !pillarToToggle.selected && currentSelected >= 3) {
        toast.error('You can select a maximum of 3 content pillars');
        return pillars;
      }
      
      return pillars.map(p => p.id === id ? { ...p, selected: !p.selected } : p);
    });
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
      <div 
        className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowSelector(false);
          }
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full"
        >
          <Card className="p-6 shadow-xl relative">
            {/* Close (X) button */}
            <button
              type="button"
              aria-label="Close"
              onClick={() => setShowSelector(false)}
              className="absolute right-4 top-4 inline-flex items-center justify-center rounded-md p-2 hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <X className="w-4 h-4" />
            </button>
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
          <div className="flex gap-3 justify-center">
            <Button onClick={() => navigate('/onboarding')} className="bg-gradient-primary">
              <Plus className="w-4 h-4 mr-2" />
              Create Foundation
            </Button>
            <Button onClick={() => navigate('/onboarding')} variant="outline">
              <ArrowRight className="w-4 h-4 mr-2" />
              Full Setup
            </Button>
          </div>
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
            onClose={() => setShowFoundationModal(false)}
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
              className="flex justify-center gap-4 flex-wrap"
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
              <Button
                variant="outline"
                onClick={() => setShowFoundationModal(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Foundation
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
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-bold">Demographics</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowDemographicInput(!showDemographicInput)}
                      className="text-xs"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add Custom
                    </Button>
                    <Badge variant="outline">
                      {demographicBlocks.filter(b => b.selected).length} selected
                    </Badge>
                  </div>
                </div>
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
                {showDemographicInput && (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newDemographic}
                      onChange={(e) => setNewDemographic(e.target.value)}
                      placeholder="Enter custom demographic"
                      className="px-4 py-2 rounded-lg border-2 border-muted focus:border-primary focus:ring-2 focus:ring-primary"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={addCustomDemographic}
                      className="text-xs"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add
                    </Button>
                  </div>
                )}
              </div>
            </Card>

            {/* Psychographics */}
            <Card className="p-6 shadow-elegant">
              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-bold">Psychographics</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPsychographicInput(!showPsychographicInput)}
                      className="text-xs"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add Custom
                    </Button>
                    <Badge variant="outline">
                      {psychographicBlocks.filter(b => b.selected).length} selected
                    </Badge>
                  </div>
                </div>
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
                {showPsychographicInput && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg border space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add custom psychographic (e.g., Values innovation, Tech-savvy)"
                        value={newPsychographic}
                        onChange={(e) => setNewPsychographic(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addCustomPsychographic()}
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                      <Button
                        size="sm"
                        onClick={addCustomPsychographic}
                        disabled={!newPsychographic.trim()}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Click on added items to select/deselect them for AI generation</p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Pain Points */}
          <Card className="p-6 shadow-elegant mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold">Pain Points</h2>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPainPointInput(!showPainPointInput)}
                  className="text-xs"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Custom
                </Button>
                <Badge variant="outline">
                  {painPointBlocks.filter(b => b.selected).length} selected
                </Badge>
              </div>
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
            
            {/* Custom Pain Point Input */}
            {showPainPointInput && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border space-y-2">
                <div className="flex gap-2">
                  <textarea
                    placeholder="Add specific pain point (e.g., Struggling with time management)"
                    value={newPainPoint}
                    onChange={(e) => setNewPainPoint(e.target.value)}
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-h-[60px] resize-none"
                  />
                  <Button
                    size="sm"
                    onClick={addCustomPainPoint}
                    disabled={!newPainPoint.trim()}
                    className="self-start"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Click on added items to select/deselect them for AI generation</p>
              </div>
            )}
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
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Users, Eye, Lightbulb, RefreshCw, Sparkles, Plus, X, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EditableField } from '@/components/ui/editable-field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { NavigationFlow } from '@/components/NavigationFlow';
import { GenerationStatus } from '@/components/GenerationStatus';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useAppStore } from '@/store/useAppStore';
import { copperReelsGemini } from '@/lib/gemini';
import { sessionService } from '@/lib/supabase/session-service';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { historyService } from '@/lib/history';
import type { Avatar, ContentPillar, FoundationData } from '@/store/useAppStore';

export default function Foundation() {
  const navigate = useNavigate();
  const { 
    umbrellaStatement, 
    foundationData, 
    setFoundationData, 
    setCurrentStep,
    setLoading 
  } = useAppStore();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGeneratedAt, setLastGeneratedAt] = useState<Date | null>(null);

  // Custom input states with selection tracking
  const [customDemographics, setCustomDemographics] = useState<{text: string, selected: boolean}[]>([]);
  const [customPsychographics, setCustomPsychographics] = useState<{text: string, selected: boolean}[]>([]);
  const [customPainPoints, setCustomPainPoints] = useState<{text: string, selected: boolean}[]>([]);
  const [customGoals, setCustomGoals] = useState<{text: string, selected: boolean}[]>([]);
  const [customPillarTopics, setCustomPillarTopics] = useState<{[key: string]: {text: string, selected: boolean}[]}>({});
  
  // Input field states
  const [newDemographic, setNewDemographic] = useState('');
  const [newPsychographic, setNewPsychographic] = useState('');
  const [newPainPoint, setNewPainPoint] = useState('');
  const [newGoal, setNewGoal] = useState('');
  const [newPillarTopic, setNewPillarTopic] = useState<{[key: string]: string}>({});
  
  // Section expansion states
  const [showDemographicsInput, setShowDemographicsInput] = useState(false);
  const [showPsychographicsInput, setShowPsychographicsInput] = useState(false);
  const [showPainPointsInput, setShowPainPointsInput] = useState(false);
  const [showGoalsInput, setShowGoalsInput] = useState(false);
  const [showPillarInputs, setShowPillarInputs] = useState<Record<string, boolean>>({});
  
  // Custom pillar topic handlers
  const addCustomPillarTopic = (pillarId: string) => {
    const topicText = newPillarTopic[pillarId]?.trim();
    if (topicText) {
      setCustomPillarTopics(prev => ({
        ...prev,
        [pillarId]: [...(prev[pillarId] || []), { text: topicText, selected: true }]
      }));
      setNewPillarTopic(prev => ({ ...prev, [pillarId]: '' }));
    }
  };
  
  const removeCustomPillarTopic = (pillarId: string, index: number) => {
    setCustomPillarTopics(prev => ({
      ...prev,
      [pillarId]: prev[pillarId]?.filter((_, i) => i !== index) || []
    }));
  };
  
  const togglePillarTopicSelection = (pillarId: string, index: number) => {
    setCustomPillarTopics(prev => ({
      ...prev,
      [pillarId]: prev[pillarId]?.map((topic, i) => 
        i === index ? { ...topic, selected: !topic.selected } : topic
      ) || []
    }));
  };

  const generateFoundation = async () => {
    if (!umbrellaStatement) return;
    
    console.log('Starting foundation generation for:', umbrellaStatement);
    console.log('Gemini API Key exists:', !!import.meta.env.VITE_GEMINI_API_KEY);
    
    setIsGenerating(true);
    setLoading(true, 'Generating your content foundation with Gemini...');
    
    try {
      // Generate foundation using Gemini
      const startTime = Date.now();
      console.log('Calling Gemini API...');
      const customData = getSelectedCustomData();
      const foundation = await copperReelsGemini.generateFoundation({
        umbrella: umbrellaStatement
      });
      console.log('OpenAI response received:', foundation);
      const duration = Date.now() - startTime;
      
      // Transform OpenAI response to match our app structure
      const transformedData: FoundationData = {
        avatar: {
          demographics: `${foundation.avatar.demographics.ageRange}, ${foundation.avatar.demographics.locations.join(', ')}, ${foundation.avatar.demographics.roles.join(', ')}${foundation.avatar.demographics.incomeRange ? `, ${foundation.avatar.demographics.incomeRange}` : ''}`,
          psychographics: `${foundation.avatar.psychographics.goals.join('. ')}`,
          painPoints: foundation.avatar.psychographics.rankedProblems
            .map(p => `${p.problem}: ${p.whyItMatters}`)
            .join('. '),
          goals: foundation.avatar.psychographics.goals.join('. ')
        },
        viewerType: foundation.viewerType,
        viewerTypeRationale: foundation.notes.rationale,
        pillars: foundation.pillars.map((pillar, index) => ({
          id: `pillar-${index + 1}`,
          title: pillar.name,
          description: pillar.summary,
          color: ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500'][index] || 'bg-gray-500'
        }))
      };
      
      setFoundationData(transformedData);
      setLastGeneratedAt(new Date());
      
      // Save to history
      historyService.addItem({
        type: 'foundation',
        title: 'Foundation Generated',
        description: `${transformedData.pillars.length} content pillars for ${transformedData.viewerType.toLowerCase()} viewers`,
        data: transformedData
      });
      
      // Log to Supabase if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        try {
          // Create or get session
          let session = await sessionService.getActiveSession(user.id);
          if (!session) {
            session = await sessionService.createSession(user.id) as any;
          }
          
          // Log the generation
          await sessionService.logGeneration({
            sessionId: session.id,
            botType: 'positioning' as const,
            success: true,
            durationMs: duration,
            requestPayload: { umbrella: umbrellaStatement },
            responsePayload: foundation
          });
        } catch (dbError) {
          console.error('Failed to log to database:', dbError);
        }
      }
      
      toast.success('Foundation regenerated successfully! New data is now displayed.');
      setIsGenerating(false);
      setLoading(false);
    } catch (error) {
      console.error('Failed to generate foundation:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to generate foundation: ${errorMessage}. Please try again.`);
      
      // Fallback to a simplified version if API fails
      const fallbackData: FoundationData = {
        avatar: {
          demographics: "Unable to generate demographics. Please refresh to try again.",
          psychographics: "Unable to generate psychographics. Please refresh to try again.",
          painPoints: "Unable to identify pain points. Please refresh to try again.",
          goals: "Unable to identify goals. Please refresh to try again."
        },
        viewerType: 'LEARNER',
        viewerTypeRationale: "Unable to determine viewer type. Using default.",
        pillars: [
          { id: '1', title: 'Content Pillar 1', description: 'Please regenerate to get AI suggestions', color: 'bg-blue-500' },
          { id: '2', title: 'Content Pillar 2', description: 'Please regenerate to get AI suggestions', color: 'bg-green-500' },
          { id: '3', title: 'Content Pillar 3', description: 'Please regenerate to get AI suggestions', color: 'bg-purple-500' }
        ]
      };
      setFoundationData(fallbackData);
      setIsGenerating(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentStep('foundation');
    
    // Clear any existing foundation data when component mounts to prevent showing old data
    if (foundationData && !umbrellaStatement) {
      setFoundationData(null);
    }
    
    // Generate foundation data if not exists and we have umbrella statement
    if (!foundationData && umbrellaStatement) {
      generateFoundation();
    }
  }, []);

  const updateAvatar = (field: keyof Avatar, value: string) => {
    if (!foundationData) return;
    setFoundationData({
      ...foundationData,
      avatar: { ...foundationData.avatar, [field]: value }
    });
  };

  const updatePillar = (id: string, field: keyof ContentPillar, value: string) => {
    if (!foundationData) return;
    const updatedPillars = foundationData.pillars.map(pillar =>
      pillar.id === id ? { ...pillar, [field]: value } : pillar
    );
    setFoundationData({ ...foundationData, pillars: updatedPillars });
  };

  // Custom input handlers with selection support
  const addCustomDemographic = () => {
    if (newDemographic.trim()) {
      setCustomDemographics([...customDemographics, { text: newDemographic.trim(), selected: true }]);
      setNewDemographic('');
    }
  };

  const removeCustomDemographic = (index: number) => {
    setCustomDemographics(customDemographics.filter((_, i) => i !== index));
  };

  const toggleDemographicSelection = (index: number) => {
    setCustomDemographics(customDemographics.map((item, i) => 
      i === index ? { ...item, selected: !item.selected } : item
    ));
  };

  const addCustomPsychographic = () => {
    if (newPsychographic.trim()) {
      setCustomPsychographics([...customPsychographics, { text: newPsychographic.trim(), selected: true }]);
      setNewPsychographic('');
    }
  };

  const removeCustomPsychographic = (index: number) => {
    setCustomPsychographics(customPsychographics.filter((_, i) => i !== index));
  };

  const togglePsychographicSelection = (index: number) => {
    setCustomPsychographics(customPsychographics.map((item, i) => 
      i === index ? { ...item, selected: !item.selected } : item
    ));
  };

  const addCustomPainPoint = () => {
    if (newPainPoint.trim()) {
      setCustomPainPoints([...customPainPoints, { text: newPainPoint.trim(), selected: true }]);
      setNewPainPoint('');
    }
  };

  const removeCustomPainPoint = (index: number) => {
    setCustomPainPoints(customPainPoints.filter((_, i) => i !== index));
  };

  const togglePainPointSelection = (index: number) => {
    setCustomPainPoints(customPainPoints.map((item, i) => 
      i === index ? { ...item, selected: !item.selected } : item
    ));
  };

  const addCustomGoal = () => {
    if (newGoal.trim()) {
      setCustomGoals([...customGoals, { text: newGoal.trim(), selected: true }]);
      setNewGoal('');
    }
  };

  const removeCustomGoal = (index: number) => {
    setCustomGoals(customGoals.filter((_, i) => i !== index));
  };

  const toggleGoalSelection = (index: number) => {
    setCustomGoals(customGoals.map((item, i) => 
      i === index ? { ...item, selected: !item.selected } : item
    ));
  };


  // Get selected custom data for LLM
  const getSelectedCustomData = () => {
    return {
      demographics: customDemographics.filter(item => item.selected).map(item => item.text),
      psychographics: customPsychographics.filter(item => item.selected).map(item => item.text),
      painPoints: customPainPoints.filter(item => item.selected).map(item => item.text),
      goals: customGoals.filter(item => item.selected).map(item => item.text),
      pillarTopics: Object.entries(customPillarTopics).reduce((acc, [pillarId, topics]) => {
        acc[pillarId] = topics.filter(item => item.selected).map(item => item.text);
        return acc;
      }, {} as {[key: string]: string[]})
    };
  };

  // Don't show error if we have umbrellaStatement (coming from onboarding)
  if (!foundationData && !umbrellaStatement) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center space-y-4">
          <Sparkles className="w-16 h-16 text-primary mx-auto" />
          <h2 className="text-2xl font-bold">Let's Set Up Your Foundation</h2>
          <p className="text-muted-foreground max-w-md">Define your channel's core identity and content strategy</p>
          <Button onClick={() => navigate('/onboarding')} className="bg-gradient-primary">
            <ArrowRight className="w-4 h-4 mr-2" />
            Start Setup
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle pb-32">
      <div className="container mx-auto px-4 py-6">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto mt-8"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl font-bold mb-4"
            >
              Your Content Foundation
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-muted-foreground max-w-2xl mx-auto mb-4"
            >
              Based on your statement: <em>"{umbrellaStatement}"</em>
            </motion.p>
            {lastGeneratedAt && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25 }}
                className="flex items-center justify-center mb-4"
              >
                <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                  ✨ Recently Updated - {lastGeneratedAt.toLocaleTimeString()}
                </Badge>
              </motion.div>
            )}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                variant="outline"
                onClick={generateFoundation}
                disabled={isGenerating}
                className="flex items-center space-x-2"
              >
                {isGenerating ? (
                  <>
                    <LoadingSpinner className="w-4 h-4" />
                    <span>Regenerating...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    <span>Regenerate Foundation</span>
                  </>
                )}
              </Button>
            </motion.div>
          </div>

          {/* Foundation Content - Only show if user has generated foundation or if there's an umbrella statement */}
          {foundationData && umbrellaStatement && (
            <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Audience Avatar */}
            <motion.div
              key={`avatar-${lastGeneratedAt?.getTime() || 'initial'}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6 h-full shadow-elegant">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">Audience Avatar</h2>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary" />
                        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Demographics</h3>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowDemographicsInput(!showDemographicsInput)}
                        className="text-xs h-6 px-2"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add Custom
                      </Button>
                    </div>
                    <EditableField
                      value={foundationData?.avatar.demographics || ''}
                      onSave={(value) => updateAvatar('demographics', value)}
                      multiline
                      className="text-sm"
                    />
                    
                    {/* Custom Demographics Display */}
                    {customDemographics.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {customDemographics.map((demo, index) => (
                          <Badge
                            key={index}
                            variant={demo.selected ? "default" : "outline"}
                            className={`text-xs flex items-center gap-1 cursor-pointer transition-all ${
                              demo.selected ? 'bg-blue-100 text-blue-800 border-blue-200' : 'opacity-60'
                            }`}
                            onClick={() => toggleDemographicSelection(index)}
                          >
                            {demo.text}
                            <X
                              className="w-3 h-3 cursor-pointer hover:text-red-500"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeCustomDemographic(index);
                              }}
                            />
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    {/* Custom Demographics Input */}
                    {showDemographicsInput && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg border space-y-2">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add custom demographic (e.g., Age 25-35, Location: US)"
                            value={newDemographic}
                            onChange={(e) => setNewDemographic(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addCustomDemographic()}
                            className="text-sm"
                          />
                          <Button
                            size="sm"
                            onClick={addCustomDemographic}
                            disabled={!newDemographic.trim()}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">Click on added items to select/deselect them for AI generation</p>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-primary" />
                        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Psychographics</h3>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPsychographicsInput(!showPsychographicsInput)}
                        className="text-xs h-6 px-2"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add Custom
                      </Button>
                    </div>
                    <EditableField
                      value={foundationData?.avatar.psychographics || ''}
                      onSave={(value) => updateAvatar('psychographics', value)}
                      multiline
                      className="text-sm"
                    />
                    
                    {/* Custom Psychographics Display */}
                    {customPsychographics.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {customPsychographics.map((psycho, index) => (
                          <Badge
                            key={index}
                            variant={psycho.selected ? "default" : "outline"}
                            className={`text-xs flex items-center gap-1 cursor-pointer transition-all ${
                              psycho.selected ? 'bg-green-100 text-green-800 border-green-200' : 'opacity-60'
                            }`}
                            onClick={() => togglePsychographicSelection(index)}
                          >
                            {psycho.text}
                            <X
                              className="w-3 h-3 cursor-pointer hover:text-red-500"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeCustomPsychographic(index);
                              }}
                            />
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    {/* Custom Psychographics Input */}
                    {showPsychographicsInput && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg border space-y-2">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add custom psychographic (e.g., Values innovation, Tech-savvy)"
                            value={newPsychographic}
                            onChange={(e) => setNewPsychographic(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addCustomPsychographic()}
                            className="text-sm"
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
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-primary" />
                        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Pain Points</h3>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPainPointsInput(!showPainPointsInput)}
                        className="text-xs h-6 px-2"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add Custom
                      </Button>
                    </div>
                    <EditableField
                      value={foundationData?.avatar.painPoints || ''}
                      onSave={(value) => updateAvatar('painPoints', value)}
                      multiline
                      className="text-sm"
                    />
                    
                    {/* Custom Pain Points Display */}
                    {customPainPoints.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {customPainPoints.map((pain, index) => (
                          <div
                            key={index}
                            className={`rounded-lg p-3 text-sm flex justify-between items-start cursor-pointer transition-all ${
                              pain.selected 
                                ? 'bg-red-50 border border-red-200 text-red-800' 
                                : 'bg-gray-50 border border-gray-200 text-gray-600 opacity-60'
                            }`}
                            onClick={() => togglePainPointSelection(index)}
                          >
                            <span>{pain.text}</span>
                            <X
                              className="w-4 h-4 cursor-pointer hover:text-red-600 text-red-500 flex-shrink-0 ml-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeCustomPainPoint(index);
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Custom Pain Points Input */}
                    {showPainPointsInput && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg border space-y-2">
                        <div className="flex gap-2">
                          <Textarea
                            placeholder="Add specific pain point (e.g., Struggling with time management)"
                            value={newPainPoint}
                            onChange={(e) => setNewPainPoint(e.target.value)}
                            className="text-sm min-h-[60px]"
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
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Goals</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowGoalsInput(!showGoalsInput)}
                        className="text-xs h-6 px-2"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add Custom
                      </Button>
                    </div>
                    <EditableField
                      value={foundationData?.avatar.goals || ''}
                      onSave={(value) => updateAvatar('goals', value)}
                      multiline
                      className="text-sm"
                    />
                    
                    {/* Custom Goals Display */}
                    {customGoals.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {customGoals.map((goal, index) => (
                          <div
                            key={index}
                            className={`rounded-lg p-3 text-sm flex justify-between items-start cursor-pointer transition-all ${
                              goal.selected 
                                ? 'bg-green-50 border border-green-200 text-green-800' 
                                : 'bg-gray-50 border border-gray-200 text-gray-600 opacity-60'
                            }`}
                            onClick={() => toggleGoalSelection(index)}
                          >
                            <span>{goal.text}</span>
                            <X
                              className="w-4 h-4 cursor-pointer hover:text-red-600 text-red-500 flex-shrink-0 ml-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeCustomGoal(index);
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Custom Goals Input */}
                    {showGoalsInput && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg border space-y-2">
                        <div className="flex gap-2">
                          <Textarea
                            placeholder="Add specific goal (e.g., Increase brand awareness by 50%)"
                            value={newGoal}
                            onChange={(e) => setNewGoal(e.target.value)}
                            className="text-sm min-h-[60px]"
                          />
                          <Button
                            size="sm"
                            onClick={addCustomGoal}
                            disabled={!newGoal.trim()}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">Click on added goals to select/deselect them for AI generation</p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Viewer Type */}
            <motion.div
              key={`viewer-${lastGeneratedAt?.getTime() || 'initial'}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-8"
            >
              <Card className="p-6 shadow-elegant">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Eye className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">Viewer Type</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Badge 
                      variant="secondary" 
                      className="px-4 py-2 text-lg font-semibold bg-primary/10 text-primary"
                    >
                      {foundationData?.viewerType || 'Loading...'}
                    </Badge>
                  </div>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {foundationData?.viewerTypeRationale || ''}
                  </p>
                </div>
              </Card>
            </motion.div>
          </div>
          )}

          {/* Content Pillars */}
          <motion.div
            key={`pillars-${lastGeneratedAt?.getTime() || 'initial'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-12"
          >
            <Card className="p-6 shadow-elegant">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Content Pillars</h2>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {foundationData?.pillars?.map((pillar, index) => (
                  <motion.div
                    key={pillar.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="bg-card border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className={`w-3 h-3 rounded-full ${pillar.color} mb-3`} />
                    <EditableField
                      value={pillar.title}
                      onSave={(value) => updatePillar(pillar.id, 'title', value)}
                      displayClassName="font-semibold mb-2"
                    />
                    <EditableField
                      value={pillar.description}
                      onSave={(value) => updatePillar(pillar.id, 'description', value)}
                      displayClassName="text-sm text-muted-foreground mb-3"
                      multiline
                    />
                    
                    {/* Custom Topics Section */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-muted-foreground">Custom Topics</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowPillarInputs({ ...showPillarInputs, [pillar.id]: !showPillarInputs[pillar.id] })}
                          className="text-xs h-5 px-1"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      
                      {/* Custom Topics Display */}
                      {customPillarTopics[pillar.id] && customPillarTopics[pillar.id].length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {customPillarTopics[pillar.id].map((topic, topicIndex) => (
                            <Badge
                              key={topicIndex}
                              variant={topic.selected ? "default" : "outline"}
                              className={`text-xs flex items-center gap-1 px-2 py-1 cursor-pointer transition-all ${
                                topic.selected ? 'bg-purple-100 text-purple-800 border-purple-200' : 'opacity-60'
                              }`}
                              onClick={() => togglePillarTopicSelection(pillar.id, topicIndex)}
                            >
                              {topic.text}
                              <X
                                className="w-2 h-2 cursor-pointer hover:text-red-500"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeCustomPillarTopic(pillar.id, topicIndex);
                                }}
                              />
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      {/* Custom Topics Input */}
                      {showPillarInputs[pillar.id] && (
                        <div className="p-3 bg-gray-50 rounded-lg border space-y-2">
                          <div className="flex gap-2">
                            <Input
                              placeholder="Add topic (e.g., Topic 1, Topic 2)"
                              value={newPillarTopic[pillar.id] || ''}
                              onChange={(e) => setNewPillarTopic({ ...newPillarTopic, [pillar.id]: e.target.value })}
                              onKeyPress={(e) => e.key === 'Enter' && addCustomPillarTopic(pillar.id)}
                              className="text-xs"
                            />
                            <Button
                              size="sm"
                              onClick={() => addCustomPillarTopic(pillar.id)}
                              disabled={!newPillarTopic[pillar.id]?.trim()}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground">Click on added topics to select/deselect them for AI generation</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

        </motion.div>
      </div>
      
      {/* Navigation Flow at Bottom */}
      <NavigationFlow
        canProceed={!!foundationData}
        nextLabel="Generate Ideas"
      />
    </div>
  );
}
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Users, Eye, Lightbulb, RefreshCw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EditableField } from '@/components/ui/editable-field';
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
            session = await sessionService.createSession(user.id);
          }
          
          // Log the generation
          await sessionService.logGeneration({
            sessionId: session.id,
            botType: 'positioning',
            success: true,
            durationMs: duration,
            requestPayload: { umbrella: umbrellaStatement },
            responsePayload: foundation
          });
        } catch (dbError) {
          console.error('Failed to log to database:', dbError);
        }
      }
      
      toast.success('Foundation generated successfully!');
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
    
    // Generate foundation data if not exists
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

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Audience Avatar */}
            <motion.div
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
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">Demographics</h3>
                    <EditableField
                      value={foundationData.avatar.demographics}
                      onSave={(value) => updateAvatar('demographics', value)}
                      multiline
                      className="text-sm"
                    />
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">Psychographics</h3>
                    <EditableField
                      value={foundationData.avatar.psychographics}
                      onSave={(value) => updateAvatar('psychographics', value)}
                      multiline
                      className="text-sm"
                    />
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">Pain Points</h3>
                    <EditableField
                      value={foundationData.avatar.painPoints}
                      onSave={(value) => updateAvatar('painPoints', value)}
                      multiline
                      className="text-sm"
                    />
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">Goals</h3>
                    <EditableField
                      value={foundationData.avatar.goals}
                      onSave={(value) => updateAvatar('goals', value)}
                      multiline
                      className="text-sm"
                    />
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Viewer Type */}
            <motion.div
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
                      {foundationData.viewerType}
                    </Badge>
                  </div>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {foundationData.viewerTypeRationale}
                  </p>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Content Pillars */}
          <motion.div
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
                {foundationData.pillars.map((pillar, index) => (
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
                      displayClassName="text-sm text-muted-foreground"
                      multiline
                    />
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
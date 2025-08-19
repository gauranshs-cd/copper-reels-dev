import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, Table, Layers, Eye, RefreshCw, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VideoScriptTable } from '@/components/VideoScriptTable';
import { BrickScriptEditor, ScriptBrick } from '@/components/BrickScriptEditor';
import { NavigationFlow } from '@/components/NavigationFlow';
import { GenerationStatus } from '@/components/GenerationStatus';
import { copperReelsGemini } from '@/lib/gemini';
import { useAppStore } from '@/store/useAppStore';
import { toast } from 'sonner';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from '@/integrations/supabase/client';
import type { VideoScriptRow } from '@/lib/gemini';

// Initialize Gemini for brick regeneration
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export default function ScriptBuilder() {
  const navigate = useNavigate();
  const { selectedIdea, umbrellaStatement, videoPlan } = useAppStore();
  const [scriptRows, setScriptRows] = useState<VideoScriptRow[]>([]);
  const [scriptBricks, setScriptBricks] = useState<ScriptBrick[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [activeView, setActiveView] = useState<'bricks' | 'table' | 'preview'>('bricks');
  const [generationStatus, setGenerationStatus] = useState('Initializing AI...');
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationSteps, setGenerationSteps] = useState<any[]>([]);

  useEffect(() => {
    // Try to restore from localStorage first
    const savedBricks = localStorage.getItem('copper_reels_script_bricks');
    if (savedBricks && !hasGenerated) {
      try {
        const parsed = JSON.parse(savedBricks);
        if (parsed && parsed.length > 0) {
          setScriptBricks(parsed);
          setHasGenerated(true);
          toast.info('Restored your previous script edits');
          return;
        }
      } catch (e) {
        console.error('Failed to restore saved bricks:', e);
      }
    }
    
    // Auto-generate script on first load with user context
    if (!hasGenerated && !isGenerating) {
      // Check if we have the necessary context
      const foundationData = useAppStore.getState().foundationData;
      const umbrella = useAppStore.getState().umbrellaStatement;
      
      if (foundationData && selectedIdea) {
        // We have context, generate rich content
        generateFullScript();
      } else if (videoPlan?.bricks && videoPlan.bricks.length > 0) {
        // Use existing video plan
        const bricksFromPlan: ScriptBrick[] = videoPlan.bricks.map((brick, index) => ({
          id: brick.id || `brick-${index}`,
          type: brick.type as ScriptBrick['type'],
          estimatedSec: parseInt(brick.duration?.split(':')[0] || '60') * 60 + 
                        parseInt(brick.duration?.split(':')[1] || '0'),
          narration: brick.content || '',
          onScreen: '',
          callouts: [],
          broll: [],
          beats: [],
          isExpanded: index === 0
        }));
        setScriptBricks(bricksFromPlan);
        setHasGenerated(true);
      } else if (umbrella) {
        // Generate with minimal context
        generateFullScript();
      }
    }
  }, [videoPlan, hasGenerated]);

  const generateFullScript = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);
    setGenerationSteps([
      { label: 'Analyzing video concept', status: 'active', detail: 'Understanding your idea' },
      { label: 'Creating script structure', status: 'pending', detail: 'Building bricks' },
      { label: 'Writing narration', status: 'pending', detail: 'Crafting dialogue' },
      { label: 'Adding visual elements', status: 'pending', detail: 'B-roll & graphics' },
      { label: 'Finalizing script', status: 'pending', detail: 'Polish & review' }
    ]);
    
    try {
      const foundationData = useAppStore.getState().foundationData;
      
      // Update status
      setGenerationStatus('Analyzing your video concept and audience...');
      setGenerationProgress(20);
      
      // Generate structured script with bricks
      setGenerationSteps(prev => prev.map((s, i) => 
        i === 0 ? { ...s, status: 'completed' } : 
        i === 1 ? { ...s, status: 'active' } : s
      ));
      setGenerationStatus('Creating script structure with YTGS bricks...');
      setGenerationProgress(40);
      
      // Get user context for better personalization
      const { data: { user } } = await supabase.auth.getUser();
      const userContext = user ? `Creating content for ${user.email}` : '';
      
      // Build comprehensive avatar summary
      const avatarSummary = foundationData ? 
        `Demographics: ${foundationData.avatar.demographics}. 
         Psychographics: ${foundationData.avatar.psychographics}. 
         Pain Points: ${foundationData.avatar.painPoints}. 
         Goals: ${foundationData.avatar.goals}` : 
        `Based on: ${umbrellaStatement}`;
      
      // Include pillar context
      const pillarContext = foundationData?.pillars ? 
        `Content pillars: ${foundationData.pillars.map(p => p.title).join(', ')}` : '';
      
      const result = await copperReelsGemini.generateScriptAndStoryboard({
        chosenTitle: selectedIdea?.title || umbrellaStatement || 'Your Video Title',
        viewerType: foundationData?.viewerType || 'LEARNER',
        avatarSummary: `${avatarSummary}. ${pillarContext}. ${userContext}`,
        ideaConcept: selectedIdea?.description || umbrellaStatement || '',
        selectedThumbBrief: {},
        targetMinutes: 10
      });

      // Convert to ScriptBrick format
      const bricks: ScriptBrick[] = result.bricks.map((brick, index) => ({
        id: `brick-${index}`,
        type: brick.type as ScriptBrick['type'],
        estimatedSec: brick.estimatedSec,
        narration: brick.narration,
        onScreen: brick.onScreen,
        callouts: brick.callouts,
        broll: brick.broll,
        beats: brick.beats,
        isExpanded: index === 0
      }));

      // Update progress
      setGenerationSteps(prev => prev.map((s, i) => 
        i <= 1 ? { ...s, status: 'completed' } : 
        i === 2 ? { ...s, status: 'active' } : s
      ));
      setGenerationStatus('Writing compelling narration...');
      setGenerationProgress(60);
      
      setScriptBricks(bricks);
      
      // Update progress
      setGenerationSteps(prev => prev.map((s, i) => 
        i <= 2 ? { ...s, status: 'completed' } : 
        i === 3 ? { ...s, status: 'active' } : s
      ));
      setGenerationStatus('Adding visual elements and B-roll suggestions...');
      setGenerationProgress(80);
      
      // Also generate table format for alternative view
      await generateTableFormat();
      
      // Final progress
      setGenerationSteps(prev => prev.map(s => ({ ...s, status: 'completed' })));
      setGenerationStatus('Finalizing your script...');
      setGenerationProgress(100);
      
      setHasGenerated(true);
      toast.success('Script generated successfully!');
      
      // Small delay to show completion
      setTimeout(() => {
        setIsGenerating(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to generate script:', error);
      setGenerationSteps(prev => prev.map((s, i) => 
        s.status === 'active' ? { ...s, status: 'error' } : s
      ));
      
      // More specific error messages
      if (error instanceof Error) {
        if (error.message.includes('quota')) {
          toast.error('API quota exceeded. Please try again later.');
        } else if (error.message.includes('JSON')) {
          toast.error('Error parsing AI response. Retrying with simpler format...');
          // Retry with fallback
          setTimeout(() => generateFullScript(), 2000);
          return;
        } else {
          toast.error(`Script generation failed: ${error.message}`);
        }
      } else {
        toast.error('Failed to generate script. Please try again.');
      }
      
      setIsGenerating(false);
    }
  };

  const generateTableFormat = async () => {
    try {
      const foundationData = useAppStore.getState().foundationData;
      const topic = selectedIdea?.title || 'How to Create Engaging Content';
      const avatarProfile = foundationData 
        ? `${foundationData.avatar.demographics}. Goals: ${foundationData.avatar.goals}. Pain points: ${foundationData.avatar.painPoints}`
        : (umbrellaStatement || 'Content creators looking to grow their audience');
      
      const targetAudience = foundationData?.viewerType 
        ? `${foundationData.viewerType} viewers interested in ${selectedIdea?.pillar || 'content'}`
        : 'General audience';
      
      const generatedScript = await copperReelsGemini.generateVideoScriptTable({
        topic,
        avatarProfile,
        targetAudience,
        duration: 10
      });
      
      setScriptRows(generatedScript);
    } catch (error) {
      console.error('Failed to generate table format:', error);
    }
  };

  const handleBricksChange = (bricks: ScriptBrick[]) => {
    setScriptBricks(bricks);
    
    // Save to store for persistence
    const updatedPlan = {
      ...videoPlan,
      bricks: bricks.map((brick, index) => ({
        id: brick.id,
        type: brick.type,
        title: `${brick.type} Section`,
        content: brick.narration,
        duration: `${Math.floor(brick.estimatedSec / 60)}:${(brick.estimatedSec % 60).toString().padStart(2, '0')}`,
        order: index + 1
      }))
    };
    useAppStore.getState().setVideoPlan(updatedPlan);
    
    // Save to localStorage for better persistence
    localStorage.setItem('copper_reels_script_bricks', JSON.stringify(bricks));
    
    // Auto-generate empty bricks if needed
    const emptyBricks = bricks.filter(b => !b.narration || b.narration.trim() === '');
    if (emptyBricks.length > 0 && emptyBricks.length < bricks.length) {
      toast.info(`${emptyBricks.length} empty brick(s) detected. Click regenerate to fill them.`);
    }
  };

  const regenerateBrick = async (brickId: string) => {
    setIsGenerating(true);
    try {
      const brick = scriptBricks.find(b => b.id === brickId);
      if (!brick) return;

      const foundationData = useAppStore.getState().foundationData;
      const umbrellaStatement = useAppStore.getState().umbrellaStatement;
      toast.info('Regenerating brick content...');
      
      // Build context including user's niche
      const context = `
Niche/Context: ${umbrellaStatement || 'General content'}
Target Audience: ${foundationData?.avatar?.demographics || 'General audience'}
Pain Points: ${foundationData?.avatar?.painPoints || 'N/A'}
Goals: ${foundationData?.avatar?.goals || 'N/A'}
`;
      
      // Call Gemini to regenerate just this specific brick with context
      const prompt = `
You are regenerating a specific section of a YouTube script. 

${context}

Current brick type: ${brick.type}
Current content: ${brick.narration || 'Empty - generate new content'}
Video title: ${selectedIdea?.title || umbrellaStatement || 'Content Creation'}
Viewer type: ${foundationData?.viewerType || 'LEARNER'}

Regenerate the narration for this ${brick.type} brick. Keep the same structure and purpose but create fresh, engaging content that's specific to the niche.
Maintain approximately ${brick.estimatedSec} seconds of speaking time (about ${Math.round(brick.estimatedSec * 2.5)} words).

IMPORTANT: Make sure the content is relevant to the niche: ${umbrellaStatement}

Return ONLY a JSON object with this structure:
{
  "narration": "The regenerated script content...",
  "onScreen": "Short on-screen text (max 8 words)",
  "beats": ["Key point 1", "Key point 2", "Key point 3"],
  "callouts": ["Important callout 1", "Important callout 2"],
  "broll": ["B-roll suggestion 1", "B-roll suggestion 2", "B-roll suggestion 3"]
}`;

      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      
      const regeneratedContent = JSON.parse(jsonMatch[0]);
      
      // Update the brick with regenerated content
      const updatedBricks = scriptBricks.map(b => {
        if (b.id === brickId) {
          return {
            ...b,
            narration: regeneratedContent.narration || b.narration,
            onScreen: regeneratedContent.onScreen || b.onScreen,
            beats: regeneratedContent.beats || b.beats,
            callouts: regeneratedContent.callouts || b.callouts,
            broll: regeneratedContent.broll || b.broll
          };
        }
        return b;
      });
      
      setScriptBricks(updatedBricks);
      handleBricksChange(updatedBricks); // Sync with store and save
      toast.success('Content regenerated and saved!');
    } catch (error) {
      console.error('Failed to regenerate brick:', error);
      toast.error('Failed to regenerate brick. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveScript = (data: VideoScriptRow[]) => {
    console.log('Saving script data:', data);
    toast.success('Script saved successfully!');
  };

  // Generate preview from bricks
  const generatePreview = () => {
    return scriptBricks.map(brick => brick.narration).join('\n\n');
  };

  // Show generation status overlay
  if (isGenerating && scriptBricks.length === 0) {
    return (
      <>
        <GenerationStatus
          isGenerating={isGenerating}
          status={generationStatus}
          progress={generationProgress}
          estimatedTime={45}
          steps={generationSteps}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle pb-32">
      {/* Generation Status Overlay */}
      <GenerationStatus
        isGenerating={isGenerating && scriptBricks.length > 0}
        status={generationStatus}
        progress={generationProgress}
        estimatedTime={30}
        steps={generationSteps}
      />
      
      <div className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Simplified Header with Actions */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <h1 className="text-2xl font-bold">Script Builder</h1>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (confirm('Clear all script content and start fresh?')) {
                    localStorage.removeItem('copper_reels_script_bricks');
                    setScriptBricks([]);
                    setHasGenerated(false);
                    toast.info('Script cleared. Click regenerate to create new content.');
                  }
                }}
                className="flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Clear
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={generateFullScript}
                disabled={isGenerating}
                className="flex items-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Regenerating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    Regenerate All
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* View Tabs */}
          <Tabs value={activeView} onValueChange={(v) => setActiveView(v as any)}>
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-6">
              <TabsTrigger value="bricks" className="flex items-center gap-2">
                <Layers className="w-4 h-4" />
                Bricks View
              </TabsTrigger>
              <TabsTrigger value="table" className="flex items-center gap-2">
                <Table className="w-4 h-4" />
                Table View
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Preview
              </TabsTrigger>
            </TabsList>

            {/* Bricks View */}
            <TabsContent value="bricks" className="mt-6">
              <div className="mb-4">
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                  <h2 className="font-semibold mb-2">📦 Bricks View</h2>
                  <p className="text-sm text-muted-foreground">
                    Visualize and edit your script as modular blocks. Each brick represents a section of your video with its own purpose and content.
                  </p>
                </div>
              </div>
              
              <BrickScriptEditor
                bricks={scriptBricks}
                onChange={handleBricksChange}
                onRegenerateScript={regenerateBrick}
                isGenerating={isGenerating}
              />
            </TabsContent>

            {/* Table View */}
            <TabsContent value="table" className="mt-6">
              <div className="mb-4">
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                  <h2 className="font-semibold mb-2">📊 Table View</h2>
                  <p className="text-sm text-muted-foreground">
                    Edit your script in a structured table format with psychological triggers and internal dialogue columns.
                  </p>
                </div>
              </div>

              <VideoScriptTable
                initialData={scriptRows}
                onSave={handleSaveScript}
                onGenerate={generateTableFormat}
                topic={selectedIdea?.title || "Your Video Title"}
              />
            </TabsContent>

            {/* Preview */}
            <TabsContent value="preview" className="mt-6">
              <div className="mb-4">
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                  <h2 className="font-semibold mb-2">👁️ Full Script Preview</h2>
                  <p className="text-sm text-muted-foreground">
                    See your complete script as it will appear in the teleprompter.
                  </p>
                </div>
              </div>

              <div className="bg-card rounded-lg p-8 shadow-lg">
                <div className="prose prose-lg max-w-none">
                  {scriptBricks.map((brick, index) => (
                    <div key={brick.id} className="mb-8">
                      <h3 className="text-primary font-bold mb-3">
                        {brick.type} BRICK {index + 1}
                      </h3>
                      {brick.onScreen && (
                        <div className="bg-primary/10 px-3 py-1 rounded inline-block mb-3">
                          <span className="text-sm font-medium">{brick.onScreen}</span>
                        </div>
                      )}
                      <p className="whitespace-pre-wrap leading-relaxed">
                        {brick.narration || <span className="text-muted-foreground italic">No content yet</span>}
                      </p>
                      {brick.beats.length > 0 && (
                        <div className="mt-3 pl-4 border-l-2 border-primary/30">
                          <p className="text-sm font-medium text-muted-foreground mb-1">Key Points:</p>
                          <ul className="text-sm space-y-1">
                            {brick.beats.map((beat, i) => (
                              <li key={i}>• {beat}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {scriptBricks.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>No script content yet. Generate or add bricks to get started.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
      
      {/* Navigation Flow at Bottom */}
      <NavigationFlow
        canProceed={scriptBricks.length > 0}
        nextLabel="Finish"
      />
    </div>
  );
}
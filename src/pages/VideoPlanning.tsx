import { useState, useEffect } from 'react';
import { motion, Reorder } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  ArrowRight, 
  GripVertical, 
  Play, 
  FileText, 
  Download,
  ToggleLeft,
  ToggleRight,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EditableField } from '@/components/ui/editable-field';
import { ProgressIndicator } from '@/components/ui/progress-indicator';
import { useAppStore } from '@/store/useAppStore';
import type { VideoBrick, StoryboardFrame, VideoPlan } from '@/store/useAppStore';
import { copperReelsGemini } from '@/lib/gemini';
import { toast } from 'sonner';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

// Empty initial plan - will be generated with AI
const emptyVideoPlan: VideoPlan = {
  teleprompterMode: false,
  bricks: [],
  storyboard: []
};

const brickTypeColors = {
  INTRO: 'bg-blue-500',
  MIDDLE: 'bg-green-500', 
  EXAMPLE: 'bg-purple-500',
  APPLICATION: 'bg-orange-500',
  OUTRO: 'bg-pink-500'
};

export default function VideoPlanning() {
  const navigate = useNavigate();
  const { 
    selectedIdea, 
    videoPlan, 
    setVideoPlan, 
    setCurrentStep 
  } = useAppStore();
  
  const [currentPlan, setCurrentPlan] = useState<VideoPlan>(videoPlan || emptyVideoPlan);
  const [isGeneratingTitles, setIsGeneratingTitles] = useState(false);
  const [generatedTitles, setGeneratedTitles] = useState<any[]>([]);
  const [isGeneratingThumbnails, setIsGeneratingThumbnails] = useState(false);
  const [generatedThumbnails, setGeneratedThumbnails] = useState<any[]>([]);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  const generateScriptStructure = async () => {
    setIsGeneratingPlan(true);
    try {
      const foundationData = useAppStore.getState().foundationData;
      const umbrellaStatement = useAppStore.getState().umbrellaStatement;
      
      // Build comprehensive context
      const title = selectedIdea?.title || umbrellaStatement || 'Your Video Title';
      const concept = selectedIdea?.description || umbrellaStatement || '';
      
      // Build detailed avatar summary with ALL context
      let avatarSummary = '';
      if (foundationData) {
        avatarSummary = `
          Demographics: ${foundationData.avatar.demographics}.
          Psychographics: ${foundationData.avatar.psychographics}.
          Pain Points: ${foundationData.avatar.painPoints}.
          Goals: ${foundationData.avatar.goals}.
          Content Pillars: ${foundationData.pillars.map(p => p.title).join(', ')}.
        `;
      } else if (umbrellaStatement) {
        avatarSummary = `Based on: ${umbrellaStatement}`;
      }
      
      // Add explicit context about the niche
      if (umbrellaStatement) {
        avatarSummary += ` Niche Context: ${umbrellaStatement}`;
      }
      
      console.log('Generating script with context:', {
        title,
        concept,
        avatarSummary,
        umbrellaStatement
      });
      
      const result = await copperReelsGemini.generateScriptAndStoryboard({
        chosenTitle: title,
        viewerType: foundationData?.viewerType || 'LEARNER',
        avatarSummary: avatarSummary,
        ideaConcept: concept,
        selectedThumbBrief: {},
        targetMinutes: 10
      });
      
      // Transform the result to match our VideoPlan structure
      const newPlan: VideoPlan = {
        teleprompterMode: false,
        bricks: result.bricks.map((brick, index) => ({
          id: `brick-${index}`,
          type: brick.type,
          title: `${brick.type} Section`,
          content: brick.narration,
          duration: `${Math.floor(brick.estimatedSec / 60)}:${(brick.estimatedSec % 60).toString().padStart(2, '0')}`,
          order: index + 1
        })),
        storyboard: result.bricks.map((brick, index) => ({
          id: `frame-${index}`,
          brickId: `brick-${index}`,
          thumbnail: brick.onScreen,
          visualNotes: brick.callouts.join(', '),
          brollSuggestions: brick.broll
        }))
      };
      
      setCurrentPlan(newPlan);
      setVideoPlan(newPlan);
      toast.success('Script structure generated!');
    } catch (error) {
      console.error('Failed to generate script structure:', error);
      toast.error('Failed to generate script structure');
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  useEffect(() => {
    setCurrentStep('plan');
    // Auto-generate script structure if not exists
    if (!videoPlan || videoPlan.bricks.length === 0) {
      generateScriptStructure();
    }
  }, [setCurrentStep]);

  const updateBrick = (brickId: string, field: keyof VideoBrick, value: string) => {
    const updatedBricks = currentPlan.bricks.map(brick =>
      brick.id === brickId ? { ...brick, [field]: value } : brick
    );
    const updatedPlan = { ...currentPlan, bricks: updatedBricks };
    setCurrentPlan(updatedPlan);
    setVideoPlan(updatedPlan);
  };

  const updateStoryboard = (frameId: string, field: keyof StoryboardFrame, value: string | string[]) => {
    const updatedStoryboard = currentPlan.storyboard.map(frame =>
      frame.id === frameId ? { ...frame, [field]: value } : frame
    );
    const updatedPlan = { ...currentPlan, storyboard: updatedStoryboard };
    setCurrentPlan(updatedPlan);
    setVideoPlan(updatedPlan);
  };

  const toggleTeleprompterMode = () => {
    const updatedPlan = { ...currentPlan, teleprompterMode: !currentPlan.teleprompterMode };
    setCurrentPlan(updatedPlan);
    setVideoPlan(updatedPlan);
  };

  const reorderBricks = (newOrder: VideoBrick[]) => {
    const reorderedBricks = newOrder.map((brick, index) => ({
      ...brick,
      order: index + 1
    }));
    const updatedPlan = { ...currentPlan, bricks: reorderedBricks };
    setCurrentPlan(updatedPlan);
    setVideoPlan(updatedPlan);
  };

  const generateTitles = async () => {
    if (!selectedIdea) {
      toast.error('No idea selected');
      return;
    }

    setIsGeneratingTitles(true);
    try {
      const result = await copperReelsGemini.generateTitles({
        ideaConcept: selectedIdea.title,
        pillarName: selectedIdea.pillar,
        viewerType: useAppStore.getState().foundationData?.viewerType || 'LEARNER'
      });
      
      setGeneratedTitles(result.titles);
      toast.success(`Generated ${result.titles.length} title variations!`);
    } catch (error) {
      console.error('Failed to generate titles:', error);
      toast.error('Failed to generate titles');
    } finally {
      setIsGeneratingTitles(false);
    }
  };

  const generateThumbnails = async () => {
    if (!selectedIdea) {
      toast.error('No idea selected');
      return;
    }

    setIsGeneratingThumbnails(true);
    try {
      const briefs = await copperReelsGemini.generateThumbnailBriefs({
        titleText: selectedIdea.title,
        ideaConcept: selectedIdea.description
      });
      
      setGeneratedThumbnails(briefs);
      toast.success(`Generated ${briefs.length} thumbnail briefs!`);
    } catch (error) {
      console.error('Failed to generate thumbnails:', error);
      toast.error('Failed to generate thumbnail briefs');
    } finally {
      setIsGeneratingThumbnails(false);
    }
  };

  const exportBrollList = () => {
    const brollItems = currentPlan.storyboard.flatMap(frame => frame.brollSuggestions);
    const brollText = brollItems.map((item, index) => `${index + 1}. ${item}`).join('\n');
    
    const blob = new Blob([brollText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'broll-list.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!selectedIdea) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No video selected</h2>
          <Button onClick={() => navigate('/ideation')}>Return to Ideation</Button>
        </div>
      </div>
    );
  }

  if (isGeneratingPlan) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" message="Generating script structure..." />
          <p className="mt-4 text-muted-foreground">
            Creating video bricks and storyboard for: {selectedIdea.title}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        <ProgressIndicator currentStep="plan" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto mt-8"
        >
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold mb-2">Video Planning</h1>
                <p className="text-muted-foreground mb-2">
                  {selectedIdea ? (
                    <>Planning: <strong>{selectedIdea.title}</strong></>
                  ) : (
                    <>Based on: <strong>{useAppStore.getState().umbrellaStatement}</strong></>
                  )}
                </p>
                {selectedIdea?.pillar && (
                  <Badge className="bg-primary/10 text-primary">
                    {selectedIdea.pillar}
                  </Badge>
                )}
                <div className="mt-2 text-xs text-muted-foreground">
                  <Sparkles className="w-3 h-3 inline mr-1" />
                  Context: {useAppStore.getState().umbrellaStatement || 'No context set'}
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  onClick={generateScriptStructure}
                  disabled={isGeneratingPlan}
                  variant="outline"
                  title="Regenerate content with your context"
                >
                  {isGeneratingPlan ? (
                    <>
                      <LoadingSpinner className="w-4 h-4 mr-2" />
                      <span>Regenerating...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      <span>Refresh Content</span>
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={generateTitles}
                  disabled={isGeneratingTitles}
                  className="bg-gradient-primary hover:shadow-glow"
                >
                  {isGeneratingTitles ? (
                    <>
                      <LoadingSpinner className="w-4 h-4 mr-2" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4 mr-2" />
                      <span>Generate Titles</span>
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={generateThumbnails}
                  disabled={isGeneratingThumbnails}
                  className="bg-gradient-primary hover:shadow-glow"
                >
                  {isGeneratingThumbnails ? (
                    <>
                      <LoadingSpinner className="w-4 h-4 mr-2" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      <span>Generate Thumbnails</span>
                    </>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={toggleTeleprompterMode}
                  className="flex items-center space-x-2"
                >
                  {currentPlan.teleprompterMode ? (
                    <ToggleRight className="w-4 h-4 text-primary" />
                  ) : (
                    <ToggleLeft className="w-4 h-4" />
                  )}
                  <span>Teleprompter View</span>
                </Button>
                
                <Button
                  variant="outline"
                  onClick={exportBrollList}
                  className="flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Export B-roll List</span>
                </Button>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Panel - Script Editor */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6 shadow-elegant">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">
                    {currentPlan.teleprompterMode ? 'Teleprompter View' : 'Script Blocks'}
                  </h2>
                </div>

                {currentPlan.teleprompterMode ? (
                  // Teleprompter View
                  <div className="space-y-6 max-h-[600px] overflow-y-auto">
                    {currentPlan.bricks
                      .sort((a, b) => a.order - b.order)
                      .map((brick) => (
                        <div key={brick.id} className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${brickTypeColors[brick.type]}`} />
                            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                              {brick.type} - {brick.duration}
                            </h4>
                          </div>
                          <div className="text-lg leading-relaxed pl-5 border-l-2 border-muted">
                            {brick.content}
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  // Block View
                  <Reorder.Group
                    axis="y"
                    values={currentPlan.bricks}
                    onReorder={reorderBricks}
                    className="space-y-4"
                  >
                    {currentPlan.bricks
                      .sort((a, b) => a.order - b.order)
                      .map((brick) => (
                        <Reorder.Item
                          key={brick.id}
                          value={brick}
                          className="cursor-grab active:cursor-grabbing"
                        >
                          <motion.div
                            whileHover={{ scale: 1.01 }}
                            className="bg-card border rounded-lg p-4"
                          >
                            <div className="flex items-center space-x-3 mb-3">
                              <GripVertical className="w-4 h-4 text-muted-foreground" />
                              <div className={`w-3 h-3 rounded-full ${brickTypeColors[brick.type]}`} />
                              <Badge variant="secondary" className="text-xs">
                                {brick.type}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {brick.duration}
                              </span>
                            </div>
                            
                            <div className="space-y-3">
                              <EditableField
                                value={brick.title}
                                onSave={(value) => updateBrick(brick.id, 'title', value)}
                                displayClassName="font-medium"
                              />
                              
                              <EditableField
                                value={brick.content}
                                onSave={(value) => updateBrick(brick.id, 'content', value)}
                                multiline
                                displayClassName="text-sm text-muted-foreground"
                              />
                            </div>
                          </motion.div>
                        </Reorder.Item>
                      ))}
                  </Reorder.Group>
                )}
              </Card>
            </motion.div>

            {/* Right Panel - Storyboard */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6 shadow-elegant">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Play className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">Storyboard</h2>
                </div>

                <div className="space-y-6 max-h-[600px] overflow-y-auto">
                  {currentPlan.storyboard.map((frame, index) => {
                    const correspondingBrick = currentPlan.bricks.find(brick => brick.id === frame.brickId);
                    
                    return (
                      <motion.div
                        key={frame.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-card border rounded-lg p-4"
                      >
                        <div className="flex items-center space-x-2 mb-3">
                          <div className={`w-3 h-3 rounded-full ${correspondingBrick ? brickTypeColors[correspondingBrick.type] : 'bg-gray-400'}`} />
                          <span className="font-medium text-sm">
                            Frame {index + 1}: {correspondingBrick?.type}
                          </span>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                              Thumbnail Brief
                            </h4>
                            <EditableField
                              value={frame.thumbnail}
                              onSave={(value) => updateStoryboard(frame.id, 'thumbnail', value)}
                              displayClassName="text-sm"
                            />
                          </div>
                          
                          <div>
                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                              Visual Notes
                            </h4>
                            <EditableField
                              value={frame.visualNotes}
                              onSave={(value) => updateStoryboard(frame.id, 'visualNotes', value)}
                              displayClassName="text-sm"
                              multiline
                            />
                          </div>
                          
                          <div>
                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                              B-roll Suggestions
                            </h4>
                            <div className="space-y-1">
                              {frame.brollSuggestions.map((suggestion, sugIndex) => (
                                <div key={sugIndex} className="text-sm text-muted-foreground">
                                  • {suggestion}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Generated Titles Section */}
          {generatedTitles.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8"
            >
              <Card className="p-6 shadow-elegant">
                <h3 className="text-xl font-bold mb-4">Generated Title Variations</h3>
                <div className="space-y-3">
                  {generatedTitles.map((title, index) => (
                    <div key={index} className="p-3 bg-muted rounded-lg">
                      <p className="font-medium">{title.text}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary">Score: {(title.score * 100).toFixed(0)}%</Badge>
                        <Badge variant="outline">{title.shape}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Generated Thumbnails Section */}
          {generatedThumbnails.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8"
            >
              <Card className="p-6 shadow-elegant">
                <h3 className="text-xl font-bold mb-4">Generated Thumbnail Briefs</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {generatedThumbnails.map((thumbnail, index) => (
                    <div key={index} className="p-4 bg-muted rounded-lg">
                      <h4 className="font-semibold mb-2">Brief {index + 1}</h4>
                      <p className="text-sm mb-2"><strong>Text:</strong> {thumbnail.overlayText}</p>
                      <p className="text-sm mb-2"><strong>Subject:</strong> {thumbnail.subject}</p>
                      <p className="text-sm mb-2"><strong>Mood:</strong> {thumbnail.colorMood}</p>
                      <p className="text-sm"><strong>Background:</strong> {thumbnail.background}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex justify-between mt-8"
          >
            <Button
              variant="outline"
              onClick={() => navigate('/ideation')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Ideas</span>
            </Button>
            
            <Button
              onClick={() => navigate('/script-builder')}
              className="flex items-center space-x-2 bg-gradient-primary hover:shadow-glow"
            >
              <span>Build Script</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
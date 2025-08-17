import { useState, useEffect } from 'react';
import { motion, Reorder } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  GripVertical, 
  Play, 
  FileText, 
  Download,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EditableField } from '@/components/ui/editable-field';
import { ProgressIndicator } from '@/components/ui/progress-indicator';
import { useAppStore } from '@/store/useAppStore';
import type { VideoBrick, StoryboardFrame, VideoPlan } from '@/store/useAppStore';

const mockVideoPlan: VideoPlan = {
  teleprompterMode: false,
  bricks: [
    {
      id: '1',
      type: 'INTRO',
      title: 'Hook & Introduction',
      content: 'Hey developers! Are you tired of spending hours setting up the same tools for every project? Today I\'m sharing the 5 essential tools that have completely transformed my development workflow...',
      duration: '0:30',
      order: 1
    },
    {
      id: '2',
      type: 'MIDDLE',
      title: 'Tool #1: VS Code Extensions',
      content: 'First up is this incredible VS Code extension pack that gives you superpowers. Let me show you exactly how to set it up and the specific extensions that will save you hours...',
      duration: '2:00',
      order: 2
    },
    {
      id: '3',
      type: 'EXAMPLE',
      title: 'Live Demo: Speed Coding',
      content: 'Watch this - I\'m going to build a complete React component in under 3 minutes using these tools. Notice how the auto-completion and snippets speed up the process...',
      duration: '3:00',
      order: 3
    },
    {
      id: '4',
      type: 'APPLICATION',
      title: 'Implementation Steps',
      content: 'Now let\'s break down exactly how you can implement this in your own workflow. Step 1: Download these extensions. Step 2: Configure your settings like this...',
      duration: '2:30',
      order: 4
    },
    {
      id: '5',
      type: 'OUTRO',
      title: 'Call to Action',
      content: 'If this saved you time, smash that like button and subscribe for more developer productivity tips. Drop a comment with your favorite coding tool - I read every single one!',
      duration: '0:30',
      order: 5
    }
  ],
  storyboard: [
    {
      id: '1',
      brickId: '1',
      thumbnail: 'Close-up of frustrated developer',
      visualNotes: 'Split screen showing messy vs clean workflow',
      brollSuggestions: ['Screen recording of slow setup', 'Developer nodding', 'Clean desktop workspace']
    },
    {
      id: '2',
      brickId: '2',
      thumbnail: 'VS Code interface with extensions',
      visualNotes: 'Highlight extension marketplace',
      brollSuggestions: ['Extension installation process', 'Before/after comparison', 'Extension icons animation']
    },
    {
      id: '3',
      brickId: '3',
      thumbnail: 'Speed coding montage',
      visualNotes: 'Time-lapse effect with timer',
      brollSuggestions: ['Hands typing rapidly', 'Code appearing fast', 'Completion suggestions popping up']
    },
    {
      id: '4',
      brickId: '4',
      thumbnail: 'Step-by-step tutorial overlay',
      visualNotes: 'Numbered steps with highlights',
      brollSuggestions: ['Settings screenshots', 'Configuration files', 'Mouse clicks and navigation']
    },
    {
      id: '5',
      brickId: '5',
      thumbnail: 'Enthusiastic creator on camera',
      visualNotes: 'Subscribe button animation',
      brollSuggestions: ['Like button clicking', 'Comment section scroll', 'Subscribe bell icon']
    }
  ]
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
  
  const [currentPlan, setCurrentPlan] = useState<VideoPlan>(videoPlan || mockVideoPlan);

  useEffect(() => {
    setCurrentStep('plan');
    if (!videoPlan) {
      setVideoPlan(mockVideoPlan);
      setCurrentPlan(mockVideoPlan);
    }
  }, [setCurrentStep, videoPlan, setVideoPlan]);

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
                <p className="text-muted-foreground mb-4">
                  Planning: <strong>{selectedIdea.title}</strong>
                </p>
                <Badge className="bg-primary/10 text-primary">
                  {selectedIdea.pillar}
                </Badge>
              </div>
              
              <div className="flex items-center space-x-4">
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
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                🎬 Your video plan is ready! Export your B-roll list and start creating.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { motion, Reorder, AnimatePresence } from 'framer-motion';
import {
  GripVertical,
  Clock,
  Edit3,
  Save,
  X,
  Sparkles,
  Film,
  MessageSquare,
  Target,
  Eye,
  List,
  Trash2,
  Plus,
  ChevronDown,
  ChevronUp,
  Download,
  FileText
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Brick type definitions
export type BrickType = 'INTRO' | 'MIDDLE' | 'EXAMPLE' | 'APPLICATION' | 'OUTRO';

export interface ScriptBrick {
  id: string;
  type: BrickType;
  estimatedSec: number;
  narration: string;
  onScreen: string;
  callouts: string[];
  broll: string[];
  beats: string[];
  isExpanded?: boolean;
  isEditing?: boolean;
}

interface BrickScriptEditorProps {
  bricks: ScriptBrick[];
  onChange: (bricks: ScriptBrick[]) => void;
  onRegenerateScript?: (brickId: string) => Promise<void>;
  isGenerating?: boolean;
}

const BRICK_COLORS: Record<BrickType, string> = {
  INTRO: 'bg-blue-500',
  MIDDLE: 'bg-green-500',
  EXAMPLE: 'bg-purple-500',
  APPLICATION: 'bg-orange-500',
  OUTRO: 'bg-pink-500'
};

const BRICK_ICONS: Record<BrickType, React.ReactNode> = {
  INTRO: <Sparkles className="w-4 h-4" />,
  MIDDLE: <Film className="w-4 h-4" />,
  EXAMPLE: <Eye className="w-4 h-4" />,
  APPLICATION: <Target className="w-4 h-4" />,
  OUTRO: <MessageSquare className="w-4 h-4" />
};

export function BrickScriptEditor({
  bricks: initialBricks,
  onChange,
  onRegenerateScript,
  isGenerating = false
}: BrickScriptEditorProps) {
  const [bricks, setBricks] = useState<ScriptBrick[]>(initialBricks);
  const [editingBrick, setEditingBrick] = useState<string | null>(null);
  const [tempBrick, setTempBrick] = useState<ScriptBrick | null>(null);

  useEffect(() => {
    setBricks(initialBricks);
  }, [initialBricks]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTotalDuration = () => {
    return bricks.reduce((acc, brick) => acc + brick.estimatedSec, 0);
  };

  const handleReorder = (newOrder: ScriptBrick[]) => {
    setBricks(newOrder);
    onChange(newOrder);
  };

  const toggleExpand = (brickId: string) => {
    const updated = bricks.map(brick => ({
      ...brick,
      isExpanded: brick.id === brickId ? !brick.isExpanded : brick.isExpanded
    }));
    setBricks(updated);
  };

  const startEditing = (brick: ScriptBrick) => {
    setEditingBrick(brick.id);
    setTempBrick({ ...brick });
  };

  const cancelEditing = () => {
    setEditingBrick(null);
    setTempBrick(null);
  };

  const saveEditing = async () => {
    if (!tempBrick) return;
    
    const updated = bricks.map(brick => 
      brick.id === tempBrick.id ? tempBrick : brick
    );
    setBricks(updated);
    onChange(updated);
    
    // Auto-generate missing content if needed
    if (onRegenerateScript && !tempBrick.narration && tempBrick.type) {
      toast.info('Auto-generating content for empty brick...');
      await onRegenerateScript(tempBrick.id);
    }
    
    setEditingBrick(null);
    setTempBrick(null);
    toast.success('Changes saved successfully!');
  };

  const updateTempField = (field: keyof ScriptBrick, value: any) => {
    if (!tempBrick) return;
    setTempBrick({ ...tempBrick, [field]: value });
  };

  const addBrick = (type: BrickType, afterId?: string) => {
    const newBrick: ScriptBrick = {
      id: `brick-${Date.now()}`,
      type,
      estimatedSec: 60,
      narration: '',
      onScreen: '',
      callouts: [],
      broll: [],
      beats: [],
      isExpanded: true,
      isEditing: true
    };

    let updated: ScriptBrick[];
    if (afterId) {
      const index = bricks.findIndex(b => b.id === afterId);
      updated = [...bricks.slice(0, index + 1), newBrick, ...bricks.slice(index + 1)];
    } else {
      updated = [...bricks, newBrick];
    }
    
    setBricks(updated);
    onChange(updated);
    startEditing(newBrick);
  };

  const deleteBrick = (brickId: string) => {
    const updated = bricks.filter(brick => brick.id !== brickId);
    setBricks(updated);
    onChange(updated);
    toast.success('Brick deleted');
  };

  const regenerateBrick = async (brickId: string) => {
    if (onRegenerateScript) {
      await onRegenerateScript(brickId);
      toast.success('Content regenerated successfully!');
    }
  };
  
  const exportAsTextFile = () => {
    // Generate text content
    let textContent = '=== VIDEO SCRIPT ===\n';
    textContent += `Total Duration: ${formatDuration(getTotalDuration())}\n\n`;
    
    bricks.forEach((brick, index) => {
      textContent += `${'='.repeat(50)}\n`;
      textContent += `${index + 1}. ${brick.type} BRICK (${formatDuration(brick.estimatedSec)})\n`;
      textContent += `${'='.repeat(50)}\n\n`;
      
      if (brick.onScreen) {
        textContent += `ON-SCREEN TEXT: ${brick.onScreen}\n\n`;
      }
      
      textContent += `NARRATION:\n${brick.narration || '[No narration yet]'}\n\n`;
      
      if (brick.beats.length > 0) {
        textContent += `KEY POINTS:\n`;
        brick.beats.forEach(beat => {
          textContent += `  • ${beat}\n`;
        });
        textContent += '\n';
      }
      
      if (brick.callouts.length > 0) {
        textContent += `CALLOUTS:\n`;
        brick.callouts.forEach(callout => {
          textContent += `  → ${callout}\n`;
        });
        textContent += '\n';
      }
      
      if (brick.broll.length > 0) {
        textContent += `B-ROLL SUGGESTIONS:\n`;
        brick.broll.forEach(shot => {
          textContent += `  📹 ${shot}\n`;
        });
        textContent += '\n';
      }
    });
    
    // Create and download the file
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `script_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Script exported as text file!');
  };
  
  const exportAsJSON = () => {
    const jsonContent = JSON.stringify({
      metadata: {
        totalDuration: getTotalDuration(),
        totalBricks: bricks.length,
        exportDate: new Date().toISOString()
      },
      bricks: bricks
    }, null, 2);
    
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `script_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Script exported as JSON!');
  };

  return (
    <div className="space-y-4">
      {/* Header Stats */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-lg px-3 py-1">
            <Clock className="w-4 h-4 mr-2" />
            Total: {formatDuration(getTotalDuration())}
          </Badge>
          <Badge variant="outline" className="text-lg px-3 py-1">
            <List className="w-4 h-4 mr-2" />
            {bricks.length} Bricks
          </Badge>
        </div>
        <Button
          onClick={() => addBrick('MIDDLE')}
          variant="outline"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Brick
        </Button>
      </div>

      {/* Bricks List */}
      <Reorder.Group
        axis="y"
        values={bricks}
        onReorder={handleReorder}
        className="space-y-4"
      >
        <AnimatePresence>
          {bricks.map((brick, index) => (
            <Reorder.Item
              key={brick.id}
              value={brick}
              className="relative"
            >
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className={cn(
                  "overflow-hidden transition-all duration-300",
                  brick.isExpanded ? "shadow-lg" : "shadow-sm",
                  editingBrick === brick.id && "ring-2 ring-primary"
                )}>
                  {/* Brick Header */}
                  <div className={cn(
                    "p-4 text-white",
                    BRICK_COLORS[brick.type]
                  )}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <GripVertical className="w-5 h-5 cursor-move opacity-60 hover:opacity-100" />
                        <div className="flex items-center gap-2">
                          {BRICK_ICONS[brick.type]}
                          <span className="font-semibold text-lg">
                            {brick.type} BRICK {index + 1}
                          </span>
                        </div>
                        <Badge variant="secondary" className="bg-white/20 text-white">
                          {formatDuration(brick.estimatedSec)}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {editingBrick === brick.id ? (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={saveEditing}
                              className="text-white hover:bg-white/20"
                            >
                              <Save className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={cancelEditing}
                              className="text-white hover:bg-white/20"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => startEditing(brick)}
                              className="text-white hover:bg-white/20"
                            >
                              <Edit3 className="w-4 h-4" />
                            </Button>
                            {onRegenerateScript && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => regenerateBrick(brick.id)}
                                disabled={isGenerating}
                                className="text-white hover:bg-white/20"
                              >
                                <Sparkles className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteBrick(brick.id)}
                              className="text-white hover:bg-white/20"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => toggleExpand(brick.id)}
                              className="text-white hover:bg-white/20"
                            >
                              {brick.isExpanded ? 
                                <ChevronUp className="w-4 h-4" /> : 
                                <ChevronDown className="w-4 h-4" />
                              }
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Brick Content */}
                  <AnimatePresence>
                    {(brick.isExpanded || editingBrick === brick.id) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t"
                      >
                        <div className="p-6 space-y-4">
                          {editingBrick === brick.id && tempBrick ? (
                            // Edit Mode
                            <>
                              <div>
                                <label className="text-sm font-medium mb-2 block">
                                  Duration (seconds)
                                </label>
                                <Input
                                  type="number"
                                  value={tempBrick.estimatedSec}
                                  onChange={(e) => updateTempField('estimatedSec', parseInt(e.target.value))}
                                  className="w-32"
                                />
                              </div>

                              <div>
                                <label className="text-sm font-medium mb-2 block">
                                  Narration / Script
                                </label>
                                <Textarea
                                  value={tempBrick.narration}
                                  onChange={(e) => updateTempField('narration', e.target.value)}
                                  rows={4}
                                  className="font-mono text-sm"
                                  placeholder="What you'll say in this section..."
                                />
                              </div>

                              <div>
                                <label className="text-sm font-medium mb-2 block">
                                  On-Screen Text
                                </label>
                                <Input
                                  value={tempBrick.onScreen}
                                  onChange={(e) => updateTempField('onScreen', e.target.value)}
                                  placeholder="Text overlay (max 8 words)"
                                />
                              </div>

                              <div>
                                <label className="text-sm font-medium mb-2 block">
                                  Key Beats (one per line)
                                </label>
                                <Textarea
                                  value={tempBrick.beats.join('\n')}
                                  onChange={(e) => updateTempField('beats', e.target.value.split('\n').filter(b => b.trim()))}
                                  rows={3}
                                  placeholder="Main points to cover..."
                                />
                              </div>

                              <div>
                                <label className="text-sm font-medium mb-2 block">
                                  Callouts (one per line)
                                </label>
                                <Textarea
                                  value={tempBrick.callouts.join('\n')}
                                  onChange={(e) => updateTempField('callouts', e.target.value.split('\n').filter(c => c.trim()))}
                                  rows={2}
                                  placeholder="Important callouts or emphasis..."
                                />
                              </div>

                              <div>
                                <label className="text-sm font-medium mb-2 block">
                                  B-Roll Suggestions (one per line)
                                </label>
                                <Textarea
                                  value={tempBrick.broll.join('\n')}
                                  onChange={(e) => updateTempField('broll', e.target.value.split('\n').filter(b => b.trim()))}
                                  rows={3}
                                  placeholder="Visual elements and B-roll shots..."
                                />
                              </div>
                            </>
                          ) : (
                            // View Mode
                            <>
                              <div>
                                <h4 className="text-sm font-semibold text-muted-foreground mb-2">
                                  Narration
                                </h4>
                                <p className="text-sm leading-relaxed">
                                  {brick.narration || <span className="text-muted-foreground italic">No narration yet</span>}
                                </p>
                              </div>

                              {brick.onScreen && (
                                <div>
                                  <h4 className="text-sm font-semibold text-muted-foreground mb-2">
                                    On-Screen Text
                                  </h4>
                                  <Badge variant="secondary" className="text-sm">
                                    {brick.onScreen}
                                  </Badge>
                                </div>
                              )}

                              {brick.beats.length > 0 && (
                                <div>
                                  <h4 className="text-sm font-semibold text-muted-foreground mb-2">
                                    Key Beats
                                  </h4>
                                  <ul className="space-y-1">
                                    {brick.beats.map((beat, i) => (
                                      <li key={i} className="text-sm flex items-start">
                                        <span className="text-primary mr-2">•</span>
                                        <span>{beat}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {brick.callouts.length > 0 && (
                                <div>
                                  <h4 className="text-sm font-semibold text-muted-foreground mb-2">
                                    Callouts
                                  </h4>
                                  <div className="flex flex-wrap gap-2">
                                    {brick.callouts.map((callout, i) => (
                                      <Badge key={i} variant="outline">
                                        {callout}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {brick.broll.length > 0 && (
                                <div>
                                  <h4 className="text-sm font-semibold text-muted-foreground mb-2">
                                    B-Roll
                                  </h4>
                                  <div className="grid grid-cols-2 gap-2">
                                    {brick.broll.map((shot, i) => (
                                      <div key={i} className="text-sm text-muted-foreground flex items-center">
                                        <Film className="w-3 h-3 mr-1" />
                                        {shot}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                        </div>

                        {/* Add Brick Button */}
                        {!editingBrick && (
                          <div className="px-6 pb-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => addBrick('MIDDLE', brick.id)}
                              className="w-full border-2 border-dashed"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Add brick after this
                            </Button>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            </Reorder.Item>
          ))}
        </AnimatePresence>
      </Reorder.Group>

      {/* Export Options */}
      <Card className="p-6 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold mb-1">Script Export Options</h3>
            <p className="text-sm text-muted-foreground">
              {bricks.length} bricks • {formatDuration(getTotalDuration())} total runtime
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={exportAsTextFile}
              variant="outline"
              className="flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Export as Text
            </Button>
            <Button 
              onClick={exportAsJSON}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export as JSON
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
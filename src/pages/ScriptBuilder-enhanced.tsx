import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Copy,
  Download,
  Eye,
  Table,
  MessageSquare,
  Sparkles,
  Settings,
  ChevronUp,
  ChevronDown,
  Edit3,
  Check,
  X
} from 'lucide-react';
import { InlineEditingCTA, FloatingEditingCTA } from '@/components/VideoEditingUpsell';
import { FloatingNextButton } from '@/components/FloatingNextButton';
import { useLayout } from '@/contexts/LayoutContext';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { useAppStore } from '@/store/useAppStore';
import { copperReelsGemini } from '@/lib/gemini';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Table as TableComponent,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface ScriptSection {
  id: string;
  brick: string;
  time: string;
  scriptBeats: string;
  avatarDialogue: string;
  psychologicalTrigger: string;
  editing?: boolean;
}

interface TeleprompterSettings {
  speed: number;
  fontSize: number;
  lineHeight: number;
  darkMode: boolean;
  autoScroll: boolean;
}

export default function ScriptBuilderEnhanced() {
  const navigate = useNavigate();
  const { hasSidebar } = useLayout();
  const { user } = useAuth();
  const { currentScript, selectedIdea } = useAppStore();
  
  const [activeTab, setActiveTab] = useState('table');
  const [scriptSections, setScriptSections] = useState<ScriptSection[]>([]);
  const [fullScript, setFullScript] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [teleprompterSettings, setTeleprompterSettings] = useState<TeleprompterSettings>({
    speed: 50,
    fontSize: 24,
    lineHeight: 1.8,
    darkMode: false,
    autoScroll: false
  });
  const [isScrolling, setIsScrolling] = useState(false);
  const [editingCell, setEditingCell] = useState<{ id: string; field: string } | null>(null);
  const [editValue, setEditValue] = useState('');
  const teleprompterRef = useRef<HTMLDivElement>(null);
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // When currentScript changes (coming from planning page), always generate new script
    if (currentScript) {
      // Clear any existing script sections to force regeneration
      setScriptSections([]);
      setFullScript('');
      // Clear localStorage to prevent restoration of old script
      localStorage.removeItem('copper_reels_script_sections');
      // Generate new script immediately
      generateScript();
      return;
    }
    
    // Only try to restore from localStorage if no currentScript (direct page access)
    if (!currentScript) {
      const savedSections = localStorage.getItem('copper_reels_script_sections');
      if (savedSections && !scriptSections.length) {
        try {
          const parsed = JSON.parse(savedSections);
          if (parsed && parsed.length > 0) {
            setScriptSections(parsed);
            // Generate full script from saved sections
            const script = parsed.map((section: ScriptSection) => 
              `[${section.time}] ${section.brick}\n\n${section.scriptBeats}\n\n`
            ).join('\n---\n\n');
            setFullScript(script);
            toast.info('Restored your previous script');
          }
        } catch (e) {
          console.error('Failed to restore saved sections:', e);
        }
      }
    }
  }, [currentScript]);

  const generateScript = async () => {
    if (!currentScript || !selectedIdea) {
      toast.error('Missing planning data');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Generate script table based on target duration and title promise
      const targetDuration = currentScript.targetDuration || 5;
      const titleText = currentScript.title?.text || selectedIdea.concept;
      
      // Calculate timing based on duration
      const introDuration = Math.floor(targetDuration * 0.15); // 15% for intro
      const outroDuration = Math.floor(targetDuration * 0.1);  // 10% for outro
      const mainContentDuration = targetDuration - introDuration - outroDuration;
      
      // Determine number of main points from title or default based on duration
      const numMainPoints = targetDuration <= 5 ? 3 : targetDuration <= 10 ? 5 : targetDuration <= 20 ? 8 : 12;
      const pointDuration = Math.floor(mainContentDuration / numMainPoints);
      
      const sections: ScriptSection[] = [
        {
          id: '1',
          brick: 'Intro Brick (0-30s)',
          time: `0:00-0:${introDuration.toString().padStart(2, '0')}`,
          scriptBeats: `HOOK: Start with a shocking statistic or counterintuitive statement about "${titleText}". Make it specific and surprising.

PERSONAL INTRODUCTION: "I'm [Your Name], and I've helped [specific number] people [specific achievement]. I've [credibility statement with numbers/results]."

PROBLEM STATEMENT: "But here's what most people don't realize about ${titleText}... [specific problem that viewers face]. This is costing you [specific consequence]."

VALUE PROMISE: "In the next ${targetDuration} minutes, I'm going to show you exactly [specific transformation they'll achieve]. By the end, you'll know [3 specific things they'll learn]."

SOCIAL PROOF: "Just last week, [specific person] used this exact approach and [specific result in specific timeframe]."

TRANSITION QUESTION: "So what's the first thing you need to know about ${titleText}?"`,
          avatarDialogue: 'This person knows what they\'re talking about, I need to pay attention',
          psychologicalTrigger: 'Authority + Curiosity Gap'
        },
        {
          id: '2',
          brick: 'Problem Agitation (30-60s)',
          time: `0:${introDuration.toString().padStart(2, '0')}-1:00`,
          scriptBeats: `BIG IDEA: "The biggest mistake people make with ${titleText} is [specific common mistake]. I see this everywhere."

AMPLIFY THE PROBLEM: "When you [describe the mistake], what actually happens is [specific negative consequence]. This leads to [bigger problem]."

COST OF INACTION: "If you keep doing this, in 6 months you'll still be [specific frustrating situation]. Meanwhile, others who fix this will be [specific better outcome]."

WHY CURRENT SOLUTIONS FAIL: "You've probably tried [common solution 1] and [common solution 2]. But here's why they don't work: [specific reason with evidence]."

TRANSITION: "So what should you do instead? Let me show you..."`,
          avatarDialogue: 'That\'s exactly my problem! I\'ve been struggling with this',
          psychologicalTrigger: 'Pain Point Amplification'
        },
        {
          id: '3',
          brick: 'Middle Brick 1 (60-180s)',
          time: `1:00-3:00`,
          scriptBeats: `SECTION HEADER: "The [Descriptive Name] Method - Point #1"

OPENING STATEMENT: "This is the foundation everything else builds on. Without this, nothing else works."

DETAILED STORY: "Let me tell you about Sarah, a marketing manager at a tech startup. Sarah was struggling with [specific problem]. She didn't just try harder with the same approach. She discovered [innovative solution]. Here's exactly what she did: [step-by-step process]. Within 3 weeks, she saw [specific measurable results]. This transformed her entire [area of impact]."

ANALYSIS: "Why did this work when everything else failed? Three reasons: [reason 1 with explanation], [reason 2 with explanation], and [reason 3 with explanation]."

APPLICATION INSTRUCTIONS: "So how do YOU apply this? Step 1: [specific action with concrete example]. Step 2: [next action with measurable outcome]. Step 3: [advanced step with timeline]. Most people see results within [specific timeframe]."

TRANSITION: "But here's what Sarah discovered next that doubled her results..."`,
          avatarDialogue: 'This makes perfect sense, I can apply this immediately',
          psychologicalTrigger: 'Story + Authority + Implementation'
        },
        {
          id: '4',
          brick: 'Example Brick (180-240s)',
          time: `3:00-4:00`,
          scriptBeats: `DETAILED STORY FORMAT: "Let me tell you about Marcus, a freelance designer who was barely making ends meet. Marcus was losing clients because his proposals looked amateur and took forever to create. Marcus didn't just work harder or copy templates online. He developed a systematic approach using [specific method]. First, he [specific action]. Then he [next action]. Finally, he [final action]. Within 2 months, his proposal acceptance rate went from 20% to 85%. This single change increased his income by $40,000 that year."

STORY BREAKDOWN:
- Specific person: Marcus, freelance designer
- Clear problem: Amateur proposals, slow creation, losing clients  
- What he DIDN'T do: Work harder, copy templates
- What he DID do: Systematic approach with [method]
- Step-by-step process: [3 specific actions]
- Exact timeframe: 2 months
- Measurable results: 20% to 85% acceptance rate
- Broader impact: $40,000 income increase

This proves that [key principle] works even when [challenging circumstances].`,
          avatarDialogue: 'If they can do it, so can I - this is a real person with real results',
          psychologicalTrigger: 'Social Proof + Possibility + Specificity'
        },
        {
          id: '5',
          brick: 'Application Brick (240-300s)',
          time: `4:00-5:00`,
          scriptBeats: `APPLICATION INSTRUCTIONS: "So how do YOU apply this starting today?

Step 1: [Specific action with concrete example] - Do this: [detailed instruction]. For example, if you're [scenario], you would [specific example]. This takes about [time estimate].

Step 2: [Next step with measurable outcome] - Once you've done step 1, [next action]. You'll know it's working when [specific indicator]. Most people see [specific result] within [timeframe].

Step 3: [Advanced implementation] - After [timeframe], take it to the next level by [advanced action]. This is where [specific benefit] really kicks in.

Step 4: [Optimization step] - Track [specific metric] and adjust [specific element] based on [specific criteria].

Step 5: [Scale/maintenance step] - Once you're getting consistent [results], [scaling action] to [bigger outcome].

[B-ROLL: Show examples of each step being implemented]
[ON-SCREEN: Display key metrics and timelines for each step]"`,
          avatarDialogue: 'I know exactly what to do next, this is actionable',
          psychologicalTrigger: 'Implementation Intention + Self-Efficacy'
        },
        {
          id: '6',
          brick: 'Outro Brick (300-330s)',
          time: `5:00-5:30`,
          scriptBeats: `SUMMARY STATEMENT: "So remember, ${titleText} comes down to [main theme recap]. It's not about [common misconception], it's about [key insight]."

ACTION RECAP: "First, you [action 1 summary]. Second, you [action 2 summary]. Third, you [action 3 summary]. Do these three things and you'll see [specific outcome] within [timeframe]."

IMPLEMENTATION CHALLENGE: "Here's what I want you to do right now - pause this video and [specific immediate action]. Don't wait. The people who take action immediately are the ones who get results."

SERVICE MENTION: "If you want me to personally help you implement this system, I work with [specific type of people] to [specific outcome]. Link in the description."

FINAL CTA: "If this helped you understand ${titleText} better, smash that like button. Subscribe for more [content type] like this. And watch this video next where I show you [related topic] - it's the perfect follow-up to what we just covered."`,
          avatarDialogue: 'This was valuable, I want more content like this',
          psychologicalTrigger: 'Commitment + Reciprocity + Authority'
        }
      ];
      
      // Save sections to localStorage immediately
      localStorage.setItem('copper_reels_script_sections', JSON.stringify(sections));
      
      // Use actual Gemini API if available
      if (selectedIdea) {
        try {
          // Add timeout wrapper for API call
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Script generation timed out after 20 seconds')), 20000)
          );
          
          const generatedSections = await Promise.race([
            copperReelsGemini.generateVideoScriptTable({
              topic: selectedIdea.concept,
              avatarProfile: currentScript.research?.[0]?.description || 'Target audience',
              targetAudience: selectedIdea.metadata?.targetAudience || 'Content creators',
              duration: currentScript.targetDuration || 6
            }),
            timeoutPromise
          ]) as Awaited<ReturnType<typeof copperReelsGemini.generateVideoScriptTable>>;
          
          if (generatedSections && generatedSections.length > 0) {
            setScriptSections(generatedSections);
            localStorage.setItem('copper_reels_script_sections', JSON.stringify(generatedSections));
          } else {
            setScriptSections(sections);
          }
        } catch (error) {
          console.log('Using default sections due to:', error);
          setScriptSections(sections);
          if (error instanceof Error && error.message.includes('timeout')) {
            toast.warning('Generation timed out, using template structure');
          }
        }
      } else {
        setScriptSections(sections);
      }
      
      // Generate full script
      const script = sections.map(section => 
        `[${section.time}] ${section.brick}\n\n${section.scriptBeats}\n\n`
      ).join('\n---\n\n');
      
      setFullScript(script);
      
      toast.success('Script generated successfully!');
    } catch (error) {
      console.error('Failed to generate script:', error);
      toast.error('Failed to generate script');
    } finally {
      setIsGenerating(false);
    }
  };

  const startTeleprompter = () => {
    if (!teleprompterSettings.autoScroll) return;
    
    setIsScrolling(true);
    
    scrollIntervalRef.current = setInterval(() => {
      if (teleprompterRef.current) {
        teleprompterRef.current.scrollTop += teleprompterSettings.speed / 10;
        
        // Stop at bottom
        if (teleprompterRef.current.scrollTop >= 
            teleprompterRef.current.scrollHeight - teleprompterRef.current.clientHeight) {
          stopTeleprompter();
        }
      }
    }, 100);
  };

  const stopTeleprompter = () => {
    setIsScrolling(false);
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
  };

  const resetTeleprompter = () => {
    stopTeleprompter();
    if (teleprompterRef.current) {
      teleprompterRef.current.scrollTop = 0;
    }
  };

  const startEdit = (id: string, field: string, currentValue: string) => {
    setEditingCell({ id, field });
    setEditValue(currentValue);
  };

  const saveEdit = () => {
    if (!editingCell) return;
    
    setScriptSections(prev => 
      prev.map(section => 
        section.id === editingCell.id 
          ? { ...section, [editingCell.field]: editValue }
          : section
      )
    );
    
    setEditingCell(null);
    setEditValue('');
    toast.success('Updated successfully');
  };

  const cancelEdit = () => {
    setEditingCell(null);
    setEditValue('');
  };

  const copyScript = () => {
    const scriptText = scriptSections.map(section => 
      `[${section.time}] ${section.brick}\n${section.scriptBeats}\n\n`
    ).join('');
    
    navigator.clipboard.writeText(scriptText);
    toast.success('Script copied to clipboard!');
  };

  const exportScript = () => {
    const scriptText = scriptSections.map(section => 
      `[${section.time}] ${section.brick}\n\n` +
      `SCRIPT: ${section.scriptBeats}\n\n` +
      `VIEWER THINKING: ${section.avatarDialogue}\n\n` +
      `PSYCHOLOGY: ${section.psychologicalTrigger}\n\n` +
      `---\n\n`
    ).join('');
    
    const blob = new Blob([scriptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `script-${selectedIdea?.concept.replace(/\s+/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Script exported! Need help turning this into a video?', {
      duration: 5000,
      action: {
        label: 'Get Editing',
        onClick: () => {
          // Will trigger upsell modal
        }
      }
    });
  };

  if (!currentScript || !selectedIdea) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center space-y-4">
          <FileText className="w-16 h-16 text-muted-foreground mx-auto" />
          <h2 className="text-2xl font-bold">No Planning Data</h2>
          <p className="text-muted-foreground">Please complete video planning first</p>
          <Button onClick={() => navigate('/plan')} className="bg-gradient-primary">
            Go to Planning
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto mt-8"
        >
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold">Script Builder</h1>
                <p className="text-xl text-muted-foreground">
                  Your complete video script
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={copyScript}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                <Button
                  variant="outline"
                  onClick={exportScript}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
            
            {/* Video Info */}
            <Card className="p-4 bg-primary/5 border-primary/20">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{currentScript.title?.text}</h3>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline">{selectedIdea.pillar}</Badge>
                    <Badge variant="secondary">
                      {scriptSections.length} sections
                    </Badge>
                    <Badge>
                      Target: {currentScript.targetDuration || 5} min
                    </Badge>
                  </div>
                </div>
                {currentScript.thumbnail?.url && (
                  <div className="aspect-video w-24 rounded overflow-hidden">
                    <img 
                      src={currentScript.thumbnail.url} 
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="table">
                <Table className="w-4 h-4 mr-2" />
                Table View
              </TabsTrigger>
              <TabsTrigger value="teleprompter">
                <Eye className="w-4 h-4 mr-2" />
                Teleprompter
              </TabsTrigger>
            </TabsList>

            {/* Table View */}
            <TabsContent value="table" className="mt-6">
              <Card className="overflow-hidden">
                <TableComponent>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-32">Brick</TableHead>
                      <TableHead className="w-24">Time</TableHead>
                      <TableHead>Script Beats</TableHead>
                      <TableHead>Avatar's Internal Dialogue</TableHead>
                      <TableHead>Psychological Trigger</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scriptSections.map(section => (
                      <TableRow key={section.id}>
                        <TableCell className="font-medium">
                          <Badge variant="outline">{section.brick}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {section.time}
                        </TableCell>
                        <TableCell>
                          {editingCell?.id === section.id && editingCell?.field === 'scriptBeats' ? (
                            <div className="flex gap-2">
                              <Textarea
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className="min-h-20"
                                autoFocus
                              />
                              <div className="flex flex-col gap-1">
                                <Button size="sm" onClick={saveEdit}>
                                  <Check className="w-3 h-3" />
                                </Button>
                                <Button size="sm" variant="ghost" onClick={cancelEdit}>
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div 
                              className="whitespace-pre-wrap cursor-pointer hover:bg-muted/50 p-2 rounded"
                              onClick={() => startEdit(section.id, 'scriptBeats', section.scriptBeats)}
                            >
                              {section.scriptBeats}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {editingCell?.id === section.id && editingCell?.field === 'avatarDialogue' ? (
                            <div className="flex gap-2">
                              <Textarea
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className="min-h-16"
                                autoFocus
                              />
                              <div className="flex flex-col gap-1">
                                <Button size="sm" onClick={saveEdit}>
                                  <Check className="w-3 h-3" />
                                </Button>
                                <Button size="sm" variant="ghost" onClick={cancelEdit}>
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div 
                              className="text-sm italic text-muted-foreground cursor-pointer hover:bg-muted/50 p-2 rounded"
                              onClick={() => startEdit(section.id, 'avatarDialogue', section.avatarDialogue)}
                            >
                              "{section.avatarDialogue}"
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs">
                            {section.psychologicalTrigger}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </TableComponent>
              </Card>
              
              {/* Magic Enhancement Button */}
              <div className="flex justify-center mt-6">
                <Button
                  onClick={generateScript}
                  disabled={isGenerating}
                  className="bg-gradient-primary"
                >
                  {isGenerating ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                      </motion.div>
                      Enhancing Script...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Enhance with AI
                    </>
                  )}
                </Button>
              </div>
              
              {/* Video Editing Upsell */}
              {scriptSections.length > 0 && (
                <div className="mt-6">
                  <InlineEditingCTA 
                    scriptLength={Math.ceil(scriptSections.length * 0.85)}
                  />
                </div>
              )}
            </TabsContent>

            {/* Teleprompter View */}
            <TabsContent value="teleprompter" className="mt-6">
              <Card className="p-6">
                {/* Teleprompter Settings */}
                <div className="mb-6 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Teleprompter Settings
                    </h3>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="dark-mode" className="text-sm">Dark Mode</Label>
                      <Switch
                        id="dark-mode"
                        checked={teleprompterSettings.darkMode}
                        onCheckedChange={(checked) => 
                          setTeleprompterSettings(prev => ({ ...prev, darkMode: checked }))
                        }
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm">Scroll Speed</Label>
                      <Slider
                        value={[teleprompterSettings.speed]}
                        onValueChange={([value]) => 
                          setTeleprompterSettings(prev => ({ ...prev, speed: value }))
                        }
                        min={10}
                        max={100}
                        step={10}
                        className="mt-2"
                      />
                      <span className="text-xs text-muted-foreground">{teleprompterSettings.speed}%</span>
                    </div>
                    
                    <div>
                      <Label className="text-sm">Font Size</Label>
                      <Slider
                        value={[teleprompterSettings.fontSize]}
                        onValueChange={([value]) => 
                          setTeleprompterSettings(prev => ({ ...prev, fontSize: value }))
                        }
                        min={16}
                        max={48}
                        step={2}
                        className="mt-2"
                      />
                      <span className="text-xs text-muted-foreground">{teleprompterSettings.fontSize}px</span>
                    </div>
                    
                    <div>
                      <Label className="text-sm">Line Height</Label>
                      <Slider
                        value={[teleprompterSettings.lineHeight * 10]}
                        onValueChange={([value]) => 
                          setTeleprompterSettings(prev => ({ ...prev, lineHeight: value / 10 }))
                        }
                        min={15}
                        max={30}
                        step={1}
                        className="mt-2"
                      />
                      <span className="text-xs text-muted-foreground">{teleprompterSettings.lineHeight}</span>
                    </div>
                  </div>
                </div>
                
                {/* Teleprompter Controls */}
                <div className="flex justify-center gap-2 mb-6">
                  <Button
                    variant={isScrolling ? "destructive" : "default"}
                    onClick={isScrolling ? stopTeleprompter : startTeleprompter}
                  >
                    {isScrolling ? (
                      <>
                        <Pause className="w-4 h-4 mr-2" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Start
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={resetTeleprompter}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (document.fullscreenElement) {
                        document.exitFullscreen();
                      } else {
                        teleprompterRef.current?.requestFullscreen();
                      }
                    }}
                  >
                    <Maximize2 className="w-4 h-4 mr-2" />
                    Fullscreen
                  </Button>
                </div>
                
                {/* Teleprompter Display */}
                <div
                  ref={teleprompterRef}
                  className={cn(
                    "h-[600px] overflow-y-auto rounded-lg p-8 transition-all",
                    teleprompterSettings.darkMode 
                      ? "bg-black text-white" 
                      : "bg-white text-black"
                  )}
                  style={{
                    fontSize: `${teleprompterSettings.fontSize}px`,
                    lineHeight: teleprompterSettings.lineHeight
                  }}
                >
                  {scriptSections.map((section, index) => (
                    <motion.div
                      key={section.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="mb-12"
                    >
                      <div className="mb-4">
                        <span className={cn(
                          "text-sm font-bold uppercase tracking-wide",
                          teleprompterSettings.darkMode ? "text-gray-400" : "text-gray-600"
                        )}>
                          [{section.time}] {section.brick}
                        </span>
                      </div>
                      <div className="whitespace-pre-wrap leading-relaxed">
                        {section.scriptBeats}
                      </div>
                      {index < scriptSections.length - 1 && (
                        <div className={cn(
                          "my-8 border-t",
                          teleprompterSettings.darkMode ? "border-gray-800" : "border-gray-200"
                        )} />
                      )}
                    </motion.div>
                  ))}
                  
                  {/* End marker */}
                  <div className="text-center py-16">
                    <div className={cn(
                      "text-2xl font-bold",
                      teleprompterSettings.darkMode ? "text-gray-400" : "text-gray-600"
                    )}>
                      — END —
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
      
      {/* Floating Edit CTA - shows after 2 seconds */}
      {scriptSections.length > 0 && (
        <FloatingEditingCTA context="script" />
      )}
      
      {/* Floating Next Button - show for authenticated users */}
      {user && scriptSections.length > 0 && (
        <FloatingNextButton
          show={true}
          onClick={() => navigate('/publish')}
          label="Publish Video"
          nextPath="/publish"
          isComplete={true}
        />
      )}
    </div>
  );
}
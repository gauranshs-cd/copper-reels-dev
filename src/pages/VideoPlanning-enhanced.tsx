import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Video, 
  Plus, 
  X, 
  ArrowRight, 
  FileText,
  Image as ImageIcon,
  Link2,
  Youtube,
  TrendingUp,
  Clock,
  Eye,
  ThumbsUp,
  Edit3,
  Check,
  ChevronDown,
  ChevronRight,
  Sparkles,
  RefreshCw,
  Copy,
  Layers,
  Target,
  Lightbulb,
  MessageSquare,
  PlayCircle,
  Hash
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { NavigationFlow } from '@/components/NavigationFlow';
import { FloatingNextButton } from '@/components/FloatingNextButton';
import { useLayout } from '@/contexts/LayoutContext';
import { useAuth } from '@/components/auth/AuthProvider';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useAppStore } from '@/store/useAppStore';
import { copperReelsGemini } from '@/lib/gemini';
import { toast } from 'sonner';
import { scraperManager } from '@/utils/scraperManager';
import { cn } from '@/lib/utils';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface YouTubeVideo {
  id: string;
  url: string;
  title?: string;
  channel?: string;
  views?: string;
  thumbnail?: string;
  duration?: string;
  publishedAt?: string;
  description?: string;
}

interface ScriptBrick {
  id: string;
  type: 'INTRO' | 'MIDDLE' | 'EXAMPLE' | 'APPLICATION' | 'OUTRO';
  title: string;
  content: string;
  duration: number;
  selected: boolean;
  editable: boolean;
  elements?: {
    hook?: string;
    problem?: string;
    value?: string;
    examples?: string[];
    cta?: string;
  };
}

interface TitleOption {
  id: string;
  text: string;
  score: number;
  selected: boolean;
}

interface ThumbnailOption {
  id: string;
  url: string;
  prompt: string;
  selected: boolean;
}

export default function VideoPlanning() {
  const navigate = useNavigate();
  const { hasSidebar } = useLayout();
  const { user } = useAuth();
  const { 
    selectedIdea, 
    currentScript,
    setCurrentScript,
    setCurrentStep,
    setLoading 
  } = useAppStore();

  const [activeTab, setActiveTab] = useState('research');
  const [youtubeLinks, setYoutubeLinks] = useState<YouTubeVideo[]>([]);
  const [newLink, setNewLink] = useState('');
  const [fetchingVideo, setFetchingVideo] = useState(false);
  const [scriptBricks, setScriptBricks] = useState<ScriptBrick[]>([]);
  const [titleOptions, setTitleOptions] = useState<TitleOption[]>([]);
  const [thumbnailOptions, setThumbnailOptions] = useState<ThumbnailOption[]>([]);
  const [generatingContent, setGeneratingContent] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState<TitleOption | null>(null);
  const [selectedThumbnail, setSelectedThumbnail] = useState<ThumbnailOption | null>(null);
  const [targetDuration, setTargetDuration] = useState<number>(5); // in minutes

  useEffect(() => {
    setCurrentStep('plan');
    
    // Debug: Log selectedIdea data
    console.log('VideoPlanning - selectedIdea:', selectedIdea);
    console.log('VideoPlanning - selectedIdea.concept:', selectedIdea?.concept);
    console.log('VideoPlanning - selectedIdea.title:', selectedIdea?.title);
    
    // Initialize script bricks
    if (!scriptBricks.length) {
      initializeScriptBricks();
    }
    
    // Generate titles and thumbnails
    if (selectedIdea && !titleOptions.length) {
      generateTitlesAndThumbnails();
    }
  }, [selectedIdea]);

  const initializeScriptBricks = () => {
    const defaultBricks: ScriptBrick[] = [
      {
        id: 'intro',
        type: 'INTRO',
        title: 'Intro Brick (0-30s)',
        content: 'Hook → Problem → Value Preview',
        duration: 30,
        selected: true,
        editable: true,
        elements: {
          hook: 'Start with a bold statement or question',
          problem: 'Identify the viewer\'s pain point',
          value: 'Preview what they\'ll learn'
        }
      },
      {
        id: 'problem',
        type: 'MIDDLE',
        title: 'Problem Agitation (30-60s)',
        content: 'Deepen the problem → Show consequences',
        duration: 30,
        selected: true,
        editable: true,
        elements: {
          examples: ['Common mistake #1', 'What happens if ignored', 'Real-world impact']
        }
      },
      {
        id: 'middle1',
        type: 'MIDDLE',
        title: 'Middle Brick 1 (60-180s)',
        content: 'Core content delivery',
        duration: 120,
        selected: true,
        editable: true,
        elements: {
          examples: ['Key point 1', 'Supporting evidence', 'Visual demonstration']
        }
      },
      {
        id: 'example',
        type: 'EXAMPLE',
        title: 'Example Brick (180-240s)',
        content: 'Real-world application',
        duration: 60,
        selected: true,
        editable: true,
        elements: {
          examples: ['Case study', 'Before/after', 'Step-by-step walkthrough']
        }
      },
      {
        id: 'application',
        type: 'APPLICATION',
        title: 'Application Brick (240-300s)',
        content: 'How viewers can apply this',
        duration: 60,
        selected: true,
        editable: true,
        elements: {
          examples: ['Action step 1', 'Action step 2', 'Quick win']
        }
      },
      {
        id: 'outro',
        type: 'OUTRO',
        title: 'Outro Brick (300-330s)',
        content: 'Recap → CTA → Next video',
        duration: 30,
        selected: true,
        editable: true,
        elements: {
          cta: 'Like, subscribe, and watch the next video'
        }
      }
    ];
    
    setScriptBricks(defaultBricks);
  };

  const fetchYouTubeVideo = async () => {
    if (!newLink) return;
    
    setFetchingVideo(true);
    
    try {
      // Extract video ID from URL
      const videoId = extractVideoId(newLink);
      if (!videoId) {
        toast.error('Invalid YouTube URL');
        return;
      }
      
      // Use YouTube scraper API
      try {
        const response = await fetch('http://localhost:3001/api/analyze-video', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url: newLink })
        });
        
        if (response.ok) {
          const realData = await response.json();
          
          const videoData: YouTubeVideo = {
            id: videoId,
            url: newLink,
            title: realData.title || `Video ${videoId}`,
            channel: realData.channel || 'Unknown Channel',
            views: realData.views || 'N/A',
            thumbnail: realData.thumbnail_url || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
            duration: realData.duration || 'N/A',
            publishedAt: realData.publishedAt || 'Unknown',
            description: realData.description || 'No description available'
          };
          
          setYoutubeLinks(prev => [...prev, videoData]);
          setNewLink('');
          toast.success('Video analyzed and added to research');
        } else {
          throw new Error('API request failed');
        }
      } catch (apiError) {
        console.log('YouTube scraper error:', apiError);
        
        // Fallback: Basic video data
        const videoData: YouTubeVideo = {
          id: videoId,
          url: newLink,
          title: `YouTube Video ${videoId}`,
          channel: 'Unknown Channel',
          views: 'N/A',
          thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
          duration: 'N/A',
          publishedAt: 'Unknown',
          description: 'Unable to fetch video details.'
        };
        
        setYoutubeLinks(prev => [...prev, videoData]);
        setNewLink('');
        toast.warning('Video added with limited data.');
      }
    } catch (error) {
      console.error('Failed to fetch video:', error);
      toast.error('Failed to fetch video information');
    } finally {
      setFetchingVideo(false);
    }
  };

  const extractVideoId = (url: string): string | null => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const generateTitlesAndThumbnails = async () => {
    if (!selectedIdea) return;
    
    setGeneratingContent(true);
    setLoading(true, 'Generating titles and thumbnails...');
    
    try {
      // Generate titles - use concept if available, otherwise fall back to title
      const ideaConcept = selectedIdea.concept || selectedIdea.title || 'Video Content';
      console.log('generateTitlesAndThumbnails - using ideaConcept:', ideaConcept);
      
      const titlesResponse = await copperReelsGemini.generateTitles({
        ideaConcept: ideaConcept,
        pillarName: selectedIdea.pillar,
        viewerType: 'LEARNER'
      });
      
      const titles: TitleOption[] = titlesResponse.titles.map((t, i) => ({
        id: `title-${i}`,
        text: t.text,
        score: t.score,
        selected: i === 0
      }));
      
      setTitleOptions(titles);
      setSelectedTitle(titles[0]);
      
      // Generate thumbnail options with unique URLs for regeneration
      const timestamp = Date.now();
      const randomSeed = Math.floor(Math.random() * 1000);
      
      const thumbnails: ThumbnailOption[] = [
        {
          id: `thumb-1-${timestamp}`,
          url: selectedIdea.thumbnail || '/placeholder.jpg',
          prompt: 'Original idea thumbnail',
          selected: true
        },
        {
          id: `thumb-2-${timestamp}`,
          url: `https://source.unsplash.com/1280x720/?${selectedIdea.concept}&sig=${randomSeed}`,
          prompt: 'Alternative style 1',
          selected: false
        },
        {
          id: `thumb-3-${timestamp}`,
          url: `https://source.unsplash.com/1280x720/?technology,${selectedIdea.pillar}&sig=${randomSeed + 1}`,
          prompt: 'Alternative style 2',
          selected: false
        },
        {
          id: `thumb-4-${timestamp}`,
          url: `https://source.unsplash.com/1280x720/?creative,${selectedIdea.concept}&sig=${randomSeed + 2}`,
          prompt: 'Creative variation',
          selected: false
        },
        {
          id: `thumb-5-${timestamp}`,
          url: `https://source.unsplash.com/1280x720/?modern,${selectedIdea.pillar}&sig=${randomSeed + 3}`,
          prompt: 'Modern style',
          selected: false
        }
      ];
      
      setThumbnailOptions(thumbnails);
      setSelectedThumbnail(thumbnails[0]);
      
      toast.success('Content generated successfully!');
    } catch (error) {
      console.error('Failed to generate content:', error);
      toast.error('Failed to generate content');
    } finally {
      setGeneratingContent(false);
      setLoading(false);
    }
  };

  const toggleBrick = (brickId: string) => {
    setScriptBricks(prev => 
      prev.map(brick => 
        brick.id === brickId 
          ? { ...brick, selected: !brick.selected }
          : brick
      )
    );
  };

  const updateBrickContent = (brickId: string, field: string, value: string) => {
    setScriptBricks(prev => 
      prev.map(brick => 
        brick.id === brickId 
          ? { 
              ...brick, 
              elements: { 
                ...brick.elements, 
                [field]: value 
              } 
            }
          : brick
      )
    );
  };

  const selectTitle = (title: TitleOption) => {
    setTitleOptions(prev => 
      prev.map(t => ({ ...t, selected: t.id === title.id }))
    );
    setSelectedTitle(title);
  };

  const selectThumbnail = (thumbnail: ThumbnailOption) => {
    setThumbnailOptions(prev => 
      prev.map(t => ({ ...t, selected: t.id === thumbnail.id }))
    );
    setSelectedThumbnail(thumbnail);
  };

  const proceedToScript = () => {
    // Save all selections
    const planData = {
      title: selectedTitle,
      thumbnail: selectedThumbnail,
      bricks: scriptBricks.filter(b => b.selected),
      research: youtubeLinks,
      targetDuration: targetDuration
    };
    
    setCurrentScript(planData);
    navigate('/script-builder');
  };

  const adjustScriptBricksForDuration = (targetDuration: number) => {
    const totalDuration = scriptBricks.reduce((acc, brick) => acc + brick.duration, 0);
    const ratio = targetDuration / totalDuration;
    setScriptBricks(prev => 
      prev.map(brick => ({ ...brick, duration: Math.floor(brick.duration * ratio) }))
    );
  };

  if (!selectedIdea) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center space-y-4">
          <Video className="w-16 h-16 text-muted-foreground mx-auto" />
          <h2 className="text-2xl font-bold">No Idea Selected</h2>
          <p className="text-muted-foreground">Please select an idea first</p>
          <Button onClick={() => navigate('/ideation')} className="bg-gradient-primary">
            Go to Ideas
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
          className="max-w-7xl mx-auto mt-8"
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Video Planning</h1>
            <p className="text-xl text-muted-foreground">
              Research, structure, and plan your video
            </p>
            
            {/* Selected Idea Summary */}
            <Card className="mt-4 p-4 bg-primary/5 border-primary/20">
              <div className="flex items-start gap-4">
                <div className="aspect-video w-32 bg-gradient-to-br from-primary/20 to-primary/10 rounded overflow-hidden">
                  {selectedIdea.thumbnail ? (
                    <img src={selectedIdea.thumbnail} alt={selectedIdea.concept} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Video className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{selectedIdea.concept}</h3>
                  <p className="text-sm text-muted-foreground">{selectedIdea.angle}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline">{selectedIdea.pillar}</Badge>
                    <Badge variant="secondary">CTR: {selectedIdea.ctrScore}%</Badge>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="research">
                <Youtube className="w-4 h-4 mr-2" />
                Research
              </TabsTrigger>
              <TabsTrigger value="structure">
                <Layers className="w-4 h-4 mr-2" />
                Structure
              </TabsTrigger>
              <TabsTrigger value="titles">
                <FileText className="w-4 h-4 mr-2" />
                Titles
              </TabsTrigger>
              <TabsTrigger value="thumbnails">
                <ImageIcon className="w-4 h-4 mr-2" />
                Thumbnails
              </TabsTrigger>
            </TabsList>

            {/* Research Tab - Skyscraper Method */}
            <TabsContent value="research" className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">Skyscraper Research</h2>
                <p className="text-muted-foreground mb-6">
                  Add YouTube videos for competitive analysis and inspiration
                </p>
                
                {/* Add Video Input */}
                <div className="flex gap-2 mb-6">
                  <Input
                    placeholder="Paste YouTube URL here..."
                    value={newLink}
                    onChange={(e) => setNewLink(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && fetchYouTubeVideo()}
                    className="flex-1"
                  />
                  <Button
                    onClick={fetchYouTubeVideo}
                    disabled={fetchingVideo}
                  >
                    {fetchingVideo ? (
                      <LoadingSpinner className="w-4 h-4" />
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Video
                      </>
                    )}
                  </Button>
                </div>
                
                {/* Video List */}
                <div className="space-y-4">
                  {youtubeLinks.map(video => (
                    <motion.div
                      key={video.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex gap-4">
                        <div className="aspect-video w-48 bg-muted rounded overflow-hidden flex-shrink-0">
                          {video.thumbnail ? (
                            <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Youtube className="w-8 h-8 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold">{video.title}</h4>
                          <p className="text-sm text-muted-foreground">{video.channel}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {video.views}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {video.duration}
                            </span>
                            <span>{video.publishedAt}</span>
                          </div>
                          {video.description && video.description !== "No description available" && (
                            <p className="text-sm mt-2 line-clamp-2">{video.description}</p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setYoutubeLinks(prev => prev.filter(v => v.id !== video.id))}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                  
                  {youtubeLinks.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Youtube className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No videos added yet</p>
                      <p className="text-sm mt-1">Add competitor videos to analyze</p>
                    </div>
                  )}
                </div>
              </Card>
            </TabsContent>

            {/* Structure Tab - Script Bricks */}
            <TabsContent value="structure" className="space-y-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold">Script Structure</h2>
                    <p className="text-muted-foreground">Select and customize your script blocks</p>
                  </div>
                  <Badge variant="outline" className="text-sm">
                    Total: {scriptBricks.filter(b => b.selected).reduce((acc, b) => acc + b.duration, 0)}s
                  </Badge>
                </div>
                
                <div className="space-y-4">
                  {scriptBricks.map((brick, index) => (
                    <motion.div
                      key={brick.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={cn(
                        "border rounded-lg p-4 transition-all",
                        brick.selected ? "border-primary bg-primary/5" : "border-muted opacity-60"
                      )}
                    >
                      <div className="flex items-start gap-4">
                        <button
                          onClick={() => toggleBrick(brick.id)}
                          className="mt-1"
                        >
                          {brick.selected ? (
                            <Check className="w-5 h-5 text-primary" />
                          ) : (
                            <div className="w-5 h-5 border-2 rounded" />
                          )}
                        </button>
                        
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold">{brick.title}</h4>
                              <p className="text-sm text-muted-foreground">{brick.content}</p>
                            </div>
                            <Badge variant="secondary">{brick.duration}s</Badge>
                          </div>
                          
                          {brick.selected && brick.elements && (
                            <div className="space-y-2 pl-4 border-l-2 border-primary/20">
                              {brick.elements.hook && (
                                <div>
                                  <Label className="text-xs">Hook</Label>
                                  <Input
                                    value={brick.elements.hook}
                                    onChange={(e) => updateBrickContent(brick.id, 'hook', e.target.value)}
                                    className="mt-1"
                                  />
                                </div>
                              )}
                              {brick.elements.problem && (
                                <div>
                                  <Label className="text-xs">Problem</Label>
                                  <Input
                                    value={brick.elements.problem}
                                    onChange={(e) => updateBrickContent(brick.id, 'problem', e.target.value)}
                                    className="mt-1"
                                  />
                                </div>
                              )}
                              {brick.elements.examples && (
                                <div>
                                  <Label className="text-xs">Key Points</Label>
                                  {brick.elements.examples.map((example, i) => (
                                    <Input
                                      key={i}
                                      value={example}
                                      onChange={(e) => {
                                        const newExamples = [...brick.elements.examples!];
                                        newExamples[i] = e.target.value;
                                        updateBrickContent(brick.id, 'examples', newExamples);
                                      }}
                                      className="mt-1"
                                      placeholder={`Point ${i + 1}`}
                                    />
                                  ))}
                                </div>
                              )}
                              {brick.elements.cta && (
                                <div>
                                  <Label className="text-xs">Call to Action</Label>
                                  <Input
                                    value={brick.elements.cta}
                                    onChange={(e) => updateBrickContent(brick.id, 'cta', e.target.value)}
                                    className="mt-1"
                                  />
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* Titles Tab */}
            <TabsContent value="titles" className="space-y-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Title Variations</h2>
                  <Button
                    variant="outline"
                    onClick={generateTitlesAndThumbnails}
                    disabled={generatingContent}
                  >
                    {generatingContent ? (
                      <LoadingSpinner className="w-4 h-4 mr-2" />
                    ) : (
                      <RefreshCw className="w-4 h-4 mr-2" />
                    )}
                    Regenerate
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {titleOptions.map(title => (
                    <motion.div
                      key={title.id}
                      whileHover={{ scale: 1.01 }}
                      onClick={() => selectTitle(title)}
                      className={cn(
                        "p-4 rounded-lg border-2 cursor-pointer transition-all",
                        title.selected 
                          ? "border-primary bg-primary/10" 
                          : "border-muted hover:border-muted-foreground"
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium">{title.text}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3 text-primary" />
                              <span className="text-xs text-muted-foreground">
                                Score: {(title.score * 100).toFixed(0)}%
                              </span>
                            </div>
                          </div>
                        </div>
                        {title.selected && (
                          <Check className="w-5 h-5 text-primary mt-1" />
                        )}
                      </div>
                    </motion.div>
                  ))}
                  
                  {titleOptions.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No titles generated yet</p>
                      <Button
                        onClick={generateTitlesAndThumbnails}
                        className="mt-3"
                        variant="outline"
                      >
                        Generate Titles
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            </TabsContent>

            {/* Thumbnails Tab */}
            <TabsContent value="thumbnails" className="space-y-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Thumbnail Options</h2>
                  <Button
                    variant="outline"
                    onClick={generateTitlesAndThumbnails}
                    disabled={generatingContent}
                  >
                    {generatingContent ? (
                      <LoadingSpinner className="w-4 h-4 mr-2" />
                    ) : (
                      <RefreshCw className="w-4 h-4 mr-2" />
                    )}
                    Regenerate
                  </Button>
                </div>
                
                <div className="grid md:grid-cols-3 gap-4">
                  {thumbnailOptions.map(thumbnail => (
                    <motion.div
                      key={thumbnail.id}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => selectThumbnail(thumbnail)}
                      className={cn(
                        "cursor-pointer transition-all rounded-lg overflow-hidden",
                        thumbnail.selected && "ring-2 ring-primary ring-offset-2"
                      )}
                    >
                      <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/10 relative">
                        {thumbnail.url ? (
                          <img 
                            src={thumbnail.url} 
                            alt={thumbnail.prompt}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-12 h-12 text-muted-foreground" />
                          </div>
                        )}
                        {thumbnail.selected && (
                          <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-2">
                            <Check className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                      <div className="p-3 bg-card">
                        <p className="text-sm text-muted-foreground">{thumbnail.prompt}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Summary Card */}
          <Card className="p-6 mt-8">
            <h3 className="font-semibold mb-4">Planning Summary</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <Label className="text-sm text-muted-foreground">Selected Title</Label>
                <p className="mt-1 font-medium">
                  {selectedTitle?.text || 'No title selected'}
                </p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Target Video Length</Label>
                <select 
                  value={targetDuration} 
                  onChange={(e) => {
                    const newDuration = parseInt(e.target.value);
                    setTargetDuration(newDuration);
                    adjustScriptBricksForDuration(newDuration);
                  }}
                  className="mt-1 w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                >
                  <option value={5}>5 minutes</option>
                  <option value={10}>10 minutes</option>
                  <option value={20}>20 minutes</option>
                </select>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Research Videos</Label>
                <p className="mt-1 font-medium">{youtubeLinks.length} videos</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
      
      {/* Navigation Flow - only show when sidebar is not present */}
      <NavigationFlow
        canProceed={selectedTitle !== null && selectedThumbnail !== null}
        nextLabel="Build Script"
        onNext={proceedToScript}
      />
      
      {/* Floating Next Button - show for authenticated users */}
      {user && (
        <FloatingNextButton
          show={selectedTitle !== null && selectedThumbnail !== null}
          onClick={proceedToScript}
          label="Build Script"
          nextPath="/script-builder"
        />
      )}
    </div>
  );
}
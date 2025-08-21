import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Search, 
  TrendingUp, 
  Eye, 
  ThumbsUp, 
  MessageSquare,
  Clock,
  BarChart3,
  Download,
  ExternalLink,
  Sparkles,
  Filter,
  Copy,
  Loader2,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { copperReelsGemini } from '@/lib/gemini';

interface VideoAnalysis {
  id: string;
  title: string;
  url: string;
  channel: string;
  views: string;
  likes: string;
  comments: string;
  duration: string;
  publishedAt: string;
  thumbnail: string;
  outlierScore: number;
  keyInsights: string[];
  gaps: string[];
  hooks: string[];
  contentStructure: string[];
}

interface SkyscraperAnalysisProps {
  onInsightsGenerated?: (insights: any) => void;
}

export function SkyscraperAnalysis({ onInsightsGenerated }: SkyscraperAnalysisProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [videos, setVideos] = useState<VideoAnalysis[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<VideoAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [filterBy, setFilterBy] = useState<'all' | 'outliers' | 'recent'>('all');

  const analyzeYouTubeSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a search topic');
      return;
    }

    setIsAnalyzing(true);
    try {
      // Simulate YouTube API search (in real implementation, use YouTube Data API)
      const mockVideos: VideoAnalysis[] = [
        {
          id: '1',
          title: `How to ${searchQuery} - Complete Guide 2024`,
          url: 'https://youtube.com/watch?v=abc123',
          channel: 'Expert Channel',
          views: '2.5M',
          likes: '125K',
          comments: '8.2K',
          duration: '12:34',
          publishedAt: '2 weeks ago',
          thumbnail: '/api/placeholder/320/180',
          outlierScore: 95,
          keyInsights: [
            'Uses pattern interrupt in first 5 seconds',
            'Story-driven introduction',
            'Clear 3-step framework',
            'Strong social proof throughout'
          ],
          gaps: [
            'No beginner-friendly explanation',
            'Missing tool recommendations',
            'Lacks troubleshooting section'
          ],
          hooks: [
            'Controversial statement opener',
            'Promise of 10x results',
            'Celebrity endorsement mention'
          ],
          contentStructure: [
            'Hook (0:00-0:15)',
            'Problem Agitation (0:15-1:00)',
            'Solution Preview (1:00-1:30)',
            'Main Content (1:30-10:00)',
            'Examples (10:00-11:30)',
            'CTA (11:30-12:34)'
          ]
        },
        {
          id: '2',
          title: `${searchQuery} Mistakes Everyone Makes`,
          url: 'https://youtube.com/watch?v=def456',
          channel: 'Growth Hacker',
          views: '850K',
          likes: '42K',
          comments: '3.1K',
          duration: '8:45',
          publishedAt: '1 month ago',
          thumbnail: '/api/placeholder/320/180',
          outlierScore: 78,
          keyInsights: [
            'Negative angle drives curiosity',
            'Quick pace maintains retention',
            'Uses viewer comments as content',
            'Multiple visual examples'
          ],
          gaps: [
            'No positive alternative solutions',
            'Limited actionable advice',
            'Missing case studies'
          ],
          hooks: [
            'Fear-based opening',
            'Common myth debunking',
            'Unexpected statistics'
          ],
          contentStructure: [
            'Shocking statement (0:00-0:10)',
            'Mistake #1 (0:10-2:30)',
            'Mistake #2 (2:30-5:00)',
            'Mistake #3 (5:00-7:30)',
            'Solution teaser (7:30-8:45)'
          ]
        },
        {
          id: '3',
          title: `The Truth About ${searchQuery} No One Tells You`,
          url: 'https://youtube.com/watch?v=ghi789',
          channel: 'Industry Insider',
          views: '3.8M',
          likes: '189K',
          comments: '12.5K',
          duration: '15:20',
          publishedAt: '3 days ago',
          thumbnail: '/api/placeholder/320/180',
          outlierScore: 98,
          keyInsights: [
            'Contrarian viewpoint',
            'Industry insider perspective',
            'Data-driven arguments',
            'Emotional storytelling'
          ],
          gaps: [
            'Too advanced for beginners',
            'Lacks step-by-step guide',
            'No resource links'
          ],
          hooks: [
            'Industry secret reveal',
            'Personal failure story',
            'Billion-dollar case study'
          ],
          contentStructure: [
            'Insider hook (0:00-0:20)',
            'Background story (0:20-2:00)',
            'Truth #1 (2:00-6:00)',
            'Truth #2 (6:00-10:00)',
            'Truth #3 (10:00-14:00)',
            'Action steps (14:00-15:20)'
          ]
        }
      ];

      // Add more realistic data
      for (let i = 4; i <= 10; i++) {
        mockVideos.push({
          id: i.toString(),
          title: `${searchQuery} Tutorial - Part ${i}`,
          url: `https://youtube.com/watch?v=video${i}`,
          channel: `Creator ${i}`,
          views: `${Math.floor(Math.random() * 900 + 100)}K`,
          likes: `${Math.floor(Math.random() * 50 + 10)}K`,
          comments: `${Math.floor(Math.random() * 5000 + 500)}`,
          duration: `${Math.floor(Math.random() * 10 + 5)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
          publishedAt: `${Math.floor(Math.random() * 30 + 1)} days ago`,
          thumbnail: '/api/placeholder/320/180',
          outlierScore: Math.floor(Math.random() * 40 + 40),
          keyInsights: [
            'Standard tutorial format',
            'Good audio quality',
            'Clear explanations'
          ],
          gaps: [
            'Needs better hooks',
            'Missing engagement elements',
            'Could use more examples'
          ],
          hooks: [
            'Basic promise statement',
            'Tutorial announcement'
          ],
          contentStructure: [
            'Introduction',
            'Main content',
            'Conclusion'
          ]
        });
      }

      setVideos(mockVideos);
      toast.success(`Analyzed top 10 videos for "${searchQuery}"`);

      // Generate insights
      const insights = {
        topPatterns: [
          'Negative angles outperform positive by 3x',
          'Videos under 10 minutes have 2x higher retention',
          'Personal stories in intro increase watch time by 40%'
        ],
        contentGaps: [
          'No comprehensive beginner guides',
          'Missing troubleshooting content',
          'Lack of case studies from small creators'
        ],
        winningFormulas: [
          'Hook + Problem + 3 Solutions + CTA',
          'Mistake-based content with solutions',
          'Insider secrets narrative structure'
        ]
      };

      if (onInsightsGenerated) {
        onInsightsGenerated(insights);
      }
    } catch (error) {
      toast.error('Failed to analyze YouTube results');
      console.error('Skyscraper analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getFilteredVideos = () => {
    switch (filterBy) {
      case 'outliers':
        return videos.filter(v => v.outlierScore >= 80);
      case 'recent':
        return videos.filter(v => v.publishedAt.includes('day') || v.publishedAt.includes('week'));
      default:
        return videos;
    }
  };

  const copyInsights = (video: VideoAnalysis) => {
    const insights = `
Title: ${video.title}
Channel: ${video.channel}
Performance: ${video.views} views, ${video.likes} likes

Key Insights:
${video.keyInsights.map(i => `- ${i}`).join('\n')}

Content Gaps:
${video.gaps.map(g => `- ${g}`).join('\n')}

Winning Hooks:
${video.hooks.map(h => `- ${h}`).join('\n')}

Structure:
${video.contentStructure.map(s => `- ${s}`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(insights);
    toast.success('Insights copied to clipboard');
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">Skyscraper Analysis</h2>
            <p className="text-muted-foreground">
              Analyze top-performing YouTube videos to find patterns and content gaps
            </p>
          </div>

          <div className="flex gap-3">
            <Input
              placeholder="Enter your topic (e.g., 'how to grow on YouTube')"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && analyzeYouTubeSearch()}
              className="flex-1"
            />
            <Button
              onClick={analyzeYouTubeSearch}
              disabled={isAnalyzing}
              className="min-w-[140px]"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Analyze Top 10
                </>
              )}
            </Button>
          </div>

          {videos.length > 0 && (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={filterBy === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterBy('all')}
              >
                All Videos ({videos.length})
              </Button>
              <Button
                size="sm"
                variant={filterBy === 'outliers' ? 'default' : 'outline'}
                onClick={() => setFilterBy('outliers')}
              >
                <TrendingUp className="w-4 h-4 mr-1" />
                Outliers ({videos.filter(v => v.outlierScore >= 80).length})
              </Button>
              <Button
                size="sm"
                variant={filterBy === 'recent' ? 'default' : 'outline'}
                onClick={() => setFilterBy('recent')}
              >
                <Clock className="w-4 h-4 mr-1" />
                Recent
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Results */}
      {videos.length > 0 && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Video List */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Analyzed Videos</h3>
            <ScrollArea className="h-[600px]">
              <div className="space-y-3">
                {getFilteredVideos().map((video) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedVideo?.id === video.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedVideo(video)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm line-clamp-2 flex-1">
                        {video.title}
                      </h4>
                      {video.outlierScore >= 80 && (
                        <Badge variant="secondary" className="ml-2 shrink-0">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Outlier
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {video.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3" />
                        {video.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        {video.comments}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {video.duration}
                      </span>
                    </div>

                    <div className="mt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{video.channel}</span>
                        <span className="text-xs text-muted-foreground">{video.publishedAt}</span>
                      </div>
                      <div className="mt-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium">Performance Score:</span>
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all ${
                                video.outlierScore >= 80 ? 'bg-green-500' :
                                video.outlierScore >= 60 ? 'bg-yellow-500' :
                                'bg-gray-400'
                              }`}
                              style={{ width: `${video.outlierScore}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium">{video.outlierScore}%</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </Card>

          {/* Detailed Analysis */}
          <Card className="p-6">
            {selectedVideo ? (
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{selectedVideo.title}</h3>
                    <p className="text-sm text-muted-foreground">{selectedVideo.channel}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyInsights(selectedVideo)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(selectedVideo.url, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="insights">Insights</TabsTrigger>
                    <TabsTrigger value="gaps">Gaps</TabsTrigger>
                    <TabsTrigger value="structure">Structure</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Views</span>
                          <span className="font-medium">{selectedVideo.views}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Likes</span>
                          <span className="font-medium">{selectedVideo.likes}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Comments</span>
                          <span className="font-medium">{selectedVideo.comments}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Duration</span>
                          <span className="font-medium">{selectedVideo.duration}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Published</span>
                          <span className="font-medium">{selectedVideo.publishedAt}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Score</span>
                          <Badge variant={selectedVideo.outlierScore >= 80 ? 'default' : 'secondary'}>
                            {selectedVideo.outlierScore}%
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Winning Hooks</h4>
                      <div className="space-y-2">
                        {selectedVideo.hooks.map((hook, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                            <span className="text-sm">{hook}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="insights" className="space-y-3">
                    <h4 className="font-medium">Key Success Factors</h4>
                    {selectedVideo.keyInsights.map((insight, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-yellow-500 mt-0.5" />
                        <span className="text-sm">{insight}</span>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="gaps" className="space-y-3">
                    <h4 className="font-medium">Content Opportunities</h4>
                    {selectedVideo.gaps.map((gap, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5" />
                        <span className="text-sm">{gap}</span>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="structure" className="space-y-3">
                    <h4 className="font-medium">Content Structure</h4>
                    {selectedVideo.contentStructure.map((section, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </div>
                        <span className="text-sm">{section}</span>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Select a video to see detailed analysis</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
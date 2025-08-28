import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { 
  Search, 
  TrendingUp, 
  FileText, 
  Edit3, 
  CheckCircle2, 
  Send, 
  Download,
  Sparkles,
  Target,
  BarChart3,
  Clock,
  Hash,
  Link2,
  Eye,
  Copy,
  FileCode,
  FileDown,
  ChevronRight,
  Info,
  AlertCircle,
  Check,
  X,
  Loader2,
  BookOpen,
  Zap,
  Globe,
  PenTool
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  generateBlogPost, 
  analyzeKeywords, 
  optimizeSEO, 
  generateMetadata,
  analyzeSERP,
  extractCommonWords
} from '@/lib/blog/blogService';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface Keyword {
  term: string;
  searchVolume: number;
  difficulty: number;
  cpc?: number;
  trend?: 'rising' | 'stable' | 'declining';
  selected?: boolean;
}

interface BlogPost {
  id?: string;
  title: string;
  content: string;
  keywords: Keyword[];
  metadata: {
    metaTitle: string;
    metaDescription: string;
    slug: string;
    tags: string[];
    category?: string;
  };
  seo: {
    score: number;
    keywordDensity: number;
    readabilityScore: number;
    wordCount: number;
    headingsStructure: boolean;
    internalLinks: number;
    externalLinks: number;
    keywordInH1?: boolean;
    keywordInSubheaders?: number;
    totalKeywordCount?: number;
    optimizationScore?: number;
  };
  status: 'draft' | 'optimizing' | 'review' | 'approved' | 'published';
  createdAt?: Date;
  updatedAt?: Date;
}

interface SERPData {
  topResults: Array<{
    title: string;
    description: string;
    url: string;
  }>;
  commonWords: string[];
  averageWordCount: number;
  commonTopics: string[];
  contentStructure: string[];
}

const BlogWriter: React.FC = () => {
  const { toast } = useToast();
  const [currentStage, setCurrentStage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  
  // Stage 1: Keyword Research
  const [topicInput, setTopicInput] = useState('');
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [selectedKeyword, setSelectedKeyword] = useState<Keyword | null>(null);
  const [serpData, setSerpData] = useState<SERPData | null>(null);
  const [commonWords, setCommonWords] = useState<string[]>([]);
  
  // Stage 2: Content Generation
  const [generatedContent, setGeneratedContent] = useState('');
  const [contentLength, setContentLength] = useState(1500);
  const [tone, setTone] = useState<'professional' | 'casual' | 'academic' | 'conversational'>('professional');
  
  // Stage 3: SEO Optimization
  const [seoScore, setSeoScore] = useState(0);
  const [optimizationSuggestions, setOptimizationSuggestions] = useState<string[]>([]);
  
  // Stage 4: Review & Edit
  const [editedContent, setEditedContent] = useState('');
  const [approvalStatus, setApprovalStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
  
  // Stage 5: Export & Publishing
  const [exportFormat, setExportFormat] = useState<'markdown' | 'html' | 'wordpress'>('markdown');

  const stages = [
    { id: 1, name: 'Keyword Research', icon: Search, description: 'Find high-impact keywords' },
    { id: 2, name: 'Content Generation', icon: FileText, description: 'AI-powered blog creation' },
    { id: 3, name: 'SEO Optimization', icon: TrendingUp, description: 'Optimize for search engines' },
    { id: 4, name: 'Review & Edit', icon: Edit3, description: 'Human review and approval' },
    { id: 5, name: 'Export & Publish', icon: Send, description: 'Export in multiple formats' },
    { id: 6, name: 'Track & Monitor', icon: BarChart3, description: 'Monitor performance' }
  ];

  // Keyword Research Handler with SERP Analysis
  const handleKeywordResearch = async () => {
    if (!topicInput.trim()) {
      toast({
        title: "Topic Required",
        description: "Please enter a topic to research keywords.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Analyze keywords
      const keywordResult = await analyzeKeywords(topicInput);
      setKeywords(keywordResult);
      
      // Analyze SERP for the main topic
      const serpResult = await analyzeSERP(topicInput);
      setSerpData(serpResult);
      
      // Extract common words from SERP data
      const words = await extractCommonWords(serpResult, topicInput);
      setCommonWords(words);
      
      toast({
        title: "Research Complete",
        description: `Found ${keywordResult.length} keywords and analyzed top 20 SERP results`,
      });
    } catch (error) {
      console.error('Keyword research error:', error);
      toast({
        title: "Research Failed",
        description: "Failed to fetch keyword data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle keyword selection and SERP analysis for specific keyword
  const handleKeywordSelection = async (keyword: Keyword) => {
    setSelectedKeyword(keyword);
    
    // If keyword is different from original topic, analyze SERP for it
    if (keyword.term !== topicInput) {
      setIsLoading(true);
      try {
        const serpResult = await analyzeSERP(keyword.term);
        setSerpData(serpResult);
        const words = await extractCommonWords(serpResult, keyword.term);
        setCommonWords(words);
      } catch (error) {
        console.error('SERP analysis error:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Content Generation Handler with SERP Data
  const handleGenerateContent = async () => {
    if (!selectedKeyword) {
      toast({
        title: "Keyword Required",
        description: "Please select a keyword first.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Ensure we have SERP data for the selected keyword
      let currentSerpData = serpData;
      let currentCommonWords = commonWords;
      
      if (!currentSerpData || (selectedKeyword.term !== topicInput && !serpData)) {
        const serpResult = await analyzeSERP(selectedKeyword.term);
        setSerpData(serpResult);
        currentSerpData = serpResult;
        
        const words = await extractCommonWords(serpResult, selectedKeyword.term);
        setCommonWords(words);
        currentCommonWords = words;
      }
      
      // Generate content with SERP data
      const content = await generateBlogPost({
        keyword: selectedKeyword.term,
        length: Math.max(1500, contentLength), // Ensure minimum 1500 words
        tone: tone,
        includeHeaders: true,
        includeSections: true,
        serpData: currentSerpData || undefined,
        commonWords: currentCommonWords || undefined
      });
      
      // Validate word count
      const wordCount = content.split(/\s+/).length;
      if (wordCount < 1500) {
        toast({
          title: "Content Too Short",
          description: `Generated only ${wordCount} words. Minimum 1500 required. Retrying...`,
          variant: "destructive"
        });
        // Retry with explicit length requirement
        const retryContent = await generateBlogPost({
          keyword: selectedKeyword.term,
          length: 2000,
          tone: tone,
          includeHeaders: true,
          includeSections: true,
          serpData: currentSerpData || undefined,
          commonWords: currentCommonWords || undefined
        });
        setGeneratedContent(retryContent);
        setEditedContent(retryContent);
      } else {
        setGeneratedContent(content);
        setEditedContent(content);
      }
      
      // Auto-generate metadata
      const metadata = await generateMetadata(editedContent || content, selectedKeyword.term);
      
      setBlogPost({
        title: metadata.title,
        content: editedContent || content,
        keywords: [selectedKeyword],
        metadata: {
          metaTitle: metadata.metaTitle,
          metaDescription: metadata.metaDescription,
          slug: metadata.slug,
          tags: metadata.tags,
          category: metadata.category
        },
        seo: {
          score: 0,
          keywordDensity: 0,
          readabilityScore: 0,
          wordCount: (editedContent || content).split(/\s+/).length,
          headingsStructure: true,
          internalLinks: 0,
          externalLinks: 0
        },
        status: 'draft'
      });
      
      toast({
        title: "Content Generated Successfully",
        description: `Generated ${(editedContent || content).split(/\s+/).length} words using SERP data from top 20 results`,
      });
      
      // Auto-run SEO analysis
      setTimeout(() => handleSEOOptimization(), 1000);
      setCurrentStage(3);
    } catch (error) {
      console.error('Content generation error:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // SEO Optimization Handler with Enhanced Rules
  const handleSEOOptimization = async () => {
    if (!blogPost || !editedContent) return;
    
    setIsLoading(true);
    try {
      const optimization = await optimizeSEO(editedContent, selectedKeyword?.term || '');
      
      setSeoScore(optimization.optimizationScore || optimization.score);
      setOptimizationSuggestions(optimization.suggestions);
      
      setBlogPost({
        ...blogPost,
        content: editedContent,
        seo: {
          ...blogPost.seo,
          score: optimization.optimizationScore || optimization.score,
          keywordDensity: optimization.keywordDensity,
          readabilityScore: optimization.readabilityScore,
          wordCount: optimization.wordCount,
          keywordInH1: optimization.keywordInH1,
          keywordInSubheaders: optimization.keywordInSubheaders,
          totalKeywordCount: optimization.totalKeywordCount,
          optimizationScore: optimization.optimizationScore
        },
        status: 'optimizing'
      });
      
      // Check if optimization meets Frase-like 90% requirement
      const score = optimization.optimizationScore || optimization.score;
      if (score >= 90) {
        toast({
          title: "✅ Excellent SEO Score!",
          description: `Score: ${score}/100 - Content is highly optimized`,
        });
      } else if (score >= 70) {
        toast({
          title: "🔶 Good SEO Score",
          description: `Score: ${score}/100 - Some improvements recommended`,
        });
      } else {
        toast({
          title: "⚠️ SEO Needs Improvement",
          description: `Score: ${score}/100 - Follow suggestions to reach 90%+`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('SEO optimization error:', error);
      toast({
        title: "Optimization Failed",
        description: "Failed to analyze SEO. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Export Handler
  const handleExport = (format: 'markdown' | 'html' | 'wordpress') => {
    if (!blogPost) return;
    
    let content = '';
    let filename = '';
    let mimeType = '';
    
    switch (format) {
      case 'markdown':
        content = convertToMarkdown(blogPost);
        filename = `${blogPost.metadata.slug}.md`;
        mimeType = 'text/markdown';
        break;
      case 'html':
        content = convertToHTML(blogPost);
        filename = `${blogPost.metadata.slug}.html`;
        mimeType = 'text/html';
        break;
      case 'wordpress':
        content = convertToWordPress(blogPost);
        filename = `${blogPost.metadata.slug}.xml`;
        mimeType = 'application/xml';
        break;
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export Successful",
      description: `Blog post exported as ${format.toUpperCase()}`,
    });
  };

  // Format Converters
  const convertToMarkdown = (post: BlogPost): string => {
    let md = `# ${post.title}\n\n`;
    md += `> ${post.metadata.metaDescription}\n\n`;
    md += `**Keywords:** ${post.keywords.map(k => k.term).join(', ')}\n\n`;
    md += `**Tags:** ${post.metadata.tags.join(', ')}\n\n`;
    md += `---\n\n`;
    md += post.content;
    return md;
  };

  const convertToHTML = (post: BlogPost): string => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${post.metadata.metaTitle}</title>
    <meta name="description" content="${post.metadata.metaDescription}">
    <meta name="keywords" content="${post.keywords.map(k => k.term).join(', ')}">
</head>
<body>
    <article>
        <h1>${post.title}</h1>
        ${post.content.replace(/\n/g, '<br>')}
    </article>
</body>
</html>`;
  };

  const convertToWordPress = (post: BlogPost): string => {
    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
    xmlns:content="http://purl.org/rss/1.0/modules/content/"
    xmlns:wp="http://wordpress.org/export/1.2/">
<channel>
    <item>
        <title>${post.title}</title>
        <content:encoded><![CDATA[${post.content}]]></content:encoded>
        <wp:post_type>post</wp:post_type>
        <wp:status>${post.status === 'approved' ? 'publish' : 'draft'}</wp:status>
        <category>${post.metadata.category || 'Uncategorized'}</category>
        ${post.metadata.tags.map(tag => `<category domain="post_tag">${tag}</category>`).join('\n        ')}
    </item>
</channel>
</rss>`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <PenTool className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Blog Post Writer
              </h1>
              <p className="text-muted-foreground mt-1">
                Create SEO-optimized blog posts with AI assistance
              </p>
            </div>
          </div>
        </motion.div>

        {/* Progress Indicator */}
        <Card className="mb-8 border-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              {stages.map((stage, index) => (
                <div key={stage.id} className="flex items-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={cn(
                      "flex flex-col items-center",
                      currentStage === stage.id && "scale-110"
                    )}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center transition-all",
                      currentStage > stage.id 
                        ? "bg-primary text-primary-foreground" 
                        : currentStage === stage.id
                        ? "bg-primary/20 text-primary border-2 border-primary"
                        : "bg-muted text-muted-foreground"
                    )}>
                      {currentStage > stage.id ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : (
                        <stage.icon className="w-5 h-5" />
                      )}
                    </div>
                    <span className={cn(
                      "text-xs mt-2 font-medium",
                      currentStage >= stage.id ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {stage.name}
                    </span>
                  </motion.div>
                  {index < stages.length - 1 && (
                    <div className={cn(
                      "h-[2px] w-full mx-2",
                      currentStage > stage.id ? "bg-primary" : "bg-muted"
                    )} />
                  )}
                </div>
              ))}
            </div>
            <Progress value={(currentStage / stages.length) * 100} className="h-2" />
          </CardContent>
        </Card>

        {/* Stage Content */}
        <AnimatePresence mode="wait">
          {/* Stage 1: Keyword Research */}
          {currentStage === 1 && (
            <motion.div
              key="stage1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    Keyword Research
                  </CardTitle>
                  <CardDescription>
                    Enter a topic to discover high-impact keywords with search volume and difficulty analysis
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="topic">Topic or Phrase</Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          id="topic"
                          placeholder="e.g., sustainable fashion, AI in healthcare, remote work tips..."
                          value={topicInput}
                          onChange={(e) => setTopicInput(e.target.value)}
                          className="flex-1"
                          onKeyPress={(e) => e.key === 'Enter' && handleKeywordResearch()}
                        />
                        <Button 
                          onClick={handleKeywordResearch}
                          disabled={isLoading || !topicInput.trim()}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Researching
                            </>
                          ) : (
                            <>
                              <Search className="w-4 h-4 mr-2" />
                              Research
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    {keywords.length > 0 && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-semibold">
                            Found {keywords.length} Keywords
                          </h3>
                          <Badge variant="outline">
                            Select one with optimal difficulty/volume ratio
                          </Badge>
                        </div>
                        
                        <ScrollArea className="h-[400px] rounded-lg border p-4">
                          <div className="space-y-3">
                            {keywords.map((keyword, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                              >
                                <Card 
                                  className={cn(
                                    "cursor-pointer transition-all hover:shadow-md",
                                    selectedKeyword?.term === keyword.term && "border-primary bg-primary/5"
                                  )}
                                  onClick={() => handleKeywordSelection(keyword)}
                                >
                                  <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                          <span className="font-medium">{keyword.term}</span>
                                          {keyword.trend && (
                                            <Badge variant={
                                              keyword.trend === 'rising' ? 'default' : 
                                              keyword.trend === 'declining' ? 'destructive' : 
                                              'secondary'
                                            }>
                                              {keyword.trend}
                                            </Badge>
                                          )}
                                        </div>
                                        <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                                          <span className="flex items-center gap-1">
                                            <TrendingUp className="w-3 h-3" />
                                            {keyword.searchVolume.toLocaleString()} searches/mo
                                          </span>
                                          <span className="flex items-center gap-1">
                                            <Target className="w-3 h-3" />
                                            {keyword.difficulty}% difficulty
                                          </span>
                                          {keyword.cpc && (
                                            <span className="flex items-center gap-1">
                                              <Hash className="w-3 h-3" />
                                              ${keyword.cpc} CPC
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                      {selectedKeyword?.term === keyword.term && (
                                        <CheckCircle2 className="w-5 h-5 text-primary" />
                                      )}
                                    </div>
                                  </CardContent>
                                </Card>
                              </motion.div>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    )}
                    
                    {/* SERP Analysis Display */}
                    {serpData && selectedKeyword && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4 mt-6"
                      >
                        <Alert className="bg-blue-50 border-blue-200">
                          <Globe className="w-4 h-4 text-blue-600" />
                          <AlertDescription className="text-blue-800">
                            <strong>SERP Analysis:</strong> Analyzed top 20 Google results for competitive insights
                          </AlertDescription>
                        </Alert>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Card className="bg-muted/50">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm font-semibold">Common Topics</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                              <div className="flex flex-wrap gap-2">
                                {serpData.commonTopics?.slice(0, 6).map((topic, i) => (
                                  <Badge key={i} variant="secondary" className="text-xs">
                                    {topic}
                                  </Badge>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-muted/50">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm font-semibold">Content Insights</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Avg. Word Count:</span>
                                  <span className="font-medium">{serpData.averageWordCount}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Top Results:</span>
                                  <span className="font-medium">{serpData.topResults?.length || 0}</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                        
                        {commonWords.length > 0 && (
                          <Card className="bg-muted/50">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm font-semibold">Common Words in Top Results</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                              <div className="flex flex-wrap gap-1">
                                {commonWords.slice(0, 15).map((word, i) => (
                                  <Badge key={i} variant="outline" className="text-xs">
                                    {word}
                                  </Badge>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </motion.div>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <Button 
                      onClick={() => setCurrentStage(2)}
                      disabled={!selectedKeyword}
                      size="lg"
                    >
                      Continue to Content Generation
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Stage 2: Content Generation */}
          {currentStage === 2 && (
            <motion.div
              key="stage2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Content Generation
                  </CardTitle>
                  <CardDescription>
                    Configure and generate your blog post with AI
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {selectedKeyword && (
                    <Alert>
                      <Target className="w-4 h-4" />
                      <AlertDescription>
                        Generating content for: <strong>{selectedKeyword.term}</strong>
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="length">Content Length</Label>
                        <div className="flex items-center gap-4 mt-2">
                          <Slider
                            id="length"
                            value={[contentLength]}
                            onValueChange={(value) => setContentLength(value[0])}
                            min={500}
                            max={3000}
                            step={100}
                            className="flex-1"
                          />
                          <span className="text-sm font-medium w-20 text-right">
                            {contentLength} words
                          </span>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="tone">Writing Tone</Label>
                        <Select value={tone} onValueChange={(value: any) => setTone(value)}>
                          <SelectTrigger className="mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="professional">Professional</SelectItem>
                            <SelectItem value="casual">Casual</SelectItem>
                            <SelectItem value="academic">Academic</SelectItem>
                            <SelectItem value="conversational">Conversational</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Card className="bg-muted/50">
                        <CardContent className="p-4 space-y-2">
                          <h4 className="text-sm font-semibold">Content Structure</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-primary" />
                              <span>H1-H5 Headers</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-primary" />
                              <span>Paragraphs & Bullet Points</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-primary" />
                              <span>SEO-Optimized Structure</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-primary" />
                              <span>Meta Tags Generation</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button 
                      variant="outline"
                      onClick={() => setCurrentStage(1)}
                    >
                      Back to Keywords
                    </Button>
                    <Button 
                      onClick={handleGenerateContent}
                      disabled={isLoading}
                      size="lg"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Generate Blog Post
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Stage 3: SEO Optimization */}
          {currentStage === 3 && (
            <motion.div
              key="stage3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card className="border-2">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        SEO Optimization
                      </CardTitle>
                      <CardDescription>
                        Optimize your content for search engines
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="content" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="content">Content</TabsTrigger>
                          <TabsTrigger value="metadata">Metadata</TabsTrigger>
                          <TabsTrigger value="preview">Preview</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="content" className="space-y-4">
                          <ScrollArea className="h-[500px] rounded-lg border p-4">
                            <Textarea
                              value={editedContent}
                              onChange={(e) => setEditedContent(e.target.value)}
                              className="min-h-[480px] border-0 focus-visible:ring-0"
                              placeholder="Your blog content will appear here..."
                            />
                          </ScrollArea>
                        </TabsContent>
                        
                        <TabsContent value="metadata" className="space-y-4">
                          {blogPost && (
                            <div className="space-y-4">
                              <div>
                                <Label>Meta Title</Label>
                                <Input 
                                  value={blogPost.metadata.metaTitle}
                                  onChange={(e) => setBlogPost({
                                    ...blogPost,
                                    metadata: { ...blogPost.metadata, metaTitle: e.target.value }
                                  })}
                                  className="mt-2"
                                />
                                <span className="text-xs text-muted-foreground">
                                  {blogPost.metadata.metaTitle.length}/60 characters
                                </span>
                              </div>
                              
                              <div>
                                <Label>Meta Description</Label>
                                <Textarea 
                                  value={blogPost.metadata.metaDescription}
                                  onChange={(e) => setBlogPost({
                                    ...blogPost,
                                    metadata: { ...blogPost.metadata, metaDescription: e.target.value }
                                  })}
                                  className="mt-2"
                                  rows={3}
                                />
                                <span className="text-xs text-muted-foreground">
                                  {blogPost.metadata.metaDescription.length}/160 characters
                                </span>
                              </div>
                              
                              <div>
                                <Label>URL Slug</Label>
                                <Input 
                                  value={blogPost.metadata.slug}
                                  onChange={(e) => setBlogPost({
                                    ...blogPost,
                                    metadata: { ...blogPost.metadata, slug: e.target.value }
                                  })}
                                  className="mt-2"
                                />
                              </div>
                              
                              <div>
                                <Label>Tags (comma-separated)</Label>
                                <Input 
                                  value={blogPost.metadata.tags.join(', ')}
                                  onChange={(e) => setBlogPost({
                                    ...blogPost,
                                    metadata: { ...blogPost.metadata, tags: e.target.value.split(',').map(t => t.trim()) }
                                  })}
                                  className="mt-2"
                                />
                              </div>
                            </div>
                          )}
                        </TabsContent>
                        
                        <TabsContent value="preview" className="space-y-4">
                          <Card className="bg-muted/50">
                            <CardContent className="p-4">
                              <div className="space-y-2">
                                <h3 className="text-lg font-semibold text-blue-600">
                                  {blogPost?.metadata.metaTitle || 'Blog Post Title'}
                                </h3>
                                <p className="text-sm text-green-600">
                                  https://yourdomain.com/blog/{blogPost?.metadata.slug || 'url-slug'}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {blogPost?.metadata.metaDescription || 'Meta description will appear here...'}
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  {/* SEO Score Card with Frase-like Optimization */}
                  <Card className="border-2">
                    <CardHeader>
                      <CardTitle className="text-lg">SEO Optimization Score</CardTitle>
                      <CardDescription>Target: 90%+ for optimal results</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="relative">
                        <div className={cn(
                          "text-4xl font-bold text-center",
                          seoScore >= 90 ? "text-green-600" : 
                          seoScore >= 70 ? "text-amber-600" : 
                          "text-red-600"
                        )}>
                          {seoScore}/100
                        </div>
                        <Progress 
                          value={seoScore} 
                          className={cn(
                            "mt-2 h-3",
                            seoScore >= 90 ? "[&>div]:bg-green-600" : 
                            seoScore >= 70 ? "[&>div]:bg-amber-600" : 
                            "[&>div]:bg-red-600"
                          )}
                        />
                        {seoScore < 90 && (
                          <p className="text-xs text-muted-foreground text-center mt-2">
                            {90 - seoScore} points needed to reach target
                          </p>
                        )}
                      </div>
                      
                      {/* SEO Rules Checklist */}
                      {blogPost?.seo && (
                        <div className="space-y-2 text-sm">
                          <div className="font-semibold text-xs uppercase text-muted-foreground">
                            SEO Requirements
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              {blogPost.seo.keywordInH1 ? (
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                              ) : (
                                <X className="w-4 h-4 text-red-600" />
                              )}
                              <span className="text-xs">Keyword in H1 Title</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {(blogPost.seo.keywordInSubheaders || 0) >= 3 ? (
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                              ) : (
                                <X className="w-4 h-4 text-red-600" />
                              )}
                              <span className="text-xs">
                                Keyword in Subheaders ({blogPost.seo.keywordInSubheaders || 0}/3+)
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {(blogPost.seo.totalKeywordCount || 0) >= 8 ? (
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                              ) : (
                                <X className="w-4 h-4 text-red-600" />
                              )}
                              <span className="text-xs">
                                Total Keyword Count ({blogPost.seo.totalKeywordCount || 0}/8+)
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {blogPost.seo.wordCount >= 1500 ? (
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                              ) : (
                                <X className="w-4 h-4 text-red-600" />
                              )}
                              <span className="text-xs">
                                Word Count ({blogPost.seo.wordCount}/1500+)
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {blogPost.seo.keywordDensity >= 1 && blogPost.seo.keywordDensity <= 2 ? (
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                              ) : (
                                <X className="w-4 h-4 text-red-600" />
                              )}
                              <span className="text-xs">
                                Keyword Density ({blogPost.seo.keywordDensity}% - Target: 1-2%)
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <Button 
                        onClick={handleSEOOptimization} 
                        className="w-full"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Zap className="w-4 h-4 mr-2" />
                            {seoScore > 0 ? 'Re-analyze SEO' : 'Analyze SEO'}
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Optimization Suggestions */}
                  {optimizationSuggestions.length > 0 && (
                    <Card className="border-2">
                      <CardHeader>
                        <CardTitle className="text-lg">Suggestions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-[200px]">
                          <div className="space-y-2">
                            {optimizationSuggestions.map((suggestion, index) => (
                              <div key={index} className="flex items-start gap-2">
                                <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5" />
                                <p className="text-sm">{suggestion}</p>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  )}

                  {/* Quick Stats */}
                  {blogPost && (
                    <Card className="border-2">
                      <CardHeader>
                        <CardTitle className="text-lg">Quick Stats</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Word Count</span>
                          <span className="text-sm font-medium">{blogPost.seo.wordCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Keyword Density</span>
                          <span className="text-sm font-medium">{blogPost.seo.keywordDensity}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Readability</span>
                          <span className="text-sm font-medium">{blogPost.seo.readabilityScore}/100</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Internal Links</span>
                          <span className="text-sm font-medium">{blogPost.seo.internalLinks}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">External Links</span>
                          <span className="text-sm font-medium">{blogPost.seo.externalLinks}</span>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <Button 
                  variant="outline"
                  onClick={() => setCurrentStage(2)}
                >
                  Back to Generation
                </Button>
                <Button 
                  onClick={() => setCurrentStage(4)}
                  size="lg"
                >
                  Continue to Review
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Stage 4: Review & Edit */}
          {currentStage === 4 && (
            <motion.div
              key="stage4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Edit3 className="w-5 h-5" />
                    Review & Approval
                  </CardTitle>
                  <CardDescription>
                    Final review and approval before publishing
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Alert>
                    <Info className="w-4 h-4" />
                    <AlertDescription>
                      Review the content and make any final edits before approval.
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <Label>Final Content</Label>
                      <ScrollArea className="h-[400px] rounded-lg border mt-2">
                        <Textarea
                          value={editedContent}
                          onChange={(e) => setEditedContent(e.target.value)}
                          className="min-h-[380px] border-0 focus-visible:ring-0 p-4"
                        />
                      </ScrollArea>
                    </div>

                    <div className="space-y-4">
                      <Card className="bg-muted/50">
                        <CardHeader>
                          <CardTitle className="text-lg">Approval Checklist</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-primary" />
                            <span className="text-sm">Grammar and spelling checked</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-primary" />
                            <span className="text-sm">SEO optimization complete</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-primary" />
                            <span className="text-sm">Fact-checking verified</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-primary" />
                            <span className="text-sm">Links validated</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-primary" />
                            <span className="text-sm">Metadata configured</span>
                          </div>
                        </CardContent>
                      </Card>

                      <div className="space-y-3">
                        <Button 
                          onClick={() => {
                            setApprovalStatus('approved');
                            setBlogPost(blogPost ? { ...blogPost, status: 'approved' } : null);
                            toast({
                              title: "Content Approved",
                              description: "Your blog post is ready for publishing",
                            });
                            setCurrentStage(5);
                          }}
                          className="w-full"
                          variant="default"
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Approve Content
                        </Button>
                        
                        <Button 
                          onClick={() => {
                            setApprovalStatus('rejected');
                            setCurrentStage(3);
                            toast({
                              title: "Content Rejected",
                              description: "Please make the necessary changes",
                              variant: "destructive"
                            });
                          }}
                          className="w-full"
                          variant="destructive"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Request Changes
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button 
                      variant="outline"
                      onClick={() => setCurrentStage(3)}
                    >
                      Back to Optimization
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Stage 5: Export & Publishing */}
          {currentStage === 5 && (
            <motion.div
              key="stage5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="w-5 h-5" />
                    Export & Publish
                  </CardTitle>
                  <CardDescription>
                    Export your blog post in multiple formats
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      Your blog post is approved and ready for export!
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleExport('markdown')}>
                      <CardContent className="p-6 text-center space-y-4">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                          <FileCode className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Markdown</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Universal format for developers
                          </p>
                        </div>
                        <Button variant="outline" className="w-full">
                          <Download className="w-4 h-4 mr-2" />
                          Export .md
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleExport('html')}>
                      <CardContent className="p-6 text-center space-y-4">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                          <Globe className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">HTML</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Ready for web publishing
                          </p>
                        </div>
                        <Button variant="outline" className="w-full">
                          <Download className="w-4 h-4 mr-2" />
                          Export .html
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleExport('wordpress')}>
                      <CardContent className="p-6 text-center space-y-4">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                          <BookOpen className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">WordPress</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Import directly to WordPress
                          </p>
                        </div>
                        <Button variant="outline" className="w-full">
                          <Download className="w-4 h-4 mr-2" />
                          Export .xml
                        </Button>
                      </CardContent>
                    </Card>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-semibold">Quick Actions</h3>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline"
                        onClick={() => {
                          navigator.clipboard.writeText(editedContent);
                          toast({
                            title: "Copied to Clipboard",
                            description: "Blog content copied successfully",
                          });
                        }}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Content
                      </Button>
                      
                      <Button 
                        variant="outline"
                        onClick={() => setCurrentStage(6)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Analytics
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button 
                      variant="outline"
                      onClick={() => setCurrentStage(4)}
                    >
                      Back to Review
                    </Button>
                    <Button 
                      onClick={() => {
                        // Reset for new post
                        setCurrentStage(1);
                        setTopicInput('');
                        setKeywords([]);
                        setSelectedKeyword(null);
                        setBlogPost(null);
                        toast({
                          title: "Ready for New Post",
                          description: "Start creating your next blog post",
                        });
                      }}
                      size="lg"
                    >
                      Create New Post
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Stage 6: Track & Monitor */}
          {currentStage === 6 && (
            <motion.div
              key="stage6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Track & Monitor
                  </CardTitle>
                  <CardDescription>
                    Monitor your blog post performance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Alert>
                    <Info className="w-4 h-4" />
                    <AlertDescription>
                      Performance metrics will be available once your blog post is published and indexed.
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-sm text-muted-foreground">Page Views</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-2xl font-bold">-</div>
                        <p className="text-sm text-muted-foreground">Avg. Time on Page</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-2xl font-bold">-</div>
                        <p className="text-sm text-muted-foreground">Bounce Rate</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-2xl font-bold">-</div>
                        <p className="text-sm text-muted-foreground">Search Position</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="flex justify-between">
                    <Button 
                      variant="outline"
                      onClick={() => setCurrentStage(5)}
                    >
                      Back to Export
                    </Button>
                    <Button 
                      onClick={() => setCurrentStage(1)}
                      size="lg"
                    >
                      Create Another Post
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BlogWriter;
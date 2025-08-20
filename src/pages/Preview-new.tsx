import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Video, Copy, Download, CheckCircle, FileText, Image, Share2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';

export function PreviewPage() {
  const navigate = useNavigate();
  const { currentIdea, currentScript, currentThumbnail } = useAppStore();
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (!currentIdea || !currentScript || !currentThumbnail) {
      toast.error('Please complete all steps first');
      navigate('/ideation');
    }
  }, [currentIdea, currentScript, currentThumbnail]);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    toast.success(`${type} copied to clipboard!`);
    setTimeout(() => setCopied(null), 2000);
  };

  const downloadAll = () => {
    // Download script
    const scriptBlob = new Blob([currentScript?.content || ''], { type: 'text/markdown' });
    const scriptUrl = URL.createObjectURL(scriptBlob);
    const scriptLink = document.createElement('a');
    scriptLink.href = scriptUrl;
    scriptLink.download = `${currentIdea?.title || 'script'}.md`;
    scriptLink.click();
    URL.revokeObjectURL(scriptUrl);

    // Download metadata
    const metadata = {
      title: currentIdea?.title,
      concept: currentIdea?.concept,
      pillar: currentIdea?.pillar,
      thumbnail: currentThumbnail?.prompt,
      scriptWordCount: currentScript?.wordCount,
      generatedAt: new Date().toISOString()
    };
    const metadataBlob = new Blob([JSON.stringify(metadata, null, 2)], { type: 'application/json' });
    const metadataUrl = URL.createObjectURL(metadataBlob);
    const metadataLink = document.createElement('a');
    metadataLink.href = metadataUrl;
    metadataLink.download = `${currentIdea?.title || 'video'}-metadata.json`;
    metadataLink.click();
    URL.revokeObjectURL(metadataUrl);

    toast.success('All files downloaded!');
  };

  const editSection = (section: 'idea' | 'script' | 'thumbnail') => {
    switch (section) {
      case 'idea':
        navigate('/ideation');
        break;
      case 'script':
        navigate('/script');
        break;
      case 'thumbnail':
        navigate('/thumbnail');
        break;
    }
  };

  if (!currentIdea || !currentScript || !currentThumbnail) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Video Preview
        </h1>
        <p className="text-xl text-muted-foreground">
          Review and export your complete video package
        </p>
      </motion.div>

      {/* Video Title and Stats */}
      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">{currentIdea.title}</h2>
            <p className="text-muted-foreground mb-4">{currentIdea.concept}</p>
            <div className="flex items-center gap-4">
              <Badge variant="secondary">{currentIdea.pillar}</Badge>
              <Badge variant="outline">
                <FileText className="w-3 h-3 mr-1" />
                {currentScript.wordCount} words
              </Badge>
              <Badge variant="outline">
                <Video className="w-3 h-3 mr-1" />
                ~{Math.ceil(currentScript.wordCount / 150)} min
              </Badge>
            </div>
          </div>
          <Button
            size="lg"
            onClick={downloadAll}
            className="bg-gradient-primary"
          >
            <Download className="w-5 h-5 mr-2" />
            Download All
          </Button>
        </div>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="script">Script</TabsTrigger>
          <TabsTrigger value="thumbnail">Thumbnail</TabsTrigger>
          <TabsTrigger value="metadata">Metadata</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Thumbnail Preview */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Image className="w-5 h-5 text-primary" />
                  Thumbnail
                </h3>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => editSection('thumbnail')}
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
              <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                <img
                  src={currentThumbnail.imageUrl}
                  alt="Thumbnail"
                  className="w-full h-full object-cover"
                />
                {currentThumbnail.overlayText && (
                  <div className="absolute inset-0 flex items-center justify-center p-4">
                    <div className="bg-black/70 backdrop-blur-sm px-4 py-2 rounded-lg">
                      <p className="text-white font-bold text-center">
                        {currentThumbnail.overlayText}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Key Points */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Script Highlights
                </h3>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => editSection('script')}
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-3">
                {currentScript.sections?.slice(0, 5).map((section: any, index: number) => (
                  <div key={index} className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{section.title}</p>
                      <Badge variant="outline" className="text-xs">
                        {section.wordCount} words
                      </Badge>
                    </div>
                    {section.timestamp && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {section.timestamp}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Why It Will Work */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Why This Video Will Succeed</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 bg-green-500/10 rounded-lg">
                <h4 className="font-medium text-green-500 mb-2">Strong Hook</h4>
                <p className="text-sm text-muted-foreground">
                  {currentIdea.angle}
                </p>
              </div>
              <div className="p-4 bg-blue-500/10 rounded-lg">
                <h4 className="font-medium text-blue-500 mb-2">Target Audience</h4>
                <p className="text-sm text-muted-foreground">
                  {currentIdea.whyItWillClick}
                </p>
              </div>
              <div className="p-4 bg-purple-500/10 rounded-lg">
                <h4 className="font-medium text-purple-500 mb-2">Content Pillar</h4>
                <p className="text-sm text-muted-foreground">
                  Aligned with {currentIdea.pillar} content strategy
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Script Tab */}
        <TabsContent value="script" className="mt-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Full Script</h3>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(currentScript.content, 'Script')}
                >
                  {copied === 'Script' ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => editSection('script')}
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="prose prose-invert max-w-none">
              <pre className="whitespace-pre-wrap font-mono text-sm bg-muted/50 p-4 rounded-lg">
                {currentScript.content}
              </pre>
            </div>
          </Card>
        </TabsContent>

        {/* Thumbnail Tab */}
        <TabsContent value="thumbnail" className="mt-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Thumbnail Design</h3>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => editSection('thumbnail')}
              >
                <Edit className="w-4 h-4" />
              </Button>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                <img
                  src={currentThumbnail.imageUrl}
                  alt="Thumbnail"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Design Prompt</h4>
                  <p className="text-sm text-muted-foreground">
                    {currentThumbnail.prompt}
                  </p>
                </div>
                {currentThumbnail.overlayText && (
                  <div>
                    <h4 className="font-medium mb-2">Overlay Text</h4>
                    <p className="text-sm text-muted-foreground">
                      {currentThumbnail.overlayText}
                    </p>
                  </div>
                )}
                <div>
                  <h4 className="font-medium mb-2">Style</h4>
                  <p className="text-sm text-muted-foreground">
                    {currentThumbnail.style}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Metadata Tab */}
        <TabsContent value="metadata" className="mt-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Video Metadata</h3>
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Title</h4>
                <p className="text-sm font-mono">{currentIdea.title}</p>
                <Button
                  size="sm"
                  variant="ghost"
                  className="mt-2"
                  onClick={() => copyToClipboard(currentIdea.title, 'Title')}
                >
                  {copied === 'Title' ? (
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  ) : (
                    <Copy className="w-4 h-4 mr-2" />
                  )}
                  Copy
                </Button>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-sm font-mono">
                  {currentScript.metadata?.description || currentIdea.concept}
                </p>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(currentScript.metadata?.tags || []).map((tag: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Export Data</h4>
                <pre className="text-xs font-mono overflow-x-auto">
                  {JSON.stringify({
                    title: currentIdea.title,
                    pillar: currentIdea.pillar,
                    wordCount: currentScript.wordCount,
                    duration: `${Math.ceil(currentScript.wordCount / 150)} min`,
                    generatedAt: new Date().toISOString()
                  }, null, 2)}
                </pre>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="lg"
          onClick={() => navigate('/ideation')}
        >
          Create Another Video
        </Button>
        
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              const shareText = `Check out my new video: ${currentIdea.title}`;
              if (navigator.share) {
                navigator.share({
                  title: currentIdea.title,
                  text: shareText
                });
              } else {
                copyToClipboard(shareText, 'Share text');
              }
            }}
          >
            <Share2 className="w-5 h-5 mr-2" />
            Share
          </Button>
          
          <Button
            size="lg"
            onClick={downloadAll}
            className="bg-gradient-primary"
          >
            <Download className="w-5 h-5 mr-2" />
            Export Everything
          </Button>
        </div>
      </div>
    </div>
  );
}
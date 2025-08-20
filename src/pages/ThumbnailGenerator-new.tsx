import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Image, Download, RefreshCw, Wand2, Palette, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { copperReelsGemini } from '@/lib/gemini';

interface ThumbnailDesign {
  id: string;
  imageUrl: string;
  prompt: string;
  overlayText: string;
  style: string;
  colorScheme: string;
}

export function ThumbnailGeneratorPage() {
  const navigate = useNavigate();
  const { currentIdea, currentScript, setCurrentThumbnail } = useAppStore();
  const [thumbnails, setThumbnails] = useState<ThumbnailDesign[]>([]);
  const [selectedThumbnail, setSelectedThumbnail] = useState<ThumbnailDesign | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [overlayText, setOverlayText] = useState('');

  // Auto-generate thumbnail on mount
  useEffect(() => {
    if (currentIdea && thumbnails.length === 0) {
      generateThumbnails();
    }
  }, [currentIdea]);

  const generateThumbnails = async () => {
    if (!currentIdea) {
      toast.error('Please select an idea first');
      navigate('/ideation');
      return;
    }

    setIsGenerating(true);
    try {
      // Generate thumbnail briefs
      const briefs = await copperReelsGemini.generateThumbnailBriefs({
        titleText: currentIdea.title,
        ideaConcept: currentIdea.concept
      });

      // Generate actual images using DALL-E or placeholder service
      const thumbnailDesigns = await Promise.all(
        briefs.slice(0, 3).map(async (brief, index) => {
          // For now, use a placeholder service
          // In production, integrate with DALL-E, Midjourney, or Stable Diffusion
          const imageUrl = await generateImage(brief.imagePrompt);
          
          return {
            id: `thumb-${Date.now()}-${index}`,
            imageUrl,
            prompt: brief.imagePrompt,
            overlayText: brief.overlayText,
            style: brief.composition,
            colorScheme: brief.colorMood
          };
        })
      );

      setThumbnails(thumbnailDesigns);
      
      // Auto-select first thumbnail
      if (thumbnailDesigns.length > 0) {
        selectThumbnail(thumbnailDesigns[0]);
      }

      toast.success(`Generated ${thumbnailDesigns.length} thumbnail designs!`);
    } catch (error) {
      console.error('Failed to generate thumbnails:', error);
      toast.error('Failed to generate thumbnails. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateImage = async (prompt: string): Promise<string> => {
    // Placeholder image generation
    // Replace with actual image generation API
    const encodedPrompt = encodeURIComponent(prompt.slice(0, 100));
    
    // Use different placeholder services for variety
    const services = [
      `https://source.unsplash.com/1280x720/?${encodedPrompt}`,
      `https://picsum.photos/seed/${encodedPrompt}/1280/720`,
      `https://via.placeholder.com/1280x720/FF6B6B/FFFFFF?text=${encodedPrompt.slice(0, 30)}`
    ];
    
    return services[Math.floor(Math.random() * services.length)];
    
    // For production, integrate with actual image generation:
    // const response = await fetch('/api/generate-image', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ prompt })
    // });
    // const data = await response.json();
    // return data.imageUrl;
  };

  const generateCustomThumbnail = async () => {
    if (!customPrompt) {
      toast.error('Please enter a custom prompt');
      return;
    }

    setIsGenerating(true);
    try {
      const imageUrl = await generateImage(customPrompt);
      const newThumbnail = {
        id: `custom-${Date.now()}`,
        imageUrl,
        prompt: customPrompt,
        overlayText: overlayText || currentIdea?.title || '',
        style: 'Custom',
        colorScheme: 'Custom'
      };

      setThumbnails([newThumbnail, ...thumbnails]);
      selectThumbnail(newThumbnail);
      toast.success('Custom thumbnail generated!');
      
      // Clear custom inputs
      setCustomPrompt('');
      setOverlayText('');
    } catch (error) {
      console.error('Failed to generate custom thumbnail:', error);
      toast.error('Failed to generate custom thumbnail');
    } finally {
      setIsGenerating(false);
    }
  };

  const selectThumbnail = (thumbnail: ThumbnailDesign) => {
    setSelectedThumbnail(thumbnail);
    setCurrentThumbnail({
      imageUrl: thumbnail.imageUrl,
      overlayText: thumbnail.overlayText,
      prompt: thumbnail.prompt,
      style: thumbnail.style
    });
  };

  const downloadThumbnail = async (thumbnail: ThumbnailDesign) => {
    try {
      const response = await fetch(thumbnail.imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `thumbnail-${thumbnail.id}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Thumbnail downloaded!');
    } catch (error) {
      toast.error('Failed to download thumbnail');
    }
  };

  const continueToPreview = () => {
    if (!selectedThumbnail) {
      toast.error('Please select a thumbnail first');
      return;
    }
    navigate('/preview');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Thumbnail Generator
        </h1>
        <p className="text-xl text-muted-foreground">
          Create eye-catching thumbnails that get clicks
        </p>
      </motion.div>

      {/* Custom Generation */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Palette className="w-5 h-5 text-primary" />
          Custom Thumbnail
        </h3>
        <div className="space-y-4">
          <Textarea
            placeholder="Describe your thumbnail design (e.g., 'Shocked person pointing at glowing computer screen with money symbols floating around')"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            className="min-h-[100px]"
          />
          <Input
            placeholder="Overlay text (optional)"
            value={overlayText}
            onChange={(e) => setOverlayText(e.target.value)}
          />
          <Button
            onClick={generateCustomThumbnail}
            disabled={isGenerating || !customPrompt}
            className="w-full bg-gradient-primary"
          >
            <Wand2 className="w-4 h-4 mr-2" />
            Generate Custom Thumbnail
          </Button>
        </div>
      </Card>

      {/* Generated Thumbnails Grid */}
      {isGenerating && thumbnails.length === 0 ? (
        <Card className="p-12">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Camera className="w-12 h-12 text-primary animate-pulse" />
            <p className="text-lg font-medium">Generating thumbnails...</p>
            <p className="text-sm text-muted-foreground">
              Creating eye-catching designs for your video
            </p>
          </div>
        </Card>
      ) : thumbnails.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {thumbnails.map((thumbnail, index) => (
            <motion.div
              key={thumbnail.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={`overflow-hidden cursor-pointer transition-all ${
                  selectedThumbnail?.id === thumbnail.id
                    ? 'ring-2 ring-primary border-primary'
                    : 'hover:border-primary/50'
                }`}
                onClick={() => selectThumbnail(thumbnail)}
              >
                {/* Thumbnail Image */}
                <div className="relative aspect-video bg-muted">
                  <img
                    src={thumbnail.imageUrl}
                    alt={thumbnail.prompt}
                    className="w-full h-full object-cover"
                  />
                  {thumbnail.overlayText && (
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                      <div className="bg-black/70 backdrop-blur-sm px-4 py-2 rounded-lg">
                        <p className="text-white font-bold text-lg text-center">
                          {thumbnail.overlayText}
                        </p>
                      </div>
                    </div>
                  )}
                  {selectedThumbnail?.id === thumbnail.id && (
                    <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-2">
                      <Image className="w-4 h-4" />
                    </div>
                  )}
                </div>

                {/* Thumbnail Details */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">{thumbnail.style}</Badge>
                    <Badge variant="outline">{thumbnail.colorScheme}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                    {thumbnail.prompt}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadThumbnail(thumbnail);
                      }}
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </Button>
                    {selectedThumbnail?.id === thumbnail.id && (
                      <Button size="sm" variant="default" className="flex-1">
                        Selected
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card className="p-12">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Image className="w-12 h-12 text-muted-foreground" />
            <p className="text-lg font-medium">No thumbnails generated yet</p>
            <Button
              size="lg"
              onClick={generateThumbnails}
              className="bg-gradient-primary"
            >
              <Wand2 className="w-5 h-5 mr-2" />
              Generate Thumbnails
            </Button>
          </div>
        </Card>
      )}

      {/* Action Buttons */}
      {thumbnails.length > 0 && (
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="lg"
            onClick={generateThumbnails}
            disabled={isGenerating}
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Generate New Thumbnails
          </Button>
          
          <Button
            size="lg"
            onClick={continueToPreview}
            disabled={!selectedThumbnail}
            className="bg-gradient-primary"
          >
            Continue to Preview →
          </Button>
        </div>
      )}
    </div>
  );
}
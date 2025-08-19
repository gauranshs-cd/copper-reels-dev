import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles, Copy, CheckCircle, TrendingUp, Eye, Lightbulb } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { CustomPatternDialog } from '@/components/CustomPatternDialog';
import { 
  patternBankService, 
  getViralTitlePatterns,
  getPowerWords,
  getThumbnailIdeas,
  generateTitleIdeas
} from '@/lib/pattern-bank';

export function PatternBankViewer() {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [viralTitles, setViralTitles] = useState<string[]>([]);
  const [powerWords, setPowerWords] = useState<string[]>([]);
  const [thumbnailPatterns, setThumbnailPatterns] = useState<string[]>([]);
  const [exampleTitles, setExampleTitles] = useState<string[]>([]);
  const [generatedIdeas, setGeneratedIdeas] = useState<string[]>([]);
  const [customPatterns, setCustomPatterns] = useState<any[]>([]);

  useEffect(() => {
    // Load pattern bank data
    setViralTitles(getViralTitlePatterns());
    setPowerWords(getPowerWords());
    setThumbnailPatterns(getThumbnailIdeas());
    setExampleTitles(patternBankService.getExampleTitles(15));
    
    // Load custom patterns
    const saved = localStorage.getItem('custom_patterns');
    if (saved) {
      setCustomPatterns(JSON.parse(saved));
    }
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(text);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const handleGenerateIdeas = () => {
    if (!searchQuery) {
      toast.error('Please enter a topic first');
      return;
    }
    const ideas = generateTitleIdeas(searchQuery);
    setGeneratedIdeas(ideas);
    toast.success(`Generated ${ideas.length} title ideas!`);
  };

  const searchResults = searchQuery ? patternBankService.searchPatterns(searchQuery) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-primary" />
            Pattern Bank
          </h2>
          <p className="text-muted-foreground">
            Viral patterns from successful YouTube channels
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-lg px-3 py-1">
            {viralTitles.length + powerWords.length + customPatterns.length} Patterns
          </Badge>
          <CustomPatternDialog />
        </div>
      </div>

      {/* Search Bar */}
      <Card className="p-4">
        <div className="flex gap-2">
          <Input
            placeholder="Search patterns or enter topic for ideas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerateIdeas()}
            className="flex-1"
          />
          <Button onClick={handleGenerateIdeas} className="bg-gradient-primary">
            <Sparkles className="w-4 h-4 mr-2" />
            Generate Ideas
          </Button>
        </div>
      </Card>

      {/* Search Results */}
      {searchResults && (
        <Card className="p-4 border-primary/20 bg-primary/5">
          <h3 className="font-semibold mb-3">Search Results</h3>
          <div className="space-y-2">
            {searchResults.titles.length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Titles:</p>
                {searchResults.titles.slice(0, 3).map((title, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-background rounded">
                    <span className="text-sm">{title}</span>
                    <Button size="sm" variant="ghost" onClick={() => handleCopy(title)}>
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Generated Ideas */}
      {generatedIdeas.length > 0 && (
        <Card className="p-4 border-green-500/20 bg-green-500/5">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-green-500" />
            Generated Title Ideas
          </h3>
          <div className="space-y-2">
            {generatedIdeas.map((idea, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-between p-3 bg-background rounded-lg"
              >
                <span className="text-sm">{idea}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleCopy(idea)}
                >
                  {copiedItem === idea ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* Pattern Tabs */}
      <Tabs defaultValue="viral" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="viral">Viral Titles</TabsTrigger>
          <TabsTrigger value="power">Power Words</TabsTrigger>
          <TabsTrigger value="thumbnail">Thumbnails</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
          <TabsTrigger value="custom">Custom</TabsTrigger>
        </TabsList>

        {/* Viral Titles */}
        <TabsContent value="viral" className="mt-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              High-Performing Viral Titles
            </h3>
            <ScrollArea className="h-[400px]">
              <div className="space-y-2">
                {viralTitles.map((title, i) => {
                  const viewMatch = title.match(/(\d+(?:\.\d+)?[MK]?) views/);
                  const views = viewMatch ? viewMatch[1] : null;
                  
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm flex-1">{title.replace(/ - \d+(?:\.\d+)?[MK]? views/, '')}</p>
                        <div className="flex items-center gap-2">
                          {views && (
                            <Badge variant="secondary" className="text-xs">
                              <Eye className="w-3 h-3 mr-1" />
                              {views}
                            </Badge>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleCopy(title.replace(/ - \d+(?:\.\d+)?[MK]? views/, ''))}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </ScrollArea>
          </Card>
        </TabsContent>

        {/* Power Words */}
        <TabsContent value="power" className="mt-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-3">High-Converting Power Words</h3>
            <div className="flex flex-wrap gap-2">
              {powerWords.map((word, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.02 }}
                >
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => handleCopy(word)}
                  >
                    {word}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Thumbnail Patterns */}
        <TabsContent value="thumbnail" className="mt-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Thumbnail Patterns That Convert</h3>
            <div className="grid gap-3">
              {thumbnailPatterns.map((pattern, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <span className="text-sm">{pattern}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCopy(pattern)}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Example Titles */}
        <TabsContent value="examples" className="mt-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Example Titles You Could Make</h3>
            <ScrollArea className="h-[400px]">
              <div className="space-y-2">
                {exampleTitles.map((title, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors group"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm flex-1">{title}</p>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleCopy(title)}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </TabsContent>

        {/* Custom Patterns */}
        <TabsContent value="custom" className="mt-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Your Custom Patterns</h3>
            {customPatterns.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p className="mb-4">No custom patterns yet</p>
                <CustomPatternDialog />
              </div>
            ) : (
              <ScrollArea className="h-[400px]">
                <div className="space-y-2">
                  {customPatterns.map((pattern, i) => (
                    <motion.div
                      key={pattern.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="text-sm mb-1">{pattern.pattern}</p>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {pattern.type}
                            </Badge>
                            {pattern.category && (
                              <Badge variant="secondary" className="text-xs">
                                {pattern.category}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCopy(pattern.pattern)}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
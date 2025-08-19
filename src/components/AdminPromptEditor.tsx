import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Edit3, Save, X, Eye, EyeOff, Lock, Unlock, Copy, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useAppStore } from '@/store/useAppStore';
import { supabase } from '@/integrations/supabase/client';
import * as prompts from '@/lib/openai/prompts';

interface AdminPromptEditorProps {
  isOpen: boolean;
  onClose: () => void;
  currentPrompt?: string;
  promptType?: string;
  onSave?: (prompt: string) => void;
}

// Available prompt types
const PROMPT_TYPES = {
  POSITIONING: 'Positioning Bot',
  SKYSCRAPER_QUERY: 'Skyscraper Query',
  PATTERN_BANK: 'Pattern Bank',
  IDEA_GENERATOR: 'Idea Generator',
  TITLE_GENERATOR: 'Title Generator',
  THUMBNAIL_BRIEF: 'Thumbnail Brief',
  SCRIPT_STORYBOARD: 'Script & Storyboard',
  BROLL_EXTRACTOR: 'B-Roll Extractor'
};

export function AdminPromptEditor({ 
  isOpen, 
  onClose, 
  currentPrompt = '', 
  promptType = 'POSITIONING',
  onSave 
}: AdminPromptEditorProps) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [editedPrompt, setEditedPrompt] = useState(currentPrompt);
  const [selectedPromptType, setSelectedPromptType] = useState(promptType);
  const [showOriginal, setShowOriginal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [customPrompts, setCustomPrompts] = useState<Record<string, string>>({});

  // Check if user is admin
  useEffect(() => {
    checkAdminStatus();
    loadCustomPrompts();
  }, []);

  useEffect(() => {
    // Load the appropriate prompt when type changes
    loadPromptForType(selectedPromptType);
  }, [selectedPromptType]);

  const checkAdminStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.email === 'arvind@copperdigital.com') {
      setIsAdmin(true);
    }
  };

  const loadCustomPrompts = () => {
    // Load custom prompts from localStorage
    const saved = localStorage.getItem('copper_reels_custom_prompts');
    if (saved) {
      setCustomPrompts(JSON.parse(saved));
    }
  };

  const loadPromptForType = (type: string) => {
    // First check if there's a custom prompt
    if (customPrompts[type]) {
      setEditedPrompt(customPrompts[type]);
      return;
    }

    // Otherwise load the original prompt
    switch (type) {
      case 'POSITIONING':
        setEditedPrompt(prompts.POSITIONING_BOT_SYSTEM);
        break;
      case 'SKYSCRAPER_QUERY':
        setEditedPrompt(prompts.SKYSCRAPER_QUERY_SYSTEM);
        break;
      case 'PATTERN_BANK':
        setEditedPrompt(prompts.PATTERN_BANK_SYSTEM);
        break;
      case 'IDEA_GENERATOR':
        setEditedPrompt(prompts.IDEA_GENERATOR_SYSTEM);
        break;
      case 'TITLE_GENERATOR':
        setEditedPrompt(prompts.TITLE_GENERATOR_SYSTEM);
        break;
      case 'THUMBNAIL_BRIEF':
        setEditedPrompt(prompts.THUMBNAIL_BRIEF_SYSTEM);
        break;
      case 'SCRIPT_STORYBOARD':
        setEditedPrompt(prompts.SCRIPT_STORYBOARD_SYSTEM);
        break;
      case 'BROLL_EXTRACTOR':
        setEditedPrompt(prompts.BROLL_EXTRACTOR_SYSTEM);
        break;
      default:
        setEditedPrompt('');
    }
  };

  const getOriginalPrompt = (type: string) => {
    switch (type) {
      case 'POSITIONING':
        return prompts.POSITIONING_BOT_SYSTEM;
      case 'SKYSCRAPER_QUERY':
        return prompts.SKYSCRAPER_QUERY_SYSTEM;
      case 'PATTERN_BANK':
        return prompts.PATTERN_BANK_SYSTEM;
      case 'IDEA_GENERATOR':
        return prompts.IDEA_GENERATOR_SYSTEM;
      case 'TITLE_GENERATOR':
        return prompts.TITLE_GENERATOR_SYSTEM;
      case 'THUMBNAIL_BRIEF':
        return prompts.THUMBNAIL_BRIEF_SYSTEM;
      case 'SCRIPT_STORYBOARD':
        return prompts.SCRIPT_STORYBOARD_SYSTEM;
      case 'BROLL_EXTRACTOR':
        return prompts.BROLL_EXTRACTOR_SYSTEM;
      default:
        return '';
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    
    // Save to localStorage
    const updated = {
      ...customPrompts,
      [selectedPromptType]: editedPrompt
    };
    setCustomPrompts(updated);
    localStorage.setItem('copper_reels_custom_prompts', JSON.stringify(updated));
    
    // Also save to the global store for immediate use
    const store = useAppStore.getState();
    store.setCustomPrompt(selectedPromptType, editedPrompt);
    
    if (onSave) {
      onSave(editedPrompt);
    }
    
    toast.success('Prompt saved successfully!');
    setIsSaving(false);
  };

  const handleReset = () => {
    const original = getOriginalPrompt(selectedPromptType);
    setEditedPrompt(original);
    
    // Remove custom prompt
    const updated = { ...customPrompts };
    delete updated[selectedPromptType];
    setCustomPrompts(updated);
    localStorage.setItem('copper_reels_custom_prompts', JSON.stringify(updated));
    
    toast.info('Reset to original prompt');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(editedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            Admin Prompt Editor
          </DialogTitle>
          <DialogDescription>
            Edit and customize the prompts sent to Gemini AI
          </DialogDescription>
        </DialogHeader>

        <Tabs value={selectedPromptType} onValueChange={setSelectedPromptType} className="flex-1">
          <TabsList className="grid grid-cols-4 gap-2 h-auto p-1">
            {Object.entries(PROMPT_TYPES).map(([key, label]) => (
              <TabsTrigger 
                key={key} 
                value={key}
                className="text-xs px-2 py-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {customPrompts[key] && (
                  <Unlock className="w-3 h-3 mr-1" />
                )}
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="mt-4 space-y-4">
            {/* Actions Bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant={customPrompts[selectedPromptType] ? 'default' : 'secondary'}>
                  {customPrompts[selectedPromptType] ? 'Customized' : 'Original'}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowOriginal(!showOriginal)}
                >
                  {showOriginal ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                  {showOriginal ? 'Hide' : 'Show'} Original
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                >
                  {copied ? <CheckCircle className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  disabled={!customPrompts[selectedPromptType]}
                >
                  <X className="w-4 h-4 mr-2" />
                  Reset
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-gradient-primary"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>

            {/* Editor Area */}
            <div className="grid grid-cols-1 gap-4">
              {showOriginal && (
                <Card className="p-4 bg-muted/50">
                  <h3 className="text-sm font-semibold mb-2 text-muted-foreground">
                    Original Prompt (Read-only)
                  </h3>
                  <ScrollArea className="h-[200px]">
                    <pre className="text-xs font-mono whitespace-pre-wrap">
                      {getOriginalPrompt(selectedPromptType)}
                    </pre>
                  </ScrollArea>
                </Card>
              )}

              <Card className="p-4">
                <h3 className="text-sm font-semibold mb-2">
                  Editable Prompt
                </h3>
                <Textarea
                  value={editedPrompt}
                  onChange={(e) => setEditedPrompt(e.target.value)}
                  className="min-h-[300px] font-mono text-sm"
                  placeholder="Enter your custom prompt here..."
                />
              </Card>
            </div>

            {/* Info Section */}
            <Card className="p-4 bg-primary/5 border-primary/20">
              <h4 className="text-sm font-semibold mb-2">Tips for Editing Prompts</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Keep the JSON schema structure intact for proper parsing</li>
                <li>• Test your changes with a small example first</li>
                <li>• Custom prompts are saved locally and persist across sessions</li>
                <li>• Reset to original if the output format breaks</li>
              </ul>
            </Card>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

// Hook to get custom prompt if available
export function useCustomPrompt(promptType: string): string | null {
  const [customPrompt, setCustomPrompt] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('copper_reels_custom_prompts');
    if (saved) {
      const prompts = JSON.parse(saved);
      if (prompts[promptType]) {
        setCustomPrompt(prompts[promptType]);
      }
    }
  }, [promptType]);

  return customPrompt;
}
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Eye, 
  Edit3, 
  Copy, 
  RotateCcw, 
  Save, 
  Code, 
  ChevronDown,
  ChevronUp,
  Lock,
  Unlock,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { DEFAULT_YTGS_TEMPLATE, PromptManager, YTGSPromptTemplate, PromptSection } from '@/lib/prompts/ytgs-system';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';

interface PromptEditorProps {
  isOpen: boolean;
  onClose: () => void;
  currentPrompt?: string;
  onSave?: (prompt: string) => void;
  variables?: Record<string, string>;
}

export function PromptEditor({ isOpen, onClose, currentPrompt, onSave, variables = {} }: PromptEditorProps) {
  const [template, setTemplate] = useState<YTGSPromptTemplate>(DEFAULT_YTGS_TEMPLATE);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['system-role']));
  const [compiledPrompt, setCompiledPrompt] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    loadUserPrompt();
  }, []);

  useEffect(() => {
    const compiled = PromptManager.compilePrompt(template, variables);
    setCompiledPrompt(compiled);
  }, [template, variables]);

  const loadUserPrompt = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUserId(user.id);
      const userPrompt = await PromptManager.getUserPrompt(user.id);
      if (userPrompt) {
        setTemplate(userPrompt);
        toast.info('Loaded your custom prompt template');
      }
    }
  };

  const handleSectionEdit = (sectionId: string, newContent: string) => {
    const updatedTemplate = {
      ...template,
      sections: template.sections.map(section =>
        section.id === sectionId ? { ...section, content: newContent } : section
      )
    };
    setTemplate(updatedTemplate);
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!userId) {
      toast.error('Please log in to save custom prompts');
      return;
    }

    await PromptManager.saveUserPrompt(template, userId);
    setHasChanges(false);
    toast.success('Prompt template saved successfully');
    
    if (onSave) {
      onSave(compiledPrompt);
    }
  };

  const handleReset = async () => {
    if (userId) {
      await PromptManager.resetToDefault(userId);
    }
    setTemplate(DEFAULT_YTGS_TEMPLATE);
    setHasChanges(false);
    toast.info('Reset to default template');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <Code className="w-6 h-6" />
                Prompt Engineering Studio
              </DialogTitle>
              <DialogDescription>
                View and customize the AI prompts that generate your content
              </DialogDescription>
            </div>
            <div className="flex gap-2">
              {hasChanges && (
                <Badge variant="secondary" className="animate-pulse">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Unsaved Changes
                </Badge>
              )}
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="sections" className="flex-1 h-full">
          <div className="border-b px-6">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="sections">
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Sections
              </TabsTrigger>
              <TabsTrigger value="compiled">
                <Eye className="w-4 h-4 mr-2" />
                Full Prompt
              </TabsTrigger>
              <TabsTrigger value="variables">
                <Sparkles className="w-4 h-4 mr-2" />
                Variables
              </TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="h-[calc(90vh-200px)]">
            <TabsContent value="sections" className="px-6 py-4 space-y-4">
              {template.sections.map((section) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border rounded-lg overflow-hidden"
                >
                  <div
                    className="p-4 bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => toggleSection(section.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {expandedSections.has(section.id) ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                        <div>
                          <h3 className="font-semibold">{section.name}</h3>
                          <p className="text-sm text-muted-foreground">{section.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {section.editable ? (
                          <Badge variant="secondary">
                            <Unlock className="w-3 h-3 mr-1" />
                            Editable
                          </Badge>
                        ) : (
                          <Badge variant="outline">
                            <Lock className="w-3 h-3 mr-1" />
                            Locked
                          </Badge>
                        )}
                        {section.variables && section.variables.length > 0 && (
                          <Badge variant="outline">
                            {section.variables.length} vars
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedSections.has(section.id) && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 space-y-3">
                          {editingSection === section.id ? (
                            <div className="space-y-3">
                              <Textarea
                                value={section.content}
                                onChange={(e) => handleSectionEdit(section.id, e.target.value)}
                                className="min-h-[200px] font-mono text-sm"
                                disabled={!section.editable}
                              />
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => setEditingSection(null)}
                                >
                                  Done Editing
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => copyToClipboard(section.content)}
                                >
                                  <Copy className="w-4 h-4 mr-2" />
                                  Copy
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <pre className="bg-muted/30 p-4 rounded-lg overflow-x-auto text-sm">
                                <code>{section.content}</code>
                              </pre>
                              {section.editable && (
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setEditingSection(section.id)}
                                  >
                                    <Edit3 className="w-4 h-4 mr-2" />
                                    Edit
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => copyToClipboard(section.content)}
                                  >
                                    <Copy className="w-4 h-4 mr-2" />
                                    Copy
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}

                          {section.variables && section.variables.length > 0 && (
                            <div className="pt-3 border-t">
                              <p className="text-sm font-medium mb-2">Variables used:</p>
                              <div className="flex flex-wrap gap-2">
                                {section.variables.map(variable => (
                                  <Badge key={variable} variant="secondary">
                                    {`{{${variable}}}`}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </TabsContent>

            <TabsContent value="compiled" className="px-6 py-4">
              <Card className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Complete Compiled Prompt</h3>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(compiledPrompt)}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Full Prompt
                  </Button>
                </div>
                <pre className="bg-muted/30 p-4 rounded-lg overflow-x-auto text-sm max-h-[500px] overflow-y-auto">
                  <code>{compiledPrompt || currentPrompt || 'No prompt generated yet'}</code>
                </pre>
              </Card>
            </TabsContent>

            <TabsContent value="variables" className="px-6 py-4">
              <Card className="p-4">
                <h3 className="font-semibold mb-4">Current Variable Values</h3>
                <div className="space-y-3">
                  {Object.entries(variables).length > 0 ? (
                    Object.entries(variables).map(([key, value]) => (
                      <div key={key} className="flex items-start gap-3">
                        <Badge variant="outline" className="min-w-[120px]">
                          {`{{${key}}}`}
                        </Badge>
                        <span className="text-sm flex-1">{value}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No variables set yet</p>
                  )}
                </div>
              </Card>
            </TabsContent>
          </ScrollArea>

          <div className="border-t px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleReset}
                  disabled={!hasChanges}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset to Default
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={!hasChanges}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
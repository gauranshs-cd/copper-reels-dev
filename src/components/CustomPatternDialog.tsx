import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface CustomPattern {
  id: string;
  type: 'title' | 'thumbnail' | 'hook' | 'powerword';
  pattern: string;
  category?: string;
  tags: string[];
  createdAt: Date;
}

export function CustomPatternDialog() {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<string>('title');
  const [pattern, setPattern] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const handleAddTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleSave = () => {
    if (!pattern) {
      toast.error('Please enter a pattern');
      return;
    }

    const customPatterns = JSON.parse(localStorage.getItem('custom_patterns') || '[]');
    
    const newPattern: CustomPattern = {
      id: `custom-${Date.now()}`,
      type: type as CustomPattern['type'],
      pattern,
      category,
      tags,
      createdAt: new Date()
    };

    customPatterns.push(newPattern);
    localStorage.setItem('custom_patterns', JSON.stringify(customPatterns));
    
    toast.success('Pattern added successfully!');
    
    // Reset form
    setPattern('');
    setCategory('');
    setTags([]);
    setTagInput('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-primary hover:shadow-glow">
          <Plus className="w-4 h-4 mr-2" />
          Add Custom Pattern
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Custom Pattern</DialogTitle>
          <DialogDescription>
            Add your own viral patterns to the pattern bank
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Pattern Type */}
          <div className="space-y-2">
            <Label>Pattern Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title">Title Pattern</SelectItem>
                <SelectItem value="thumbnail">Thumbnail Pattern</SelectItem>
                <SelectItem value="hook">Hook Pattern</SelectItem>
                <SelectItem value="powerword">Power Word</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Pattern Input */}
          <div className="space-y-2">
            <Label>Pattern</Label>
            {type === 'powerword' ? (
              <Input
                placeholder="Enter a power word..."
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
              />
            ) : (
              <Textarea
                placeholder={
                  type === 'title' 
                    ? "Enter a title pattern... (e.g., 'How I [Achievement] in [Timeframe]')"
                    : type === 'thumbnail'
                    ? "Enter a thumbnail idea... (e.g., 'Split screen: Before/After transformation')"
                    : "Enter a hook pattern... (e.g., 'Stop scrolling if you...')"
                }
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                rows={3}
              />
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Category (Optional)</Label>
            <Input
              placeholder="e.g., Education, Tech, Lifestyle..."
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add a tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddTag}
              >
                Add Tag
              </Button>
            </div>
            
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    {tag}
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Preview */}
          {pattern && (
            <div className="p-4 bg-muted rounded-lg">
              <Label className="text-xs text-muted-foreground mb-2">Preview</Label>
              <p className="text-sm">{pattern}</p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-gradient-primary">
            Save Pattern
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Edit2, Check, X } from 'lucide-react';
import { Button } from './button';
import { Input } from './input';
import { Textarea } from './textarea';
import { cn } from '@/lib/utils';

interface EditableFieldProps {
  value: string;
  onSave: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  className?: string;
  displayClassName?: string;
  inputClassName?: string;
}

export function EditableField({
  value,
  onSave,
  placeholder = "Click to edit...",
  multiline = false,
  className,
  displayClassName,
  inputClassName
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleSave = () => {
    onSave(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    const InputComponent = multiline ? Textarea : Input;
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn("space-y-2", className)}
      >
        <InputComponent
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn("transition-all duration-200", inputClassName)}
          autoFocus
        />
        <div className="flex space-x-2">
          <Button
            size="sm"
            onClick={handleSave}
            className="h-8 px-3"
          >
            <Check className="w-3 h-3 mr-1" />
            Save
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCancel}
            className="h-8 px-3"
          >
            <X className="w-3 h-3 mr-1" />
            Cancel
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={cn(
        "group cursor-pointer transition-all duration-200 hover:bg-accent/30 rounded-lg p-2 -m-2",
        className
      )}
      onClick={() => setIsEditing(true)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className={cn(
        "flex items-start space-x-2",
        displayClassName
      )}>
        <div className="flex-1">
          {value || (
            <span className="text-muted-foreground italic">{placeholder}</span>
          )}
        </div>
        <Edit2 className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors opacity-0 group-hover:opacity-100" />
      </div>
    </motion.div>
  );
}
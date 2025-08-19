import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle, AlertCircle, Clock, Sparkles } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface GenerationStatusProps {
  isGenerating: boolean;
  status?: string;
  progress?: number;
  estimatedTime?: number;
  steps?: Array<{
    label: string;
    status: 'pending' | 'active' | 'completed' | 'error';
    detail?: string;
  }>;
}

export function GenerationStatus({
  isGenerating,
  status = 'Initializing...',
  progress = 0,
  estimatedTime = 30,
  steps = []
}: GenerationStatusProps) {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (!isGenerating) {
      setElapsedTime(0);
      return;
    }

    const interval = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isGenerating]);

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const estimatedRemaining = Math.max(0, estimatedTime - elapsedTime);

  if (!isGenerating) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
        >
          <Card className="max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 animate-ping">
                  <Sparkles className="w-12 h-12 text-primary/20" />
                </div>
                <Sparkles className="w-12 h-12 text-primary animate-pulse" />
              </div>
            </div>

            <h3 className="text-xl font-semibold text-center mb-2">
              Generating Your Content
            </h3>
            
            <p className="text-sm text-muted-foreground text-center mb-6">
              {status}
            </p>

            {/* Progress Bar */}
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Time Estimates */}
            <div className="flex items-center justify-between mb-6 p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Elapsed</p>
                  <p className="text-sm font-medium">{formatTime(elapsedTime)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Est. Remaining</p>
                <p className="text-sm font-medium">
                  {estimatedRemaining > 0 ? `~${formatTime(estimatedRemaining)}` : 'Almost done...'}
                </p>
              </div>
            </div>

            {/* Step-by-step Status */}
            {steps.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                  Processing Steps
                </p>
                {steps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 p-2 rounded-md bg-muted/30"
                  >
                    <div className="flex-shrink-0">
                      {step.status === 'completed' && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                      {step.status === 'active' && (
                        <Loader2 className="w-4 h-4 text-primary animate-spin" />
                      )}
                      {step.status === 'error' && (
                        <AlertCircle className="w-4 h-4 text-destructive" />
                      )}
                      {step.status === 'pending' && (
                        <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{step.label}</p>
                      {step.detail && (
                        <p className="text-xs text-muted-foreground truncate">
                          {step.detail}
                        </p>
                      )}
                    </div>
                    {step.status === 'active' && (
                      <Badge variant="outline" className="text-xs">
                        Processing
                      </Badge>
                    )}
                  </motion.div>
                ))}
              </div>
            )}

            {/* Fun Facts or Tips */}
            <div className="mt-6 p-3 bg-primary/5 rounded-lg border border-primary/10">
              <p className="text-xs text-muted-foreground">
                💡 <strong>Tip:</strong> AI is analyzing patterns from top-performing videos to optimize your content
              </p>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
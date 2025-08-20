import { motion } from 'framer-motion';
import { Loader2, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface LoadingScreenProps {
  title?: string;
  description?: string;
  progress?: number;
  steps?: Array<{
    label: string;
    status: 'pending' | 'active' | 'completed' | 'error';
    detail?: string;
  }>;
}

export function LoadingScreen({ 
  title = 'Loading...', 
  description = 'Please wait while we prepare your content',
  progress = 0,
  steps = []
}: LoadingScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-2xl"
      >
        <Card className="p-8 shadow-xl">
          <div className="flex flex-col items-center space-y-6">
            {/* Animated Icon */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="relative"
            >
              <Sparkles className="w-16 h-16 text-primary" />
              <motion.div
                className="absolute inset-0"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-16 h-16 text-primary opacity-30" />
              </motion.div>
            </motion.div>

            {/* Title and Description */}
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">{title}</h2>
              <p className="text-muted-foreground">{description}</p>
            </div>

            {/* Progress Bar */}
            {progress > 0 && (
              <div className="w-full space-y-2">
                <Progress value={progress} className="h-2" />
                <p className="text-center text-sm text-muted-foreground">
                  {progress}% Complete
                </p>
              </div>
            )}

            {/* Steps */}
            {steps.length > 0 && (
              <div className="w-full space-y-3">
                {steps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center
                      ${step.status === 'completed' ? 'bg-green-500 text-white' :
                        step.status === 'active' ? 'bg-primary text-primary-foreground' :
                        step.status === 'error' ? 'bg-red-500 text-white' :
                        'bg-muted text-muted-foreground'}
                    `}>
                      {step.status === 'completed' ? '✓' :
                       step.status === 'active' ? <Loader2 className="w-4 h-4 animate-spin" /> :
                       step.status === 'error' ? '✗' :
                       index + 1}
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${
                        step.status === 'active' ? 'text-foreground' : 
                        step.status === 'completed' ? 'text-green-600' :
                        step.status === 'error' ? 'text-red-600' :
                        'text-muted-foreground'
                      }`}>
                        {step.label}
                      </p>
                      {step.detail && step.status === 'active' && (
                        <p className="text-xs text-muted-foreground">{step.detail}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Fallback Loading Animation */}
            {!progress && steps.length === 0 && (
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
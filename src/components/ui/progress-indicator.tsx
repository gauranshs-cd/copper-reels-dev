import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgressIndicatorProps {
  currentStep: 'onboarding' | 'foundation' | 'ideation' | 'plan';
  className?: string;
}

const steps = [
  { key: 'onboarding', label: 'Strategy Input', number: 1 },
  { key: 'foundation', label: 'Foundation', number: 2 },
  { key: 'ideation', label: 'Ideas', number: 3 },
  { key: 'plan', label: 'Planning', number: 4 },
];

export function ProgressIndicator({ currentStep, className }: ProgressIndicatorProps) {
  const currentIndex = steps.findIndex(step => step.key === currentStep);

  return (
    <div className={cn("flex items-center justify-center space-x-4 py-8", className)}>
      {steps.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isUpcoming = index > currentIndex;

        return (
          <div key={step.key} className="flex items-center">
            <div className="flex flex-col items-center">
              <motion.div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300",
                  isCompleted && "bg-primary text-primary-foreground",
                  isCurrent && "bg-primary text-primary-foreground shadow-glow",
                  isUpcoming && "bg-muted text-muted-foreground"
                )}
                initial={false}
                animate={{
                  scale: isCurrent ? 1.1 : 1,
                }}
                transition={{ duration: 0.2 }}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span>{step.number}</span>
                )}
              </motion.div>
              <span className={cn(
                "text-xs font-medium mt-2 transition-colors duration-300",
                (isCompleted || isCurrent) && "text-foreground",
                isUpcoming && "text-muted-foreground"
              )}>
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <motion.div
                className={cn(
                  "w-16 h-0.5 mx-4 transition-colors duration-500",
                  isCompleted ? "bg-primary" : "bg-muted"
                )}
                initial={false}
                animate={{
                  backgroundColor: isCompleted ? "hsl(var(--primary))" : "hsl(var(--muted))"
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
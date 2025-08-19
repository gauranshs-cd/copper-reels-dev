import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const FLOW_STEPS = [
  { path: '/onboarding', label: 'Start', step: 1 },
  { path: '/foundation', label: 'Foundation', step: 2 },
  { path: '/ideation', label: 'Ideas', step: 3 },
  { path: '/plan', label: 'Planning', step: 4 },
  { path: '/script-builder', label: 'Script', step: 5 }
];

interface NavigationFlowProps {
  onNext?: () => void;
  onBack?: () => void;
  isLoading?: boolean;
  nextLabel?: string;
  canProceed?: boolean;
}

export function NavigationFlow({
  onNext,
  onBack,
  isLoading = false,
  nextLabel = 'Continue',
  canProceed = true
}: NavigationFlowProps) {
  const navigate = useNavigate();
  const location = useLocation();
  
  const currentStepIndex = FLOW_STEPS.findIndex(s => s.path === location.pathname);
  const currentStep = FLOW_STEPS[currentStepIndex];
  const nextStep = FLOW_STEPS[currentStepIndex + 1];
  const prevStep = FLOW_STEPS[currentStepIndex - 1];
  
  const progress = ((currentStepIndex + 1) / FLOW_STEPS.length) * 100;

  const handleNext = () => {
    if (onNext) {
      onNext();
    } else if (nextStep) {
      navigate(nextStep.path);
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (prevStep) {
      navigate(prevStep.path);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t shadow-lg z-30"
    >
      <div className="container mx-auto px-4 py-3">
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              Step {currentStepIndex + 1} of {FLOW_STEPS.length}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Indicators */}
        <div className="flex items-center justify-between mb-4">
          {FLOW_STEPS.map((step, index) => {
            const isActive = index === currentStepIndex;
            const isCompleted = index < currentStepIndex;
            
            return (
              <div
                key={step.path}
                className={cn(
                  "flex items-center",
                  index < FLOW_STEPS.length - 1 && "flex-1"
                )}
              >
                <button
                  onClick={() => isCompleted && navigate(step.path)}
                  disabled={!isCompleted && !isActive}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-full transition-all",
                    isActive && "bg-primary text-primary-foreground",
                    isCompleted && "bg-primary/20 text-primary hover:bg-primary/30 cursor-pointer",
                    !isActive && !isCompleted && "bg-muted text-muted-foreground cursor-not-allowed"
                  )}
                >
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                    isActive && "bg-primary-foreground text-primary",
                    isCompleted && "bg-primary text-primary-foreground",
                    !isActive && !isCompleted && "bg-muted-foreground/20"
                  )}>
                    {isCompleted ? <Check className="w-3 h-3" /> : step.step}
                  </div>
                  <span className="text-sm font-medium hidden sm:inline">
                    {step.label}
                  </span>
                </button>
                
                {index < FLOW_STEPS.length - 1 && (
                  <div className={cn(
                    "flex-1 h-0.5 mx-2",
                    isCompleted ? "bg-primary" : "bg-muted"
                  )} />
                )}
              </div>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={!prevStep || isLoading}
            className={cn(
              "flex items-center gap-2",
              !prevStep && "invisible"
            )}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          <div className="flex items-center gap-4">
            {isLoading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </div>
            )}
            
            <Button
              onClick={handleNext}
              disabled={!canProceed || isLoading || !nextStep}
              className={cn(
                "flex items-center gap-2",
                !nextStep && "invisible"
              )}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing
                </>
              ) : (
                <>
                  {nextLabel}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
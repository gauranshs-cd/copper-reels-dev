import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, Target, Users, ArrowRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FoundationModalProps {
  open: boolean;
  onClose?: () => void;
  onSubmit: (data: { niche: string; audience: string; goals: string }) => void;
}

export function FoundationModal({ open, onClose, onSubmit }: FoundationModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    niche: '',
    audience: '',
    goals: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    await onSubmit(formData);
    setIsLoading(false);
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.niche.trim().length > 10;
      case 2:
        return formData.audience.trim().length > 10;
      case 3:
        return formData.goals.trim().length > 10;
      default:
        return false;
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose?.(); }}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden" hideCloseButton>
        <div className="relative">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary/10 to-purple-600/10 p-6 border-b">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <Target className="w-6 h-6 text-primary" />
                Let's Set Your Foundation
              </DialogTitle>
              <DialogDescription className="text-base mt-2">
                Tell us about your YouTube channel to get personalized content strategies
              </DialogDescription>
            </DialogHeader>
            {/* Close (X) button */}
            <button
              type="button"
              aria-label="Close"
              onClick={() => onClose?.()}
              className="absolute right-4 top-4 inline-flex items-center justify-center rounded-md p-2 hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <X className="w-4 h-4" />
            </button>
            
            {/* Progress Steps */}
            <div className="flex items-center gap-2 mt-4">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={cn(
                    "flex-1 h-2 rounded-full transition-all",
                    s <= step ? "bg-primary" : "bg-muted"
                  )}
                />
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label className="text-lg font-semibold flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      What is your channel about?
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Describe your niche and what you help people with
                    </p>
                  </div>
                  <Textarea
                    placeholder="Example: I help entrepreneurs build profitable online businesses through practical marketing strategies and automation tools..."
                    value={formData.niche}
                    onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
                    className="min-h-[120px] text-base"
                    autoFocus
                  />
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      💡 <strong>Tip:</strong> Be specific! Instead of "fitness", try "I help busy professionals get fit with 15-minute home workouts"
                    </p>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label className="text-lg font-semibold flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      Who is your target audience?
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Describe your ideal viewer in detail
                    </p>
                  </div>
                  <Textarea
                    placeholder="Example: Aspiring entrepreneurs aged 25-40 who want to quit their 9-5 job and start an online business but don't know where to begin..."
                    value={formData.audience}
                    onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                    className="min-h-[120px] text-base"
                    autoFocus
                  />
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      💡 <strong>Tip:</strong> Think about their age, interests, pain points, and what keeps them up at night
                    </p>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label className="text-lg font-semibold flex items-center gap-2">
                      <Target className="w-5 h-5 text-primary" />
                      What are your channel goals?
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      What do you want to achieve with your YouTube channel?
                    </p>
                  </div>
                  <Textarea
                    placeholder="Example: Build a community of 100K subscribers, generate $10K/month from courses and coaching, become the go-to expert in my niche..."
                    value={formData.goals}
                    onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                    className="min-h-[120px] text-base"
                    autoFocus
                  />
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      💡 <strong>Tip:</strong> Be ambitious but realistic. Include both subscriber goals and business objectives
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t bg-muted/30">
            <Button
              variant="ghost"
              onClick={() => { if (step > 1) { setStep(step - 1); } else { onClose?.(); } }}
            >
              Back
            </Button>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Step {step} of 3
              </span>
            </div>

            <Button
              onClick={handleNext}
              disabled={!canProceed() || isLoading}
              className="bg-gradient-primary"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  {step === 3 ? 'Start Creating' : 'Next'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
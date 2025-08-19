import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ProgressIndicator } from '@/components/ui/progress-indicator';
import { useAppStore } from '@/store/useAppStore';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const placeholderExamples = [
  "I help indie developers launch profitable SaaS",
  "I help fitness enthusiasts build sustainable habits",
  "I help small business owners automate their marketing",
  "I help content creators grow their audience",
  "I help students master programming fundamentals",
  "I help entrepreneurs validate their ideas"
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { umbrellaStatement, setUmbrellaStatement, setLoading, isLoading, setCurrentStep, resetStore } = useAppStore();
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const [inputValue, setInputValue] = useState(umbrellaStatement);

  useEffect(() => {
    setCurrentStep('onboarding');
    
    const interval = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholderExamples.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [setCurrentStep]);

  const handleGenerate = async () => {
    if (!inputValue.trim()) return;

    setUmbrellaStatement(inputValue);
    setLoading(true, "Analyzing your strategy statement...");

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    setLoading(false);
    navigate('/foundation');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <LoadingSpinner size="lg" message="Analyzing your strategy statement..." />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-6 text-muted-foreground max-w-md"
          >
            Our AI is breaking down your statement to identify your target audience, their needs, and the best content pillars for your YouTube strategy.
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        <ProgressIndicator currentStep="onboarding" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center mt-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-8"
          >
            <div className="inline-flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-primary font-medium">Copper Reels Strategy Builder</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Turn Your Expertise Into
              <span className="text-transparent bg-gradient-primary bg-clip-text block">
                YouTube Success
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Start with a simple statement about who you help and what you help them achieve. 
              We'll build your complete content strategy from there.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="max-w-2xl mx-auto space-y-6"
          >
            <div className="relative">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={placeholderExamples[currentPlaceholder]}
                className={cn(
                  "h-16 text-lg px-4 py-4 rounded-xl border-2 shadow-elegant transition-all duration-300",
                  "focus:border-primary focus:shadow-glow"
                )}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              />
            </div>

            <div className="flex items-center justify-center gap-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={handleGenerate}
                  disabled={!inputValue.trim()}
                  size="lg"
                  className={cn(
                    "h-14 px-8 text-lg font-semibold rounded-xl shadow-elegant",
                    "bg-gradient-primary hover:shadow-glow transition-all duration-300",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                >
                  Generate Strategy
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
              
              {umbrellaStatement && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={() => {
                      resetStore();
                      setInputValue('');
                      toast.success('Starting fresh!');
                    }}
                    variant="outline"
                    size="lg"
                    className="h-14 px-6"
                  >
                    <RefreshCw className="w-5 h-5 mr-2" />
                    Start Fresh
                  </Button>
                </motion.div>
              )}
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-sm text-muted-foreground"
            >
              ✨ This usually takes 30-60 seconds to analyze
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
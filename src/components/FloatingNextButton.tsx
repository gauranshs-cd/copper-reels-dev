import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface FloatingNextButtonProps {
  onClick?: () => void;
  nextPath?: string;
  label?: string;
  show?: boolean;
  disabled?: boolean;
  isComplete?: boolean;
  className?: string;
}

export function FloatingNextButton({ 
  onClick, 
  nextPath, 
  label = "Continue",
  show = true,
  disabled = false,
  isComplete = false,
  className
}: FloatingNextButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (nextPath) {
      navigate(nextPath);
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className={cn(
            "fixed bottom-8 right-8 z-50",
            className
          )}
        >
          <Button
            onClick={handleClick}
            disabled={disabled}
            size="lg"
            className={cn(
              "bg-gradient-primary shadow-glow hover:shadow-glow-lg transition-all duration-300",
              "px-6 py-3 text-lg font-semibold",
              isComplete && "bg-green-500 hover:bg-green-600"
            )}
          >
            <span className="mr-2">{label}</span>
            {isComplete ? (
              <Check className="w-5 h-5" />
            ) : (
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            )}
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
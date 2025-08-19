import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PatternBankViewer } from '@/components/PatternBankViewer';
import { NavigationFlow } from '@/components/NavigationFlow';

export default function PatternBank() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-subtle pb-32">
      <div className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              onClick={() => navigate('/ideation')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Ideation
            </Button>
          </div>

          {/* Pattern Bank Content */}
          <PatternBankViewer />
        </motion.div>
      </div>
      
      {/* Navigation Flow */}
      <NavigationFlow />
    </div>
  );
}
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Play, BarChart3, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth/AuthProvider';

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    // If user is authenticated, redirect to onboarding
    if (!loading && user) {
      navigate('/onboarding');
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-4xl"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-8"
        >
          <img 
            src="/cr-logo-new.svg" 
            alt="Copper Reels" 
            className="h-24 mx-auto mb-6"
            style={{ maxWidth: '350px' }}
          />
          
          <h1 className="text-6xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
            YouTube Content
            <span className="text-transparent bg-gradient-primary bg-clip-text block">
              Strategy Builder
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
            Transform your expertise into viral YouTube content with AI-powered strategy, 
            ideation, and video planning tools.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12"
        >
          <div className="flex items-center space-x-2 text-muted-foreground">
            <BarChart3 className="w-5 h-5" />
            <span>AI-Powered Strategy</span>
          </div>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Play className="w-5 h-5" />
            <span>Video Planning</span>
          </div>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Sparkles className="w-5 h-5" />
            <span>Content Ideation</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            onClick={() => navigate('/login')}
            size="lg"
            className="h-16 px-8 text-lg font-semibold rounded-xl bg-gradient-primary hover:shadow-glow transition-all duration-300"
          >
            Get Started
            <Play className="w-5 h-5 ml-2" />
          </Button>
          
          <Button
            onClick={() => navigate('/login')}
            variant="outline"
            size="lg"
            className="h-16 px-8 text-lg font-semibold rounded-xl"
          >
            <LogIn className="w-5 h-5 mr-2" />
            Sign In
          </Button>
        </motion.div>

        {!loading && !user && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-sm text-muted-foreground mt-6"
          >
            Sign up to start building your content strategy
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};

export default Index;

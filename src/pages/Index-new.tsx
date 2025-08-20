import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/components/auth/AuthProvider';
import { 
  Sparkles, 
  Video, 
  TrendingUp, 
  Lightbulb,
  FileText,
  Image,
  ArrowRight,
  Play,
  Zap,
  Target,
  BarChart3,
  Users
} from 'lucide-react';

export default function Index() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      icon: Lightbulb,
      title: 'AI Ideation',
      description: 'Generate viral video ideas tailored to your niche',
      color: 'from-[#4CAF84] to-[#29B6F6]'
    },
    {
      icon: FileText,
      title: 'Script Builder',
      description: 'Create engaging scripts with psychological triggers',
      color: 'from-[#29B6F6] to-[#1E88E5]'
    },
    {
      icon: Image,
      title: 'Thumbnail Generator',
      description: 'Design eye-catching thumbnails that get clicks',
      color: 'from-[#A4CCC4] to-[#4CAF84]'
    },
    {
      icon: TrendingUp,
      title: 'Pattern Banking',
      description: 'Learn from viral patterns and replicate success',
      color: 'from-[#1E88E5] to-[#29B6F6]'
    }
  ];

  const stats = [
    { label: 'Videos Created', value: '10K+', icon: Video },
    { label: 'Average CTR Boost', value: '47%', icon: Target },
    { label: 'Active Creators', value: '2.5K', icon: Users },
    { label: 'Views Generated', value: '50M+', icon: BarChart3 }
  ];

  return (
    <div className="min-h-screen bg-gradient-mesh">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial opacity-50" />
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Logo */}
            <motion.img
              src="/copper-reels-logo.jpg"
              alt="Copper Reels"
              className="h-32 md:h-40 mx-auto mb-8 object-contain"
              style={{ maxWidth: '400px' }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-gradient">Transform Your</span>
              <br />
              YouTube Success
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              AI-powered content creation system that helps you generate viral ideas, 
              write engaging scripts, and design thumbnails that convert.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <>
                  <Button
                    size="lg"
                    onClick={() => navigate('/ideation')}
                    className="bg-gradient-primary text-white hover:shadow-glow group"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Start Creating
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => navigate('/foundation')}
                    className="border-2"
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    Setup Foundation
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    size="lg"
                    onClick={() => navigate('/auth')}
                    className="bg-gradient-primary text-white hover:shadow-glow group"
                  >
                    Get Started Free
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => navigate('/auth')}
                    className="border-2 glass"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Watch Demo
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y bg-background/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <stat.icon className="w-8 h-8 mx-auto mb-2 text-[#4CAF84]" />
                <div className="text-3xl font-bold text-gradient">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">
              Everything You Need to <span className="text-gradient">Go Viral</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powered by AI and proven YouTube growth strategies
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 h-full hover:shadow-glow transition-all duration-300 hover:-translate-y-1 group">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Transform Your Channel?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of creators who are using Copper Reels to grow their YouTube channels
            </p>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate(user ? '/ideation' : '/auth')}
              className="bg-white text-[#4CAF84] hover:bg-white/90 hover:shadow-glow-lg"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Start Creating Now
            </Button>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-mesh">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">
              How <span className="text-gradient">Copper Reels</span> Works
            </h2>
            <p className="text-xl text-muted-foreground">
              Three simple steps to YouTube success
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: '1',
                title: 'Set Your Foundation',
                description: 'Define your niche, audience, and content pillars'
              },
              {
                step: '2',
                title: 'Generate Ideas',
                description: 'AI creates viral video concepts tailored to your channel'
              },
              {
                step: '3',
                title: 'Create & Publish',
                description: 'Get scripts, thumbnails, and everything you need'
              }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative"
              >
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-primary text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-[#4CAF84] to-[#29B6F6]" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
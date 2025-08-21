import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/components/auth/AuthProvider';
import { Footer } from '@/components/Footer';
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
  Users,
  CheckCircle,
  Clock,
  Shield,
  Award,
  Star,
  MessageSquare,
  ChevronRight,
  Rocket,
  Brain
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
              src="/copper-reels-logo.svg"
              alt="Copper Reels"
              className="h-24 md:h-32 mx-auto mb-8 w-auto"
              style={{ maxWidth: '500px' }}
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

      {/* Testimonials Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-4" variant="secondary">
              <Star className="w-3 h-3 mr-1" />
              Success Stories
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by <span className="text-gradient">2,500+ Creators</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See how content creators are scaling their channels with Copper Reels
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Sarah Johnson',
                channel: 'TechSavvySarah',
                avatar: 'SJ',
                rating: 5,
                text: 'Copper Reels helped me go from 1K to 100K subscribers in 6 months. The AI suggestions are spot-on!',
                metric: '100x Growth'
              },
              {
                name: 'Mike Chen',
                channel: 'CodingWithMike',
                avatar: 'MC',
                rating: 5,
                text: 'The script builder is a game-changer. My watch time increased by 300% using their frameworks.',
                metric: '+300% Watch Time'
              },
              {
                name: 'Emma Davis',
                channel: 'LifestyleEmma',
                avatar: 'ED',
                rating: 5,
                text: 'Finally, a tool that understands YouTube algorithms. Every video I create now gets 10x more views.',
                metric: '10x More Views'
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 h-full">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.channel}</p>
                    </div>
                  </div>
                  <div className="flex mb-3">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                  <p className="text-sm mb-4 italic">"{testimonial.text}"</p>
                  <Badge variant="secondary">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {testimonial.metric}
                  </Badge>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-4" variant="secondary">
              <MessageSquare className="w-3 h-3 mr-1" />
              FAQs
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                q: 'How does the AI generate video ideas?',
                a: 'Our AI analyzes millions of viral videos, current trends, and your specific niche to generate ideas with high viral potential.'
              },
              {
                q: 'Can I use Copper Reels for any YouTube niche?',
                a: 'Yes! Our system adapts to any niche - from tech and gaming to lifestyle and education. The AI learns from your specific audience.'
              },
              {
                q: 'Do I need video editing skills?',
                a: 'No editing skills required! We provide scripts, titles, and thumbnails. You can also use our professional editing services.'
              },
              {
                q: 'How quickly can I see results?',
                a: 'Most creators see improved engagement within their first 5 videos. Some report 10x view increases within 30 days.'
              },
              {
                q: 'Is there a free trial?',
                a: 'Yes! Start with our free plan to test the platform. Upgrade anytime to unlock unlimited features.'
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6">
                  <h3 className="font-semibold mb-2">{faq.q}</h3>
                  <p className="text-muted-foreground">{faq.a}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-primary/5 to-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Create Your Next
              <span className="text-gradient"> Viral Video?</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of creators who are growing their channels with AI-powered content
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate(user ? '/ideation' : '/auth')}
                className="bg-gradient-primary text-white hover:shadow-glow"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Start Creating Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/services')}
              >
                <Video className="w-5 h-5 mr-2" />
                Get Video Editing
              </Button>
            </div>
            <div className="flex items-center justify-center gap-6 mt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-500" />
                <span>100% secure</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-500" />
                <span>Setup in 2 minutes</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
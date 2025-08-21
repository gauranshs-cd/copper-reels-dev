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
      title: 'Set Your Foundation',
      description: 'Pick your niche + goals',
      color: 'from-[#4CAF84] to-[#29B6F6]'
    },
    {
      icon: FileText,
      title: 'Generate Ideas',
      description: 'AI delivers viral-ready concepts',
      color: 'from-[#29B6F6] to-[#1E88E5]'
    },
    {
      icon: Rocket,
      title: 'Publish & Grow',
      description: 'Get scripts, thumbnails, and editing if you need it',
      color: 'from-[#A4CCC4] to-[#4CAF84]'
    },
    {
      icon: TrendingUp,
      title: 'Scale & Optimize',
      description: 'Track performance and refine your strategy',
      color: 'from-[#1E88E5] to-[#29B6F6]'
    }
  ];

  const stats = [
    { label: 'Clients Served', value: '1,200+', icon: Video },
    { label: 'Social Followers', value: '100K+', icon: Target },
    { label: 'Years in Business', value: '15+', icon: Users },
    { label: 'AI Tool Users', value: '700K+', icon: BarChart3 }
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
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-gradient">Your AI-Powered</span>
              <br />
              YouTube Growth Assistant
            </h1>
            
            <p className="text-xl text-muted-foreground mb-4 max-w-2xl mx-auto">
              Generate viral ideas, scripts, and thumbnails in minutes, then scale with our full-service editing when you're ready.
            </p>
            
            <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">
                30-day free trial • Then just $10/month • Cancel anytime
              </span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <>
                  <Button
                    size="lg"
                    onClick={() => navigate('/chat')}
                    className="bg-gradient-primary text-white hover:shadow-glow group"
                  >
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Open AI Studio
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => navigate('/dashboard')}
                    className="border-2"
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    View Dashboard
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    size="lg"
                    onClick={() => navigate('/auth')}
                    className="bg-gradient-primary text-white hover:shadow-glow group"
                  >
                    Start 30-Day Free Trial
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
              Ready to Grow Your Channel?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of creators who are using Copper Reels to grow their YouTube channels
            </p>
            <Button
              size="lg"
              onClick={() => navigate(user ? '/ideation' : '/auth')}
              className="bg-white text-[#4CAF84] hover:bg-white/90 hover:shadow-glow-lg font-semibold"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Start Creating Now
            </Button>
          </motion.div>
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
              Built on <span className="text-gradient">15+ Years of Business Excellence</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From enterprise solutions to mobile apps, podcasts to YouTube - we've helped businesses scale with proven strategies. 
              See our LinkedIn recommendations and 15+ years of business success since 2010.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Henry',
                channel: 'Video Client',
                avatar: 'H',
                rating: 5,
                text: 'Our video team is awesome!',
                metric: 'Team Excellence'
              },
              {
                name: 'CEO CasperEdge',
                channel: 'SaaS Platform',
                avatar: 'CE',
                rating: 5,
                text: 'Our team is so great and understanding, so motivated and flexible too.',
                metric: 'Flexible & Motivated'
              },
              {
                name: 'Tech Client',
                channel: 'Enterprise Solutions',
                avatar: 'TC',
                rating: 5,
                text: 'You have done awesome work time and time again. Big and small clients, all kinds of projects.',
                metric: 'Proven Results'
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

      {/* AI Capabilities Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-4" variant="default">
              <Brain className="w-3 h-3 mr-1" />
              AI-Powered Intelligence
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Built on $50k+ of Creator Training
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We've flown across the country to learn from successful creators and built their strategies into our AI
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <Card className="p-6 h-full">
                <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-primary flex items-center justify-center">
                  <Target className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">Viral Pattern Analysis</h3>
                <p className="text-muted-foreground">
                  Our AI studies thousands of viral videos to identify patterns that drive clicks, views, and engagement
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <Card className="p-6 h-full">
                <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-primary/80 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">Psychological Triggers</h3>
                <p className="text-muted-foreground">
                  Leverages proven psychological principles to create hooks that grab attention and keep viewers watching
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <Card className="p-6 h-full">
                <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-primary/60 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">Performance Optimization</h3>
                <p className="text-muted-foreground">
                  Continuously learns from your results to refine strategies and improve future content performance
                </p>
              </Card>
            </motion.div>
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
                Start free today. Upgrade anytime.
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
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Footer } from '@/components/Footer';
import { 
  TrendingUp,
  Lock,
  Sparkles,
  BarChart3,
  MousePointer,
  Eye,
  ThumbsUp,
  FileText,
  Image,
  AlertTriangle,
  Heart,
  Target,
  Zap,
  ArrowRight,
  Brain,
  Lightbulb,
  Play,
  CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const patternCategories = [
  {
    title: 'Viral Hooks',
    icon: Zap,
    count: '500+',
    examples: [
      'The "Nobody Talks About This" Pattern',
      'The "I Was Wrong" Revelation',
      'The "Secret Professional Trick"',
      'The "Shocking Statistic" Opener'
    ],
    color: 'from-yellow-500/20 to-orange-500/20'
  },
  {
    title: 'Thumbnail Formulas',
    icon: Image,
    count: '300+',
    examples: [
      'The "Before/After" Transformation',
      'The "Shocked Face" Formula',
      'The "Red Arrow" Psychology',
      'The "Number Overlay" Strategy'
    ],
    color: 'from-blue-500/20 to-purple-500/20'
  },
  {
    title: 'Title Templates',
    icon: FileText,
    count: '400+',
    examples: [
      'The "Why X is Actually Y" Format',
      'The "I Tried X for 30 Days"',
      'The "Scientists Discovered" Hook',
      'The "Stop Doing X, Do Y Instead"'
    ],
    color: 'from-green-500/20 to-teal-500/20'
  },
  {
    title: 'Retention Tactics',
    icon: BarChart3,
    count: '250+',
    examples: [
      'The "Loop Opening" Technique',
      'The "Progressive Reveal" Method',
      'The "Cliffhanger Checkpoint"',
      'The "Pattern Interrupt" Strategy'
    ],
    color: 'from-purple-500/20 to-pink-500/20'
  }
];

const provenPatterns = [
  {
    type: 'Hook',
    pattern: 'Most people think [common belief], but [surprising truth]',
    avgViews: '2.3M',
    retention: '68%'
  },
  {
    type: 'Title',
    pattern: 'How [unexpected person] [achieved surprising result]',
    avgViews: '1.8M',
    retention: '62%'
  },
  {
    type: 'Thumbnail',
    pattern: 'Split screen: Problem vs Solution visualization',
    avgViews: '3.1M',
    retention: '71%'
  }
];

const features = [
  {
    icon: Brain,
    title: 'AI-Analyzed',
    description: 'Every pattern validated through 10,000+ viral videos'
  },
  {
    icon: TrendingUp,
    title: 'Performance Data',
    description: 'See actual view counts and retention rates'
  },
  {
    icon: Lightbulb,
    title: 'Niche-Specific',
    description: 'Patterns customized for your content category'
  },
  {
    icon: Target,
    title: 'Copy & Adapt',
    description: 'Ready-to-use templates you can customize'
  }
];

export default function PatternBank() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-mesh">
      {/* Hero Section */}
      <section className="py-20 border-b relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial opacity-30" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge className="mb-4" variant="secondary">
              <TrendingUp className="w-3 h-3 mr-1" />
              Pattern Bank
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              1,450+ Proven <span className="text-gradient">Viral Patterns</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              The exact hooks, titles, and thumbnails that generated billions of views - 
              analyzed, categorized, and ready to use
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" onClick={() => navigate('/login')}>
                Unlock Pattern Bank
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/documentation')}>
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
            <div>
              <div className="text-2xl font-bold text-primary">10,000+</div>
              <p className="text-sm text-muted-foreground">Videos Analyzed</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">1,450+</div>
              <p className="text-sm text-muted-foreground">Patterns Identified</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">82%</div>
              <p className="text-sm text-muted-foreground">Avg View Increase</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">Real-time</div>
              <p className="text-sm text-muted-foreground">Updates</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pattern Categories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">What's Inside the Pattern Bank</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Every pattern is tested, proven, and comes with real performance data
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {patternCategories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 relative overflow-hidden group hover:scale-105 transition-transform">
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-10`} />
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                          <category.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{category.title}</h3>
                          <Badge variant="secondary">{category.count} patterns</Badge>
                        </div>
                      </div>
                      <Lock className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                      {category.examples.map((example, exIndex) => (
                        <div key={exIndex} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                          <span className="text-muted-foreground">{example}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Patterns */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-4" variant="default">
              <Sparkles className="w-3 h-3 mr-1" />
              Free Samples
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Try These Proven Patterns</h2>
            <p className="text-muted-foreground">
              Here are 3 patterns that consistently go viral
            </p>
          </motion.div>

          <div className="space-y-6 max-w-4xl mx-auto">
            {provenPatterns.map((pattern, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant="outline">{pattern.type}</Badge>
                    <div className="flex gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4 text-primary" />
                        Avg: {pattern.avgViews}
                      </span>
                      <span className="flex items-center gap-1">
                        <BarChart3 className="w-4 h-4 text-primary" />
                        {pattern.retention}
                      </span>
                    </div>
                  </div>
                  <p className="text-lg font-medium mb-2">{pattern.pattern}</p>
                  <Button size="sm" variant="outline" onClick={() => navigate('/login')}>
                    See Full Analysis
                    <Lock className="w-3 h-3 ml-2" />
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="text-center"
              >
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge className="mb-4" variant="default">
              <Play className="w-3 h-3 mr-1" />
              Start Creating
            </Badge>
            <h2 className="text-3xl font-bold mb-4">
              Stop Guessing. Start Using <span className="text-gradient">Proven Patterns</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join creators who are using data-driven patterns to consistently create viral content
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" onClick={() => navigate('/login')}>
                Start 30-Day Free Trial
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/services')}>
                View Pricing
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              No credit card required • Full access • Cancel anytime
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
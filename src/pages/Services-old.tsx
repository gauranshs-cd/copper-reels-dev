import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Video, 
  DollarSign, 
  Clock, 
  Zap,
  Users,
  Award,
  Calendar,
  Check,
  ArrowRight,
  Star,
  TrendingUp,
  Shield,
  Sparkles,
  Package,
  CreditCard,
  MessageCircle,
  Play,
  Target,
  Brain,
  Lightbulb,
  BarChart3,
  MousePointer,
  Eye,
  ThumbsUp,
  FileText,
  Image,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { StripeCheckout } from '@/components/StripeCheckout';
import { Footer } from '@/components/Footer';

export default function Services() {
  const navigate = useNavigate();
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutPackage, setCheckoutPackage] = useState<'payAsYouGo' | null>(null);

  const handleCheckout = (packageType: string) => {
    if (packageType === 'starter') {
      setCheckoutPackage('payAsYouGo');
      setShowCheckout(true);
    }
  };

  const problems = [
    {
      icon: Clock,
      title: 'Scripts Take Too Long',
      description: 'Coming up with fresh video scripts takes too long.',
      color: 'from-red-500 to-orange-500',
      bgColor: 'bg-red-50 dark:bg-red-950/20'
    },
    {
      icon: Eye,
      title: 'Thumbnails Don\'t Click',
      description: 'Thumbnails don\'t grab clicks (or worse, mislead).',
      color: 'from-orange-500 to-yellow-500',
      bgColor: 'bg-orange-50 dark:bg-orange-950/20'
    },
    {
      icon: BarChart3,
      title: 'Videos Don\'t Convert',
      description: 'Videos fail to break out and actually drive sales.',
      color: 'from-yellow-500 to-red-500',
      bgColor: 'bg-yellow-50 dark:bg-yellow-950/20'
    }
  ];

  const solutions = [
    {
      icon: Brain,
      title: 'AI-Powered Scripts',
      description: 'Scripts that hook & deliver (viewer satisfaction = growth).',
      color: 'from-primary to-primary/70',
      bgColor: 'bg-primary/10'
    },
    {
      icon: Target,
      title: 'Proven Thumbnails',
      description: 'Thumbnails that pop — built on proven "outlier" patterns.',
      color: 'from-primary/80 to-primary/50',
      bgColor: 'bg-primary/10'
    },
    {
      icon: TrendingUp,
      title: 'Repeat Winners',
      description: 'Repeat-the-winners system so every hit multiplies.',
      color: 'from-primary/60 to-primary/40',
      bgColor: 'bg-primary/10'
    }
  ];

  const deliverables = [
    {
      icon: FileText,
      title: 'Complete Script',
      description: 'Mapped for watch-time optimization',
      color: 'from-primary to-primary/70',
      bgColor: 'bg-primary/10'
    },
    {
      icon: Image,
      title: 'Multiple Options',
      description: 'Title & thumbnail variations',
      color: 'from-primary/80 to-primary/50',
      bgColor: 'bg-primary/10'
    },
    {
      icon: Sparkles,
      title: 'Full-Service Help',
      description: 'Done-for-you if you want it',
      color: 'from-primary/60 to-primary/40',
      bgColor: 'bg-primary/10'
    }
  ];

  return (
    <>
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial opacity-30" />
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge className="mb-4 px-4 py-1" variant="secondary">
              <Sparkles className="w-3 h-3 mr-1" />
              AI-Powered Content Creation
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-gradient">Simple, Transparent Pricing</span>
              <br />
              AI Tools + Video Editing Services
            </h1>
            
            <p className="text-xl text-muted-foreground mb-4 max-w-2xl mx-auto">
              Turn your ideas into binge-worthy YouTube videos without the headache of writing scripts or guessing thumbnails.
            </p>
            
            <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">
                AI Platform: 30-day free trial • Then $10/month • Cancel anytime
              </span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => handleCheckout('starter')}
                className="bg-gradient-primary text-white hover:shadow-glow group"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Start 30-Day Free Trial
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => window.open('https://calendly.com/arvindsarin/30min', '_blank')}
              >
                <Calendar className="w-5 h-5 mr-2" />
                Learn About Video Editing
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-4" variant="destructive">
              <AlertTriangle className="w-3 h-3 mr-1" />
              The Problem
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Most YouTube Videos Fail
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {problems.map((problem, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`p-6 h-full border-l-4 border-l-red-500 ${problem.bgColor}`}>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${problem.color} flex items-center justify-center mb-4`}>
                    <problem.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{problem.title}</h3>
                  <p className="text-muted-foreground">{problem.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The Fix Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-4" variant="default">
              <Zap className="w-3 h-3 mr-1" />
              The Fix
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Built on $50k+ of Proven Strategies
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Distilled into AI-powered systems that deliver results.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {solutions.map((solution, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`p-6 h-full border-l-4 border-l-green-500 ${solution.bgColor}`}>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${solution.color} flex items-center justify-center mb-4`}>
                    <solution.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{solution.title}</h3>
                  <p className="text-muted-foreground">{solution.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What You Get Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-4" variant="secondary">
              <Package className="w-3 h-3 mr-1" />
              What You Get
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Complete Video Package
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to create viral content that drives real business results
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
            {deliverables.map((deliverable, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`p-6 h-full border-l-4 border-l-blue-500 ${deliverable.bgColor}`}>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${deliverable.color} flex items-center justify-center mb-4`}>
                    <deliverable.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{deliverable.title}</h3>
                  <p className="text-muted-foreground">{deliverable.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* AI Platform */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-6 h-full border-2 hover:border-primary/50 transition-all">
                <div className="text-center mb-6">
                  <Badge className="mb-3" variant="secondary">
                    <Sparkles className="w-3 h-3 mr-1" />
                    AI Platform
                  </Badge>
                  <h3 className="text-2xl font-bold mb-2">Content Creation AI</h3>
                  <p className="text-sm text-muted-foreground mb-4">Everything you need to create viral YouTube content</p>
                  <div className="mb-2">
                    <span className="text-3xl font-bold">$10</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <p className="text-sm text-green-500 font-medium">30-day free trial • Cancel anytime</p>
                </div>
                
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Unlimited AI script generation</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Viral pattern analysis</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Thumbnail & title generator</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Content ideation tools</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Video planning system</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Export to any format</span>
                  </li>
                </ul>
                
                <Button
                  className="w-full bg-gradient-primary"
                  onClick={() => handleCheckout('starter')}
                >
                  Start Free Trial
                </Button>
              </Card>
            </motion.div>

            {/* Video Editing Services */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6 h-full border-2 hover:border-primary/50 transition-all">
                <div className="text-center mb-6">
                  <Badge className="mb-3" variant="secondary">
                    <Video className="w-3 h-3 mr-1" />
                    Video Editing
                  </Badge>
                  <h3 className="text-2xl font-bold mb-2">Professional Editing</h3>
                  <p className="text-sm text-muted-foreground mb-4">Our team edits faster than AI with premium quality</p>
                  <div className="mb-2">
                    <span className="text-3xl font-bold">$150</span>
                    <span className="text-muted-foreground">/minute</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Bulk discounts available</p>
                </div>
                
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Professional video editing</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Color grading & correction</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Motion graphics & animations</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Sound design & music</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>48-hour turnaround</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>2 revisions included</span>
                  </li>
                </ul>
                
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => window.open('https://calendly.com/arvindsarin/30min', '_blank')}
                >
                  Book Consultation
                </Button>
              </Card>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-4" variant="outline">
              <Clock className="w-3 h-3 mr-1" />
              Our Process
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How We Deliver Results
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              A proven 4-step process that ensures your content performs
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                step: '1',
                title: 'Discovery',
                description: 'We analyze your niche, audience, and goals to create a tailored strategy'
              },
              {
                step: '2',
                title: 'Creation',
                description: 'AI generates scripts and thumbnails optimized for your specific audience'
              },
              {
                step: '3',
                title: 'Review',
                description: 'You review and approve content with unlimited revisions included'
              },
              {
                step: '4',
                title: 'Launch',
                description: 'We help you publish and track performance for continuous optimization'
              }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <Card className="p-6 h-full">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-primary text-white text-xl font-bold flex items-center justify-center">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-4" variant="outline">
              <Target className="w-3 h-3 mr-1" />
              Why Us
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              YouTube Doesn't Reward Effort
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              It rewards packaging + satisfaction. We cut through the guesswork and give you what works.
            </p>
          </motion.div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-8">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <span className="font-semibold">15+ Years Business</span>
            </div>
            <div className="flex items-center gap-2">
              <Play className="w-5 h-5 text-primary" />
              <span className="font-semibold">1,200+ Clients</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span className="font-semibold">100K+ Social Followers</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="p-12 text-center bg-gradient-to-br from-primary/20 via-primary/10 to-transparent">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Content?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Tried the AI tool? Ready for done-for-you editing? Start with our Starter Package today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => handleCheckout('starter')}
                className="bg-gradient-primary"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Start 30-Day Free Trial
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => window.open('https://calendly.com/arvindsarin/30min', '_blank')}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Chat with Sales
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </div>

    {/* Footer */}
    <Footer />

    {/* Stripe Checkout Modal */}
    {showCheckout && checkoutPackage && (
      <StripeCheckout
        packageType={checkoutPackage}
        estimatedMinutes={10}
        onSuccess={() => {
          setShowCheckout(false);
          toast.success('Order placed successfully! Check your email for confirmation.');
        }}
        onCancel={() => {
          setShowCheckout(false);
          setCheckoutPackage(null);
        }}
      />
    )}
    </>
  );
}
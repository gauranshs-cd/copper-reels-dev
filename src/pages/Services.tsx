import { motion } from 'framer-motion';
import { 
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Brain,
  Calendar,
  Camera,
  Check,
  CheckCircle2,
  Clock,
  CreditCard,
  DollarSign,
  Edit,
  Eye,
  FileText,
  Gift,
  Headphones,
  Heart,
  Image,
  Lightbulb,
  MessageCircle,
  MousePointer,
  Package,
  Phone,
  Play,
  Shield,
  Sparkles,
  Star,
  Target,
  ThumbsUp,
  TrendingUp,
  Users,
  Video,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StripeCheckout } from '@/components/StripeCheckout';
import { Footer } from '@/components/Footer';

export default function Services() {
  const navigate = useNavigate();
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutPackage, setCheckoutPackage] = useState<'payAsYouGo' | null>(null);

  const handleCheckout = (packageType: string) => {
    if (packageType === 'ai-platform') {
      navigate('/auth');
    } else {
      window.open('https://calendly.com/arvindsarin/30min', '_blank');
    }
  };

  // What's included in full service
  const fullServiceIncludes = [
    { icon: Camera, text: "Equipment recommendations & setup help" },
    { icon: MessageCircle, text: "Motivation & strategy calls whenever needed" },
    { icon: Edit, text: "Complete script writing & optimization" },
    { icon: Image, text: "Unlimited thumbnail variations until perfect" },
    { icon: Video, text: "Professional video editing with unlimited revisions" },
    { icon: Headphones, text: "Sound design, music, and audio optimization" },
    { icon: Users, text: "Direct access to our entire team" },
    { icon: Heart, text: "We genuinely care about your success" },
    { icon: Zap, text: "Rush delivery when you need it" },
    { icon: Phone, text: "WhatsApp support - message anytime" }
  ];

  // Value comparison
  const freelancerCosts = [
    { service: "Script Writer", cost: "$300-500/script" },
    { service: "Thumbnail Designer", cost: "$50-150/thumbnail" },
    { service: "Video Editor", cost: "$500-1500/video" },
    { service: "Strategy Consultant", cost: "$200-500/hour" },
    { service: "Motion Graphics", cost: "$100-300/minute" },
    { service: "Sound Design", cost: "$200-400/video" },
  ];

  return (
    <>
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-radial opacity-30" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge className="mb-4 px-4 py-1" variant="secondary">
              <Heart className="w-3 h-3 mr-1" />
              Full-Service YouTube Success
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              We Do <span className="text-gradient">Everything</span>
              <br />
              You Focus on Your Business
            </h1>
            
            <p className="text-xl text-muted-foreground mb-4 max-w-2xl mx-auto">
              Not just tools. Not just editing. We're your complete YouTube team that actually cares.
            </p>
            
            <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">
                No counting iterations • No hidden fees • Just results
              </span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => handleCheckout('ai-platform')}
                className="bg-gradient-primary text-white hover:shadow-glow group"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Start 30-Day Free Trial
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => window.open('https://wa.me/14697420195', '_blank')}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                WhatsApp Us Now
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Full Service Value Section */}
      <section className="py-20 bg-gradient-to-b from-background to-primary/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-4" variant="default">
              <Gift className="w-3 h-3 mr-1" />
              Everything Included
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What "Full Service" Really Means
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              When we say we do everything, we mean <span className="font-semibold">everything</span>. 
              No freelancer juggling. No quality compromises. Just one team that cares.
            </p>
          </motion.div>

          {/* Everything Included Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 max-w-7xl mx-auto mb-16">
            {fullServiceIncludes.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-4 h-full bg-primary/5 border-primary/20 hover:bg-primary/10 transition-colors">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center mb-3">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-sm">{item.text}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Value Comparison */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <Card className="p-8 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">The Real Value</h3>
                <p className="text-muted-foreground">What you'd pay hiring individual freelancers</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {freelancerCosts.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 rounded-lg bg-background/50">
                    <span className="font-medium">{item.service}</span>
                    <span className="text-muted-foreground">{item.cost}</span>
                  </div>
                ))}
              </div>
              
              <div className="text-center p-4 bg-primary/20 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Total freelancer cost per video:</p>
                <p className="text-3xl font-bold text-primary">$1,350 - $3,450</p>
                <p className="text-sm text-muted-foreground mt-2">Plus the headache of managing them all</p>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Simple 3-Tier Pricing */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-4" variant="secondary">
              <DollarSign className="w-3 h-3 mr-1" />
              Simple Pricing
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Choose Your Path
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Start with AI tools, add human editing when ready
            </p>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* AI Platform */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-8 h-full relative overflow-hidden border-2 hover:border-primary/50 transition-all">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16" />
                <div className="relative z-10">
                  <div className="text-center mb-6">
                    <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">AI Platform</h3>
                    <p className="text-sm text-muted-foreground mb-4">Generate unlimited content with AI</p>
                    <div className="mb-2">
                      <span className="text-4xl font-bold">$10</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    <Badge variant="secondary" className="mb-4">
                      30-day free trial
                    </Badge>
                  </div>
                  
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Unlimited AI scripts</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Viral pattern library</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Thumbnail generator</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Title optimizer</span>
                    </li>
                  </ul>
                  
                  <Button
                    className="w-full bg-gradient-primary"
                    onClick={() => handleCheckout('ai-platform')}
                  >
                    Start Free Trial
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Pay As You Go */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-8 h-full relative overflow-hidden border-2 hover:border-primary/50 transition-all">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16" />
                <div className="relative z-10">
                  <div className="text-center mb-6">
                    <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                      <Video className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Pay As You Go</h3>
                    <p className="text-sm text-muted-foreground mb-4">Perfect for testing our services</p>
                    <div className="mb-2">
                      <span className="text-4xl font-bold">$150</span>
                      <span className="text-muted-foreground">/minute</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">of finished video</p>
                  </div>
                  
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Everything in AI Platform</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Professional editing</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>48-hour delivery</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>All revisions included</span>
                    </li>
                  </ul>
                  
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => handleCheckout('pay-as-you-go')}
                  >
                    Book a Call
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Bundle Deal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-8 h-full relative overflow-hidden border-2 border-primary">
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                  <Star className="w-3 h-3 mr-1" />
                  Save $500
                </Badge>
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16" />
                <div className="relative z-10">
                  <div className="text-center mb-6">
                    <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                      <Gift className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Creator Bundle</h3>
                    <p className="text-sm text-muted-foreground mb-4">Best value for regular creators</p>
                    <div className="mb-2">
                      <span className="text-4xl font-bold">$1,000</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">for 10 minutes of video</p>
                  </div>
                  
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Everything included</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Priority delivery</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Direct team access</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Strategy calls included</span>
                    </li>
                  </ul>
                  
                  <Button
                    className="w-full bg-gradient-primary"
                    onClick={() => handleCheckout('bundle')}
                  >
                    Get Bundle Deal
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge className="mb-4" variant="secondary">
              <Heart className="w-3 h-3 mr-1" />
              Our Promise
            </Badge>
            <h2 className="text-3xl font-bold mb-4">We Treat You Like Family</h2>
            <p className="text-xl text-muted-foreground mb-8">
              No contracts. No counting revisions. No nickel-and-diming. 
              We work with you until you're happy, period. That's how we'd want to be treated.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" onClick={() => handleCheckout('ai-platform')}>
                Start Free Trial
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => window.open('https://wa.me/14697420195', '_blank')}>
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp Arvind
              </Button>
            </div>
          </motion.div>
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
          toast.success('Welcome to Copper Reels!');
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
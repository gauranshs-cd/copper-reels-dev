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
  Play
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function Services() {
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState<'starter' | 'professional' | 'enterprise'>('professional');
  const [billingCycle, setBillingCycle] = useState<'one-time' | 'monthly'>('one-time');

  const handleCheckout = (packageType: string) => {
    // Stripe integration will go here
    toast.info('Redirecting to secure checkout...');
    // For now, book a call
    window.open('https://calendly.com/copperreels/video-editing-consultation', '_blank');
  };

  const packages = {
    starter: {
      name: 'Starter',
      price: 150,
      unit: 'per minute',
      description: 'Perfect for trying our services',
      features: [
        'Professional video editing',
        'Color grading & correction',
        'Background music',
        'Basic transitions',
        '72-hour delivery',
        '2 revisions included',
        'YouTube optimization'
      ],
      cta: 'Start with Pay-as-you-go'
    },
    professional: {
      name: 'Professional Bundle',
      price: 1000,
      unit: 'per 10 minutes',
      savings: 500,
      description: 'Best value for regular creators',
      features: [
        'Everything in Starter',
        'Motion graphics & animations',
        'Custom transitions',
        'Sound design & SFX',
        '48-hour delivery',
        'Unlimited revisions',
        'Thumbnail design included',
        'Priority support',
        'Rush delivery available'
      ],
      popular: true,
      cta: 'Save 33% with Bundle'
    },
    enterprise: {
      name: 'Enterprise',
      price: 'Custom',
      unit: 'volume pricing',
      description: 'For channels & agencies',
      features: [
        'Everything in Professional',
        'Dedicated editor team',
        'Same-day delivery option',
        'Brand asset management',
        'Custom templates',
        'Analytics & reporting',
        'API access',
        'White-label options',
        'Dedicated account manager'
      ],
      cta: 'Contact Sales'
    }
  };

  const testimonials = [
    {
      name: 'Alex Thompson',
      channel: 'TechExplained',
      subscribers: '750K',
      avatar: 'AT',
      rating: 5,
      text: 'Copper Reels transformed my content. My watch time increased by 250% after they started editing my videos.',
      metric: '+250% Watch Time'
    },
    {
      name: 'Maria Garcia',
      channel: 'FitLife Daily',
      subscribers: '1.2M',
      avatar: 'MG',
      rating: 5,
      text: 'The editing quality is exceptional. They understand YouTube better than any other service I\'ve tried.',
      metric: '+400% Views'
    },
    {
      name: 'David Kim',
      channel: 'CodingMaster',
      subscribers: '500K',
      avatar: 'DK',
      rating: 5,
      text: 'Worth every penny. The ROI is incredible - my ad revenue tripled in 3 months.',
      metric: '3x Revenue'
    }
  ];

  const process = [
    {
      step: 1,
      title: 'Upload Your Raw Footage',
      description: 'Send us your recordings via our secure upload portal',
      icon: Video
    },
    {
      step: 2,
      title: 'Our Editors Work Magic',
      description: 'Professional editing with your style preferences',
      icon: Sparkles
    },
    {
      step: 3,
      title: 'Review & Revise',
      description: 'Get your edit back with unlimited revisions',
      icon: MessageCircle
    },
    {
      step: 4,
      title: 'Publish & Grow',
      description: 'Upload your polished video and watch it perform',
      icon: TrendingUp
    }
  ];

  const faqs = [
    {
      q: 'How fast is the turnaround?',
      a: 'Standard delivery is 48-72 hours. Rush delivery (24 hours) is available for Professional and Enterprise packages.'
    },
    {
      q: 'What if I need revisions?',
      a: 'Starter includes 2 revisions. Professional and Enterprise packages include unlimited revisions.'
    },
    {
      q: 'Do you work with my existing style?',
      a: 'Absolutely! We analyze your existing content and match your style while enhancing quality.'
    },
    {
      q: 'Can I cancel anytime?',
      a: 'Yes, you can cancel or pause your service anytime. Unused credits never expire.'
    }
  ];

  return (
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
              Professional Video Editing Services
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-gradient">Transform Your Content</span>
              <br />
              Into Viral Videos
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Professional YouTube video editing that drives views, engagement, and revenue. 
              Join 500+ creators who trust us with their content.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                size="lg"
                onClick={() => handleCheckout('professional')}
                className="bg-gradient-primary text-white hover:shadow-glow"
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Get Started - Save 33%
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => window.open('https://calendly.com/copperreels/video-editing-consultation', '_blank')}
              >
                <Calendar className="w-5 h-5 mr-2" />
                Book Free Consultation
              </Button>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-8">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <span className="font-semibold">500+ Creators</span>
              </div>
              <div className="flex items-center gap-2">
                <Play className="w-5 h-5 text-primary" />
                <span className="font-semibold">10K+ Videos</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span className="font-semibold">100M+ Views</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-muted-foreground">Choose the plan that works for you</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {Object.entries(packages).map(([key, pkg], index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "relative",
                  selectedPackage === key && "ring-2 ring-primary rounded-lg"
                )}
                onClick={() => setSelectedPackage(key as any)}
              >
                <Card className={cn(
                  "p-6 h-full cursor-pointer transition-all hover:shadow-lg",
                  pkg.popular && "border-primary"
                )}>
                  {pkg.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary">
                      Most Popular
                    </Badge>
                  )}
                  
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold mb-2">{pkg.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{pkg.description}</p>
                    
                    <div className="mb-2">
                      {typeof pkg.price === 'number' ? (
                        <>
                          <span className="text-4xl font-bold">${pkg.price}</span>
                          <span className="text-muted-foreground ml-2">/{pkg.unit}</span>
                        </>
                      ) : (
                        <span className="text-3xl font-bold">{pkg.price}</span>
                      )}
                    </div>
                    
                    {pkg.savings && (
                      <Badge variant="secondary" className="mb-4">
                        Save ${pkg.savings}
                      </Badge>
                    )}
                  </div>
                  
                  <ul className="space-y-3 mb-6">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    className={cn(
                      "w-full",
                      pkg.popular ? "bg-gradient-primary" : ""
                    )}
                    variant={pkg.popular ? "default" : "outline"}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCheckout(key);
                    }}
                  >
                    {pkg.cta}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground">From raw footage to viral video in 4 simple steps</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {process.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-primary rounded-full flex items-center justify-center text-white">
                  <item.icon className="w-8 h-8" />
                </div>
                <h3 className="font-semibold mb-2">Step {item.step}: {item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
                {index < process.length - 1 && (
                  <ArrowRight className="w-5 h-5 mx-auto mt-4 text-muted-foreground hidden md:block" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Creator Success Stories</h2>
            <p className="text-muted-foreground">See what our clients are saying</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 h-full">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold">
                      {testimonial.avatar}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.channel}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.subscribers} subscribers</p>
                    </div>
                  </div>
                  
                  <div className="flex mb-3">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                  
                  <p className="text-sm mb-4 italic">"{testimonial.text}"</p>
                  
                  <Badge variant="secondary" className="w-full justify-center">
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
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
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

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="p-12 text-center bg-gradient-to-br from-primary/20 via-primary/10 to-transparent">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Content?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join 500+ creators who are scaling their channels with professional editing
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => handleCheckout('professional')}
                className="bg-gradient-primary"
              >
                <DollarSign className="w-5 h-5 mr-2" />
                Get Started Today
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => window.open('https://calendly.com/copperreels/video-editing-consultation', '_blank')}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Chat with Sales
              </Button>
            </div>
            
            <div className="flex items-center justify-center gap-4 mt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Shield className="w-4 h-4" />
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>48hr Delivery</span>
              </div>
              <div className="flex items-center gap-1">
                <Award className="w-4 h-4" />
                <span>Money-back Guarantee</span>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Video, 
  Sparkles, 
  Clock, 
  DollarSign, 
  Check, 
  ArrowRight,
  Zap,
  Users,
  Award,
  Calendar,
  ChevronRight,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface VideoEditingUpsellProps {
  isOpen: boolean;
  onClose: () => void;
  context?: 'script' | 'thumbnail' | 'export' | 'general';
  scriptLength?: number;
}

export function VideoEditingUpsell({ 
  isOpen, 
  onClose, 
  context = 'general',
  scriptLength = 6 
}: VideoEditingUpsellProps) {
  const [selectedPackage, setSelectedPackage] = useState<'pay-as-you-go' | 'bundle'>('bundle');
  
  const estimatedMinutes = Math.ceil(scriptLength * 1.5); // Estimate 1.5x script length for edited video
  const payAsYouGoPrice = estimatedMinutes * 150;
  const bundlePrice = Math.ceil(estimatedMinutes / 10) * 1000;
  const savings = payAsYouGoPrice - bundlePrice;

  const handleBookCall = () => {
            window.open('https://calendly.com/arvindsarin/30min', '_blank');
    toast.success('Redirecting to booking page...');
  };

  const handleCheckout = () => {
    // Will integrate Stripe here
    toast.info('Payment system coming soon! Book a call to get started.');
    handleBookCall();
  };

  const features = [
    'Professional color grading',
    'Custom transitions & effects',
    'Background music & sound design',
    'Motion graphics & animations',
    'Thumbnail design included',
    'Unlimited revisions',
    '48-hour turnaround',
    'YouTube optimization'
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      channel: '500K subscribers',
      text: 'Copper Reels editing took my content to the next level. Views increased by 300%!'
    },
    {
      name: 'Mike Rodriguez',
      channel: '1.2M subscribers',
      text: 'The best investment for my channel. Professional quality at an unbeatable price.'
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Video className="w-6 h-6 text-primary" />
            Professional Video Editing Services
          </DialogTitle>
          <DialogDescription>
            Transform your script into a professionally edited YouTube video
          </DialogDescription>
        </DialogHeader>

        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-primary/20 via-primary/10 to-transparent p-6 mb-6">
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-2">
              Your Script + Our Editing = Viral Videos
            </h3>
            <p className="text-muted-foreground mb-4">
              Let our professional editors bring your content to life while you focus on creating more
            </p>
            
            {context === 'script' && (
              <div className="flex items-center gap-4 text-sm">
                <Badge variant="secondary" className="px-3 py-1">
                  <Clock className="w-3 h-3 mr-1" />
                  Estimated: {estimatedMinutes} minutes
                </Badge>
                <Badge variant="secondary" className="px-3 py-1">
                  <Zap className="w-3 h-3 mr-1" />
                  48hr delivery
                </Badge>
              </div>
            )}
          </div>
          
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
        </div>

        {/* Pricing Options */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {/* Bundle Package */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedPackage('bundle')}
            className={cn(
              "relative cursor-pointer transition-all",
              selectedPackage === 'bundle' && "ring-2 ring-primary"
            )}
          >
            <Card className="p-6 h-full">
              {savings > 0 && (
                <Badge className="absolute -top-3 -right-3 bg-green-500">
                  Save ${savings}
                </Badge>
              )}
              
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-lg">10-Minute Bundle</h4>
                {selectedPackage === 'bundle' && (
                  <Check className="w-5 h-5 text-primary" />
                )}
              </div>
              
              <div className="mb-4">
                <div className="text-3xl font-bold">
                  $1,000
                  <span className="text-sm font-normal text-muted-foreground ml-2">
                    / 10 minutes
                  </span>
                </div>
                <p className="text-sm text-green-600 dark:text-green-400">
                  $100 per minute (Save 33%)
                </p>
              </div>
              
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary" />
                  Best value for regular creators
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary" />
                  Priority support
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary" />
                  Faster turnaround
                </li>
              </ul>
            </Card>
          </motion.div>

          {/* Pay As You Go */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedPackage('pay-as-you-go')}
            className={cn(
              "cursor-pointer transition-all",
              selectedPackage === 'pay-as-you-go' && "ring-2 ring-primary"
            )}
          >
            <Card className="p-6 h-full">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-lg">Pay As You Go</h4>
                {selectedPackage === 'pay-as-you-go' && (
                  <Check className="w-5 h-5 text-primary" />
                )}
              </div>
              
              <div className="mb-4">
                <div className="text-3xl font-bold">
                  $150
                  <span className="text-sm font-normal text-muted-foreground ml-2">
                    / minute
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Perfect for one-off projects
                </p>
              </div>
              
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary" />
                  No commitment required
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary" />
                  Flexible for any length
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary" />
                  Standard support
                </li>
              </ul>
            </Card>
          </motion.div>
        </div>

        {/* Features */}
        <Card className="p-6 mb-6">
          <h4 className="font-bold mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            What's Included
          </h4>
          <div className="grid md:grid-cols-2 gap-3">
            {features.map((feature, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-green-500" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Social Proof */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {testimonials.map((testimonial, i) => (
            <Card key={i} className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center text-white font-bold">
                  {testimonial.name[0]}
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-xs text-muted-foreground mb-2">{testimonial.channel}</div>
                  <p className="text-sm italic">"{testimonial.text}"</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex gap-3">
          <Button 
            onClick={handleCheckout}
            className="flex-1 bg-gradient-primary"
          >
            <DollarSign className="w-4 h-4 mr-2" />
            Get Started - ${selectedPackage === 'bundle' ? '1,000' : `${estimatedMinutes * 150}`}
          </Button>
          <Button 
            onClick={handleBookCall}
            variant="outline"
            className="flex-1"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Book Free Consultation
          </Button>
        </div>

        {/* Trust Badges */}
        <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>15+ Years Business Experience</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Award className="w-4 h-4" />
            <span>1,200+ Clients Served</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Zap className="w-4 h-4" />
            <span>48hr Turnaround</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Floating CTA Button Component
export function FloatingEditingCTA({ context = 'general' }: { context?: string }) {
  const [showUpsell, setShowUpsell] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2, duration: 0.3 }}
        className="fixed bottom-24 right-6 z-40"
      >
        <Button
          onClick={() => setShowUpsell(true)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all group"
        >
          <Video className="w-4 h-4 mr-2" />
          <span>Get Professional Editing</span>
          <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </Button>
      </motion.div>
      
      <VideoEditingUpsell 
        isOpen={showUpsell} 
        onClose={() => setShowUpsell(false)}
        context={context as any}
      />
    </>
  );
}

// Inline CTA Component
export function InlineEditingCTA({ 
  variant = 'default',
  scriptLength 
}: { 
  variant?: 'default' | 'compact';
  scriptLength?: number;
}) {
  const [showUpsell, setShowUpsell] = useState(false);

  if (variant === 'compact') {
    return (
      <>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowUpsell(true)}
          className="gap-1"
        >
          <Sparkles className="w-3 h-3" />
          Need editing?
        </Button>
        
        <VideoEditingUpsell 
          isOpen={showUpsell} 
          onClose={() => setShowUpsell(false)}
          scriptLength={scriptLength}
        />
      </>
    );
  }

  return (
    <>
      <Card className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
              <Video className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-semibold">Need Professional Editing?</h4>
              <p className="text-sm text-muted-foreground">
                Turn your script into a polished video
              </p>
            </div>
          </div>
          <Button
            onClick={() => setShowUpsell(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600"
          >
            Learn More
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </Card>
      
      <VideoEditingUpsell 
        isOpen={showUpsell} 
        onClose={() => setShowUpsell(false)}
        scriptLength={scriptLength}
      />
    </>
  );
}
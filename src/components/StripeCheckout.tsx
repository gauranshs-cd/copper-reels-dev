import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Shield, 
  Lock,
  Check,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { PRICING_OPTIONS, createCheckoutSession, redirectToCheckout } from '@/lib/stripe';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface StripeCheckoutProps {
  packageType: 'payAsYouGo' | 'bundle10';
  estimatedMinutes?: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function StripeCheckout({ 
  packageType, 
  estimatedMinutes = 1,
  onSuccess,
  onCancel 
}: StripeCheckoutProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [email, setEmail] = useState('');
  const [quantity, setQuantity] = useState(
    packageType === 'payAsYouGo' 
      ? estimatedMinutes 
      : Math.ceil(estimatedMinutes / 10)
  );

  const priceOption = PRICING_OPTIONS[packageType];
  const totalPrice = priceOption.price * quantity;
  
  const handleCheckout = async () => {
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setIsProcessing(true);

    try {
      // In test mode, show success message
      if (!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 
          import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY === 'pk_test_placeholder') {
        
        toast.success('Test Mode: Payment would be processed here', {
          description: `Total: $${totalPrice}`,
          duration: 5000
        });
        
        // Simulate success
        setTimeout(() => {
          onSuccess?.();
          toast.success('Order placed successfully! Our team will contact you within 24 hours.');
        }, 2000);
        
        return;
      }

      // Real Stripe integration
      const session = await createCheckoutSession(
        priceOption,
        quantity,
        email
      );
      
      await redirectToCheckout(session.id);
      
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to start checkout. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={() => onCancel?.()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Complete Your Order</DialogTitle>
          <DialogDescription>
            Secure checkout powered by Stripe
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Package Summary */}
          <Card className="p-6 bg-primary/5 border-primary/20">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg">{priceOption.name}</h3>
                <p className="text-sm text-muted-foreground">{priceOption.description}</p>
              </div>
              <Badge variant="secondary" className="ml-4">
                ${priceOption.price}/{priceOption.unit}
              </Badge>
            </div>

            {/* Quantity Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>
                  {packageType === 'payAsYouGo' ? 'Minutes' : 'Bundles (10 min each)'}
                </Label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 text-center"
                    min="1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="pt-3 border-t space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${totalPrice}</span>
                </div>
                {packageType === 'bundle10' && estimatedMinutes > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>You save</span>
                    <span>${(estimatedMinutes * 150) - totalPrice}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span className="text-primary">${totalPrice}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Email Input */}
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              We'll send your order confirmation here
            </p>
          </div>

          {/* Features List */}
          <div className="space-y-2">
            <Label>What's Included:</Label>
            <div className="grid gap-2">
              {priceOption.features.slice(0, 5).map((feature, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Security Badges */}
          <div className="flex items-center justify-center gap-4 py-4 border-t">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Shield className="w-4 h-4" />
              <span>Secure Checkout</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Lock className="w-4 h-4" />
              <span>SSL Encrypted</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <CreditCard className="w-4 h-4" />
              <span>Powered by Stripe</span>
            </div>
          </div>

          {/* Test Mode Warning */}
          {(!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 
            import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY === 'pk_test_placeholder') && (
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
                    Test Mode Active
                  </p>
                  <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                    No real payment will be processed. Add your Stripe keys to enable payments.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => onCancel?.()}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCheckout}
            disabled={isProcessing || !email}
            className="bg-gradient-primary"
          >
            {isProcessing ? (
              <>Processing...</>
            ) : (
              <>
                <CreditCard className="w-4 h-4 mr-2" />
                Pay ${totalPrice}
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
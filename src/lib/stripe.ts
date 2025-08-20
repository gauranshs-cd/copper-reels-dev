import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with test mode key
// Replace with your actual Stripe publishable key
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder';

export const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

export interface PriceOption {
  id: string;
  name: string;
  price: number;
  unit: string;
  description: string;
  features: string[];
  stripePriceId?: string;
}

export const PRICING_OPTIONS: Record<string, PriceOption> = {
  payAsYouGo: {
    id: 'pay-as-you-go',
    name: 'Pay As You Go',
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
    stripePriceId: 'price_test_payasyougo' // Replace with actual Stripe price ID
  },
  bundle10: {
    id: 'bundle-10',
    name: '10-Minute Bundle',
    price: 1000,
    unit: 'per bundle',
    description: 'Best value for regular creators',
    features: [
      'Everything in Pay As You Go',
      'Motion graphics & animations',
      'Custom transitions',
      'Sound design & SFX',
      '48-hour delivery',
      'Unlimited revisions',
      'Thumbnail design included',
      'Priority support',
      'Rush delivery available'
    ],
    stripePriceId: 'price_test_bundle10' // Replace with actual Stripe price ID
  }
};

export async function createCheckoutSession(
  priceOption: PriceOption,
  quantity: number = 1,
  customerEmail?: string
) {
  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId: priceOption.stripePriceId,
        quantity,
        customerEmail,
        mode: priceOption.id === 'pay-as-you-go' ? 'payment' : 'payment',
        metadata: {
          packageType: priceOption.id,
          packageName: priceOption.name,
        }
      }),
    });

    const session = await response.json();
    
    if (session.error) {
      throw new Error(session.error);
    }

    return session;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

export async function redirectToCheckout(sessionId: string) {
  const stripe = await stripePromise;
  
  if (!stripe) {
    throw new Error('Stripe failed to load');
  }

  const { error } = await stripe.redirectToCheckout({ sessionId });
  
  if (error) {
    throw error;
  }
}
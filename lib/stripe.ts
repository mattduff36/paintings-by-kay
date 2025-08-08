import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  console.warn('STRIPE_SECRET_KEY is not set');
}

export const stripe = new Stripe(stripeSecretKey || '', {
  apiVersion: '2024-06-20',
});



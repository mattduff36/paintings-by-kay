import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { markSold } from '@/lib/db/products';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const sig = request.headers.get('stripe-signature');
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !secret) return NextResponse.json({ ok: true });

  const payload = await request.text();
  let event;
  try {
    event = stripe.webhooks.constructEvent(payload, sig, secret);
  } catch (err) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;
    const productId = session?.metadata?.product_id as string | undefined;
    if (productId) {
      await markSold(productId).catch(() => {});
    }
  }
  return NextResponse.json({ received: true });
}



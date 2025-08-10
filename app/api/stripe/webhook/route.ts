import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getProductById, markSold } from '@/lib/db/products';
import { revalidatePath } from 'next/cache';
import { sendPurchaseConfirmationEmail } from '@/lib/email';
import type Stripe from 'stripe';

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
  const isCheckoutSuccess =
    event.type === 'checkout.session.completed' ||
    event.type === 'checkout.session.async_payment_succeeded';

  if (isCheckoutSuccess) {
    const session = event.data.object as Stripe.Checkout.Session;
    const productId = (session.metadata?.product_id as string | undefined) || undefined;
    if (productId) {
      const updated = await markSold(productId).catch(() => false);
      if (updated) {
        const product = await getProductById(productId).catch(() => null);
        const customerEmail = session.customer_details?.email || session.customer_email || '';
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'http://localhost:3000';
        if (product && customerEmail) {
          await sendPurchaseConfirmationEmail({
            toEmail: customerEmail,
            product,
            session,
            siteUrl,
          }).catch(() => {});
        }
        try {
          revalidatePath('/gallery');
          revalidatePath('/');
        } catch {}
      }
    }
  }
  return NextResponse.json({ received: true });
}



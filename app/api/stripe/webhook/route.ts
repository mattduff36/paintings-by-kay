import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getProductById, markSold } from '@/lib/db/products';
import { revalidatePath } from 'next/cache';
import { sendOwnerOrderFailedEmail, sendOwnerOrderPaidEmail, sendPurchaseConfirmationEmail } from '@/lib/email';
import { upsertOrderFromSession } from '@/lib/db/orders';
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
  const isCheckoutFailed =
    event.type === 'checkout.session.async_payment_failed' ||
    event.type === 'checkout.session.expired' ||
    event.type === 'checkout.session.completed' && (event as any).data?.object?.payment_status === 'unpaid';

  if (isCheckoutSuccess) {
    const session = event.data.object as Stripe.Checkout.Session;
    const productId = (session.metadata?.product_id as string | undefined) || undefined;
    if (productId) {
      const updated = await markSold(productId).catch(() => false);
      if (updated) {
        const product = await getProductById(productId).catch(() => null);
        const customerEmail = session.customer_details?.email || session.customer_email || '';
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'http://localhost:3000';
        if (product) {
          await upsertOrderFromSession({ session, product, status: 'paid' }).catch(() => ({ order: null } as any));
          await sendOwnerOrderPaidEmail({ product, session }).catch(() => {});
        }
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
  if (isCheckoutFailed) {
    const session = event.data.object as Stripe.Checkout.Session;
    const productId = (session.metadata?.product_id as string | undefined) || undefined;
    if (productId) {
      const product = await getProductById(productId).catch(() => null);
      if (product) {
        await upsertOrderFromSession({ session, product, status: 'failed' }).catch(() => ({ order: null } as any));
        await sendOwnerOrderFailedEmail({ product, session, reason: event.type }).catch(() => {});
      }
    }
  }
  return NextResponse.json({ received: true });
}



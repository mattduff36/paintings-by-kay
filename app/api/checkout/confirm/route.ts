import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import type Stripe from 'stripe';
import { getProductById, markSold } from '@/lib/db/products';
import { sendPurchaseConfirmationEmail } from '@/lib/email';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const sessionId = String(body?.session_id || '').trim();
    if (!sessionId) return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });

    const session = (await stripe.checkout.sessions.retrieve(sessionId)) as Stripe.Checkout.Session;
    const paymentOk = session.payment_status === 'paid' || session.status === 'complete';
    const productId = (session.metadata?.product_id as string | undefined) || undefined;
    if (!paymentOk || !productId) return NextResponse.json({ error: 'Not paid or missing product' }, { status: 400 });

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
    }
    return NextResponse.json({ ok: true, updated });
  } catch (_e) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}



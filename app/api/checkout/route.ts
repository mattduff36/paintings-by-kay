import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getProductById } from '@/lib/db/products';

export async function POST(request: Request) {
  const body = await request.json();
  const id = body?.productId as string | undefined;
  if (!id) return NextResponse.json({ error: 'Missing productId' }, { status: 400 });
  const product = await getProductById(id);
  if (!product || product.is_sold !== false || product.is_for_sale !== true) {
    return NextResponse.json({ error: 'Unavailable' }, { status: 400 });
  }
  const origin = process.env.NEXT_PUBLIC_SITE_URL || (new URL(request.url)).origin;
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'gbp',
          product_data: {
            name: product.name,
            images: [
              origin + product.image_path,
            ],
          },
          unit_amount: product.price_gbp_pennies,
        },
        quantity: 1,
      },
    ],
    success_url: `${origin}/shop?success=1&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/shop?canceled=1`,
    metadata: { product_id: product.id },
  });
  return NextResponse.json({ url: session.url });
}



import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createProduct, getAllProducts } from '@/lib/db/products';

export async function GET() {
  const items = await getAllProducts().catch(() => []);
  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  const body = await request.json();
  // basic validation/coercion
  const name = String(body?.name || '').trim();
  const type = String(body?.type || '').trim();
  const w = Number.parseInt(String(body?.dimensions_w_cm || body?.dimensions_w || ''), 10);
  const h = Number.parseInt(String(body?.dimensions_h_cm || body?.dimensions_h || ''), 10);
  const price = Math.round(Number.parseFloat(String(body?.price_gbp_pennies || body?.price || '')));
  const image_path = String(body?.image_path || '').trim();
  if (!name || !type || !Number.isFinite(w) || !Number.isFinite(h) || !Number.isFinite(price) || !image_path) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }
  const input = {
    name,
    type,
    dimensions_w_cm: w,
    dimensions_h_cm: h,
    dimensions_label: `${w}×${h} cm`,
    price_gbp_pennies: price,
    notes: null,
    image_path,
    is_for_sale: Boolean(body?.is_for_sale ?? false),
  } as any;
  const created = await createProduct(input).catch((e) => {
    console.error(e);
    return null;
  });
  if (!created) return NextResponse.json({ error: 'Failed to create' }, { status: 400 });
  try {
    revalidatePath('/gallery');
    revalidatePath('/');
  } catch {}
  return NextResponse.json({ item: created });
}



import { NextResponse } from 'next/server';
import { createProduct, getAllProducts } from '@/lib/db/products';

export async function GET() {
  const items = await getAllProducts().catch(() => []);
  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  const body = await request.json();
  const created = await createProduct(body).catch((e) => {
    console.error(e);
    return null;
  });
  if (!created) return NextResponse.json({ error: 'Failed to create' }, { status: 400 });
  return NextResponse.json({ item: created });
}



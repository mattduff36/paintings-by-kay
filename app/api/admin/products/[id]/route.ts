import { NextResponse } from 'next/server';
import { deleteProduct, updateProduct } from '@/lib/db/products';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  const updated = await updateProduct(params.id, body).catch(() => null);
  if (!updated) return NextResponse.json({ error: 'Failed to update' }, { status: 400 });
  return NextResponse.json({ item: updated });
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  await deleteProduct(params.id).catch(() => null);
  return NextResponse.json({ ok: true });
}



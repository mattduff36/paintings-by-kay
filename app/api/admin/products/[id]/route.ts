import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { deleteProduct, updateProduct } from '@/lib/db/products';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  const updates: Record<string, unknown> = {};
  if (typeof body?.name === 'string') updates.name = body.name.trim();
  if (typeof body?.type === 'string') updates.type = body.type.trim();
  if (typeof body?.notes === 'string') updates.notes = body.notes;
  if (typeof body?.image_path === 'string') updates.image_path = body.image_path.trim();
  if (body?.dimensions_w_cm) updates.dimensions_w_cm = Number.parseInt(String(body.dimensions_w_cm), 10);
  if (body?.dimensions_h_cm) updates.dimensions_h_cm = Number.parseInt(String(body.dimensions_h_cm), 10);
  if (updates.dimensions_w_cm && updates.dimensions_h_cm) {
    updates.dimensions_label = `${updates.dimensions_w_cm}×${updates.dimensions_h_cm} cm`;
  }
  if (body?.price_gbp_pennies) updates.price_gbp_pennies = Math.round(Number.parseFloat(String(body.price_gbp_pennies)));
  if (typeof body?.is_for_sale === 'boolean') updates.is_for_sale = body.is_for_sale;
  if (typeof body?.is_sold === 'boolean') updates.is_sold = body.is_sold;
  const updated = await updateProduct(params.id, updates as any).catch(() => null);
  if (!updated) return NextResponse.json({ error: 'Failed to update' }, { status: 400 });
  try {
    revalidatePath('/gallery');
    revalidatePath('/shop');
    revalidatePath('/');
  } catch {}
  return NextResponse.json({ item: updated });
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  await deleteProduct(params.id).catch(() => null);
  return NextResponse.json({ ok: true });
}



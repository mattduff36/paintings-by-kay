import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/auth/session';
import { updateOrderStatus } from '@/lib/db/orders';
import { sendOrderDespatchedEmails } from '@/lib/email';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  if (!isAdminAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const id = params.id;
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  let trackingNumber: string | null = null;
  try {
    const body = await request.json();
    trackingNumber = (String(body?.trackingNumber || '').trim() || null);
  } catch {}
  const order = await updateOrderStatus(id, 'despatched', trackingNumber).catch(() => null);
  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'http://localhost:3000';
  await sendOrderDespatchedEmails({ order, siteUrl }).catch(() => {});
  return NextResponse.json({ ok: true, order });
}




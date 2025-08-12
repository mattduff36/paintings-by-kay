import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/auth/session';
import { listOrders } from '@/lib/db/orders';

export async function GET() {
  if (!isAdminAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const items = await listOrders().catch(() => []);
  return NextResponse.json({ items });
}



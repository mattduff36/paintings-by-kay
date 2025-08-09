import { NextResponse } from 'next/server';
import { listAdminImageMappings } from '@/lib/gallery-assets';

export async function GET() {
  const items = listAdminImageMappings();
  return NextResponse.json({ items });
}



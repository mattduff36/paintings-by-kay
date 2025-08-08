import { NextResponse } from 'next/server';
import { listDesktopGalleryAssets } from '@/lib/gallery-assets';

export async function GET() {
  const assets = listDesktopGalleryAssets();
  return NextResponse.json({ assets });
}



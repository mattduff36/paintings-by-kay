import fs from 'node:fs';
import path from 'node:path';

export interface GalleryAsset {
  id: string;
  desktopPath: string;
  mobilePath: string;
  tabletPath: string;
}

export function listDesktopGalleryAssets(): string[] {
  const dir = path.join(process.cwd(), 'public', 'images', 'gallery', 'desktop');
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.webp'))
    .map((f) => `/images/gallery/desktop/${f}`);
}



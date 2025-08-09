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

export interface AdminImageMapping {
  index: number;
  galleryDesktopPath: string; // e.g. /images/gallery/desktop/gallery1.webp
  displayPath: string; // e.g. /images/raw_images/Display/IMG_1325.JPEG
  adminThumbPath: string; // e.g. /images/raw_images/Front/originals/IMG_1324.JPEG (fallback to displayPath if missing)
}

function extractImgNumber(filename: string): number | null {
  // Expect patterns like IMG_1325.JPEG
  const match = filename.match(/IMG_(\d+)\.[jJ][pP][eE]?[gG]$/);
  if (!match) return null;
  const num = Number.parseInt(match[1], 10);
  return Number.isFinite(num) ? num : null;
}

export function listAdminImageMappings(): AdminImageMapping[] {
  const displayDir = path.join(process.cwd(), 'public', 'images', 'raw_images', 'Display');
  const frontDir = path.join(process.cwd(), 'public', 'images', 'raw_images', 'Front', 'originals');
  if (!fs.existsSync(displayDir)) return [];

  const displayFiles = fs
    .readdirSync(displayDir)
    .filter((f) => /\.jpe?g$/i.test(f) && extractImgNumber(f) !== null)
    .sort((a, b) => (extractImgNumber(a)! - extractImgNumber(b)!));

  return displayFiles.map((filename, idx) => {
    const n = extractImgNumber(filename)!; // safe due to filter above
    const frontNumber = n - 1;
    const displayPath = `/images/raw_images/Display/${filename}`;
    const expectedFront = `IMG_${frontNumber}.JPEG`;
    const expectedFrontLower = `IMG_${frontNumber}.jpeg`;
    const hasFrontUpper = fs.existsSync(path.join(frontDir, expectedFront));
    const hasFrontLower = fs.existsSync(path.join(frontDir, expectedFrontLower));
    const adminThumbPath = hasFrontUpper
      ? `/images/raw_images/Front/originals/${expectedFront}`
      : hasFrontLower
      ? `/images/raw_images/Front/originals/${expectedFrontLower}`
      : displayPath;

    const index = idx + 1;
    const galleryDesktopPath = `/images/gallery/desktop/gallery${index}.webp`;

    return {
      index,
      galleryDesktopPath,
      displayPath,
      adminThumbPath,
    } satisfies AdminImageMapping;
  });
}



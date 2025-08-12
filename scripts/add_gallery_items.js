/*
  Generates gallery WebP assets (desktop/tablet/mobile) for provided Display JPEGs.
  Usage: node scripts/add_gallery_items.js
*/
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function ensureDir(dir) {
  await fs.promises.mkdir(dir, { recursive: true }).catch(() => {});
}

async function generateForIndex(index, absSrcPath) {
  const baseOut = path.join(process.cwd(), 'public', 'images', 'gallery');
  const outD = path.join(baseOut, 'desktop', `gallery${index}.webp`);
  const outT = path.join(baseOut, 'tablet', `gallery${index}.webp`);
  const outM = path.join(baseOut, 'mobile', `gallery${index}.webp`);
  await ensureDir(path.dirname(outD));
  await ensureDir(path.dirname(outT));
  await ensureDir(path.dirname(outM));

  console.log(`→ Generating gallery${index}.webp from ${absSrcPath}`);
  // Desktop ~1600px
  await sharp(absSrcPath)
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(outD);
  // Tablet ~1024px
  await sharp(absSrcPath)
    .resize({ width: 1024, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(outT);
  // Mobile ~768px
  await sharp(absSrcPath)
    .resize({ width: 768, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(outM);
}

async function main() {
  const displayBase = path.join(process.cwd(), 'public', 'images', 'raw_images', 'Display');
  const files = ['IMG_2510.JPEG', 'IMG_2512.JPEG', 'IMG_2514.JPEG'];
  for (const f of files) {
    const src = path.join(displayBase, f);
    if (!fs.existsSync(src)) {
      console.error(`Missing source file: ${src}`);
      process.exit(1);
    }
  }

  const desktopDir = path.join(process.cwd(), 'public', 'images', 'gallery', 'desktop');
  let count = 0;
  if (fs.existsSync(desktopDir)) {
    count = fs.readdirSync(desktopDir).filter((f) => /\.webp$/i.test(f)).length;
  }
  const startIndex = count; // next will be count+1

  for (let i = 0; i < files.length; i++) {
    const index = startIndex + i + 1;
    const src = path.join(displayBase, files[i]);
    // Generate assets
    await generateForIndex(index, src);
  }

  console.log('Done generating new gallery assets.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});




import NextDynamic from 'next/dynamic';
import { getAllProducts } from '@/lib/db/products';
import { listAdminImageMappings, listDesktopGalleryAssets } from '@/lib/gallery-assets';

export const dynamic = 'force-dynamic';
// Use absolute import to avoid any dev-time chunk resolution issues
const FullscreenMount = NextDynamic(() => import('@/app/(site)/gallery/FullscreenMount'), { ssr: false });
export default async function GalleryPage() {
  const desktopAssets = listDesktopGalleryAssets();
  const images = Array.from({ length: desktopAssets.length }).map((_, i) => i + 1);
  const products = await getAllProducts().catch(() => []);
  const mappings = listAdminImageMappings();
  const frontByIndex = new Map<number, string>();
  mappings.forEach((m) => {
    frontByIndex.set(m.index, m.adminThumbPath);
  });
  const saleSet = new Set<number>();
  const soldSet = new Set<number>();
  for (const p of products) {
    const id = p.image_path.match(/gallery\/(?:desktop|mobile|tablet)\/gallery(\d+)\./i)?.[1];
    const num = id ? Number.parseInt(id, 10) : NaN;
    if (!Number.isFinite(num)) continue;
    if (p.is_sold) soldSet.add(num);
    else if (p.is_for_sale) saleSet.add(num);
  }
  return (
    <main id="top">
      {/* Client script to enable fullscreen behavior */}
      <FullscreenMount />
      <h1 className="gallery-title">Gallery</h1>
      <p className="gallery-note">Selected pictures are available for purchase. Please visit our shop to see the pieces currently available. All with free UK delivery.</p>
      <div className="gallery-grid" id="fullGallery">
        {images.map((n) => {
          const frontSrc = frontByIndex.get(n) || '';
          return (
            <div key={n} className="gallery-item">
              <picture>
                <source media="(max-width: 768px)" srcSet={`/images/gallery/mobile/gallery${n}.webp`} type="image/webp" />
                <source media="(max-width: 1024px)" srcSet={`/images/gallery/tablet/gallery${n}.webp`} type="image/webp" />
                <img
                  src={`/images/gallery/desktop/gallery${n}.webp`}
                  alt={`Original canvas painting by Kay - gallery ${n}`}
                  loading="lazy"
                  data-front-src={frontSrc}
                />
              </picture>
              {soldSet.has(n) ? (
                <div className="gallery-badge-sold">Sold</div>
              ) : saleSet.has(n) ? (
                <div className="gallery-badge-sale">For sale</div>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="fullscreen-overlay">
        <span className="close-fullscreen">&times;</span>
        <img className="fullscreen-image" src="" alt="" />
      </div>
    </main>
  );
}



import NextDynamic from 'next/dynamic';
import { getProductsForSale } from '@/lib/db/products';
import { ProductCard } from '@/components/product-card';
import { listAdminImageMappings } from '@/lib/gallery-assets';
import ConfirmPurchase from './purchase-confirm-client';

const FullscreenMount = NextDynamic(() => import('@/app/(site)/gallery/FullscreenMount'), { ssr: false });

export default async function ShopPage({ searchParams }: { searchParams?: { success?: string; canceled?: string } }) {
  const products = await getProductsForSale().catch(() => []);
  const mappings = listAdminImageMappings();
  const frontByPath = new Map<string, string>();
  mappings.forEach((m) => {
    // Map the gallery desktop path to a preferred front image (adminThumbPath if available)
    frontByPath.set(m.galleryDesktopPath, m.adminThumbPath || m.displayPath);
  });
  const success = searchParams?.success === '1';
  const canceled = searchParams?.canceled === '1';
  return (
    <main id="top">
      {/* Enable fullscreen behavior shared with gallery */}
      <FullscreenMount />
      <h1 className="gallery-title">Shop</h1>
      <p className="gallery-note">Free postage and packaging to UK addresses. We are unable to ship overseas.</p>
      {success && <>
        <ConfirmPurchase />
        <p className="mb-4 rounded bg-green-100 p-3 text-green-700">Thank you for your purchase!</p>
      </>}
      {canceled && <p className="mb-4 rounded bg-yellow-100 p-3 text-yellow-700">Checkout canceled.</p>}
      {products.length === 0 ? (
        <p className="text-center text-gray-600">No items are currently for sale. Please check back soon.</p>
      ) : (
        <div id="shopGrid" className="mx-auto grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {products.map((p) => {
            const frontSrc = frontByPath.get(p.image_path) || '';
            return <ProductCard key={p.id} product={p} frontSrc={frontSrc} />;
          })}
        </div>
      )}
      {/* Fullscreen overlay with details area (populated by client script) */}
      <div className="fullscreen-overlay">
        <span className="close-fullscreen">&times;</span>
        <img className="fullscreen-image" src="" alt="" />
        <div className="fullscreen-details"></div>
      </div>
    </main>
  );
}



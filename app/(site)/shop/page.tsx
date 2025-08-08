import { getProductsForSale } from '@/lib/db/products';
import { ProductCard } from '@/components/product-card';

export default async function ShopPage({ searchParams }: { searchParams?: { success?: string; canceled?: string } }) {
  const products = await getProductsForSale().catch(() => []);
  const success = searchParams?.success === '1';
  const canceled = searchParams?.canceled === '1';
  return (
    <section className="mx-auto max-w-7xl">
      <h1 className="mb-6 text-center text-3xl font-medium text-[var(--primary-color)]">Shop</h1>
      {success && <p className="mb-4 rounded bg-green-100 p-3 text-green-700">Thank you for your purchase!</p>}
      {canceled && <p className="mb-4 rounded bg-yellow-100 p-3 text-yellow-700">Checkout canceled.</p>}
      {products.length === 0 ? (
        <p className="text-center text-gray-600">No items are currently for sale. Please check back soon.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}



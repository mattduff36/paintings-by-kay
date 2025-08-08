import { getAllProducts } from '@/lib/db/products';
import { ProductForm } from './product-form';

export async function AdminDashboard() {
  const products = await getAllProducts().catch(() => []);
  return (
    <section className="mx-auto mt-6 max-w-5xl space-y-6">
      <h1 className="text-2xl font-medium">Admin</h1>
      <ProductForm />
      <div>
        <h2 className="mb-2 text-xl">Products</h2>
        <div className="divide-y rounded border">
          {products.map((p) => (
            <div key={p.id} className="grid grid-cols-6 items-center gap-2 p-3">
              <div className="col-span-2">
                <div className="text-sm font-medium">{p.name}</div>
                <div className="text-xs text-gray-500">{p.dimensions_label} • {p.type}</div>
              </div>
              <div>£{(p.price_gbp_pennies / 100).toLocaleString('en-GB')}</div>
              <div>{p.is_for_sale ? 'For Sale' : 'Hidden'}</div>
              <div>{p.is_sold ? 'Sold' : ''}</div>
              <div className="text-right text-sm text-gray-600">{p.image_path}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}



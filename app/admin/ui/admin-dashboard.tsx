import { getAllProducts } from '@/lib/db/products';
import { ProductForm } from './product-form';
import { AdminProductRow } from './admin-product-row';

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
            <AdminProductRow key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}



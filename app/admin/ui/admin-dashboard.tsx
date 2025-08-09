import { getAllProducts } from '@/lib/db/products';
import { AdminTable } from './admin-table';

export async function AdminDashboard() {
  const products = await getAllProducts().catch(() => []);
  return (
    <section className="mx-auto mt-6 max-w-6xl">
      <AdminTable products={products} />
    </section>
  );
}



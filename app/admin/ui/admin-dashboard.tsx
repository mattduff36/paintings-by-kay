import { getAllProducts } from '@/lib/db/products';
import { AdminTable } from './admin-table';
import { listOrders } from '@/lib/db/orders';
import Link from 'next/link';
import { updateOrderStatus } from '@/lib/db/orders';
import { sendOrderDespatchedEmails } from '@/lib/email';

export async function AdminDashboard() {
  const products = await getAllProducts().catch(() => []);
  const orders = await listOrders().catch(() => []);
  return (
    <section className="mx-auto mt-6 max-w-6xl space-y-6">
      <nav className="flex items-center gap-3 border-b pb-2 text-sm">
        <Link className="underline" href="#products">Products</Link>
        <Link className="underline" href="#orders">Order processing</Link>
      </nav>
      <div id="products">
        <AdminTable products={products} />
      </div>
      <div id="orders">
        <h2 className="text-xl mb-2">Order processing</h2>
        <OrdersTable orders={orders} />
      </div>
    </section>
  );
}

interface OrdersTableProps {
  orders: {
    id: string;
    order_number: number;
    product_name: string;
    customer_email: string;
    customer_name: string | null;
    amount_total_pennies: number;
    shipping_line1: string | null;
    shipping_line2: string | null;
    shipping_city: string | null;
    shipping_postal_code: string | null;
    shipping_country: string | null;
    status: string;
    created_at: string;
    despatched_at: string | null;
  }[];
}

function formatDate(d: string | null): string {
  if (!d) return '-';
  try {
    return new Date(d).toLocaleString();
  } catch {
    return d;
  }
}

async function markDespatched(orderId: string) {
  'use server';
  const order = await updateOrderStatus(orderId, 'despatched').catch(() => null);
  if (order) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'http://localhost:3000';
    await sendOrderDespatchedEmails({ order, siteUrl }).catch(() => {});
  }
}

function OrdersTable({ orders }: OrdersTableProps) {
  return (
    <div className="overflow-x-auto rounded border">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-left">
          <tr>
            <th className="p-2">Placed</th>
            <th className="p-2">Order</th>
            <th className="p-2">Item</th>
            <th className="p-2">Customer</th>
            <th className="p-2">Email</th>
            <th className="p-2">Amount</th>
            <th className="p-2">Shipping address</th>
            <th className="p-2">Status</th>
            <th className="p-2">Despatched</th>
            <th className="p-2" />
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-t align-middle">
              <td className="p-2 whitespace-nowrap">{formatDate(o.created_at)}</td>
              <td className="p-2">{`PBK-${String(o.order_number).padStart(3, '0')}`}</td>
              <td className="p-2">{o.product_name}</td>
              <td className="p-2">{o.customer_name || '-'}</td>
              <td className="p-2">
                <a className="underline" href={`mailto:${o.customer_email}`}>{o.customer_email}</a>
              </td>
              <td className="p-2 whitespace-nowrap">£{(o.amount_total_pennies / 100).toFixed(2)}</td>
              <td className="p-2">
                {[o.shipping_line1, o.shipping_line2, o.shipping_city, o.shipping_postal_code, o.shipping_country]
                  .filter(Boolean)
                  .join(', ') || '-'}
              </td>
              <td className="p-2">{o.status}</td>
              <td className="p-2 whitespace-nowrap">{formatDate(o.despatched_at)}</td>
              <td className="p-2 text-right">
                {o.status !== 'despatched' ? (
                  <form action={markDespatched.bind(null, o.id)}>
                    <button className="rounded border px-3 py-1">Mark despatched</button>
                  </form>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}



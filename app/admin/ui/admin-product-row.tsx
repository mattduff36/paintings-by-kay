"use client";
import type { Product } from '@/lib/types/product';
import { useState } from 'react';

export function AdminProductRow({ product }: { product: Product }) {
  const [busy, setBusy] = useState(false);
  const [p, setP] = useState(product);

  async function update(updates: Partial<Product>) {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/products/${p.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const data = await res.json();
        setP(data.item);
      }
    } finally {
      setBusy(false);
    }
  }

  async function del() {
    if (!confirm('Delete this product?')) return;
    setBusy(true);
    try {
      await fetch(`/api/admin/products/${p.id}`, { method: 'DELETE' });
      window.location.reload();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid grid-cols-6 items-center gap-2 p-3">
      <div className="col-span-2">
        <div className="text-sm font-medium">{p.name}</div>
        <div className="text-xs text-gray-500">{p.dimensions_label} • {p.type}</div>
      </div>
      <div>£{(p.price_gbp_pennies / 100).toLocaleString('en-GB')}</div>
      <div>{p.is_for_sale ? 'For Sale' : 'Hidden'}</div>
      <div>{p.is_sold ? 'Sold' : ''}</div>
      <div className="flex items-center justify-end gap-2 text-sm">
        <button disabled={busy} onClick={() => update({ is_for_sale: !p.is_for_sale })} className="rounded border px-2 py-1">
          {p.is_for_sale ? 'Hide' : 'Publish'}
        </button>
        <button disabled={busy || p.is_sold} onClick={() => update({ is_sold: true, is_for_sale: false })} className="rounded border px-2 py-1">
          Mark sold
        </button>
        <button disabled={busy} onClick={del} className="rounded border px-2 py-1 text-red-600">
          Delete
        </button>
      </div>
    </div>
  );
}



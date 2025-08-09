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
    <div className="hidden" />
  );
}



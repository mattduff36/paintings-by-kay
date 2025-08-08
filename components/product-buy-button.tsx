"use client";
import { useState } from 'react';

export function BuyButton({ productId }: { productId: string }) {
  const [busy, setBusy] = useState(false);
  async function handleClick() {
    setBusy(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();
      if (data?.url) window.location.href = data.url;
    } finally {
      setBusy(false);
    }
  }
  return (
    <button onClick={handleClick} disabled={busy} className="rounded bg-[var(--primary-color)] px-3 py-2 text-white disabled:opacity-50">
      {busy ? 'Redirecting…' : 'Buy'}
    </button>
  );
}



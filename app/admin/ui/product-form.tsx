"use client";
import { useEffect, useState } from 'react';

interface FormState {
  name: string;
  width: string;
  height: string;
  type: string;
  price: string;
  notes: string;
  image_path: string;
  is_for_sale: boolean;
}

export function ProductForm() {
  const [assets, setAssets] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<FormState>({
    name: '',
    width: '',
    height: '',
    type: '',
    price: '',
    notes: '',
    image_path: '',
    is_for_sale: true,
  });

  useEffect(() => {
    fetch('/api/admin/products/assets').then(async (r) => setAssets((await r.json())?.assets || [])).catch(() => setAssets([]));
  }, []);

  function set<K extends keyof FormState>(key: K, val: FormState[K]) {
    setState((s) => ({ ...s, [key]: val }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const width = parseInt(state.width, 10);
    const height = parseInt(state.height, 10);
    const pennies = Math.round(parseFloat(state.price) * 100);
    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: state.name,
        dimensions_w_cm: width,
        dimensions_h_cm: height,
        dimensions_label: `${width}×${height} cm`,
        type: state.type,
        price_gbp_pennies: pennies,
        notes: state.notes || null,
        image_path: state.image_path,
        is_for_sale: state.is_for_sale,
      }),
    });
    if (!res.ok) {
      setError('Failed to save product');
    } else {
      window.location.reload();
    }
    setSaving(false);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded border p-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input className="rounded border p-2" placeholder="Name" value={state.name} onChange={(e) => set('name', e.target.value)} />
        <input className="rounded border p-2" placeholder="Type (e.g., Acrylic on canvas)" value={state.type} onChange={(e) => set('type', e.target.value)} />
        <input className="rounded border p-2" placeholder="Width (cm)" value={state.width} onChange={(e) => set('width', e.target.value)} />
        <input className="rounded border p-2" placeholder="Height (cm)" value={state.height} onChange={(e) => set('height', e.target.value)} />
        <input className="rounded border p-2" placeholder="Price (GBP)" value={state.price} onChange={(e) => set('price', e.target.value)} />
        <select className="rounded border p-2" value={state.image_path} onChange={(e) => set('image_path', e.target.value)}>
          <option value="">Select image</option>
          {assets.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
        <textarea className="rounded border p-2 sm:col-span-2" placeholder="Notes (optional)" value={state.notes} onChange={(e) => set('notes', e.target.value)} />
      </div>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={state.is_for_sale} onChange={(e) => set('is_for_sale', e.target.checked)} /> For sale</label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button disabled={saving || !state.name || !state.type || !state.width || !state.height || !state.price || !state.image_path} className="rounded bg-[var(--primary-color)] px-4 py-2 text-white disabled:opacity-50" type="submit">{saving ? 'Saving...' : 'Create product'}</button>
    </form>
  );
}



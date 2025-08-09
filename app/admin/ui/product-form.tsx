"use client";
import { useEffect, useState } from 'react';

interface FormState {
  name: string;
  width: string;
  height: string;
  type: string;
  price: string;
  image_path: string;
  is_for_sale: boolean;
}

export function ProductForm() {
  const [assets, setAssets] = useState<{ index: number; galleryDesktopPath: string; displayPath: string; adminThumbPath: string }[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<FormState>({
    name: '',
    width: '',
    height: '',
    type: '',
    price: '',
    image_path: '',
    is_for_sale: false,
  });

  useEffect(() => {
    fetch('/api/admin/products/assets')
      .then(async (r) => setAssets((await r.json())?.items || []))
      .catch(() => setAssets([]));
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
        <div className="sm:col-span-2">
          <p className="mb-2 text-sm font-medium">Select image</p>
          <div className="max-h-80 overflow-auto rounded border p-2">
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8">
              {assets.map((item) => {
                const isSelected = state.image_path === item.galleryDesktopPath;
                const thumbSrc = item.adminThumbPath;
                return (
                  <button
                    key={item.galleryDesktopPath}
                    type="button"
                    onClick={() => set('image_path', item.galleryDesktopPath)}
                    aria-pressed={isSelected}
                    className={`relative rounded outline-none transition focus:ring-2 focus:ring-blue-500 ${
                      isSelected ? 'ring-2 ring-[var(--primary-color)]' : 'ring-1 ring-transparent'
                    }`}
                    title={item.galleryDesktopPath.split('/').pop() || 'image'}
                  >
                    <img
                      src={thumbSrc}
                      alt={item.galleryDesktopPath.split('/').pop() || 'gallery image'}
                      loading="lazy"
                      className="h-20 w-full rounded object-cover"
                    />
                  </button>
                );
              })}
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-700">
            {state.image_path ? (
              <span>Selected: <code>{state.image_path.split('/').pop()}</code></span>
            ) : (
              <span className="text-gray-500">No image selected</span>
            )}
          </div>
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={state.is_for_sale} onChange={(e) => set('is_for_sale', e.target.checked)} /> For sale</label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button disabled={saving || !state.name || !state.type || !state.width || !state.height || !state.price || !state.image_path} className="rounded bg-[var(--primary-color)] px-4 py-2 text-white disabled:opacity-50" type="submit">{saving ? 'Saving...' : 'Create product'}</button>
    </form>
  );
}



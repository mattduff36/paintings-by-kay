"use client";
import { useEffect, useMemo, useState } from 'react';
import type { Product } from '@/lib/types/product';

interface AdminAssetItem {
  index: number;
  galleryDesktopPath: string;
  displayPath: string;
  adminThumbPath: string;
}

interface RowState {
  id: string | null; // null means not yet created
  is_for_sale: boolean;
  image_path: string | null; // selected gallery desktop path
  name: string;
  type: string;
  width: string;
  height: string;
  price: string; // pounds
  busy: boolean;
  error: string | null;
}

export function AdminTable({ products }: { products: Product[] }) {
  const [assets, setAssets] = useState<AdminAssetItem[]>([]);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const productByImage = useMemo(() => {
    const map = new Map<string, Product>();
    for (const p of products) {
      if (p.image_path) map.set(p.image_path, p);
    }
    return map;
  }, [products]);

  const [rows, setRows] = useState<RowState[]>([]);

  useEffect(() => {
    fetch('/api/admin/products/assets')
      .then(async (r) => (await r.json())?.items as AdminAssetItem[])
      .then((items) => {
        setAssets(items || []);
        const initial: RowState[] = (items || []).map((item) => {
          const existing = productByImage.get(item.galleryDesktopPath) || null;
          return {
            id: existing?.id ?? null,
            is_for_sale: existing?.is_for_sale ?? false,
            image_path: item.galleryDesktopPath,
            name: existing?.name ?? '',
            type: existing?.type ?? '',
            width: existing ? String(existing.dimensions_w_cm) : '',
            height: existing ? String(existing.dimensions_h_cm) : '',
            price: existing ? String((existing.price_gbp_pennies / 100).toFixed(2)) : '',
            busy: false,
            error: null,
          };
        });
        setRows(initial);
      })
      .catch(() => setAssets([]));
  }, [productByImage]);

  useEffect(() => {
    function onSaveAll() {
      saveAll();
    }
    window.addEventListener('admin:save-all', onSaveAll as EventListener);
    return () => window.removeEventListener('admin:save-all', onSaveAll as EventListener);
  }, [rows]);

  function updateRow(idx: number, updates: Partial<RowState>) {
    setRows((prev) => prev.map((r, i) => (i === idx ? { ...r, ...updates } : r)));
    if (!dirty) {
      setDirty(true);
      window.dispatchEvent(new CustomEvent('admin:dirty'));
    }
  }

  async function saveRow(idx: number) {
    const row = rows[idx];
    // Skip rows that are neither existing products nor selected for sale
    if (!row.id && !row.is_for_sale) return;
    if (!row.image_path) return;
    updateRow(idx, { busy: true, error: null });
    try {
      const width = Number.parseInt(row.width || '0', 10);
      const height = Number.parseInt(row.height || '0', 10);
      const pennies = Math.round(Number.parseFloat(row.price || '0') * 100);
      const dimsLabel = Number.isFinite(width) && Number.isFinite(height) ? `${width}×${height} cm` : '';
      const payload = {
        name: row.name,
        type: row.type,
        dimensions_w_cm: width,
        dimensions_h_cm: height,
        dimensions_label: dimsLabel,
        price_gbp_pennies: pennies,
        image_path: row.image_path,
        is_for_sale: row.is_for_sale,
      };
      let ok = false;
      if (row.id) {
        const res = await fetch(`/api/admin/products/${row.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        ok = res.ok;
        if (ok) {
          const data = await res.json();
          updateRow(idx, { id: data.item.id });
        }
      } else {
        // create
        const res = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        ok = res.ok;
        if (ok) {
          const data = await res.json();
          updateRow(idx, { id: data.item.id });
        }
      }
      if (!ok) updateRow(idx, { error: 'Save failed' });
    } catch (_e) {
      updateRow(idx, { error: 'Save error' });
    } finally {
      updateRow(idx, { busy: false });
    }
  }

  async function saveAll() {
    if (saving) return;
    setSaving(true);
    let hadErrors = false;
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (row.id || row.is_for_sale) {
        await saveRow(i);
        // capture error state after each save attempt
        const current = rows[i];
        if (current?.error) hadErrors = true;
      }
    }
    setSaving(false);
    if (!hadErrors) {
      setDirty(false);
      window.dispatchEvent(new CustomEvent('admin:clean'));
    }
  }

  return (
    <div className="space-y-3">
      <h2 className="text-xl">Products</h2>
      {/* Mobile card list */}
      <div className="md:hidden space-y-3">
        {rows.map((row, idx) => {
          const asset = assets[idx];
          return (
            <div key={asset?.galleryDesktopPath || idx} className="rounded border p-3">
              <div className="mb-2 flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={row.is_for_sale}
                    onChange={(e) => updateRow(idx, { is_for_sale: e.target.checked })}
                  />
                  For sale
                </label>
                {asset ? (
                  <img src={asset.adminThumbPath} alt={asset.galleryDesktopPath.split('/').pop() || 'image'} className="h-16 w-16 rounded object-cover" />
                ) : null}
              </div>
              <div className="space-y-2">
                <input
                  className="w-full rounded border p-2"
                  placeholder="Name"
                  value={row.name}
                  onChange={(e) => updateRow(idx, { name: e.target.value })}
                />
                <input
                  className="w-full rounded border p-2"
                  placeholder="Type (e.g., Acrylic on canvas)"
                  value={row.type}
                  onChange={(e) => updateRow(idx, { type: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    className="w-full rounded border p-2"
                    placeholder="Width (cm)"
                    value={row.width}
                    onChange={(e) => updateRow(idx, { width: e.target.value })}
                  />
                  <input
                    className="w-full rounded border p-2"
                    placeholder="Height (cm)"
                    value={row.height}
                    onChange={(e) => updateRow(idx, { height: e.target.value })}
                  />
                </div>
                <input
                  className="w-full rounded border p-2"
                  placeholder="Price (GBP)"
                  value={row.price}
                  onChange={(e) => updateRow(idx, { price: e.target.value })}
                />
                {row.error && (row.id || row.is_for_sale) ? (
                  <div className="pt-1 text-xs text-red-600">{row.error}</div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto rounded border">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-2">For sale</th>
              <th className="p-2">Image</th>
              <th className="p-2">Name</th>
              <th className="p-2">Type</th>
              <th className="p-2">Width (cm)</th>
              <th className="p-2">Height (cm)</th>
              <th className="p-2">Price (GBP)</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => {
              const asset = assets[idx];
              return (
                <tr key={asset?.galleryDesktopPath || idx} className="border-t align-middle">
                  <td className="p-2">
                    <input
                      type="checkbox"
                      checked={row.is_for_sale}
                      onChange={(e) => updateRow(idx, { is_for_sale: e.target.checked })}
                    />
                  </td>
                  <td className="p-2">
                    {asset ? (
                      <img src={asset.adminThumbPath} alt={asset.galleryDesktopPath.split('/').pop() || 'image'} className="h-16 w-16 rounded object-cover" />
                    ) : null}
                  </td>
                  <td className="p-2">
                    <input
                      className="w-48 rounded border p-1"
                      placeholder="Name"
                      value={row.name}
                      onChange={(e) => updateRow(idx, { name: e.target.value })}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      className="w-56 rounded border p-1"
                      placeholder="Type"
                      value={row.type}
                      onChange={(e) => updateRow(idx, { type: e.target.value })}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      className="w-28 rounded border p-1"
                      placeholder="Width"
                      value={row.width}
                      onChange={(e) => updateRow(idx, { width: e.target.value })}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      className="w-28 rounded border p-1"
                      placeholder="Height"
                      value={row.height}
                      onChange={(e) => updateRow(idx, { height: e.target.value })}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      className="w-28 rounded border p-1"
                      placeholder="Price"
                      value={row.price}
                      onChange={(e) => updateRow(idx, { price: e.target.value })}
                    />
                  </td>
                  <td className="p-2 text-right">
                    {row.error && (row.id || row.is_for_sale) ? (
                      <div className="pt-1 text-xs text-red-600">{row.error}</div>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}



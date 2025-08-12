"use client";
import { useState } from 'react';

export function OrderDespatchButton({ orderId }: { orderId: string }) {
  const [open, setOpen] = useState(false);
  const [tracking, setTracking] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/despatch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackingNumber: tracking.trim() || null }),
      });
      if (!res.ok) throw new Error('Failed to update');
      setOpen(false);
      window.location.reload();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button className="rounded border px-3 py-1" onClick={() => setOpen(true)}>Mark despatched</button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded bg-white p-4 shadow">
            <h3 className="mb-2 text-lg font-medium">Enter tracking number</h3>
            <input
              className="mb-3 w-full rounded border p-2"
              placeholder="e.g., Royal Mail tracking"
              value={tracking}
              onChange={(e) => setTracking(e.target.value)}
            />
            {error && <div className="mb-2 text-sm text-red-600">{error}</div>}
            <div className="flex justify-end gap-2">
              <button className="rounded border px-3 py-1" onClick={() => setOpen(false)} disabled={busy}>Cancel</button>
              <button className="rounded bg-[var(--primary-color)] px-3 py-1 text-white disabled:opacity-50" onClick={submit} disabled={busy}>{busy ? 'Saving…' : 'Save & send email'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}



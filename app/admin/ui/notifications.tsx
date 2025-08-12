"use client";
import { useEffect, useState } from 'react';

interface ToastItem {
  id: number;
  message: string;
  type?: 'info' | 'success' | 'error';
}

export function Notifications() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    let idSeq = 1;
    function onNotify(e: Event) {
      const detail = (e as CustomEvent).detail as { message: string; type?: ToastItem['type'] } | undefined;
      const message = detail?.message || '';
      const type = detail?.type || 'info';
      if (!message) return;
      const id = idSeq++;
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3500);
    }
    window.addEventListener('notify', onNotify as EventListener);
    return () => window.removeEventListener('notify', onNotify as EventListener);
  }, []);

  if (toasts.length === 0) return null;
  return (
    <div className="fixed right-4 top-4 z-50 space-y-2">
      {toasts.map((t) => {
        const base = 'rounded border px-3 py-2 shadow bg-white';
        const tone =
          t.type === 'success' ? 'border-green-500' : t.type === 'error' ? 'border-red-500' : 'border-gray-300';
        return (
          <div key={t.id} className={`${base} ${tone}`}>
            {t.message}
          </div>
        );
      })}
    </div>
  );
}



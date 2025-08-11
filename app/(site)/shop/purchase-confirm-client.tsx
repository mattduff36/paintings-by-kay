"use client";
import { useEffect, useState } from 'react';

export default function ConfirmPurchase() {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const url = new URL(window.location.href);
    const sessionId = url.searchParams.get('session_id');
    if (!sessionId || done) return;
    (async () => {
      try {
        await fetch('/api/checkout/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_id: sessionId }),
        });
      } catch {}
      setDone(true);
    })();
  }, [done]);
  return null;
}




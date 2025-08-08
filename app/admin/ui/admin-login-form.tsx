"use client";
import { useState } from 'react';

export function AdminLoginForm() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data?.error || 'Login failed');
      return;
    }
    window.location.reload();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded border p-4">
      <input
        className="w-full rounded border p-2"
        type="password"
        placeholder="Admin password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button className="rounded bg-[var(--primary-color)] px-4 py-2 text-white hover:bg-[var(--accent-color)]" type="submit">
        Log in
      </button>
    </form>
  );
}



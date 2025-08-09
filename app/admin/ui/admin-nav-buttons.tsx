"use client";
import { useEffect, useState } from 'react';

export function AdminNavButtons() {
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    function onDirty() { setIsDirty(true); }
    function onClean() { setIsDirty(false); setIsSaving(false); }
    function onSaving() { setIsSaving(true); }
    window.addEventListener('admin:dirty', onDirty);
    window.addEventListener('admin:clean', onClean);
    window.addEventListener('admin:saving', onSaving);
    return () => {
      window.removeEventListener('admin:dirty', onDirty);
      window.removeEventListener('admin:clean', onClean);
      window.removeEventListener('admin:saving', onSaving);
    };
  }, []);

  async function onSave() {
    window.dispatchEvent(new CustomEvent('admin:saving'));
    window.dispatchEvent(new CustomEvent('admin:save-all'));
  }
  async function onLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.href = '/shop';
  }
  const saveClass = `rounded border px-3 py-1 ${isDirty ? 'bg-red-600 text-white border-red-600' : ''} ${isSaving ? 'opacity-60' : ''}`;
  return (
    <li style={{ display: 'flex', gap: '0.5rem' }}>
      <button onClick={onSave} className={saveClass} disabled={isSaving}>{isSaving ? 'Saving…' : 'Save'}</button>
      <button onClick={onLogout} className="rounded border px-3 py-1">Log out</button>
    </li>
  );
}



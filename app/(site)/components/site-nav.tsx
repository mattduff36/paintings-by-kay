"use client";
import Link from 'next/link';
import { AdminNavButtons } from '@/app/admin/ui/admin-nav-buttons';
import { useEffect, useState } from 'react';

export function SiteNav({ showAdminActions = false }: { showAdminActions?: boolean }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    function onResize() {
      if (window.innerWidth >= 768 && open) setOpen(false);
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [open]);
  return (
    <nav>
      <div className="logo">
        <Link href="/#home">
          <img src="/images/logos/logo-transparent.webp" alt="Paintings by Kay Logo" width={200} height={80} />
        </Link>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <ul className={`nav-links ${open ? 'open' : ''}`}>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/gallery">Gallery</Link></li>
          <li><Link href="/#about">About</Link></li>
          <li><Link href="/#contact">Contact</Link></li>
          <li><Link href="/shop">Shop</Link></li>
        </ul>
        {showAdminActions ? <AdminNavButtons /> : null}
        <button className="menu-toggle" aria-label="Menu" onClick={() => setOpen((v) => !v)}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>
    </nav>
  );
}



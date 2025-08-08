import { SiteNav } from './components/site-nav';
import React from 'react';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header>
        <SiteNav />
      </header>
      <main>{children}</main>
      <footer>
        <p>Website developed by <a href="https://mpdee.co.uk">mpdee.co.uk</a> © 2025. All rights reserved.</p>
      </footer>
    </>
  );
}



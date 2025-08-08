export const metadata = {
  title: 'Paintings by Kay',
  description: 'Original canvas paintings by Kay',
};

import './globals.css';
import '../../styles.css';
import { SiteNav } from './components/site-nav';
import React from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="fixed inset-x-0 top-0 z-50 bg-white shadow">
          <SiteNav />
        </header>
        <main className="mt-24 px-4">{children}</main>
        <footer className="mt-24 bg-white p-8 text-center text-gray-800">
          Website developed by <a className="underline" href="https://mpdee.co.uk">mpdee.co.uk</a> © 2025. All rights reserved.
        </footer>
      </body>
    </html>
  );
}



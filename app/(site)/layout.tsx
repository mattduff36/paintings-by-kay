export const metadata = {
  title: 'Paintings by Kay',
  description: 'Original canvas paintings by Kay',
};

import '../globals.css';
import '../../styles.css';
import { SiteNav } from './components/site-nav';
import React from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body>
        <header>
          <SiteNav />
        </header>
        <main>{children}</main>
        <footer>
          <p>Website developed by <a href="https://mpdee.co.uk">mpdee.co.uk</a> © 2025. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}



import Link from 'next/link';

export function SiteNav() {
  return (
    <nav className="mx-auto flex max-w-6xl items-center justify-between p-4">
      <div className="logo">
        <Link href="/">
          <img src="/images/logos/logo-transparent.png" alt="Paintings by Kay Logo" className="h-12 w-auto" />
        </Link>
      </div>
      <ul className="flex list-none gap-6">
        <li><Link href="/">Home</Link></li>
        <li><Link href="/gallery">Gallery</Link></li>
        <li><Link href="/shop">Shop</Link></li>
      </ul>
    </nav>
  );
}



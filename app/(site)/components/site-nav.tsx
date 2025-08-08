import Link from 'next/link';

export function SiteNav() {
  return (
    <nav>
      <div className="logo">
        <Link href="/#home">
          <img src="/images/logos/logo-transparent.webp" alt="Paintings by Kay Logo" width={200} height={80} />
        </Link>
      </div>
      <ul className="nav-links">
        <li><Link href="/">Home</Link></li>
        <li><Link href="/gallery">Gallery</Link></li>
        <li><Link href="/#about">About</Link></li>
        <li><Link href="/#contact">Contact</Link></li>
        <li><Link href="/shop">Shop</Link></li>
      </ul>
    </nav>
  );
}



export default function HomePage() {
  return (
    <section className="mx-auto max-w-6xl">
      <div className="text-center">
        <img
          src="/images/logos/logo-transparent.png"
          alt="Paintings by Kay Logo"
          className="mx-auto mb-4 h-auto max-w-md drop-shadow"
        />
        <p>A collection of nature-inspired paintings created with love and passion</p>
      </div>
      <div className="mt-12 text-center">
        <a href="/gallery" className="inline-block rounded bg-[var(--primary-color)] px-6 py-3 text-white hover:bg-[var(--accent-color)]">View All Paintings</a>
      </div>
    </section>
  );
}



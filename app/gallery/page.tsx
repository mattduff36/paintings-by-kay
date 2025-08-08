function GalleryGrid() {
  const images = Array.from({ length: 40 }).map((_, i) => i + 1);
  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {images.map((n) => (
        <div key={n} className="overflow-hidden rounded shadow">
          <picture>
            <source media="(max-width: 768px)" srcSet={`/images/gallery/mobile/gallery${n}.webp`} type="image/webp" />
            <source media="(max-width: 1024px)" srcSet={`/images/gallery/tablet/gallery${n}.webp`} type="image/webp" />
            <img
              src={`/images/gallery/desktop/gallery${n}.webp`}
              alt={`Original canvas painting by Kay - gallery ${n}`}
              loading="lazy"
            />
          </picture>
        </div>
      ))}
    </div>
  );
}

export default function GalleryPage() {
  return (
    <main className="space-y-8">
      <h1 className="text-center text-3xl font-medium text-[var(--primary-color)]">Gallery</h1>
      <p className="text-center italic text-gray-600">
        All paintings are available for purchase. If you're interested in buying any of these pieces, please get in touch.
      </p>
      <GalleryGrid />
    </main>
  );
}



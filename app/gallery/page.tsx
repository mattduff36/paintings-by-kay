import FullscreenMount from './FullscreenMount';
export default function GalleryPage() {
  const images = Array.from({ length: 40 }).map((_, i) => i + 1);
  return (
    <main id="top">
      {/* Client script to enable fullscreen behavior */}
      {/* @ts-expect-error Server Components can include client children */}
      <FullscreenMount />
      <h1 className="gallery-title">Gallery</h1>
      <p className="gallery-note">All paintings are available for purchase. If you're interested in buying any of these pieces, please get in touch.</p>
      <div className="gallery-grid" id="fullGallery">
        {images.map((n) => (
          <div key={n} className="gallery-item">
            <picture>
              <source media="(max-width: 768px)" srcSet={`/images/gallery/mobile/gallery${n}.webp`} type="image/webp" />
              <source media="(max-width: 1024px)" srcSet={`/images/gallery/tablet/gallery${n}.webp`} type="image/webp" />
              <img src={`/images/gallery/desktop/gallery${n}.webp`} alt={`Original canvas painting by Kay - gallery ${n}`} loading="lazy" />
            </picture>
          </div>
        ))}
      </div>

      <div className="fullscreen-overlay">
        <span className="close-fullscreen">&times;</span>
        <img className="fullscreen-image" src="" alt="" />
      </div>
    </main>
  );
}



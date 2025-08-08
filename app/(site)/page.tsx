export default function HomePage() {
  return (
    <>
      <section id="home" className="hero">
        <div className="hero-content">
          <picture>
            <source srcSet="/images/logos/logo-transparent.webp" type="image/webp" />
            <img src="/images/logos/logo-transparent.webp" alt="Paintings by Kay Logo" className="hero-logo" />
          </picture>
          <p>A collection of nature-inspired paintings created with love and passion</p>
        </div>
      </section>

      <section id="about" className="about">
        <div className="about-content">
          <div className="about-image">
            <picture>
              <source media="(max-width: 768px)" srcSet="/images/profile/kay-profile-mobile.webp" type="image/webp" />
              <source srcSet="/images/profile/kay-profile.webp" type="image/webp" />
              <img src="/images/profile/kay-profile.webp" alt="Kay - Local artist from Mansfield, Nottinghamshire" />
            </picture>
          </div>
          <div className="about-text">
            <h2>Hi, I'm Kay</h2>
            <p>I started painting in 2013 after being inspired by watching Bob Ross. What began as a bit of fun quickly became a much-loved hobby and a way for me to relax and express my creativity.</p>
            <p>I specialize in nature-inspired artwork — from serene woodland scenes and dramatic skies to tranquil waters and coastal landscapes. Each piece is carefully crafted using high-quality acrylic paints (and occasionally oils), capturing the beauty of the natural world through my unique perspective.</p>
            <p>While painting is my passion rather than my profession, I do take on select commissions. I particularly enjoy creating custom landscape and scenery pieces that bring the beauty of nature into your home.</p>
            <p>Thank you for exploring my collection of original paintings. I hope you enjoy my artwork as much as I enjoy creating it.</p>
          </div>
        </div>
      </section>

      <section id="gallery" className="gallery">
        <h2>Featured Paintings</h2>
        <div className="gallery-grid" id="featuredGallery">
          {/* Render featured images similar to original behavior */}
          {[1, 2, 3].map((n) => (
            <div key={n} className="gallery-item">
              <img src={`/images/featured/featured${n}.jpg`} alt={`Featured Painting ${n}`} />
            </div>
          ))}
        </div>
        <p className="gallery-note">All paintings are available for purchase. If you're interested in buying any of these pieces, please get in touch.</p>
        <div className="view-all">
          <a href="/gallery" className="view-all-button">View All Paintings</a>
        </div>
      </section>

      <section id="contact" className="contact">
        <h2>Get in Touch</h2>
        <div className="contact-content">
          <p>If you'd like to know more about my paintings or discuss a commission, I'd love to hear from you.</p>
          <form id="contact-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" name="name" required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" required />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" required />
            </div>
            <button type="submit" id="submit-button">Send Message</button>
            <div id="form-status" className="form-status" />
          </form>
        </div>
      </section>
    </>
  );
}



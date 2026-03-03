import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <p className="hero-tag">Welcome to</p>
          <h1 className="hero-title">Brewscape</h1>
          <p className="hero-subtitle">
            Where every cup tells a story. Specialty coffee, artisan eats, and a
            vibe that feels like home.
          </p>
          <div className="hero-actions">
            <Link to="/menu" className="btn btn-primary">
              Explore Menu
            </Link>
            <Link to="/book" className="btn btn-outline">
              Book a Table
            </Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-emoji">☕</div>
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <span className="feature-icon">🫘</span>
          <h3>Premium Beans</h3>
          <p>Single-origin, ethically sourced coffee roasted to perfection</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">🥐</span>
          <h3>Fresh Bakes</h3>
          <p>Artisan pastries and sandwiches baked fresh every morning</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">🪴</span>
          <h3>Cozy Vibes</h3>
          <p>Minimalist space designed for work, chill, or catching up</p>
        </div>
      </section>

      <section className="cta-section">
        <h2>Hungry? Skip the wait.</h2>
        <p>Order ahead and pick up when it&apos;s ready.</p>
        <Link to="/order" className="btn btn-primary">
          Order Now
        </Link>
      </section>
    </div>
  );
}

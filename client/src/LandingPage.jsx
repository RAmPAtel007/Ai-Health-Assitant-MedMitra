import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="landing-page">
      {/* Animated Background Elements */}
      <div className="animated-bg">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
        <div className="floating-shape shape-4"></div>
        <div className="floating-shape shape-5"></div>
        <div className="floating-shape shape-6"></div>
      </div>

      {/* Cursor Follow Effect */}
      <div 
        className="cursor-glow" 
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
        }}
      ></div>

      {/* Header */}
      <header className={`header ${scrolled ? "scrolled" : ""}`}>
        <nav className="nav-container">
          <div className="logo-section">
            <div className="logo-icon">
              <span>M</span>
            </div>
            <span className="logo-text">Medmitra</span>
          </div>
          <div className="nav-buttons">
            <Link to="/login">
              <button className="btn-login">Login</button>
            </Link>
            <Link to="/register">
              <button className="btn-get-started">Get Started</button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-grid">
            <div className="hero-content">
              <div className="hero-badge">
                🏥 Healthcare Made Simple
              </div>
              <h1 className="hero-title">
                Hi, I'm <span className="gradient-text">Medmitra</span> — Your personal AI health assistant
              </h1>
              <p className="hero-description">
                Daily support for your well-being — from habits to sleep and nutrition. Track vaccinations, get outbreak alerts, and find hospitals instantly.
              </p>
              <div className="hero-buttons">
                <Link to="/register">
                  <button className="btn-primary-large">Create Account</button>
                </Link>
                <Link to="/login">
                  <button className="btn-secondary-large">Sign In</button>
                </Link>
              </div>
            </div>
            <div className="hero-image-container">
              <div className="hero-glow"></div>
              <div className="pulse-ring"></div>
              <div className="pulse-ring ring-delay-1"></div>
              <div className="pulse-ring ring-delay-2"></div>
              
              <div className="hero-card">
                <div className="doctor-image-container">
                  <div className="image-frame">
                    <img 
                      src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=80" 
                      alt="Female Doctor"
                      className="doctor-image"
                    />
                    <div className="image-overlay"></div>
                  </div>
                  
                  {/* Floating Health Icons */}
                  <div className="floating-icon icon-1">💊</div>
                  <div className="floating-icon icon-2">❤️</div>
                  <div className="floating-icon icon-3">🩺</div>
                  <div className="floating-icon icon-4">💉</div>
                  <div className="floating-icon icon-5">⚕️</div>
                </div>
                
                <div className="hero-trust">
                  <div className="trust-badge">
                    <span className="badge-icon">⭐</span>
                    <div>
                      <p className="trust-title">Trusted worldwide</p>
                      <p className="trust-subtitle">30K+ users rely on Medmitra</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stats-card">
            <div className="stats-header">
              <span className="stats-badge">🌟 Health support</span>
              <h2 className="stats-title">
                Understand and improve your health
              </h2>
            </div>
            <div className="stats-grid">
              <div className="stat-item stat-delay-1">
                <div className="stat-number">15</div>
                <p className="stat-text">health & productivity features available</p>
              </div>
              <div className="stat-item stat-delay-2">
                <div className="stat-number">50+</div>
                <p className="stat-text">expert resources integrated</p>
              </div>
              <div className="stat-item stat-delay-3">
                <div className="stat-number">30K+</div>
                <p className="stat-text">active users in the community</p>
              </div>
              <div className="stat-item stat-delay-4">
                <div className="stat-number">99%</div>
                <p className="stat-text">user satisfaction rate</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <div className="features-header">
            <span className="features-badge">✨ Key features</span>
            <h2 className="features-title">
              Support for your body and mind — always within reach
            </h2>
          </div>
          <div className="features-grid">
            <div className="feature-card card-animate-1">
              <div className="feature-icon">
                <span className="icon-spin">💬</span>
              </div>
              <h3 className="feature-heading">AI chat that understands you</h3>
              <p className="feature-text">Voice, photo, or text — talk the way you like, I'll always reply.</p>
              <div className="feature-shine"></div>
            </div>
            <div className="feature-card card-animate-2">
              <div className="feature-icon">
                <span className="icon-bounce">📊</span>
              </div>
              <h3 className="feature-heading">Track your key health metrics</h3>
              <p className="feature-text">Monitor vaccinations, medications, and health history.</p>
              <div className="feature-shine"></div>
            </div>
            <div className="feature-card card-animate-3">
              <div className="feature-icon">
                <span className="icon-pulse">📚</span>
              </div>
              <h3 className="feature-heading">Your history, always accessible</h3>
              <p className="feature-text">Keep your past conversations so you can revisit them anytime.</p>
              <div className="feature-shine"></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-card">
            <div className="cta-particles">
              <div className="particle particle-1"></div>
              <div className="particle particle-2"></div>
              <div className="particle particle-3"></div>
              <div className="particle particle-4"></div>
              <div className="particle particle-5"></div>
            </div>
            <h2 className="cta-title">Ready to transform your healthcare journey?</h2>
            <p className="cta-subtitle">Join thousands of users who trust Medmitra</p>
            <Link to="/register">
              <button className="cta-button">
                Get Started Free
                <span className="button-arrow">→</span>
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
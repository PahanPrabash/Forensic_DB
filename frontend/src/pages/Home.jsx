import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeFeature, setActiveFeature] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Animated particles on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(56, 189, 248, ${this.opacity})`;
        ctx.fill();
      }
    }

    const particles = Array.from({ length: 80 }, () => new Particle());

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });

      // Draw connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(56, 189, 248, ${0.06 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const features = [
    {
      icon: 'shield-checkmark',
      title: 'Secure Case Management',
      desc: 'Military-grade encryption for all forensic case files and patient records.',
      color: '#38bdf8',
    },
    {
      icon: 'document-text',
      title: 'Digital MLEF Forms',
      desc: 'Generate medico-legal examination forms with automated data pre-fill.',
      color: '#7dd3fc',
    },
    {
      icon: 'flask',
      title: 'Lab Integration',
      desc: 'Track evidence chain-of-custody and lab test results in real-time.',
      color: '#10b981',
    },
    {
      icon: 'stats-chart',
      title: 'Analytics & Reports',
      desc: 'Instant reports with visualizations for court submissions and audits.',
      color: '#f59e0b',
    },
  ];

  const stats = [
    { number: '10,000+', label: 'Cases Processed' },
    { number: '99.9%', label: 'System Uptime' },
    { number: '500+', label: 'Medical Officers' },
    { number: '24/7', label: 'Support Available' },
  ];

  return (
    <div className="home-page" onMouseMove={handleMouseMove}>
      {/* Animated Particle Canvas */}
      <canvas ref={canvasRef} className="particle-canvas" />

      {/* Floating Cursor Glow */}
      <div
        className="cursor-glow"
        style={{
          left: mousePos.x - 150,
          top: mousePos.y - 150,
        }}
      />

      {/* =================== HERO SECTION =================== */}
      <section className="hero-section">
        {/* Animated Orbs */}
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />

        {/* DNA Helix Animation */}
        <div className="dna-helix">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="dna-strand" style={{ animationDelay: `${i * 0.15}s` }}>
              <div className="dna-dot dna-dot-left" />
              <div className="dna-bar" />
              <div className="dna-dot dna-dot-right" />
            </div>
          ))}
        </div>

        <div className={`hero-content ${isLoaded ? 'loaded' : ''}`}>
          {/* Animated Badge */}
          <div className="hero-badge animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <span className="badge-dot" />
            <span>Forensic Medical Database System</span>
          </div>

          <h1 className="hero-title animate-slide-up" style={{ animationDelay: '0.4s' }}>
            Digital Forensic
            <br />
            <span className="gradient-text">Medicine Platform</span>
          </h1>

          <p className="hero-description animate-slide-up" style={{ animationDelay: '0.6s' }}>
            A comprehensive digital platform for the Department of Forensic Medicine.
            Manage cases, patients, medico-legal forms, autopsy reports, and evidence
            chain-of-custody — all in one secure, modern system.
          </p>

          <div className="hero-actions animate-slide-up" style={{ animationDelay: '0.8s' }}>
            <button
              className="btn-hero-primary"
              onClick={() => navigate('/login')}
              id="home-login-btn"
            >
              <ion-icon name="log-in-outline"></ion-icon>
              Login to System
              <span className="btn-shine" />
            </button>
            <button
              className="btn-hero-secondary"
              onClick={() => navigate('/signup')}
              id="home-signup-btn"
            >
              <ion-icon name="person-add-outline"></ion-icon>
              Create Account
            </button>
          </div>

          {/* Animated Stats Bar */}
          <div className="hero-stats animate-slide-up" style={{ animationDelay: '1s' }}>
            {stats.map((stat, i) => (
              <div key={i} className="hero-stat-item">
                <span className="hero-stat-number">{stat.number}</span>
                <span className="hero-stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =================== FEATURES SECTION =================== */}
      <section className="features-section" id="features">
        <div className="section-header animate-on-scroll">
          <span className="section-tag">Capabilities</span>
          <h2 className="section-title">
            Everything You Need for
            <br />
            <span className="gradient-text">Forensic Case Management</span>
          </h2>
          <p className="section-subtitle">
            Built specifically for forensic medical departments with industry-leading security and compliance.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, i) => (
            <div
              key={i}
              className={`feature-card ${activeFeature === i ? 'active' : ''}`}
              onMouseEnter={() => setActiveFeature(i)}
              onMouseLeave={() => setActiveFeature(null)}
              style={{ animationDelay: `${0.15 * i}s` }}
            >
              <div className="feature-icon-wrap" style={{ background: `${feature.color}15` }}>
                <ion-icon name={feature.icon} style={{ color: feature.color, fontSize: '1.75rem' }}></ion-icon>
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-desc">{feature.desc}</p>
              <div className="feature-glow" style={{ background: feature.color }} />
            </div>
          ))}
        </div>
      </section>

      {/* =================== CTA SECTION =================== */}
      <section className="cta-section">
        <div className="cta-bg-pattern" />
        <div className="cta-content animate-on-scroll">
          <h2 className="cta-title">
            Ready to Modernize Your
            <br />
            <span className="gradient-text">Forensic Department?</span>
          </h2>
          <p className="cta-desc">
            Join hundreds of medical professionals already using Forensic DB
            to streamline their workflow and improve case outcomes.
          </p>
          <button
            className="btn-hero-primary btn-lg"
            onClick={() => navigate('/login')}
            id="cta-login-btn"
          >
            <ion-icon name="arrow-forward-outline"></ion-icon>
            Get Started Now
            <span className="btn-shine" />
          </button>
        </div>
      </section>

      {/* =================== FOOTER =================== */}
      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <ion-icon name="medical" style={{ color: 'var(--primary)', fontSize: '1.5rem' }}></ion-icon>
            <span className="sidebar-logo">Forensic DB</span>
          </div>
          <p className="footer-text">
            © 2026 Department of Forensic Medicine. Digital Database System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;

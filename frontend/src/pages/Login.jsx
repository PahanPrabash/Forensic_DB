import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate a brief loading animation before navigating
    setTimeout(() => {
      navigate('/dashboard');
    }, 800);
  };

  return (
    <div className="login-page" style={{ 
        display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', 
        background: 'radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)', position: 'relative', overflow: 'hidden' 
    }}>
      
      {/* Animated Background Orbs */}
      <div className="bg-shape" style={{
        position: 'absolute', filter: 'blur(80px)', opacity: '0.4', zIndex: 0, borderRadius: '50%',
        width: '500px', height: '500px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', top: '-150px', left: '-100px'
      }}></div>
      <div className="bg-shape" style={{
        position: 'absolute', filter: 'blur(80px)', opacity: '0.4', zIndex: 0, borderRadius: '50%',
        width: '350px', height: '350px', background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)', bottom: '-80px', right: '-50px'
      }}></div>
      <div className="bg-shape" style={{
        position: 'absolute', filter: 'blur(60px)', opacity: '0.2', zIndex: 0, borderRadius: '50%',
        width: '200px', height: '200px', background: '#10b981', top: '60%', left: '20%',
        animation: 'orbFloat 12s ease-in-out infinite 5s'
      }}></div>

      {/* Floating Grid Pattern */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        backgroundImage: `
          linear-gradient(rgba(59, 130, 246, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(59, 130, 246, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        animation: 'float 6s ease-in-out infinite'
      }} />

      <div className="glass-panel login-card" style={{ width: '100%', maxWidth: '440px', padding: '3rem 2.5rem', zIndex: 1 }}>
        
        {/* Logo & Header */}
        <div className="login-header" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          {/* Animated Shield Icon */}
          <div style={{
            width: '64px', height: '64px', margin: '0 auto 1rem',
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(14, 165, 233, 0.15))',
            borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            animation: 'scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards'
          }}>
            <ion-icon name="shield-checkmark" style={{ fontSize: '2rem', color: '#3b82f6' }}></ion-icon>
          </div>
          <div className="login-logo" style={{ 
            fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem', 
            background: 'linear-gradient(135deg, #3b82f6, #0ea5e9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' 
          }}>Forensic DB</div>
          <div className="login-subtitle" style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Secure access to the Department of Forensic Medicine
          </div>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="username" className="form-label">Username / Staff ID</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                id="username" 
                className="form-control" 
                placeholder="Enter your credentials" 
                required
                onFocus={() => setFocusedField('username')}
                onBlur={() => setFocusedField(null)}
                style={{
                  paddingLeft: '2.75rem',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  ...(focusedField === 'username' ? { borderColor: '#3b82f6', boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.15), 0 0 20px rgba(59, 130, 246, 0.1)' } : {})
                }}
              />
              <ion-icon name="person-outline" style={{
                position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)',
                fontSize: '1.2rem', color: focusedField === 'username' ? '#3b82f6' : '#475569',
                transition: 'color 0.3s'
              }}></ion-icon>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="password" 
                id="password" 
                className="form-control" 
                placeholder="••••••••" 
                required
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                style={{
                  paddingLeft: '2.75rem',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  ...(focusedField === 'password' ? { borderColor: '#3b82f6', boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.15), 0 0 20px rgba(59, 130, 246, 0.1)' } : {})
                }}
              />
              <ion-icon name="lock-closed-outline" style={{
                position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)',
                fontSize: '1.2rem', color: focusedField === 'password' ? '#3b82f6' : '#475569',
                transition: 'color 0.3s'
              }}></ion-icon>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <input type="checkbox" style={{ accentColor: 'var(--primary)' }} /> Remember me
            </label>
            <a href="#" style={{ fontSize: '0.875rem', color: 'var(--primary)', transition: 'opacity 0.2s' }}>Forgot password?</a>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            id="login-submit-btn"
            disabled={isSubmitting}
            style={{ 
              width: '100%', marginTop: '1rem', padding: '0.9rem', fontSize: '1rem',
              position: 'relative', overflow: 'hidden',
              opacity: isSubmitting ? 0.8 : 1,
              transition: 'all 0.3s'
            }}
          >
            {isSubmitting ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{
                  width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#fff', borderRadius: '50%', animation: 'rotateSlow 0.6s linear infinite',
                  display: 'inline-block'
                }} />
                Authenticating...
              </span>
            ) : (
              <>
                <ion-icon name="log-in-outline"></ion-icon>
                Secure Login
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.5rem 0' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          <span style={{ fontSize: '0.8rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>or</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
        </div>

        <div style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Don't have an account? <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: '600', transition: 'opacity 0.2s' }}>Sign up</Link>
        </div>

        {/* Back to Home Link */}
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <Link to="/" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', transition: 'color 0.2s' }}>
            <ion-icon name="arrow-back-outline"></ion-icon>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

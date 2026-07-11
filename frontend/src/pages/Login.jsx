import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="login-page" style={{ 
        display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', 
        background: 'radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)', position: 'relative', overflow: 'hidden' 
    }}>
      
      {/* Abstract Background Elements */}
      <div className="bg-shape" style={{
        position: 'absolute', filter: 'blur(80px)', opacity: '0.5', zIndex: 0, borderRadius: '50%',
        width: '400px', height: '400px', background: 'var(--primary)', top: '-100px', left: '-100px'
      }}></div>
      <div className="bg-shape" style={{
        position: 'absolute', filter: 'blur(80px)', opacity: '0.5', zIndex: 0, borderRadius: '50%',
        width: '300px', height: '300px', background: 'var(--accent)', bottom: '-50px', right: '-50px'
      }}></div>

      <div className="glass-panel login-card animate-fade-in" style={{ width: '100%', maxWidth: '420px', padding: '3rem 2.5rem', zIndex: 1 }}>
        <div className="login-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="login-logo" style={{ 
            fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem', 
            background: 'linear-gradient(135deg, #3b82f6, #0ea5e9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' 
          }}>Forensic DB</div>
          <div className="login-subtitle" style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Department of Forensic Medicine</div>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="username" className="form-label">Username / Staff ID</label>
            <input type="text" id="username" className="form-control" placeholder="Enter your credentials" required />
          </div>
          
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" id="password" className="form-control" placeholder="••••••••" required />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <input type="checkbox" style={{ accentColor: 'var(--primary)' }} /> Remember me
            </label>
            <a href="#" style={{ fontSize: '0.875rem', color: 'var(--primary)' }}>Forgot password?</a>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '0.85rem', fontSize: '1rem' }}>
            Secure Login
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Don't have an account? <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: '500' }}>Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    navigate('/login');
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

      <div className="glass-panel login-card animate-fade-in" style={{ width: '100%', maxWidth: '450px', padding: '2.5rem', zIndex: 1 }}>
        <div className="login-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="login-logo" style={{ 
            fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem', 
            background: 'linear-gradient(135deg, #3b82f6, #0ea5e9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' 
          }}>Forensic DB</div>
          <div className="login-subtitle" style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Staff Registration</div>
        </div>

        <form onSubmit={handleSignup}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label htmlFor="firstName" className="form-label">First Name</label>
              <input type="text" id="firstName" className="form-control" placeholder="First Name" required />
            </div>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label htmlFor="lastName" className="form-label">Last Name</label>
              <input type="text" id="lastName" className="form-control" placeholder="Last Name" required />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label htmlFor="staffId" className="form-label">Staff ID</label>
            <input type="text" id="staffId" className="form-control" placeholder="e.g. DOC-1234" required />
          </div>

          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label htmlFor="role" className="form-label">Role</label>
            <select id="role" className="form-control" required>
              <option value="">Select your role</option>
              <option value="doctor">Medical Officer</option>
              <option value="jmo">JMO (Judicial Medical Officer)</option>
              <option value="lab">Lab Technician</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
          
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" id="password" className="form-control" placeholder="Create a strong password" required />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem', fontSize: '1rem' }}>
            Register Account
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '500' }}>Login here</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;

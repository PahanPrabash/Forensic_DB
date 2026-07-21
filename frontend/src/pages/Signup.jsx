import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';

const Signup = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [roleId, setRoleId] = useState('2'); // Default to JMO doctor role
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await authAPI.register({
        username,
        password,
        roleId: parseInt(roleId)
      });

      if (res.success) {
        setSuccessMessage('Account registered successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        setErrorMessage(res.message || 'Registration failed');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Server error during registration');
    } finally {
      setIsSubmitting(false);
    }
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
          <div className="login-subtitle" style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Staff & User Registration</div>
        </div>

        {errorMessage && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.5rem',
            fontSize: '0.875rem'
          }}>
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#34d399', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.5rem',
            fontSize: '0.875rem'
          }}>
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSignup}>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label htmlFor="username" className="form-label">Username</label>
            <input 
              type="text" 
              id="username" 
              className="form-control" 
              placeholder="Choose a username" 
              required 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label htmlFor="role" className="form-label">Role</label>
            <select 
              id="role" 
              className="form-control" 
              required
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
            >
              <option value="1">System Administrator</option>
              <option value="2">Examining Doctor (JMO)</option>
              <option value="3">Registrar Clerk</option>
              <option value="4">Laboratory Staff</option>
            </select>
          </div>
          
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="password" className="form-label">Password</label>
            <input 
              type="password" 
              id="password" 
              className="form-control" 
              placeholder="Create a strong password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={isSubmitting}
            style={{ width: '100%', padding: '0.85rem', fontSize: '1rem' }}
          >
            {isSubmitting ? 'Registering Account...' : 'Register Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: '500' }} onClick={() => navigate('/login')}>Login here</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;

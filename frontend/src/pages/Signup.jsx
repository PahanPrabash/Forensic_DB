import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';

const Signup = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [roleId, setRoleId] = useState('2'); // Default to JMO doctor role
  const [staffId, setStaffId] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        username,
        password,
        roleId: parseInt(roleId)
      };

      // Add double verification fields for non-admin roles
      if (roleId !== '1') {
        if (!staffId || !email) {
          setErrorMessage('Staff ID and Registered Email Address are required.');
          setIsSubmitting(false);
          return;
        }
        payload.staffId = staffId.trim(); // Send string (e.g. STF-002) to backend
        payload.email = email.trim();
      }

      const res = await authAPI.register(payload);

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
            <label htmlFor="username" className="form-label">System Username</label>
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

          {/* Double Verification Fields (Staff ID and Email) */}
          {roleId !== '1' && (
            <>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label htmlFor="staffId" className="form-label">Staff ID *</label>
                <input 
                  type="text" 
                  id="staffId" 
                  className="form-control" 
                  placeholder="e.g. STF-002" 
                  required 
                  value={staffId}
                  onChange={(e) => setStaffId(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label htmlFor="email" className="form-label">Registered Email Address *</label>
                <input 
                  type="email" 
                  id="email" 
                  className="form-control" 
                  placeholder="Enter your registered email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                  Must match the exact email and ID registered in the staff directory by the Administrator.
                </span>
              </div>
            </>
          )}
          
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label htmlFor="password" className="form-label">Password *</label>
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

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="confirmPassword" className="form-label">Confirm Password *</label>
            <input 
              type="password" 
              id="confirmPassword" 
              className="form-control" 
              placeholder="Confirm your password" 
              required 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600' }}>Login here</Link>
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

export default Signup;

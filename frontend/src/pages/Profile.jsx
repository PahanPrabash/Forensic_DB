import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

const Profile = () => {
  const { user, token } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: 'Forensic Medicine',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        username: user.Username || user.username || '',
        firstName: user.FirstName || user.firstName || '',
        lastName: user.LastName || user.lastName || '',
        email: user.Email || user.email || '',
        phone: user.Phone || user.phone || '',
        department: user.Department || user.department || 'Forensic Medicine'
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'danger', text: 'New passwords do not match' });
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await authAPI.updateProfile({
        username: formData.username,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        department: formData.department,
        ...(formData.newPassword && {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      });

      if (res.success) {
        setMessage({ type: 'success', text: 'Profile & Username updated successfully! Refresh to see full changes.' });
        setFormData((prev) => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
      } else {
        setMessage({ type: 'danger', text: res.message || 'Failed to update profile' });
      }
    } catch (err) {
      setMessage({ type: 'danger', text: err.message || 'Error updating profile' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-content animate-slide-up">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>User Profile & Settings</h1>
        <p style={{ margin: 0, color: 'var(--text-muted)' }}>Manage your username, account details, contact info, and security credentials.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        
        {/* Profile Card */}
        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', height: 'fit-content' }}>
          <div style={{
            width: '80px', height: '80px', margin: '0 auto 1.25rem',
            background: 'linear-gradient(135deg, var(--primary), var(--accent))',
            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', fontWeight: 'bold', color: '#fff', boxShadow: '0 8px 24px rgba(59, 130, 246, 0.3)'
          }}>
            {formData.firstName?.[0] || formData.username?.[0] || 'U'}
          </div>
          <h2 style={{ fontSize: '1.25rem', margin: '0 0 0.25rem' }}>
            {formData.firstName || formData.username} {formData.lastName}
          </h2>
          <span className="badge badge-primary" style={{ marginBottom: '1rem', display: 'inline-block' }}>
            {user?.RoleName || user?.role || 'User'}
          </span>
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '1rem', textAlign: 'left', fontSize: '0.875rem' }}>
            <p style={{ margin: '0.5rem 0', color: 'var(--text-muted)' }}>
              <b>Username:</b> <code style={{ color: '#3b82f6', fontWeight: 'bold' }}>{formData.username}</code>
            </p>
            <p style={{ margin: '0.5rem 0', color: 'var(--text-muted)' }}>
              <b>Staff ID:</b> {user?.StaffID || 'N/A'}
            </p>
            <p style={{ margin: '0.5rem 0', color: 'var(--text-muted)' }}>
              <b>Department:</b> {formData.department}
            </p>
          </div>
        </div>

        {/* Edit Form */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ margin: '0 0 1.5rem', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ion-icon name="create-outline" style={{ color: 'var(--primary)' }}></ion-icon>
            Edit Profile & Credentials
          </h3>

          {message.text && (
            <div style={{
              background: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              border: `1px solid ${message.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
              color: message.type === 'success' ? '#34d399' : '#f87171',
              padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.875rem'
            }}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            
            {/* Username Field */}
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">System Username</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  name="username"
                  className="form-control"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your system username"
                  required
                  style={{ paddingLeft: '2.5rem' }}
                />
                <ion-icon name="at-outline" style={{
                  position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)',
                  fontSize: '1.2rem', color: '#3b82f6'
                }}></ion-icon>
              </div>
              <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>This is the handle you use when logging into Forensic DB.</small>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  className="form-control"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  required
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  className="form-control"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="email@forensic.pdn.ac.lk"
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  className="form-control"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="077-1234567"
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Department</label>
              <input
                type="text"
                name="department"
                className="form-control"
                value={formData.department}
                onChange={handleChange}
                placeholder="Department of Forensic Medicine"
              />
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
              <h4 style={{ margin: '0 0 1rem', fontSize: '1rem', color: 'var(--primary)' }}>Change Password (Optional)</h4>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  className="form-control"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="Enter current password to change"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    className="form-control"
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="New password"
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    className="form-control"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
              style={{ width: '100%', padding: '0.85rem', fontSize: '1rem' }}
            >
              {isSubmitting ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Profile;

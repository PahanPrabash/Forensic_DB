import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AppLayout = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = () => {
    if (!user) return 'U';
    const first = user.FirstName || user.firstName || user.username || '';
    const last = user.LastName || user.lastName || '';
    return `${first[0] || ''}${last[0] || ''}`.toUpperCase() || 'U';
  };

  const getDisplayName = () => {
    if (!user) return 'User Profile';
    if (user.FirstName || user.firstName) {
      return `${user.FirstName || user.firstName} ${user.LastName || user.lastName || ''}`.trim();
    }
    return user.username || 'User Profile';
  };

  const showLink = (moduleName) => {
    if (!user) return false;
    const roleId = parseInt(user.RoleID || user.roleId);
    
    // System Administrator (Role ID 1)
    if (roleId === 1) {
      return ['Dashboard', 'Staff', 'Profile'].includes(moduleName);
    }
    // Examining Doctor (JMO) (Role ID 2)
    if (roleId === 2) {
      return ['Dashboard', 'Cases', 'Clinical', 'MLR', 'Referrals', 'Autopsy', 'CauseOfDeath', 'Court', 'Evidence', 'Reports', 'Profile'].includes(moduleName);
    }
    // Registrar Clerk (Role ID 3)
    if (roleId === 3) {
      return ['Dashboard', 'Cases', 'Court', 'Reports', 'Profile'].includes(moduleName);
    }
    // Laboratory Staff (Role ID 4)
    if (roleId === 4) {
      return ['Dashboard', 'Evidence', 'Profile'].includes(moduleName);
    }
    return false;
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-header" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }} title="Go to Dashboard">
          <ion-icon name="medical" style={{ color: 'var(--primary)', fontSize: '1.5rem' }}></ion-icon>
          <span className="sidebar-logo">Forensic DB</span>
        </div>
        
        <nav className="nav-menu">
          {showLink('Dashboard') && (
            <div className="nav-item">
              <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                <ion-icon name="grid-outline"></ion-icon> Dashboard
              </NavLink>
            </div>
          )}
          
          {(showLink('Cases') || showLink('Clinical') || showLink('MLR') || showLink('Referrals') || showLink('Autopsy') || showLink('CauseOfDeath') || showLink('Court') || showLink('Evidence') || showLink('Reports')) && (
            <div style={{ margin: '1.5rem 0 0.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: '#475569', fontWeight: '700', letterSpacing: '0.05em', paddingLeft: '1rem' }}>
              Modules
            </div>
          )}
          
          {showLink('Cases') && (
            <div className="nav-item">
              <NavLink to="/cases" className={({ isActive }) => (isActive || window.location.pathname === '/register-patient' ? 'nav-link active' : 'nav-link')}>
                <ion-icon name="folder-outline"></ion-icon> Patient & Cases
              </NavLink>
            </div>
          )}
          {showLink('Clinical') && (
            <div className="nav-item">
              <NavLink to="/clinical-mlef" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                <ion-icon name="document-text-outline"></ion-icon> Clinical (MLEF)
              </NavLink>
            </div>
          )}
          {showLink('MLR') && (
            <div className="nav-item">
              <NavLink to="/mlr-report" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                <ion-icon name="reader-outline"></ion-icon> MLR Reports
              </NavLink>
            </div>
          )}
          {showLink('Referrals') && (
            <div className="nav-item">
              <NavLink to="/referrals" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                <ion-icon name="git-branch-outline"></ion-icon> Referrals & Reviews
              </NavLink>
            </div>
          )}
          {showLink('Autopsy') && (
            <div className="nav-item">
              <NavLink to="/autopsy-pmr" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                <ion-icon name="flask-outline"></ion-icon> Autopsy (PMR)
              </NavLink>
            </div>
          )}
          {showLink('CauseOfDeath') && (
            <div className="nav-item">
              <NavLink to="/cause-of-death" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                <ion-icon name="document-outline"></ion-icon> Cause of Death
              </NavLink>
            </div>
          )}
          {showLink('Court') && (
            <div className="nav-item">
              <NavLink to="/court-summons" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                <ion-icon name="calendar-outline"></ion-icon> Court Summons
              </NavLink>
            </div>
          )}
          {showLink('Evidence') && (
            <div className="nav-item">
              <NavLink to="/evidence" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                <ion-icon name="barcode-outline"></ion-icon> Evidence & Lab
              </NavLink>
            </div>
          )}
          {showLink('Reports') && (
            <div className="nav-item">
              <NavLink to="/reports" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                <ion-icon name="stats-chart-outline"></ion-icon> Reports
              </NavLink>
            </div>
          )}
          
          {showLink('Staff') && (
            <>
              <div style={{ margin: '1.5rem 0 0.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: '#475569', fontWeight: '700', letterSpacing: '0.05em', paddingLeft: '1rem' }}>
                Administration
              </div>
              <div className="nav-item">
                <NavLink to="/staff" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                  <ion-icon name="people-outline"></ion-icon> Staff Directory
                </NavLink>
              </div>
            </>
          )}

          {showLink('Profile') && (
            <>
              <div style={{ margin: '1.5rem 0 0.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: '#475569', fontWeight: '700', letterSpacing: '0.05em', paddingLeft: '1rem' }}>
                Account
              </div>
              <div className="nav-item">
                <NavLink to="/profile" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                  <ion-icon name="person-circle-outline"></ion-icon> Profile Settings
                </NavLink>
              </div>
            </>
          )}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        
        {/* Header */}
        <header className="top-header">
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '500' }}>
            Department of Forensic Medicine
          </h2>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ position: 'relative', cursor: 'pointer' }}>
              <ion-icon name="notifications-outline" style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }}></ion-icon>
              <span style={{ position: 'absolute', top: '-2px', right: '-2px', background: 'var(--danger)', width: '10px', height: '10px', borderRadius: '50%', border: '2px solid var(--bg-dark)' }}></span>
            </div>
            {/* User Profile Pill */}
            <div 
              onClick={() => navigate('/profile')}
              className="user-profile"
              style={{
                display: 'flex', alignItems: 'center', gap: '10px', padding: '0.5rem 1rem',
                borderRadius: '20px', cursor: 'pointer', transition: 'all 0.2s'
              }}
              title="Click to Edit Profile"
            >
              <div className="avatar" style={{
                width: '30px', height: '30px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', fontSize: '0.85rem'
              }}>
                {getInitials()}
              </div>
              <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{getDisplayName()}</span>
            </div>

            <button 
              onClick={handleLogout} 
              title="Log Out"
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            >
              <ion-icon name="log-out-outline" style={{ fontSize: '1.5rem' }}></ion-icon>
            </button>
          </div>
        </header>

        {/* Dynamic Page Content Rendered Here */}
        <Outlet />
        
      </main>
    </div>
  );
};

export default AppLayout;

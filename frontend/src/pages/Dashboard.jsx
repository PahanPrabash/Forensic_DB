import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardAPI } from '../services/api';

const AnimatedCounter = ({ target, duration = 1500 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    const numTarget = typeof target === 'number' ? target : parseInt(String(target).replace(/[^0-9]/g, '')) || 0;
    
    if (numTarget === 0) {
      setCount(0);
      return;
    }

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * numTarget));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [target, duration]);

  return <>{count}</>;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [greeting, setGreeting] = useState('');
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    activeCases: 0,
    draftMlefs: 0,
    courtSummons: 0,
    pendingLabTests: 0
  });

  const [recentCases, setRecentCases] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    const fetchDashboardData = async () => {
      try {
        const res = await dashboardAPI.getStats();
        if (res.success) {
          setStats(res.stats);
          setRecentCases(res.recentCases || []);
          setNotifications(res.notifications || []);
        }
      } catch (err) {
        console.warn('Dashboard API offline, using initial state:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const displayName = user ? `${user.firstName || user.username}` : 'Doctor';

  return (
    <div className="page-content">
      {/* Welcome Header */}
      <div className="animate-slide-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', animationDelay: '0.1s' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {greeting}, {displayName}.
            <span style={{ animation: 'float 3s ease-in-out infinite', display: 'inline-block' }}>👋</span>
          </h1>
          <p style={{ margin: 0 }}>Here is what's happening today in the department.</p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={() => navigate('/register-patient')}
          style={{ position: 'relative', overflow: 'hidden' }}
        >
          <ion-icon name="add-outline"></ion-icon> Open New Case
          <span className="btn-shine" />
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid-cards">
        <div className="glass-panel stat-card">
          <div className="stat-icon primary">
            <ion-icon name="folder-open"></ion-icon>
          </div>
          <div className="stat-info">
            <h3><AnimatedCounter target={stats.activeCases} /></h3>
            <p>Active Cases</p>
          </div>
        </div>
        
        <div className="glass-panel stat-card">
          <div className="stat-icon warning">
            <ion-icon name="document-text"></ion-icon>
          </div>
          <div className="stat-info">
            <h3><AnimatedCounter target={stats.draftMlefs} duration={1000} /></h3>
            <p>Draft MLEFs</p>
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-icon danger">
            <ion-icon name="calendar-clear"></ion-icon>
          </div>
          <div className="stat-info">
            <h3><AnimatedCounter target={stats.courtSummons} duration={800} /></h3>
            <p>Court Summons this Week</p>
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-icon success">
            <ion-icon name="flask"></ion-icon>
          </div>
          <div className="stat-info">
            <h3><AnimatedCounter target={stats.pendingLabTests} duration={1200} /></h3>
            <p>Pending Lab Tests</p>
          </div>
        </div>
      </div>

      {/* Main Split Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        
        {/* Recent Cases Table */}
        <div className="glass-panel animate-slide-up" style={{ padding: '1.5rem', animationDelay: '0.3s' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ion-icon name="time-outline" style={{ color: 'var(--primary)' }}></ion-icon>
              Recent Cases
            </h3>
            <Link to="/cases" style={{ color: 'var(--primary)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.25rem', transition: 'gap 0.2s' }}>
              View All <ion-icon name="arrow-forward-outline"></ion-icon>
            </Link>
          </div>
          
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Case No.</th>
                  <th>Type</th>
                  <th>Patient/Deceased</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentCases.length > 0 ? (
                  recentCases.map((c) => (
                    <tr key={c.CaseID || c.CaseNumber}>
                      <td style={{ fontFamily: 'monospace' }}>{c.CaseNumber}</td>
                      <td>{c.CaseType} ({c.SubCategory || 'N/A'})</td>
                      <td>{c.FirstName ? `${c.FirstName} ${c.LastName || ''}` : 'Confidential'}</td>
                      <td>{c.CreatedAt ? new Date(c.CreatedAt).toLocaleDateString() : 'Today'}</td>
                      <td>
                        <span className={`badge ${
                          c.Status === 'Completed' || c.Status === 'Closed' ? 'badge-success' :
                          c.Status === 'InProgress' ? 'badge-primary' : 'badge-warning'
                        }`}>
                          {c.Status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                      No active cases in database yet. Click "Open New Case" to add a new record.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Notifications/Alerts */}
        <div className="glass-panel animate-slide-up" style={{ padding: '1.5rem', animationDelay: '0.4s' }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ion-icon name="notifications-outline" style={{ color: 'var(--danger)' }}></ion-icon>
            Pending Actions
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {notifications.length > 0 ? (
              notifications.map((n) => (
                <div key={n.NotificationID} className="alert-card" style={{ display: 'flex', gap: '1rem', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderLeft: '3px solid var(--primary)', borderRadius: 'var(--radius-sm)' }}>
                  <ion-icon name="information-circle" style={{ color: 'var(--primary)', fontSize: '1.5rem', flexShrink: 0 }}></ion-icon>
                  <div>
                    <h4 style={{ margin: '0 0 0.25rem', fontSize: '0.95rem' }}>{n.Title}</h4>
                    <p style={{ margin: 0, fontSize: '0.85rem' }}>{n.Message}</p>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', padding: '1rem', textAlign: 'center' }}>
                No pending notifications or court summons.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;

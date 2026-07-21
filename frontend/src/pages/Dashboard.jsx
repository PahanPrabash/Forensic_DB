import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const AnimatedCounter = ({ target, duration = 1500 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    const numTarget = parseInt(target.replace(/[^0-9]/g, ''));
    
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out cubic
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
  const [greeting, setGreeting] = useState('');
  const [stats, setStats] = useState({
    totalCases: '0',
    pendingMLRs: '0',
    totalEvidence: '0',
    pendingAutopsies: '0'
  });

  useEffect(() => {
    fetch('/api/dashboard/stats')
      .then(res => res.json())
      .then(data => {
        if(data.data) {
          setStats({
            totalCases: data.data.totalCases.toString(),
            pendingMLRs: data.data.pendingMLRs.toString(),
            totalEvidence: data.data.totalEvidence.toString(),
            pendingAutopsies: data.data.pendingAutopsies.toString()
          });
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  return (
    <div className="page-content">
      {/* Welcome Header */}
      <div className="animate-slide-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', animationDelay: '0.1s' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {greeting}, Doctor.
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
            <h3><AnimatedCounter target={stats.totalCases} /></h3>
            <p>Total Cases</p>
          </div>
        </div>
        
        <div className="glass-panel stat-card">
          <div className="stat-icon warning">
            <ion-icon name="document-text"></ion-icon>
          </div>
          <div className="stat-info">
            <h3><AnimatedCounter target={stats.pendingMLRs} duration={1000} /></h3>
            <p>Draft MLRs</p>
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-icon danger">
            <ion-icon name="flask"></ion-icon>
          </div>
          <div className="stat-info">
            <h3><AnimatedCounter target={stats.totalEvidence} duration={800} /></h3>
            <p>Total Evidence</p>
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-icon success">
            <ion-icon name="body"></ion-icon>
          </div>
          <div className="stat-info">
            <h3><AnimatedCounter target={stats.pendingAutopsies} duration={1200} /></h3>
            <p>Pending Autopsies</p>
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
                <tr>
                  <td style={{ fontFamily: 'monospace' }}>CAS-2026-089</td>
                  <td>Clinical (Trauma)</td>
                  <td>A.B. Perera</td>
                  <td>Today, 09:30 AM</td>
                  <td><span className="badge badge-warning">Under Investigation</span></td>
                </tr>
                <tr>
                  <td style={{ fontFamily: 'monospace' }}>CAS-2026-088</td>
                  <td>Autopsy (Accidental)</td>
                  <td>M.N. Silva</td>
                  <td>Yesterday</td>
                  <td><span className="badge badge-primary">PM In Progress</span></td>
                </tr>
                <tr>
                  <td style={{ fontFamily: 'monospace' }}>CAS-2026-087</td>
                  <td>Clinical (Abuse)</td>
                  <td>Confidential</td>
                  <td>Jul 09, 2026</td>
                  <td><span className="badge badge-success">Closed</span></td>
                </tr>
                <tr>
                  <td style={{ fontFamily: 'monospace' }}>CAS-2026-085</td>
                  <td>Autopsy (Homicidal)</td>
                  <td>K. Jayasuriya</td>
                  <td>Jul 08, 2026</td>
                  <td><span className="badge badge-danger">Pending Court</span></td>
                </tr>
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
            
            <div className="alert-card" style={{ display: 'flex', gap: '1rem', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderLeft: '3px solid var(--danger)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', transition: 'all 0.2s ease' }}>
              <ion-icon name="alert-circle" style={{ color: 'var(--danger)', fontSize: '1.5rem', flexShrink: 0 }}></ion-icon>
              <div>
                <h4 style={{ margin: '0 0 0.25rem', fontSize: '0.95rem' }}>Court Appearance</h4>
                <p style={{ margin: 0, fontSize: '0.85rem' }}>Magistrate Court Kandy regarding Case CAS-2026-042 on July 14, 2026.</p>
              </div>
            </div>

            <div className="alert-card" style={{ display: 'flex', gap: '1rem', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderLeft: '3px solid var(--warning)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', transition: 'all 0.2s ease' }}>
              <ion-icon name="document-text" style={{ color: 'var(--warning)', fontSize: '1.5rem', flexShrink: 0 }}></ion-icon>
              <div>
                <h4 style={{ margin: '0 0 0.25rem', fontSize: '0.95rem' }}>MLEF Draft Pending</h4>
                <p style={{ margin: 0, fontSize: '0.85rem' }}>MLEF for Patient #1024 has not been finalized yet.</p>
              </div>
            </div>
            
            <div className="alert-card" style={{ display: 'flex', gap: '1rem', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderLeft: '3px solid var(--primary)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', transition: 'all 0.2s ease' }}>
              <ion-icon name="flask" style={{ color: 'var(--primary)', fontSize: '1.5rem', flexShrink: 0 }}></ion-icon>
              <div>
                <h4 style={{ margin: '0 0 0.25rem', fontSize: '0.95rem' }}>Lab Results Ready</h4>
                <p style={{ margin: 0, fontSize: '0.85rem' }}>Toxicology results for Autopsy PM-2026-031 are available.</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;

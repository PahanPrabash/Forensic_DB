import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="page-content animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem' }}>Welcome back, Doctor.</h1>
          <p style={{ margin: 0 }}>Here is what's happening today in the department.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/register-patient')}>
          <ion-icon name="add-outline"></ion-icon> Open New Case
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid-cards">
        <div className="glass-panel stat-card">
          <div className="stat-icon primary">
            <ion-icon name="folder-open"></ion-icon>
          </div>
          <div className="stat-info">
            <h3>124</h3>
            <p>Active Cases</p>
          </div>
        </div>
        
        <div className="glass-panel stat-card">
          <div className="stat-icon warning">
            <ion-icon name="document-text"></ion-icon>
          </div>
          <div className="stat-info">
            <h3>12</h3>
            <p>Draft MLEFs</p>
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-icon danger">
            <ion-icon name="calendar-clear"></ion-icon>
          </div>
          <div className="stat-info">
            <h3>3</h3>
            <p>Court Summons this Week</p>
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-icon success">
            <ion-icon name="flask"></ion-icon>
          </div>
          <div className="stat-info">
            <h3>28</h3>
            <p>Pending Lab Tests</p>
          </div>
        </div>
      </div>

      {/* Main Split Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        
        {/* Recent Cases Table */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Recent Cases</h3>
            <Link to="/cases" style={{ color: 'var(--primary)', fontSize: '0.875rem' }}>View All</Link>
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
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem' }}>Pending Actions</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            <div style={{ display: 'flex', gap: '1rem', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderLeft: '3px solid var(--danger)', borderRadius: 'var(--radius-sm)' }}>
              <ion-icon name="alert-circle" style={{ color: 'var(--danger)', fontSize: '1.5rem' }}></ion-icon>
              <div>
                <h4 style={{ margin: '0 0 0.25rem', fontSize: '0.95rem' }}>Court Appearance</h4>
                <p style={{ margin: 0, fontSize: '0.85rem' }}>Magistrate Court Kandy regarding Case CAS-2026-042 on July 14, 2026.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderLeft: '3px solid var(--warning)', borderRadius: 'var(--radius-sm)' }}>
              <ion-icon name="document-text" style={{ color: 'var(--warning)', fontSize: '1.5rem' }}></ion-icon>
              <div>
                <h4 style={{ margin: '0 0 0.25rem', fontSize: '0.95rem' }}>MLEF Draft Pending</h4>
                <p style={{ margin: 0, fontSize: '0.85rem' }}>MLEF for Patient #1024 has not been finalized yet.</p>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderLeft: '3px solid var(--primary)', borderRadius: 'var(--radius-sm)' }}>
              <ion-icon name="flask" style={{ color: 'var(--primary)', fontSize: '1.5rem' }}></ion-icon>
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

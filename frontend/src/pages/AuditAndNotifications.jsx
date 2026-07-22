import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AuditAndNotifications = () => {
  const [activeTab, setActiveTab] = useState('notifications');
  const [notifications, setNotifications] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  const fetchLogs = async () => {
    setLoading(true);
    setError('');
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      };

      if (activeTab === 'notifications') {
        const res = await fetch('http://localhost:5000/api/audit/notifications', { headers });
        const json = await res.json();
        if (json.success) {
          setNotifications(json.data || []);
        } else {
          setError(json.message || 'Failed to load notifications');
        }
      } else {
        const res = await fetch('http://localhost:5000/api/audit/audit-logs', { headers });
        const json = await res.json();
        if (json.success) {
          setAuditLogs(json.data || []);
        } else {
          setError(json.message || 'Failed to load audit trail');
        }
      }
    } catch (err) {
      console.error(err);
      setError('Error connecting to security logs endpoint.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [activeTab]);

  return (
    <div className="page-content animate-fade-in">
      {/* Header Breadcrumbs */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
          <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--primary)' }}>
            <ion-icon name="home-outline"></ion-icon> Home
          </Link>
          <span>/</span>
          <span>Audit & Alerts</span>
        </div>
        <h1 style={{ fontSize: '1.75rem', margin: 0 }}>Security Audit & Activity Logs</h1>
        <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-muted)' }}>Monitor database modifications, user logins, and notification triggers.</p>
      </div>

      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#f87171', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.875rem'
        }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <button 
          className={`btn ${activeTab === 'notifications' ? 'btn-primary' : 'btn-secondary'}`} 
          onClick={() => setActiveTab('notifications')}
        >
          Notifications & Alerts
        </button>
        <button 
          className={`btn ${activeTab === 'audit' ? 'btn-primary' : 'btn-secondary'}`} 
          onClick={() => setActiveTab('audit')}
        >
          System Audit Trail
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        {activeTab === 'notifications' && (
          <div>
            <h3 style={{ marginTop: 0, marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)', color: 'var(--primary)', fontSize: '1.1rem' }}>Active Alerts</h3>
            
            {loading ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Loading alerts...</div>
            ) : notifications.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {notifications.map(notif => (
                  <div key={notif.NotificationID} style={{ 
                    padding: '1rem', 
                    borderRadius: '8px', 
                    backgroundColor: 'rgba(0,0,0,0.15)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <h4 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="badge badge-warning">{notif.NotificationType}</span>
                        {notif.Title}
                      </h4>
                      <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>{notif.Message}</p>
                    </div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {new Date(notif.CreatedAt).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                No active notifications or department alerts recorded.
              </div>
            )}
          </div>
        )}

        {activeTab === 'audit' && (
          <div>
            <h3 style={{ marginTop: 0, marginBottom: '1.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)', color: 'var(--primary)', fontSize: '1.1rem' }}>Security Audit Trail</h3>
            
            <div className="table-container">
              <table className="data-table" style={{ width: '100%', textAlign: 'left' }}>
                <thead>
                  <tr>
                    <th>Log ID</th>
                    <th>Action</th>
                    <th>Table Affected</th>
                    <th>Record ID</th>
                    <th>User</th>
                    <th>IP Address</th>
                    <th>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                        Loading audit trail logs...
                      </td>
                    </tr>
                  ) : auditLogs.length > 0 ? (
                    auditLogs.map(log => (
                      <tr key={log.AuditID}>
                        <td style={{ fontFamily: 'monospace' }}>#LOG-{log.AuditID}</td>
                        <td>
                          <span className={`badge ${
                            log.Action === 'DELETE' ? 'badge-danger' : 
                            log.Action === 'INSERT' ? 'badge-success' : 'badge-primary'
                          }`}>
                            {log.Action}
                          </span>
                        </td>
                        <td><b>{log.TableAffected}</b></td>
                        <td style={{ fontFamily: 'monospace' }}>ID-{log.RecordID || 'N/A'}</td>
                        <td>{log.Username || 'System'}</td>
                        <td><code style={{ fontSize: '0.8rem' }}>{log.IPAddress || '127.0.0.1'}</code></td>
                        <td>{new Date(log.Timestamp).toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                        No audit trail entries recorded. All database triggers are active.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditAndNotifications;

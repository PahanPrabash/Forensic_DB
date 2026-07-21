import React, { useState } from 'react';

const AuditAndNotifications = () => {
  const [activeTab, setActiveTab] = useState('notifications');

  const notifications = [
    { id: 1, type: 'MLEF Pending', message: 'MLEF Report for Case PM-2026-052 is pending.', time: '2 hours ago', read: false },
    { id: 2, type: 'Court Date', message: 'Court hearing tomorrow for Case PM-2026-041.', time: '1 day ago', read: true },
  ];

  const auditLogs = [
    { id: 1, action: 'UPDATE', table: 'Case', user: 'Dr. Smith', time: '2026-07-21 10:15 AM' },
    { id: 2, action: 'INSERT', table: 'Postmortem', user: 'Dr. Jones', time: '2026-07-21 09:30 AM' },
  ];

  return (
    <div className="page-content animate-fade-in">
      <h2 style={{ marginBottom: '1.5rem' }}>Audit & Notifications</h2>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <button 
          className={`btn ${activeTab === 'notifications' ? 'btn-primary' : 'btn-secondary'}`} 
          onClick={() => setActiveTab('notifications')}
        >
          Notifications
        </button>
        <button 
          className={`btn ${activeTab === 'audit' ? 'btn-primary' : 'btn-secondary'}`} 
          onClick={() => setActiveTab('audit')}
        >
          Audit Logs
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        {activeTab === 'notifications' && (
          <div>
            <h3 style={{ marginTop: 0, marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)', color: 'var(--primary)', fontSize: '1.1rem' }}>Recent Notifications</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {notifications.map(notif => (
                <div key={notif.id} style={{ 
                  padding: '1rem', 
                  borderRadius: '8px', 
                  backgroundColor: notif.read ? 'rgba(0,0,0,0.1)' : 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.5rem 0' }}>{notif.type}</h4>
                    <p style={{ margin: 0, color: 'var(--text-muted)' }}>{notif.message}</p>
                  </div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{notif.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'audit' && (
          <div>
            <h3 style={{ marginTop: 0, marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)', color: 'var(--primary)', fontSize: '1.1rem' }}>System Audit Logs</h3>
            <table className="table" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                  <th style={{ padding: '10px' }}>Log ID</th>
                  <th style={{ padding: '10px' }}>Action</th>
                  <th style={{ padding: '10px' }}>Table</th>
                  <th style={{ padding: '10px' }}>User</th>
                  <th style={{ padding: '10px' }}>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map(log => (
                  <tr key={log.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '10px' }}>{log.id}</td>
                    <td style={{ padding: '10px' }}>{log.action}</td>
                    <td style={{ padding: '10px' }}>{log.table}</td>
                    <td style={{ padding: '10px' }}>{log.user}</td>
                    <td style={{ padding: '10px' }}>{log.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditAndNotifications;

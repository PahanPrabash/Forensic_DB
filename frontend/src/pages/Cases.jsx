import React from 'react';
import { useNavigate } from 'react-router-dom';

const Cases = () => {
  const navigate = useNavigate();

  return (
    <div className="page-content animate-fade-in">
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <input type="text" placeholder="Search by Case No, Patient Name, or NIC..." 
            style={{ flex: 1, padding: '0.5rem 1rem', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-main)' }} />
          <select style={{ padding: '0.5rem 1rem', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-main)' }}>
            <option value="">All Types</option>
            <option value="clinical">Clinical</option>
            <option value="autopsy">Autopsy</option>
          </select>
          <select style={{ padding: '0.5rem 1rem', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-main)' }}>
            <option value="">All Statuses</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
            <option value="court">Pending Court</option>
          </select>
          <button className="btn btn-secondary">Filter</button>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Case No.</th>
                <th>Type</th>
                <th>Patient/Deceased</th>
                <th>Incident Date</th>
                <th>Assigned Doctor</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontFamily: 'monospace' }}>CAS-2026-089</td>
                <td>Clinical (Trauma)</td>
                <td>A.B. Perera</td>
                <td>Jul 11, 2026</td>
                <td>Dr. Wickramasinghe</td>
                <td><span className="badge badge-warning">Under Investigation</span></td>
                <td>
                  <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>View</button>
                </td>
              </tr>
              <tr>
                <td style={{ fontFamily: 'monospace' }}>CAS-2026-088</td>
                <td>Autopsy (Accidental)</td>
                <td>M.N. Silva</td>
                <td>Jul 10, 2026</td>
                <td>Dr. Wickramasinghe</td>
                <td><span className="badge badge-primary">PM In Progress</span></td>
                <td>
                  <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>View</button>
                </td>
              </tr>
              <tr>
                <td style={{ fontFamily: 'monospace' }}>CAS-2026-087</td>
                <td>Clinical (Abuse)</td>
                <td>Confidential</td>
                <td>Jul 09, 2026</td>
                <td>Dr. Silva</td>
                <td><span className="badge badge-success">Closed</span></td>
                <td>
                  <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>View</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Cases;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Cases = () => {
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/cases')
      .then(res => res.json())
      .then(data => {
        setCases(data.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleFilter = () => {
    // Filter functionality placeholder — filters can be implemented here
    console.log('Filter applied');
  };

  return (
    <div className="page-content animate-fade-in">
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <input type="text" placeholder="Search by Case No, Patient Name, or NIC..." 
            style={{ flex: 1, padding: '0.5rem 1rem', background: 'rgba(10, 10, 10, 0.6)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-main)' }} />
          <select style={{ padding: '0.5rem 1rem', background: 'rgba(10, 10, 10, 0.6)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-main)' }}>
            <option value="">All Types</option>
            <option value="clinical">Clinical</option>
            <option value="autopsy">Autopsy</option>
          </select>
          <select style={{ padding: '0.5rem 1rem', background: 'rgba(10, 10, 10, 0.6)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-main)' }}>
            <option value="">All Statuses</option>
            <option value="open">Open</option>
            <option value="investigation">Under Investigation</option>
            <option value="closed">Closed</option>
            <option value="court">Pending Court</option>
          </select>
          <button className="btn btn-secondary" onClick={handleFilter}>Filter</button>
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
              {loading ? (
                <tr><td colSpan="7" style={{textAlign: 'center'}}>Loading cases...</td></tr>
              ) : cases.length === 0 ? (
                <tr><td colSpan="7" style={{textAlign: 'center'}}>No cases found.</td></tr>
              ) : (
                cases.map((c) => (
                  <tr key={c.CaseID}>
                    <td style={{ fontFamily: 'monospace' }}>{c.CaseNumber}</td>
                    <td>{c.CaseType} ({c.SubCategory})</td>
                    <td>{c.PatientFirstName} {c.PatientLastName}</td>
                    <td>{new Date(c.IncidentDate).toLocaleDateString()}</td>
                    <td>Dr. {c.DoctorLastName || 'Unassigned'}</td>
                    <td>
                      <span className={`badge badge-${c.Status === 'Closed' ? 'success' : c.Status === 'Open' ? 'warning' : 'primary'}`}>
                        {c.Status}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>View</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Cases;

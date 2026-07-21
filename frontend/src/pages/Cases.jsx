import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Cases = () => {
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchCases = (params = {}) => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const query = new URLSearchParams();
    if (params.search) query.set('search', params.search);
    if (params.type) query.set('type', params.type);
    if (params.status) query.set('status', params.status);

    fetch(`/api/cases?${query.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setCases(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const handleFilter = () => {
    fetchCases({ search, type: typeFilter, status: statusFilter });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleFilter();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getStatusBadge = (status) => {
    const map = {
      'Open': 'badge-primary',
      'Under Investigation': 'badge-warning',
      'Closed': 'badge-success',
      'Pending Court': 'badge-danger',
    };
    return map[status] || 'badge-primary';
  };

  return (
    <div className="page-content animate-fade-in">
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <input 
            type="text" 
            placeholder="Search by Case No, Patient Name, or NIC..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{ flex: 1, padding: '0.5rem 1rem', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-main)' }} 
          />
          <select 
            value={typeFilter} 
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{ padding: '0.5rem 1rem', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-main)' }}
          >
            <option value="">All Types</option>
            <option value="clinical">Clinical</option>
            <option value="autopsy">Autopsy</option>
          </select>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: '0.5rem 1rem', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-main)' }}
          >
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
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>Loading...</td></tr>
              ) : cases.length === 0 ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No cases found.</td></tr>
              ) : (
                cases.map((c) => (
                  <tr key={c.CaseID}>
                    <td style={{ fontFamily: 'monospace' }}>{c.CaseNumber}</td>
                    <td>{c.CaseType}{c.SubCategory ? ` (${c.SubCategory})` : ''}</td>
                    <td>{c.PatientName || 'Unknown'}</td>
                    <td>{formatDate(c.IncidentDate)}</td>
                    <td>{c.DoctorName || '—'}</td>
                    <td><span className={`badge ${getStatusBadge(c.Status)}`}>{c.Status}</span></td>
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

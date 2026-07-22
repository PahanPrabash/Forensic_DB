import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { caseAPI } from '../services/api';

const Cases = () => {
  const navigate = useNavigate();

  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchCases = async () => {
    setLoading(true);
    try {
      const res = await caseAPI.getCases({
        ...(search && { search }),
        ...(typeFilter && { type: typeFilter === 'clinical' ? 'Clinical' : 'Postmortem' }),
        ...(statusFilter && { status: statusFilter })
      });
      if (res.success) {
        setCases(res.data || []);
      }
    } catch (err) {
      console.warn('Failed to fetch cases from backend:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    fetchCases();
  };

  return (
    <div className="page-content animate-fade-in">
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        
        {/* Header & New Case Button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
              <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--primary)' }}>
                <ion-icon name="home-outline"></ion-icon> Home
              </Link>
              <span>/</span>
              <span>Patient & Cases</span>
            </div>
            <h2 style={{ margin: 0, fontSize: '1.4rem' }}>Forensic Case Records</h2>
            <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>View, search, and manage clinical and postmortem case files.</p>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/register-patient')}>
            <ion-icon name="add-outline"></ion-icon> Register New Case
          </button>
        </div>

        {/* Filter Bar */}
        <form onSubmit={handleFilter} style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <input 
            type="text" 
            placeholder="Search by Case No, Patient Name, or NIC..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
            <option value="Pending">Pending</option>
            <option value="InProgress">InProgress</option>
            <option value="Completed">Completed</option>
            <option value="Closed">Closed</option>
          </select>
          <button type="submit" className="btn btn-secondary">Filter</button>
        </form>

        {/* Table */}
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
              {cases.length > 0 ? (
                cases.map((c) => (
                  <tr key={c.CaseID}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#3b82f6' }}>{c.CaseNumber}</td>
                    <td>{c.CaseType} ({c.SubCategory || 'N/A'})</td>
                    <td>{c.PatientFirstName} {c.PatientLastName} {c.NIC ? `(NIC: ${c.NIC})` : ''}</td>
                    <td>{c.IncidentDate ? new Date(c.IncidentDate).toLocaleDateString() : 'N/A'}</td>
                    <td>{c.DoctorFirstName ? `Dr. ${c.DoctorLastName}` : 'Unassigned'}</td>
                    <td>
                      <span className={`badge ${
                        c.Status === 'Completed' || c.Status === 'Closed' ? 'badge-success' :
                        c.Status === 'InProgress' ? 'badge-primary' : 'badge-warning'
                      }`}>
                        {c.Status}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-secondary" style={{ padding: '0.25rem 0.6rem', fontSize: '0.8rem' }}>View</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2.5rem' }}>
                    {loading ? 'Loading case records from database...' : 'No case records found in database. Click "Register New Case" above to add one!'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Cases;

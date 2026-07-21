import React, { useState } from 'react';

const CourtSummons = () => {
  const [summonsList, setSummonsList] = useState([
    { id: 1, caseNo: 'PM-2026-052', courtName: 'Magistrate Court - Kandy', date: '2026-08-15', status: 'Pending' },
    { id: 2, caseNo: 'PM-2026-041', courtName: 'High Court - Colombo', date: '2026-07-28', status: 'Attended' }
  ]);

  return (
    <div className="page-content animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
        <h2>Court Summons Calendar</h2>
        <button className="btn btn-primary">Add New Summons</button>
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h3 style={{ marginTop: 0, marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)', color: 'var(--primary)', fontSize: '1.1rem' }}>Upcoming Hearings</h3>
        
        <table className="table" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border)' }}>
              <th style={{ padding: '10px' }}>Case No.</th>
              <th style={{ padding: '10px' }}>Court Name</th>
              <th style={{ padding: '10px' }}>Hearing Date</th>
              <th style={{ padding: '10px' }}>Status</th>
              <th style={{ padding: '10px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {summonsList.map(summons => (
              <tr key={summons.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '10px' }}>{summons.caseNo}</td>
                <td style={{ padding: '10px' }}>{summons.courtName}</td>
                <td style={{ padding: '10px' }}>{summons.date}</td>
                <td style={{ padding: '10px' }}>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    fontSize: '0.85rem',
                    backgroundColor: summons.status === 'Pending' ? 'rgba(234, 179, 8, 0.2)' : 'rgba(34, 197, 94, 0.2)',
                    color: summons.status === 'Pending' ? '#eab308' : '#22c55e'
                  }}>
                    {summons.status}
                  </span>
                </td>
                <td style={{ padding: '10px' }}>
                  <button className="btn btn-secondary" style={{ padding: '5px 10px', fontSize: '0.85rem' }}>Update</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CourtSummons;

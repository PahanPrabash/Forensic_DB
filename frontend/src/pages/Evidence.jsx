import React, { useState } from 'react';

const Evidence = () => {
  const [evidenceList, setEvidenceList] = useState([]);
  const [labRequests, setLabRequests] = useState([]);

  return (
    <div className="page-content animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
        <button className="btn btn-primary">
          <ion-icon name="add-outline"></ion-icon> Log New Evidence
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        
        {/* Evidence Tracking */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginTop: 0, fontSize: '1.1rem' }}>Chain of Custody</h3>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Barcode / ID</th>
                  <th>Type</th>
                  <th>Case No.</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {evidenceList.length > 0 ? (
                  evidenceList.map((e) => (
                    <tr key={e.EvidenceID}>
                      <td style={{ fontFamily: 'monospace' }}>{e.QRCode || `EV-${e.EvidenceID}`}</td>
                      <td>{e.EvidenceType}</td>
                      <td>{e.CaseNumber}</td>
                      <td><span className="badge badge-warning">{e.ChainOfCustodyStatus}</span></td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                      No evidence samples logged in database yet. Click "Log New Evidence" to add a specimen.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Laboratory Tests */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginTop: 0, fontSize: '1.1rem' }}>Laboratory Requests</h3>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Test Type</th>
                  <th>Related Evidence</th>
                  <th>Requested By</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {labRequests.length > 0 ? (
                  labRequests.map((l) => (
                    <tr key={l.TestID}>
                      <td>{l.TestType}</td>
                      <td style={{ fontFamily: 'monospace' }}>{l.EvidenceBarcode || '--'}</td>
                      <td>{l.RequestedBy}</td>
                      <td><span className="badge badge-warning">{l.Status}</span></td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                      No laboratory test requests logged yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Evidence;

import React from 'react';

const Evidence = () => {
  return (
    <div className="page-content animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
        <button className="btn btn-primary"><ion-icon name="add"></ion-icon> Log New Evidence</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        
        {/* Evidence Tracking */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginTop: 0 }}>Chain of Custody</h3>
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
                <tr>
                  <td style={{ fontFamily: 'monospace' }}>EV-84729</td>
                  <td>Blood Swab</td>
                  <td>CAS-2026-089</td>
                  <td><span className="badge badge-warning">In Lab</span></td>
                </tr>
                <tr>
                  <td style={{ fontFamily: 'monospace' }}>EV-84728</td>
                  <td>Clothing</td>
                  <td>CAS-2026-088</td>
                  <td><span className="badge badge-success">In Custody</span></td>
                </tr>
                <tr>
                  <td style={{ fontFamily: 'monospace' }}>EV-84725</td>
                  <td>Weapon</td>
                  <td>CAS-2026-085</td>
                  <td><span className="badge badge-primary">Transferred</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Laboratory Tests */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginTop: 0 }}>Laboratory Requests</h3>
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
                <tr>
                  <td>Toxicology</td>
                  <td style={{ fontFamily: 'monospace' }}>EV-84729</td>
                  <td>Dr. Silva</td>
                  <td><span className="badge badge-warning">In Progress</span></td>
                </tr>
                <tr>
                  <td>Histology</td>
                  <td>--</td>
                  <td>Dr. Perera</td>
                  <td><span className="badge badge-danger">Requested</span></td>
                </tr>
                <tr>
                  <td>DNA Analysis</td>
                  <td style={{ fontFamily: 'monospace' }}>EV-84720</td>
                  <td>Dr. Wickramasinghe</td>
                  <td><span className="badge badge-success">Completed</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Evidence;

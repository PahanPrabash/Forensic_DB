import React, { useState, useEffect } from 'react';

const Evidence = () => {
  const [evidence, setEvidence] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchEvidence = async () => {
    try {
      const res = await fetch('/api/evidence');
      const data = await res.json();
      setEvidence(data.data || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvidence();
  }, []);

  const handleLogEvidence = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('/api/evidence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setShowModal(false);
        fetchEvidence();
      } else {
        alert('Failed to log evidence');
      }
    } catch (err) {
      console.error(err);
      alert('Network error');
    }
  };
  return (
    <div className="page-content animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <ion-icon name="add"></ion-icon> Log New Evidence
        </button>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
            <h3 style={{ marginTop: 0 }}>Log New Evidence</h3>
            <form onSubmit={handleLogEvidence}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Case ID (Number)</label>
                <input type="number" name="caseId" className="form-control" required placeholder="e.g. 1" />
              </div>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Evidence Type</label>
                <input type="text" name="evidenceType" className="form-control" required placeholder="e.g. Blood Swab" />
              </div>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Barcode / QR</label>
                <input type="text" name="barcode" className="form-control" required placeholder="e.g. EV-84729" />
              </div>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Storage Location</label>
                <input type="text" name="storageLocation" className="form-control" placeholder="e.g. Fridge A" />
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Evidence</button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                {loading ? (
                  <tr><td colSpan="4" style={{textAlign: 'center'}}>Loading...</td></tr>
                ) : evidence.length === 0 ? (
                  <tr><td colSpan="4" style={{textAlign: 'center'}}>No evidence logged.</td></tr>
                ) : (
                  evidence.map(ev => (
                    <tr key={ev.EvidenceID}>
                      <td style={{ fontFamily: 'monospace' }}>{ev.BarcodeQR}</td>
                      <td>{ev.EvidenceType}</td>
                      <td>{ev.CaseNumber || 'Unknown'}</td>
                      <td>
                        <span className={`badge badge-${ev.ChainOfCustodyStatus === 'In Custody' ? 'success' : 'warning'}`}>
                          {ev.ChainOfCustodyStatus}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
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

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
          <h3 style={{ marginTop: 0, marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', color: 'var(--primary)' }}>Chain of Custody</h3>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Barcode / ID</th>
                  <th>Type</th>
                  <th>Case No.</th>
                  <th>Status</th>
                  <th>Action</th>
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
          <h3 style={{ marginTop: 0, marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', color: 'var(--primary)' }}>Laboratory Requests</h3>
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
                {loading ? (
                  <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>Loading...</td></tr>
                ) : labTests.length === 0 ? (
                  <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No lab tests found.</td></tr>
                ) : (
                  labTests.map((lt) => (
                    <tr key={lt.TestID}>
                      <td>{lt.TestType}</td>
                      <td style={{ fontFamily: 'monospace' }}>{lt.EvidenceBarcode || '--'}</td>
                      <td>{lt.RequestedByName || '—'}</td>
                      <td><span className={`badge ${getStatusBadge(lt.Status)}`}>{lt.Status}</span></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* MODAL 1: Log New Evidence */}
      {showLogModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(8px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div className="glass-panel" style={{ padding: '2rem', width: '500px', maxWidth: '90%;' }}>
            <h3 style={{ marginTop: 0, marginBottom: '1.5rem', color: 'var(--primary)' }}>Log New Evidence</h3>
            <form onSubmit={handleLogEvidence}>
              {logError && (
                <div style={{ color: '#f87171', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem' }}>{logError}</div>
              )}
              {logSuccess && (
                <div style={{ color: '#34d399', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem' }}>{logSuccess}</div>
              )}

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">Related Case</label>
                <select name="caseId" className="form-control" required>
                  <option value="">Select Case...</option>
                  {cases.map((c) => (
                    <option key={c.CaseID} value={c.CaseID}>{c.CaseNumber} - {c.PatientName || 'No Name'}</option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">Evidence Type</label>
                <select name="evidenceType" className="form-control" required>
                  <option value="Blood Swab">Blood Swab</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Weapon">Weapon</option>
                  <option value="DNA Sample">DNA Sample</option>
                  <option value="Toxicology Sample">Toxicology Sample</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">Storage Location</label>
                <input type="text" name="storageLocation" placeholder="e.g. Locker B-12" className="form-control" />
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">Custom Barcode / QR ID (Optional)</label>
                <input type="text" name="barcodeQR" placeholder="Auto-generated if left blank" className="form-control" />
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Description</label>
                <textarea name="description" rows="3" className="form-control" placeholder="Describe the condition and details of the evidence..."></textarea>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowLogModal(false)} disabled={isSubmitting}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Logging...' : 'Save Evidence'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Evidence Details & Transfer Custody */}
      {selectedEvidence && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(8px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div className="glass-panel" style={{ padding: '2rem', width: '800px', maxWidth: '95%', display: 'flex', gap: '2rem' }}>
            
            {/* Details and QR Code Card */}
            <div style={{ flex: '1.2', borderRight: '1px solid var(--border)', paddingRight: '2rem' }}>
              <h3 style={{ marginTop: 0, color: 'var(--primary)', marginBottom: '1.5rem' }}>Evidence Label & Details</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(15, 23, 42, 0.4)', border: '1px dashed var(--border)', borderRadius: 'var(--radius-md)', padding: '1.5rem', marginBottom: '1.5rem' }}>
                <div id="qr-code-svg">
                  <QRCodeSVG value={selectedEvidence.BarcodeQR} size={150} level="H" includeMargin={true} />
                </div>
                <div style={{ fontFamily: 'monospace', fontWeight: 'bold', fontSize: '1.1rem', marginTop: '0.75rem', color: 'var(--text-main)' }}>
                  {selectedEvidence.BarcodeQR}
                </div>
                <button className="btn btn-secondary" style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }} onClick={printLabel}>
                  <ion-icon name="print"></ion-icon> Print QR Label
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem' }}>
                <div><strong>Type:</strong> <br/><span style={{ color: 'var(--text-muted)' }}>{selectedEvidence.EvidenceType}</span></div>
                <div><strong>Case No:</strong> <br/><span style={{ color: 'var(--text-muted)' }}>{selectedEvidence.CaseNumber}</span></div>
                <div><strong>Collected By:</strong> <br/><span style={{ color: 'var(--text-muted)' }}>{selectedEvidence.CollectedByName || 'Unknown'}</span></div>
                <div><strong>Collected Date:</strong> <br/><span style={{ color: 'var(--text-muted)' }}>{new Date(selectedEvidence.CollectedDate).toLocaleString()}</span></div>
                <div style={{ gridColumn: '1 / -1' }}><strong>Storage Location:</strong> <br/><span style={{ color: 'var(--text-muted)' }}>{selectedEvidence.StorageLocation || 'N/A'}</span></div>
                <div style={{ gridColumn: '1 / -1' }}><strong>Description:</strong> <br/><span style={{ color: 'var(--text-muted)', display: 'block', maxHeight: '80px', overflowY: 'auto' }}>{selectedEvidence.Description || 'No description provided.'}</span></div>
              </div>
            </div>

            {/* Custody Transfer Form */}
            <div style={{ flex: '1' }}>
              <h3 style={{ marginTop: 0, color: 'var(--primary)', marginBottom: '1.5rem' }}>Record Custody Transfer</h3>
              
              <form onSubmit={handleTransferCustody}>
                {transferError && (
                  <div style={{ color: '#f87171', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.85rem' }}>{transferError}</div>
                )}
                {transferSuccess && (
                  <div style={{ color: '#34d399', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.85rem' }}>{transferSuccess}</div>
                )}

                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                  <label className="form-label">Transfer To (Staff Member)</label>
                  <select name="transferredTo" className="form-control" required>
                    <option value="">Select recipient...</option>
                    {staffList.map((s) => (
                      <option key={s.StaffID} value={s.StaffID}>{s.FullName}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                  <label className="form-label">Transfer Purpose</label>
                  <input type="text" name="purpose" placeholder="e.g. Lab Testing, Storage Transfer" className="form-control" required />
                </div>

                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                  <label className="form-label">Updated Custody Status</label>
                  <select name="newStatus" className="form-control" defaultValue="Transferred">
                    <option value="In Custody">In Custody</option>
                    <option value="Transferred">Transferred</option>
                    <option value="In Lab">In Lab</option>
                    <option value="Disposed">Disposed</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label className="form-label">Remarks</label>
                  <textarea name="remarks" rows="3" className="form-control" placeholder="Add transfer conditions, handover signatures, or remarks..."></textarea>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setSelectedEvidence(null)} disabled={isSubmitting}>Close</button>
                  <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Transferring...' : 'Submit Transfer'}
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Evidence;

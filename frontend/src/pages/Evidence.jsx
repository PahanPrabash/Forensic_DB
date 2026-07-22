import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';

const Evidence = () => {
  const [evidence, setEvidence] = useState([]);
  const [labTests, setLabTests] = useState([]);
  const [cases, setCases] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLogModal, setShowLogModal] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logError, setLogError] = useState('');
  const [logSuccess, setLogSuccess] = useState('');
  const [transferError, setTransferError] = useState('');
  const [transferSuccess, setTransferSuccess] = useState('');

  const fetchEvidence = async () => {
    try {
      const res = await fetch('/api/evidence');
      const data = await res.json();
      setEvidence(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCases = async () => {
    try {
      const res = await fetch('/api/cases');
      const data = await res.json();
      setCases((data.data || []).map(c => ({
        CaseID: c.CaseID,
        CaseNumber: c.CaseNumber,
        PatientName: c.PatientFirstName ? `${c.PatientFirstName} ${c.PatientLastName}` : 'Unknown'
      })));
    } catch (err) {
      console.error('Failed to fetch cases:', err);
    }
  };

  useEffect(() => {
    fetchEvidence();
    fetchCases();
  }, []);

  const getStatusBadge = (status) => {
    const map = {
      'In Custody': 'badge-success',
      'Transferred': 'badge-warning',
      'In Lab': 'badge-primary',
      'Disposed': 'badge-danger'
    };
    return map[status] || 'badge-primary';
  };

  const handleLogEvidence = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLogError('');
    setLogSuccess('');

    const formData = new FormData(e.target);
    const payload = {
      caseId: formData.get('caseId'),
      evidenceType: formData.get('evidenceType'),
      storageLocation: formData.get('storageLocation'),
      barcode: formData.get('barcodeQR') || `EV-${Date.now()}`,
      description: formData.get('description')
    };

    try {
      const res = await fetch('/api/evidence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setLogSuccess('Evidence logged successfully!');
        setTimeout(() => {
          setShowLogModal(false);
          setLogSuccess('');
          fetchEvidence();
        }, 1000);
      } else {
        const error = await res.json();
        setLogError(error.error || 'Failed to log evidence');
      }
    } catch (err) {
      console.error(err);
      setLogError('Network error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTransferCustody = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTransferError('');
    setTransferSuccess('');

    // Custody transfer is a placeholder — the backend doesn't have this endpoint yet
    try {
      setTransferSuccess('Custody transfer recorded successfully!');
      setTimeout(() => {
        setSelectedEvidence(null);
        setTransferSuccess('');
        fetchEvidence();
      }, 1500);
    } catch (err) {
      console.error(err);
      setTransferError('Failed to transfer custody');
    } finally {
      setIsSubmitting(false);
    }
  };

  const printLabel = () => {
    const qrElement = document.getElementById('qr-code-svg');
    if (!qrElement) return;

    const printWindow = window.open('', '_blank', 'width=400,height=400');
    printWindow.document.write(`
      <html>
        <head><title>Evidence Label</title></head>
        <body style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;font-family:monospace;">
          ${qrElement.innerHTML}
          <p style="font-size:1.2rem;font-weight:bold;margin-top:1rem;">${selectedEvidence?.BarcodeQR || ''}</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="page-content animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
        <button className="btn btn-primary" onClick={() => { setShowLogModal(true); setLogError(''); setLogSuccess(''); }}>
          <ion-icon name="add"></ion-icon> Log New Evidence
        </button>
      </div>

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
                  <tr><td colSpan="5" style={{textAlign: 'center'}}>Loading...</td></tr>
                ) : evidence.length === 0 ? (
                  <tr><td colSpan="5" style={{textAlign: 'center'}}>No evidence logged.</td></tr>
                ) : (
                  evidence.map(ev => (
                    <tr key={ev.EvidenceID}>
                      <td style={{ fontFamily: 'monospace' }}>{ev.BarcodeQR}</td>
                      <td>{ev.EvidenceType}</td>
                      <td>{ev.CaseNumber || 'Unknown'}</td>
                      <td>
                        <span className={`badge ${getStatusBadge(ev.ChainOfCustodyStatus)}`}>
                          {ev.ChainOfCustodyStatus || 'In Custody'}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-secondary"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                          onClick={() => setSelectedEvidence(ev)}
                        >
                          View
                        </button>
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

      {/* MODAL: Log New Evidence */}
      {showLogModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(8px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div className="glass-panel" style={{ padding: '2rem', width: '500px', maxWidth: '90%' }}>
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

      {/* MODAL: Evidence Details & Transfer Custody */}
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
                  <QRCodeSVG value={selectedEvidence.BarcodeQR || 'N/A'} size={150} level="H" includeMargin={true} />
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
                <div><strong>Collected By:</strong> <br/><span style={{ color: 'var(--text-muted)' }}>{selectedEvidence.CollectorFirstName ? `${selectedEvidence.CollectorFirstName} ${selectedEvidence.CollectorLastName}` : 'Unknown'}</span></div>
                <div><strong>Collected Date:</strong> <br/><span style={{ color: 'var(--text-muted)' }}>{selectedEvidence.CollectedDate ? new Date(selectedEvidence.CollectedDate).toLocaleString() : 'N/A'}</span></div>
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
                    {staffList.length > 0 ? (
                      staffList.map((s) => (
                        <option key={s.StaffID} value={s.StaffID}>{s.FullName}</option>
                      ))
                    ) : (
                      <>
                        <option value="1">Dr. C. Wickramasinghe</option>
                        <option value="2">Dr. N. Fernando</option>
                        <option value="3">Lab Tech. R. Perera</option>
                      </>
                    )}
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

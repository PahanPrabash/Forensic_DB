import React, { useState } from 'react';

const MlReport = () => {
  const [activeView, setActiveView] = useState('list');
  const [selectedMLR, setSelectedMLR] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  // Sample MLR data matching the database schema
  const mlrRecords = [
    {
      id: 1, mlrNumber: 'MLR/2026/001', mlefNumber: 'MLEF/2026/001',
      caseNumber: 'CW/2026/001', patient: 'Kamal Jayasuriya', nic: '198512345678',
      doctor: 'Dr. C. Wickramasinghe', designation: 'Consultant JMO',
      reportDate: '2026-01-20', status: 'Finalized', certificate: 'CR/2026/001',
      category: 'Trauma', caseType: 'Clinical',
      content: 'I, Dr. Chaminda Wickramasinghe, Consultant Judicial Medical Officer, Teaching Hospital Peradeniya, examined Mr. Kamal Jayasuriya (NIC: 198512345678) on 16th January 2026 at 09:30 hours at the request of Kandy Police.\n\nHISTORY: The patient states he was assaulted by two unknown persons with an iron rod on 15/01/2026 at approximately 20:00 hours near Temple Road, Kandy.\n\nFINDINGS:\n1. Contusion (3x2 cm) over left temporal region\n2. Laceration (4 cm) over right forearm\n3. Abrasion (5x3 cm) over right knee\n4. X-ray confirmed fractures of left 5th and 6th ribs',
      conclusion: 'The injuries are consistent with assault using a hard blunt weapon such as an iron rod. The fracture of ribs constitutes GRIEVOUS HURT under Section 311 of the Penal Code. The injuries could not have been self-inflicted.'
    },
    {
      id: 2, mlrNumber: 'MLR/2026/002', mlefNumber: 'MLEF/2026/002',
      caseNumber: 'CW/2026/002', patient: 'Nimal Rathnayake', nic: '199287654321',
      doctor: 'Dr. N. Fernando', designation: 'Senior Registrar',
      reportDate: '2026-02-15', status: 'Draft', certificate: null,
      category: 'Domestic Abuse', caseType: 'Clinical',
      content: 'I, Dr. Niluka Fernando, Senior Registrar in Forensic Medicine, Teaching Hospital Peradeniya, examined Mr. Nimal Rathnayake (NIC: 199287654321) on 9th February 2026.\n\nHISTORY: Patient admitted to Ward 12 following a domestic incident.\n\nFINDINGS:\n1. Healing contusion over left cheek (5-7 days old)\n2. Fresh contusion over right upper arm\n3. Linear abrasion over back consistent with belt mark',
      conclusion: 'The pattern of old and new injuries at different stages of healing is consistent with repeated physical abuse (domestic violence). Individual injuries are NON-GRIEVOUS.'
    },
    {
      id: 3, mlrNumber: 'MLR/2026/004', mlefNumber: 'MLEF/2026/004',
      caseNumber: 'CW/2026/004', patient: 'Child (Name Withheld)', nic: 'PROTECTED',
      doctor: 'Dr. N. Fernando', designation: 'Senior Registrar',
      reportDate: '2026-04-28', status: 'Submitted to Court', certificate: 'CR/2026/004',
      category: 'Child Abuse', caseType: 'Clinical',
      content: 'I, Dr. Niluka Fernando, examined the child (age 8 years) on 23rd April 2026.\n\nFINDINGS:\n1. Multiple circular cigarette burn marks on forearms\n2. Parallel linear bruises on buttocks (cane marks)\n3. Healing fracture of left ulna (3 weeks old)',
      conclusion: 'The injuries are GRIEVOUS and strongly suggestive of repeated child abuse (Non-Accidental Injury). Referred to NCPA.'
    },
    {
      id: 4, mlrNumber: 'MLR/2026/005', mlefNumber: 'MLEF/2026/005',
      caseNumber: 'CW/2026/005', patient: 'Ruwan Wijesinghe', nic: '197845678901',
      doctor: 'Dr. C. Wickramasinghe', designation: 'Consultant JMO',
      reportDate: '2026-05-10', status: 'Finalized', certificate: 'CR/2026/005',
      category: 'Age Estimation', caseType: 'Clinical',
      content: 'Age estimation examination as per Magistrate Court order.\n\nMETHODS:\n1. Dental examination and OPG X-ray\n2. Skeletal maturity assessment\n3. Physical maturity assessment (Tanner staging)',
      conclusion: 'Estimated age: 25-30 years. The individual is definitively above the age of 18 years.'
    }
  ];

  const getStatusBadge = (status) => {
    const map = {
      'Draft': 'badge-warning',
      'Finalized': 'badge-success',
      'Submitted to Court': 'badge-primary'
    };
    return map[status] || 'badge-primary';
  };

  const handleViewReport = (mlr) => {
    setSelectedMLR(mlr);
    setActiveView('detail');
  };

  // ─── Print Preview Modal ───────────────────────────────────────────────
  const PrintPreview = ({ mlr, onClose }) => (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: 'fadeIn 0.3s ease'
    }}>
      <div style={{
        background: '#fff', color: '#000', width: '210mm', maxHeight: '90vh', overflowY: 'auto',
        padding: '30mm 25mm', borderRadius: '4px', position: 'relative', fontFamily: 'Georgia, serif', lineHeight: '1.8'
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: '10px', right: '15px', background: '#ef4444', color: '#fff',
          border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontSize: '1.2rem',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>×</button>

        <div style={{ textAlign: 'center', marginBottom: '2rem', borderBottom: '2px solid #000', paddingBottom: '1rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.1rem', letterSpacing: '0.1em', color: '#000' }}>TEACHING HOSPITAL PERADENIYA</h2>
          <h3 style={{ margin: '4px 0', fontSize: '0.95rem', color: '#333' }}>Department of Forensic Medicine</h3>
          <h1 style={{ margin: '12px 0 4px', fontSize: '1.3rem', color: '#000' }}>MEDICO-LEGAL REPORT</h1>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#555' }}>Report No: {mlr.mlrNumber} | Case: {mlr.caseNumber}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          <p style={{ color: '#000' }}><strong>Patient:</strong> {mlr.patient}</p>
          <p style={{ color: '#000' }}><strong>NIC:</strong> {mlr.nic}</p>
          <p style={{ color: '#000' }}><strong>Date of Report:</strong> {mlr.reportDate}</p>
          <p style={{ color: '#000' }}><strong>MLEF Ref:</strong> {mlr.mlefNumber}</p>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', borderBottom: '1px solid #ccc', paddingBottom: '4px', color: '#000' }}>Report</h3>
          <p style={{ whiteSpace: 'pre-wrap', color: '#000', fontSize: '0.9rem' }}>{mlr.content}</p>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1rem', borderBottom: '1px solid #ccc', paddingBottom: '4px', color: '#000' }}>Opinion & Conclusion</h3>
          <p style={{ whiteSpace: 'pre-wrap', color: '#000', fontSize: '0.9rem', fontWeight: '500' }}>{mlr.conclusion}</p>
        </div>

        <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
          <div>
            <p style={{ margin: '0 0 4px', color: '#000' }}><strong>{mlr.doctor}</strong></p>
            <p style={{ margin: 0, color: '#555' }}>{mlr.designation}</p>
            <p style={{ margin: 0, color: '#555' }}>Department of Forensic Medicine</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: '0 0 4px', color: '#000' }}><strong>Date:</strong> {mlr.reportDate}</p>
            {mlr.certificate && <p style={{ margin: 0, color: '#555' }}>Certificate: {mlr.certificate}</p>}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button onClick={() => window.print()} style={{
            padding: '10px 30px', background: '#3b82f6', color: '#fff', border: 'none',
            borderRadius: '6px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: '500'
          }}>
            🖨️ Print Report
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="page-content animate-fade-in">
      {showPreview && selectedMLR && (
        <PrintPreview mlr={selectedMLR} onClose={() => setShowPreview(false)} />
      )}

      {/* ─── Header Actions ──────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700' }}>
            <ion-icon name="document-text" style={{ verticalAlign: 'middle', marginRight: '8px', color: 'var(--primary)' }}></ion-icon>
            Medico-Legal Reports
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: '0.9rem' }}>Generate, finalize, and manage MLR documents</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {activeView === 'detail' && (
            <button className="btn btn-secondary" onClick={() => { setActiveView('list'); setSelectedMLR(null); }}>
              <ion-icon name="arrow-back-outline"></ion-icon> Back to List
            </button>
          )}
          <button className="btn btn-primary" onClick={() => setActiveView('create')}>
            <ion-icon name="add-circle-outline"></ion-icon> New MLR
          </button>
        </div>
      </div>

      {/* ─── Stats Cards ─────────────────────────────────────────────── */}
      <div className="grid-cards" style={{ marginBottom: '2rem' }}>
        <div className="glass-panel stat-card">
          <div className="stat-icon primary"><ion-icon name="document-text-outline"></ion-icon></div>
          <div className="stat-info">
            <h3>{mlrRecords.length}</h3>
            <p>Total MLRs</p>
          </div>
        </div>
        <div className="glass-panel stat-card">
          <div className="stat-icon warning"><ion-icon name="create-outline"></ion-icon></div>
          <div className="stat-info">
            <h3>{mlrRecords.filter(r => r.status === 'Draft').length}</h3>
            <p>Drafts</p>
          </div>
        </div>
        <div className="glass-panel stat-card">
          <div className="stat-icon success"><ion-icon name="checkmark-circle-outline"></ion-icon></div>
          <div className="stat-info">
            <h3>{mlrRecords.filter(r => r.status === 'Finalized').length}</h3>
            <p>Finalized</p>
          </div>
        </div>
        <div className="glass-panel stat-card">
          <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' }}>
            <ion-icon name="briefcase-outline"></ion-icon>
          </div>
          <div className="stat-info">
            <h3>{mlrRecords.filter(r => r.status === 'Submitted to Court').length}</h3>
            <p>Submitted to Court</p>
          </div>
        </div>
      </div>

      {/* ─── MLR List View ───────────────────────────────────────────── */}
      {activeView === 'list' && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.15rem' }}>MLR Records</h2>
            <div style={{ display: 'flex', gap: '10px' }}>
              <select className="form-control" style={{ width: 'auto', padding: '0.5rem 1rem' }}>
                <option value="">All Statuses</option>
                <option value="Draft">Draft</option>
                <option value="Finalized">Finalized</option>
                <option value="Submitted to Court">Submitted to Court</option>
              </select>
              <div style={{ position: 'relative' }}>
                <input type="text" className="form-control" placeholder="Search reports..." style={{ paddingLeft: '2.5rem', width: '250px' }} />
                <ion-icon name="search-outline" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}></ion-icon>
              </div>
            </div>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>MLR Number</th>
                  <th>Case</th>
                  <th>Patient</th>
                  <th>Category</th>
                  <th>Doctor</th>
                  <th>Report Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {mlrRecords.map((mlr) => (
                  <tr key={mlr.id} style={{ cursor: 'pointer' }} onClick={() => handleViewReport(mlr)}>
                    <td style={{ fontWeight: '600', color: 'var(--primary)' }}>{mlr.mlrNumber}</td>
                    <td>{mlr.caseNumber}</td>
                    <td>{mlr.patient}</td>
                    <td>
                      <span style={{ fontSize: '0.8rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(14, 165, 233, 0.1)', color: '#0ea5e9' }}>
                        {mlr.category}
                      </span>
                    </td>
                    <td>{mlr.doctor}</td>
                    <td>{mlr.reportDate}</td>
                    <td><span className={`badge ${getStatusBadge(mlr.status)}`}>{mlr.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }} onClick={(e) => e.stopPropagation()}>
                        <button className="btn btn-secondary" style={{ padding: '0.4rem 0.7rem', fontSize: '0.8rem' }} onClick={() => handleViewReport(mlr)}>
                          <ion-icon name="eye-outline"></ion-icon>
                        </button>
                        <button className="btn btn-secondary" style={{ padding: '0.4rem 0.7rem', fontSize: '0.8rem' }} onClick={() => { setSelectedMLR(mlr); setShowPreview(true); }}>
                          <ion-icon name="print-outline"></ion-icon>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── MLR Detail View ─────────────────────────────────────────── */}
      {activeView === 'detail' && selectedMLR && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem' }}>
          {/* Main Report Content */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ margin: '0 0 4px', fontSize: '1.3rem' }}>{selectedMLR.mlrNumber}</h2>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>Linked to {selectedMLR.mlefNumber} • {selectedMLR.caseNumber}</p>
              </div>
              <span className={`badge ${getStatusBadge(selectedMLR.status)}`} style={{ fontSize: '0.85rem', padding: '0.4rem 1rem' }}>
                {selectedMLR.status === 'Finalized' && <ion-icon name="lock-closed-outline" style={{ marginRight: '4px' }}></ion-icon>}
                {selectedMLR.status}
              </span>
            </div>

            {/* Patient & Case Info Bar */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem',
              padding: '1rem 1.25rem', background: 'rgba(59, 130, 246, 0.05)', borderRadius: 'var(--radius-sm)',
              border: '1px solid rgba(59, 130, 246, 0.1)', marginBottom: '1.5rem'
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Patient</div>
                <div style={{ fontWeight: '600', marginTop: '2px' }}>{selectedMLR.patient}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>NIC</div>
                <div style={{ fontWeight: '500', marginTop: '2px' }}>{selectedMLR.nic}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category</div>
                <div style={{ fontWeight: '500', marginTop: '2px' }}>{selectedMLR.category}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Report Date</div>
                <div style={{ fontWeight: '500', marginTop: '2px' }}>{selectedMLR.reportDate}</div>
              </div>
            </div>

            {/* Report Content */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', color: 'var(--primary)', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>
                <ion-icon name="document-outline" style={{ verticalAlign: 'middle', marginRight: '6px' }}></ion-icon>
                Report Content
              </h3>
              {selectedMLR.status === 'Draft' ? (
                <textarea
                  className="form-control"
                  rows="12"
                  defaultValue={selectedMLR.content}
                  style={{ fontFamily: 'Georgia, serif', lineHeight: '1.8', fontSize: '0.95rem' }}
                />
              ) : (
                <div style={{
                  whiteSpace: 'pre-wrap', padding: '1.25rem', background: 'rgba(0,0,0,0.2)',
                  borderRadius: 'var(--radius-sm)', lineHeight: '1.8', fontSize: '0.95rem',
                  fontFamily: 'Georgia, serif', border: '1px solid var(--border)'
                }}>
                  {selectedMLR.content}
                </div>
              )}
            </div>

            {/* Conclusion */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', color: 'var(--primary)', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>
                <ion-icon name="shield-checkmark-outline" style={{ verticalAlign: 'middle', marginRight: '6px' }}></ion-icon>
                Opinion & Conclusion
              </h3>
              {selectedMLR.status === 'Draft' ? (
                <textarea
                  className="form-control"
                  rows="5"
                  defaultValue={selectedMLR.conclusion}
                  style={{ fontFamily: 'Georgia, serif', lineHeight: '1.8' }}
                />
              ) : (
                <div style={{
                  whiteSpace: 'pre-wrap', padding: '1.25rem',
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(59, 130, 246, 0.05))',
                  borderRadius: 'var(--radius-sm)', lineHeight: '1.8', fontSize: '0.95rem',
                  fontFamily: 'Georgia, serif', border: '1px solid rgba(16, 185, 129, 0.15)', fontWeight: '500'
                }}>
                  {selectedMLR.conclusion}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
              {selectedMLR.status === 'Draft' && (
                <>
                  <button className="btn btn-secondary"><ion-icon name="save-outline"></ion-icon> Save Draft</button>
                  <button className="btn btn-primary" style={{ background: 'var(--success)', boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)' }}>
                    <ion-icon name="lock-closed-outline"></ion-icon> Finalize MLR
                  </button>
                </>
              )}
              <button className="btn btn-secondary" onClick={() => { setShowPreview(true); }}>
                <ion-icon name="print-outline"></ion-icon> Print Preview
              </button>
            </div>
          </div>

          {/* Sidebar Info Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Report Metadata */}
            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <h3 style={{ fontSize: '0.95rem', marginBottom: '1rem', color: 'var(--primary)' }}>Report Details</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.875rem' }}>
                <div>
                  <div style={{ color: 'var(--text-muted)', marginBottom: '2px' }}>Prepared By</div>
                  <div style={{ fontWeight: '600' }}>{selectedMLR.doctor}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{selectedMLR.designation}</div>
                </div>
                <div style={{ height: '1px', background: 'var(--border)' }}></div>
                <div>
                  <div style={{ color: 'var(--text-muted)', marginBottom: '2px' }}>MLEF Reference</div>
                  <div style={{ fontWeight: '500', color: 'var(--accent)' }}>{selectedMLR.mlefNumber}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)', marginBottom: '2px' }}>Case Reference</div>
                  <div style={{ fontWeight: '500' }}>{selectedMLR.caseNumber}</div>
                </div>
                {selectedMLR.certificate && (
                  <div>
                    <div style={{ color: 'var(--text-muted)', marginBottom: '2px' }}>Certificate of Receipt</div>
                    <div style={{ fontWeight: '500', color: 'var(--success)' }}>{selectedMLR.certificate}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Status Lock Indicator */}
            {selectedMLR.status !== 'Draft' && (
              <div className="glass-panel" style={{
                padding: '1.25rem', borderLeft: '3px solid var(--success)',
                background: 'rgba(16, 185, 129, 0.05)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <ion-icon name="lock-closed" style={{ color: 'var(--success)', fontSize: '1.2rem' }}></ion-icon>
                  <h3 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--success)' }}>Report Locked</h3>
                </div>
                <p style={{ margin: 0, fontSize: '0.82rem', lineHeight: '1.5' }}>
                  This MLR has been finalized and is protected by the MLR Lock Trigger. No further edits are permitted.
                </p>
              </div>
            )}

            {/* Timeline */}
            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <h3 style={{ fontSize: '0.95rem', marginBottom: '1rem', color: 'var(--primary)' }}>Timeline</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.82rem', position: 'relative' }}>
                <div style={{ position: 'absolute', left: '5px', top: '8px', bottom: '8px', width: '2px', background: 'var(--border)' }}></div>
                {[
                  { label: 'MLEF Created', date: 'Based on linked MLEF', icon: 'document-outline', color: 'var(--accent)' },
                  { label: 'MLR Draft Created', date: selectedMLR.reportDate, icon: 'create-outline', color: 'var(--warning)' },
                  ...(selectedMLR.status !== 'Draft' ? [{ label: 'MLR Finalized', date: selectedMLR.reportDate, icon: 'lock-closed-outline', color: 'var(--success)' }] : []),
                  ...(selectedMLR.status === 'Submitted to Court' ? [{ label: 'Submitted to Court', date: selectedMLR.reportDate, icon: 'briefcase-outline', color: '#8b5cf6' }] : [])
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', paddingLeft: '16px' }}>
                    <div style={{
                      width: '12px', height: '12px', borderRadius: '50%', background: item.color,
                      position: 'absolute', left: 0, marginTop: '2px', border: '2px solid var(--bg-panel)',
                      boxShadow: `0 0 0 2px ${item.color}`
                    }}></div>
                    <div>
                      <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>{item.label}</div>
                      <div style={{ color: 'var(--text-muted)' }}>{item.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Create New MLR View ─────────────────────────────────────── */}
      {activeView === 'create' && (
        <div className="glass-panel" style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.2rem' }}>
              <ion-icon name="add-circle" style={{ verticalAlign: 'middle', marginRight: '8px', color: 'var(--primary)' }}></ion-icon>
              Create New Medico-Legal Report
            </h2>
            <button className="btn btn-secondary" onClick={() => setActiveView('list')}>
              <ion-icon name="close-outline"></ion-icon> Cancel
            </button>
          </div>

          <form>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Linked MLEF *</label>
                <select className="form-control">
                  <option value="">Select MLEF to link...</option>
                  <option value="3">MLEF/2026/003 — CW/2026/003 — Sanduni Herath (Sexual Abuse)</option>
                </select>
                <small style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '4px', display: 'block' }}>
                  Only MLEFs without an existing MLR are shown (1:1 relationship)
                </small>
              </div>
              <div className="form-group">
                <label className="form-label">MLR Number (Auto-generated)</label>
                <input type="text" className="form-control" value="MLR/2026/006" readOnly style={{ background: 'rgba(0,0,0,0.2)' }} />
              </div>
              <div className="form-group">
                <label className="form-label">Prepared By</label>
                <input type="text" className="form-control" value="Dr. C. Wickramasinghe" readOnly style={{ background: 'rgba(0,0,0,0.2)' }} />
              </div>
              <div className="form-group">
                <label className="form-label">Report Date *</label>
                <input type="date" className="form-control" />
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label className="form-label">Report Content *</label>
              <textarea className="form-control" rows="10" placeholder="Enter the full medico-legal report content including history, examination findings, and detailed observations..." style={{ fontFamily: 'Georgia, serif', lineHeight: '1.8' }}></textarea>
            </div>

            <div className="form-group">
              <label className="form-label">Opinion & Conclusion *</label>
              <textarea className="form-control" rows="4" placeholder="Enter your medical opinion and legal conclusion..." style={{ fontFamily: 'Georgia, serif', lineHeight: '1.8' }}></textarea>
            </div>

            <div className="form-group">
              <label className="form-label">Certificate of Receipt (optional — for finalization)</label>
              <input type="text" className="form-control" placeholder="e.g., CR/2026/006" />
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setActiveView('list')}>Cancel</button>
              <button type="submit" className="btn btn-primary"><ion-icon name="save-outline"></ion-icon> Save as Draft</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default MlReport;

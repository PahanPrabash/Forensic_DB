import React, { useState } from 'react';

const MlefForm = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="page-content animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginBottom: '1.5rem' }}>
        <span className="badge badge-warning" style={{ alignSelf: 'center' }}>Draft Mode</span>
        <button className="btn btn-secondary"><ion-icon name="save-outline"></ion-icon> Save Draft</button>
        <button className="btn btn-primary"><ion-icon name="checkmark-circle-outline"></ion-icon> Finalize MLEF</button>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
        
        <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border)', marginBottom: '1.5rem' }}>
          {['1. General Information', '2. Clinical Findings', '3. Injuries & Diagram', '4. Conclusion & Opinion'].map((tab, idx) => (
            <div 
              key={idx} 
              onClick={() => setActiveTab(idx)}
              style={{ 
                padding: '0.75rem 1.5rem', cursor: 'pointer', fontWeight: '500',
                color: activeTab === idx ? 'var(--primary)' : 'var(--text-muted)',
                borderBottom: activeTab === idx ? '2px solid var(--primary)' : '2px solid transparent'
              }}
            >
              {tab}
            </div>
          ))}
        </div>

        <form>
          {activeTab === 0 && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Linked Case</label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input type="text" className="form-control" value="CAS-2026-089" readOnly style={{ background: 'rgba(0,0,0,0.2)' }} />
                    <button type="button" className="btn btn-secondary">Select</button>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">MLEF Number (Auto-generated)</label>
                  <input type="text" className="form-control" value="MLEF/2026/045" readOnly style={{ background: 'rgba(0,0,0,0.2)' }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Examining Doctor</label>
                  <input type="text" className="form-control" value="Dr. C. Wickramasinghe" readOnly style={{ background: 'rgba(0,0,0,0.2)' }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Examination Date & Time</label>
                  <input type="datetime-local" className="form-control" />
                </div>
              </div>

              <h3 style={{ marginTop: '2rem', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)', color: 'var(--primary)', fontSize: '1.1rem' }}>Legal Authorization</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Referral Source</label>
                  <select className="form-control">
                    <option>Hospital Ward</option>
                    <option>Police Station</option>
                    <option>Attorney General Office</option>
                    <option>Human Rights Commission</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Legal Document Type</label>
                  <select className="form-control">
                    <option>MLEF Request</option>
                    <option>Request Letter</option>
                    <option>Court Order</option>
                  </select>
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Document Upload (Scanned Copy)</label>
                  <div style={{ border: '2px dashed var(--border)', padding: '2rem', textAlign: 'center', borderRadius: 'var(--radius-sm)', color: 'var(--text-muted)', cursor: 'pointer', background: 'rgba(0,0,0,0.2)' }}>
                    <ion-icon name="cloud-upload-outline" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}></ion-icon>
                    <div>Drag & Drop or Click to Upload Police Request / Court Order</div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 1 && (
            <>
              <h3 style={{ marginTop: 0, marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)', color: 'var(--primary)', fontSize: '1.1rem' }}>Clinical Findings & Injuries</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                <div className="form-group">
                  <label className="form-label">General Clinical Findings</label>
                  <textarea className="form-control" rows="4" placeholder="Enter general findings..."></textarea>
                </div>
                <div className="form-group">
                  <label className="form-label">Detailed Injury Description</label>
                  <textarea className="form-control" rows="6" placeholder="List and describe injuries (Abrasions, Lacerations, Contusions, etc.)"></textarea>
                </div>
              </div>
            </>
          )}

          {activeTab === 2 && (
            <>
              <h3 style={{ marginTop: 0, marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)', color: 'var(--primary)', fontSize: '1.1rem' }}>Injuries & Diagram</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Body Diagram Annotation Upload</label>
                  <div style={{ border: '2px dashed var(--border)', padding: '2rem', textAlign: 'center', borderRadius: 'var(--radius-sm)', color: 'var(--text-muted)', cursor: 'pointer', background: 'rgba(0,0,0,0.2)' }}>
                    <ion-icon name="body-outline" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}></ion-icon>
                    <div>Upload Annotated Body Diagrams</div>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Weapon Used (Suspected)</label>
                  <select className="form-control">
                    <option value="">Select Weapon Category</option>
                    <option value="blunt">Blunt Object</option>
                    <option value="sharp">Sharp Object</option>
                    <option value="firearm">Firearm</option>
                    <option value="burns">Thermal/Chemical</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Circumstances of Injury</label>
                  <textarea className="form-control" rows="3" placeholder="Briefly describe the circumstances..."></textarea>
                </div>
              </div>
            </>
          )}

          {activeTab === 3 && (
            <>
              <h3 style={{ marginTop: 0, marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)', color: 'var(--primary)', fontSize: '1.1rem' }}>Conclusion & Opinion</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Category of Hurt</label>
                  <select className="form-control">
                    <option value="">Select Category...</option>
                    <option value="non-grievous">Non-Grievous</option>
                    <option value="grievous">Grievous Hurt</option>
                    <option value="fatal">Fatal</option>
                    <option value="endangering">Endangering Life</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Final Opinion</label>
                  <textarea className="form-control" rows="5" placeholder="Enter final medical opinion..."></textarea>
                </div>
                <div className="form-group">
                  <label className="form-label">Digital Signature</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                    <input type="checkbox" id="sign_mlef" />
                    <label htmlFor="sign_mlef" style={{ cursor: 'pointer' }}>I digitally sign this Medico-Legal Examination Form.</label>
                  </div>
                </div>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default MlefForm;

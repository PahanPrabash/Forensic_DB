import React, { useState } from 'react';

const MlefForm = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    MLEFNumber: `MLEF/2026/0${Math.floor(Math.random() * 90) + 10}`,
    CaseID: '1',
    PatientID: '1',
    ExaminingDoctorID: '1',
    ExaminationDate: '',
    ReferralSource: 'Hospital Ward',
    LegalAuthorization: 'MLEF Request',
    ClinicalFindings: '',
    Injuries: '',
    Opinion: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (status) => {
    try {
      // Assuming backend expects Status in the payload
      const payload = { ...formData, Status: status };
      const res = await fetch('/api/mlef', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        alert(`MLEF ${status === 'Finalized' ? 'Finalized' : 'Saved as Draft'} successfully!`);
      } else {
        alert('Failed to save MLEF');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page-content animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginBottom: '1.5rem' }}>
        <span className="badge badge-warning" style={{ alignSelf: 'center' }}>Draft Mode</span>
        <button type="button" className="btn btn-secondary" onClick={() => handleSave('Draft')}><ion-icon name="save-outline"></ion-icon> Save Draft</button>
        <button type="button" className="btn btn-primary" onClick={() => handleSave('Finalized')}><ion-icon name="checkmark-circle-outline"></ion-icon> Finalize MLEF</button>
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

        <form onSubmit={(e) => e.preventDefault()}>
          {activeTab === 0 && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Linked Case</label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input type="text" className="form-control" value="CW/2026/001" readOnly style={{ background: 'rgba(0,0,0,0.05)' }} />
                    <button type="button" className="btn btn-secondary">Select</button>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">MLEF Number (Auto-generated)</label>
                  <input type="text" className="form-control" value={formData.MLEFNumber} readOnly style={{ background: 'rgba(0,0,0,0.05)' }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Examining Doctor</label>
                  <input type="text" className="form-control" value="Dr. C. Wickramasinghe" readOnly style={{ background: 'rgba(0,0,0,0.05)' }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Examination Date & Time</label>
                  <input type="datetime-local" name="ExaminationDate" className="form-control" value={formData.ExaminationDate} onChange={handleChange} required />
                </div>
              </div>

              <h3 style={{ marginTop: '2rem', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)', color: 'var(--primary)', fontSize: '1.1rem' }}>Legal Authorization</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Referral Source</label>
                  <select name="ReferralSource" className="form-control" value={formData.ReferralSource} onChange={handleChange}>
                    <option value="Hospital Ward">Hospital Ward</option>
                    <option value="Police Station">Police Station</option>
                    <option value="Attorney General Office">Attorney General Office</option>
                    <option value="Human Rights Commission">Human Rights Commission</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Legal Document Type</label>
                  <select name="LegalAuthorization" className="form-control" value={formData.LegalAuthorization} onChange={handleChange}>
                    <option value="MLEF Request">MLEF Request</option>
                    <option value="Request Letter">Request Letter</option>
                    <option value="Court Order">Court Order</option>
                  </select>
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Document Upload (Scanned Copy)</label>
                  <div style={{ border: '2px dashed var(--border)', padding: '2rem', textAlign: 'center', borderRadius: 'var(--radius-sm)', color: 'var(--text-muted)', cursor: 'pointer', background: 'rgba(0,0,0,0.05)' }}>
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
                  <textarea name="ClinicalFindings" className="form-control" rows="4" placeholder="Enter general findings..." value={formData.ClinicalFindings} onChange={handleChange}></textarea>
                </div>
                <div className="form-group">
                  <label className="form-label">Detailed Injury Description</label>
                  <textarea name="Injuries" className="form-control" rows="6" placeholder="List and describe injuries (Abrasions, Lacerations, Contusions, etc.)" value={formData.Injuries} onChange={handleChange}></textarea>
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
                  <div style={{ border: '2px dashed var(--border)', padding: '2rem', textAlign: 'center', borderRadius: 'var(--radius-sm)', color: 'var(--text-muted)', cursor: 'pointer', background: 'rgba(0,0,0,0.05)' }}>
                    <ion-icon name="body-outline" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}></ion-icon>
                    <div>Upload Annotated Body Diagrams</div>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Weapon Used (Suspected)</label>
                  <select name="WeaponUsed" className="form-control" value={formData.WeaponUsed} onChange={handleChange}>
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
                  <textarea name="Circumstances" className="form-control" rows="3" placeholder="Briefly describe the circumstances..." value={formData.Circumstances} onChange={handleChange}></textarea>
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
                  <select name="CategoryOfHurt" className="form-control" value={formData.CategoryOfHurt} onChange={handleChange}>
                    <option value="">Select Category...</option>
                    <option value="non-grievous">Non-Grievous</option>
                    <option value="grievous">Grievous Hurt</option>
                    <option value="fatal">Fatal</option>
                    <option value="endangering">Endangering Life</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Final Opinion</label>
                  <textarea name="Opinion" className="form-control" rows="5" placeholder="Enter final medical opinion..." value={formData.Opinion} onChange={handleChange}></textarea>
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

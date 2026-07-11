import React from 'react';

const AutopsyForm = () => {
  return (
    <div className="page-content animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
        <button className="btn btn-primary">Generate Cause of Death Form</button>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
        <form>
          <h3 style={{ marginTop: 0, marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)', color: 'var(--primary)', fontSize: '1.1rem' }}>Case & Inquest Details</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Autopsy Case No.</label>
              <input type="text" className="form-control" value="PM-2026-052" readOnly style={{ background: 'rgba(0,0,0,0.2)' }} />
            </div>
            <div className="form-group">
              <label className="form-label">Inquest Order / Court Order No.</label>
              <input type="text" className="form-control" placeholder="e.g. MAG/123/26" />
            </div>
            <div className="form-group">
              <label className="form-label">Death Type</label>
              <select className="form-control">
                <option>Accidental</option>
                <option>Natural</option>
                <option>Suicidal</option>
                <option>Homicidal</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Death Source</label>
              <select className="form-control">
                <option>Hospital (Ward)</option>
                <option>Outside (Brought Dead)</option>
              </select>
            </div>
          </div>

          <h3 style={{ marginTop: '2rem', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)', color: 'var(--primary)', fontSize: '1.1rem' }}>Autopsy Findings</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Pre-Autopsy Information</label>
              <textarea className="form-control" rows="3" placeholder="Info from crime scene, BHT, witnesses..."></textarea>
            </div>
            <div className="form-group">
              <label className="form-label">External Findings</label>
              <textarea className="form-control" rows="4"></textarea>
            </div>
            <div className="form-group">
              <label className="form-label">Internal Findings</label>
              <textarea className="form-control" rows="6"></textarea>
            </div>
            
            <div className="form-group">
              <label className="form-label">Audio to Text Recording (Dictation)</label>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'stretch' }}>
                <textarea className="form-control" rows="2" style={{ flex: 1 }} placeholder="Dictate PMR content..."></textarea>
                <button type="button" className="btn btn-secondary" style={{ background: 'rgba(239, 68, 68, 0.2)', borderColor: 'var(--danger)', color: 'var(--danger)' }}>
                  <ion-icon name="mic-outline" style={{ fontSize: '1.5rem' }}></ion-icon>
                </button>
              </div>
            </div>
          </div>

          <h3 style={{ marginTop: '2rem', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)', color: 'var(--primary)', fontSize: '1.1rem' }}>Cause of Death</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">1(a) Immediate Cause</label>
              <input type="text" className="form-control" placeholder="e.g. Myocardial Infarction" />
            </div>
            <div className="form-group">
              <label className="form-label">1(b) Antecedent Cause</label>
              <input type="text" className="form-control" />
            </div>
            <div className="form-group">
              <label className="form-label">2. Other Significant Conditions</label>
              <input type="text" className="form-control" />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
            <button type="button" className="btn btn-secondary">Upload Photos</button>
            <button type="submit" className="btn btn-primary">Save Autopsy Record</button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AutopsyForm;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AutopsyForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData.entries());

    // Generate current date for autopsy date
    payload.autopsyDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

    try {
      const res = await fetch('/api/autopsies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        alert('Autopsy form submitted successfully!');
        navigate('/cases');
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to submit autopsy form');
      }
    } catch (err) {
      console.error(err);
      alert('Network error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-content animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
        <button className="btn btn-primary" type="button" onClick={() => navigate('/cases')}>Back to Cases</button>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit}>
          <h3 style={{ marginTop: 0, marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)', color: 'var(--primary)', fontSize: '1.1rem' }}>Case & Inquest Details</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Case ID (Number)</label>
              <input type="number" name="caseId" className="form-control" placeholder="e.g. 1" required />
            </div>
            <div className="form-group">
              <label className="form-label">Inquest Order / Court Order No.</label>
              <input type="text" name="inquestOrder" className="form-control" placeholder="e.g. MAG/123/26" />
            </div>
            <div className="form-group">
              <label className="form-label">Death Type</label>
              <select name="deathType" className="form-control">
                <option value="Accidental">Accidental</option>
                <option value="Natural">Natural</option>
                <option value="Suicidal">Suicidal</option>
                <option value="Homicidal">Homicidal</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Death Source</label>
              <select name="deathSource" className="form-control">
                <option value="Hospital">Hospital (Ward)</option>
                <option value="Outside">Outside (Brought Dead)</option>
              </select>
            </div>
          </div>

          <h3 style={{ marginTop: '2rem', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)', color: 'var(--primary)', fontSize: '1.1rem' }}>Autopsy Findings</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Pre-Autopsy Information</label>
              <textarea name="preAutopsyInfo" className="form-control" rows="3" placeholder="Info from crime scene, BHT, witnesses..."></textarea>
            </div>
            <div className="form-group">
              <label className="form-label">External Findings</label>
              <textarea name="externalFindings" className="form-control" rows="4"></textarea>
            </div>
            <div className="form-group">
              <label className="form-label">Internal Findings</label>
              <textarea name="internalFindings" className="form-control" rows="6"></textarea>
            </div>
            
            <div className="form-group">
              <label className="form-label">Audio to Text Recording (Dictation)</label>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'stretch' }}>
                <textarea name="dictation" className="form-control" rows="2" style={{ flex: 1 }} placeholder="Dictate PMR content..."></textarea>
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
              <input type="text" name="immediateCause" className="form-control" placeholder="e.g. Myocardial Infarction" />
            </div>
            <div className="form-group">
              <label className="form-label">1(b) Antecedent Cause</label>
              <input type="text" name="antecedentCause" className="form-control" />
            </div>
            <div className="form-group">
              <label className="form-label">2. Other Significant Conditions</label>
              <input type="text" name="otherConditions" className="form-control" />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
            <button type="button" className="btn btn-secondary">Upload Photos</button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Autopsy Record'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AutopsyForm;

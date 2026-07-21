import React, { useState } from 'react';

const CauseOfDeathForm = () => {
  const [formData, setFormData] = useState({
    postmortemId: '',
    immediateCause: '',
    antecedentCause1: '',
    antecedentCause2: '',
    underlyingCause: '',
    otherConditions: '',
    mannerOfDeath: 'Natural'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // API call to save cause of death will be placed here
      console.log('Submitting cause of death:', formData);
      alert('Cause of death saved successfully!');
    } catch (error) {
      console.error('Error saving cause of death:', error);
    }
  };

  return (
    <div className="page-content animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
        <button className="btn btn-secondary">View Case Records</button>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit}>
          <h3 style={{ marginTop: 0, marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)', color: 'var(--primary)', fontSize: '1.1rem' }}>Cause of Death Declaration</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Postmortem / Case ID</label>
              <input type="text" name="postmortemId" className="form-control" placeholder="e.g. PM-2026-052" value={formData.postmortemId} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Manner of Death</label>
              <select name="mannerOfDeath" className="form-control" value={formData.mannerOfDeath} onChange={handleChange}>
                <option value="Natural">Natural</option>
                <option value="Accident">Accident</option>
                <option value="Suicide">Suicide</option>
                <option value="Homicide">Homicide</option>
                <option value="Undetermined">Undetermined</option>
              </select>
            </div>
          </div>

          <h3 style={{ marginTop: '2rem', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)', color: 'var(--primary)', fontSize: '1.1rem' }}>I. Disease or condition directly leading to death</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">1(a) Immediate Cause</label>
              <input type="text" name="immediateCause" className="form-control" placeholder="e.g. Acute Myocardial Infarction" value={formData.immediateCause} onChange={handleChange} required />
              <small style={{ color: 'var(--text-muted)' }}>Due to (or as a consequence of)</small>
            </div>
            <div className="form-group">
              <label className="form-label">1(b) Antecedent Cause 1</label>
              <input type="text" name="antecedentCause1" className="form-control" placeholder="e.g. Coronary Artery Disease" value={formData.antecedentCause1} onChange={handleChange} />
              <small style={{ color: 'var(--text-muted)' }}>Due to (or as a consequence of)</small>
            </div>
            <div className="form-group">
              <label className="form-label">1(c) Antecedent Cause 2 (Underlying Cause)</label>
              <input type="text" name="antecedentCause2" className="form-control" placeholder="e.g. Type 2 Diabetes Mellitus" value={formData.antecedentCause2} onChange={handleChange} />
            </div>
          </div>

          <h3 style={{ marginTop: '2rem', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)', color: 'var(--primary)', fontSize: '1.1rem' }}>II. Other significant conditions</h3>
          <div className="form-group">
            <label className="form-label">Conditions contributing to death but not related to the disease or condition causing it</label>
            <textarea name="otherConditions" className="form-control" rows="3" value={formData.otherConditions} onChange={handleChange}></textarea>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
            <button type="submit" className="btn btn-primary">Finalize Certificate</button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CauseOfDeathForm;

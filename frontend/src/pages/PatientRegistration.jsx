import React from 'react';
import { useNavigate } from 'react-router-dom';

const PatientRegistration = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/cases');
  };

  return (
    <div className="page-content animate-fade-in">
      <div className="glass-panel" style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit}>
          
          <h3 style={{ marginTop: 0, marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)', color: 'var(--primary)', fontSize: '1.1rem' }}>Patient Information</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input type="text" className="form-control" required />
            </div>
            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input type="text" className="form-control" required />
            </div>
            <div className="form-group">
              <label className="form-label">NIC (National Identity Card)</label>
              <input type="text" className="form-control" />
            </div>
            <div className="form-group">
              <label className="form-label">Date of Birth / Age</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input type="date" className="form-control" />
                <input type="number" className="form-control" placeholder="Age" style={{ width: '80px' }} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Gender</label>
              <select className="form-control">
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Contact Number</label>
              <input type="tel" className="form-control" />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Address</label>
              <input type="text" className="form-control" />
            </div>
          </div>

          <h3 style={{ marginTop: '2rem', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)', color: 'var(--primary)', fontSize: '1.1rem' }}>Case Details</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Case Type</label>
              <select className="form-control" required>
                <option value="">Select Type</option>
                <option value="clinical">Clinical Forensic</option>
                <option value="autopsy">Autopsy</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Sub Category</label>
              <select className="form-control">
                <option value="trauma">Trauma / Accident</option>
                <option value="abuse_domestic">Domestic Abuse</option>
                <option value="abuse_sexual">Sexual Abuse</option>
                <option value="detainee">Detainee</option>
                <option value="age">Age Estimation</option>
                <option value="death_hospital">Hospital Death</option>
                <option value="death_outside">Outside Death</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Incident Date & Time</label>
              <input type="datetime-local" className="form-control" required />
            </div>
            <div className="form-group">
              <label className="form-label">Incident Location</label>
              <input type="text" className="form-control" />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Brief Description of Incident</label>
              <textarea className="form-control" rows="3"></textarea>
            </div>
            <div className="form-group">
              <label className="form-label">Assigned Doctor</label>
              <select className="form-control">
                <option>Dr. Wickramasinghe</option>
                <option>Dr. Silva</option>
                <option>Dr. Perera</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Register Patient & Case</button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default PatientRegistration;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PatientRegistration = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/api/doctors', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setDoctors(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const form = e.target;
    const token = localStorage.getItem('token');

    const payload = {
      firstName: form.firstName.value,
      lastName: form.lastName.value,
      nic: form.nic.value || null,
      dateOfBirth: form.dob.value || null,
      age: form.age.value ? parseInt(form.age.value) : null,
      gender: form.gender.value,
      phone: form.phone.value || null,
      address: form.address.value || null,
      caseType: form.caseType.value,
      subCategory: form.subCategory.value || null,
      incidentDate: form.incidentDate.value || null,
      incidentLocation: form.incidentLocation.value || null,
      description: form.description.value || null,
      assignedDoctorId: form.assignedDoctor.value ? parseInt(form.assignedDoctor.value) : null,
    };

    try {
      const res = await fetch('/api/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to register patient.');
        setIsSubmitting(false);
        return;
      }

      navigate('/cases');
    } catch (err) {
      setError('Network error. Is the backend running?');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-content animate-fade-in">
      <div className="glass-panel" style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit}>
          
          {error && (
            <div style={{ 
              background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 'var(--radius-sm)', padding: '0.75rem 1rem', marginBottom: '1rem',
              color: '#f87171', fontSize: '0.875rem'
            }}>{error}</div>
          )}

          <h3 style={{ marginTop: 0, marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)', color: 'var(--primary)', fontSize: '1.1rem' }}>Patient Information</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input type="text" name="firstName" className="form-control" required />
            </div>
            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input type="text" name="lastName" className="form-control" required />
            </div>
            <div className="form-group">
              <label className="form-label">NIC (National Identity Card)</label>
              <input type="text" name="nic" className="form-control" />
            </div>
            <div className="form-group">
              <label className="form-label">Date of Birth / Age</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input type="date" name="dob" className="form-control" />
                <input type="number" name="age" className="form-control" placeholder="Age" style={{ width: '80px' }} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Gender</label>
              <select name="gender" className="form-control" required>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Contact Number</label>
              <input type="tel" name="phone" className="form-control" />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Address</label>
              <input type="text" name="address" className="form-control" />
            </div>
          </div>

          <h3 style={{ marginTop: '2rem', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)', color: 'var(--primary)', fontSize: '1.1rem' }}>Case Details</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Case Type</label>
              <select name="caseType" className="form-control" required>
                <option value="">Select Type</option>
                <option value="Clinical">Clinical Forensic</option>
                <option value="Autopsy">Autopsy</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Sub Category</label>
              <select name="subCategory" className="form-control">
                <option value="Trauma">Trauma / Accident</option>
                <option value="Domestic Abuse">Domestic Abuse</option>
                <option value="Sexual Abuse">Sexual Abuse</option>
                <option value="Detainee">Detainee</option>
                <option value="Age Estimation">Age Estimation</option>
                <option value="Hospital Death">Hospital Death</option>
                <option value="Outside Death">Outside Death</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Incident Date & Time</label>
              <input type="datetime-local" name="incidentDate" className="form-control" required />
            </div>
            <div className="form-group">
              <label className="form-label">Incident Location</label>
              <input type="text" name="incidentLocation" className="form-control" />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Brief Description of Incident</label>
              <textarea name="description" className="form-control" rows="3"></textarea>
            </div>
            <div className="form-group">
              <label className="form-label">Assigned Doctor</label>
              <select name="assignedDoctor" className="form-control">
                <option value="">Select Doctor</option>
                {doctors.map((d) => (
                  <option key={d.DoctorID} value={d.DoctorID}>{d.FullName}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Registering...' : 'Register Patient & Case'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default PatientRegistration;

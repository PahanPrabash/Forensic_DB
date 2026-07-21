import React from 'react';
import { useNavigate } from 'react-router-dom';

const PatientRegistration = () => {
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData.entries());

    try {
      // 1. Create Patient
      const patientRes = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: payload.firstName,
          lastName: payload.lastName,
          nic: payload.nic,
          dateOfBirth: payload.dateOfBirth,
          gender: payload.gender,
          phone: payload.phone,
          address: payload.address
        })
      });

      if (!patientRes.ok) throw new Error('Failed to create patient');
      const patientData = await patientRes.json();
      const patientId = patientData.patientId;

      // 2. Create Case
      const caseRes = await fetch('/api/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseNumber: `CASE-${Date.now()}`, // generate unique case number
          caseType: payload.caseType === 'clinical' ? 'Clinical' : 'Autopsy',
          subCategory: payload.subCategory,
          incidentDate: payload.incidentDate,
          incidentLocation: payload.incidentLocation,
          description: payload.description,
          patientId: patientId,
          doctorId: 1, // Mock doctor ID for now
          createdBy: 1 // Mock createdBy ID
        })
      });

      if (!caseRes.ok) throw new Error('Failed to create case');

      alert('Patient and Case registered successfully!');
      navigate('/cases');
    } catch (err) {
      console.error(err);
      alert('Error: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-content animate-fade-in">
      <div className="glass-panel" style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit}>
          
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
                <input type="date" name="dateOfBirth" className="form-control" />
                <input type="number" name="age" className="form-control" placeholder="Age" style={{ width: '80px' }} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Gender</label>
              <select name="gender" className="form-control">
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
                <option value="clinical">Clinical Forensic</option>
                <option value="autopsy">Autopsy</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Sub Category</label>
              <select name="subCategory" className="form-control">
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
              <select name="doctor" className="form-control">
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

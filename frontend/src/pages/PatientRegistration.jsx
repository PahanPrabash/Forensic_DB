import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { caseAPI, staffAPI } from '../services/api';

const PatientRegistration = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    nic: '',
    dob: '',
    age: '',
    gender: 'Female',
    phone: '',
    address: '',
    caseType: 'clinical',
    subCategory: 'Trauma / Accident',
    incidentDate: '',
    incidentLocation: '',
    description: '',
    assignedDoctorId: ''
  });

  const [doctors, setDoctors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await staffAPI.getAllDoctors();
        if (res.success && res.data.length > 0) {
          setDoctors(res.data);
          setFormData((prev) => ({ ...prev, assignedDoctorId: res.data[0].DoctorID }));
        }
      } catch (err) {
        console.warn('Could not retrieve JMO doctors from database:', err.message);
      }
    };

    fetchDoctors();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await caseAPI.createCase(formData);
      if (res.success) {
        navigate('/cases');
      } else {
        setErrorMessage(res.error || res.message || 'Failed to create case');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Error submitting case registration');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-content animate-fade-in">
      <div className="glass-panel" style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
              <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--primary)' }}>
                <ion-icon name="home-outline"></ion-icon> Home
              </Link>
              <span>/</span>
              <Link to="/cases" style={{ color: 'var(--primary)' }}>Patient & Cases</Link>
              <span>/</span>
              <span>Register Patient</span>
            </div>
            <h2 style={{ margin: 0, fontSize: '1.4rem' }}>Register New Patient & Forensic Case</h2>
            <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Enter victim demographic and incident details into the forensic database.</p>
          </div>
        </div>

        {errorMessage && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.5rem',
            fontSize: '0.875rem'
          }}>
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          
          <h3 style={{ marginTop: 0, marginBottom: '1rem', paddingBottom: '0.5rem', color: 'var(--primary)', fontSize: '1.1rem' }}>
            Patient Information
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">First Name *</label>
              <input type="text" name="firstName" className="form-control" value={formData.firstName} onChange={handleChange} required placeholder="e.g. Kaveesha" />
            </div>
            <div className="form-group">
              <label className="form-label">Last Name *</label>
              <input type="text" name="lastName" className="form-control" value={formData.lastName} onChange={handleChange} required placeholder="e.g. Himashi" />
            </div>
            <div className="form-group">
              <label className="form-label">NIC (National Identity Card)</label>
              <input type="text" name="nic" className="form-control" value={formData.nic} onChange={handleChange} placeholder="e.g. 209876543614" />
            </div>
            <div className="form-group">
              <label className="form-label">Date of Birth / Age</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input type="date" name="dob" className="form-control" value={formData.dob} onChange={handleChange} />
                <input type="number" name="age" className="form-control" value={formData.age} onChange={handleChange} placeholder="Age" style={{ width: '90px' }} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Gender</label>
              <select name="gender" className="form-control" value={formData.gender} onChange={handleChange}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Contact Number</label>
              <input type="tel" name="phone" className="form-control" value={formData.phone} onChange={handleChange} placeholder="0776260373" />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Address</label>
              <input type="text" name="address" className="form-control" value={formData.address} onChange={handleChange} placeholder="Residential address" />
            </div>
          </div>

          <h3 style={{ marginTop: '2rem', marginBottom: '1rem', paddingBottom: '0.5rem', color: 'var(--primary)', fontSize: '1.1rem' }}>
            Case Details
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Case Type *</label>
              <select name="caseType" className="form-control" value={formData.caseType} onChange={handleChange} required>
                <option value="clinical">Clinical Forensic</option>
                <option value="autopsy">Autopsy (Postmortem)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Sub Category</label>
              <select name="subCategory" className="form-control" value={formData.subCategory} onChange={handleChange}>
                <option value="Trauma / Accident">Trauma / Accident</option>
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
              <input type="datetime-local" name="incidentDate" className="form-control" value={formData.incidentDate} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Incident Location</label>
              <input type="text" name="incidentLocation" className="form-control" value={formData.incidentLocation} onChange={handleChange} placeholder="e.g. Kandy Town" />
            </div>
            
            {/* Dynamic Assigned Doctor Field */}
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Assigned JMO Doctor *</label>
              <select 
                name="assignedDoctorId" 
                className="form-control" 
                value={formData.assignedDoctorId} 
                onChange={handleChange} 
                required
              >
                {doctors.map((d) => (
                  <option key={d.DoctorID} value={d.DoctorID}>
                    Dr. {d.LastName} ({d.Specialization || 'JMO'}) — SLMC: {d.MedicalRegNo}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Brief Description of Incident</label>
              <textarea name="description" className="form-control" rows="3" value={formData.description} onChange={handleChange} placeholder="Describe incident details..."></textarea>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/cases')}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Creating Case...' : 'Submit & Register Case'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientRegistration;

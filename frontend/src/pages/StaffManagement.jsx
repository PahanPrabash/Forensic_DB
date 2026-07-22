import React, { useState, useEffect } from 'react';
import { staffAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const StaffManagement = () => {
  const { user } = useAuth();
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    role: 'Clerk',
    department: 'Forensic Medicine',
    phone: '',
    email: '',
    hireDate: new Date().toISOString().split('T')[0],
    // Doctor Credentials (Only JMO)
    medicalRegNo: '',
    specialization: 'Forensic Medicine',
    designation: 'Judicial Medical Officer',
    qualifications: 'MBBS'
  });

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await staffAPI.getAllStaff();
      if (res.success) {
        setStaffList(res.data || []);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || 'Failed to retrieve staff directory records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleStatus = async (staffId, currentStatus) => {
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const res = await staffAPI.updateStatus(staffId, !currentStatus);
      if (res.success) {
        setSuccessMessage('Staff member status updated!');
        fetchStaff();
      }
    } catch (err) {
      setErrorMessage(err.message || 'Permission denied. System Admin role required.');
    }
  };

  const handleDeleteStaff = async (staffId) => {
    if (window.confirm('Are you sure you want to permanently delete this staff member? This will delete their doctor credentials and user login account as well.')) {
      setErrorMessage('');
      setSuccessMessage('');
      try {
        const res = await staffAPI.deleteStaff(staffId);
        if (res.success) {
          setSuccessMessage('Staff member deleted successfully!');
          fetchStaff();
        }
      } catch (err) {
        setErrorMessage(err.message || 'Failed to delete staff member.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // 1. Create Staff Record
      const staffRes = await staffAPI.createStaff({
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.role,
        department: formData.department,
        phone: formData.phone,
        email: formData.email,
        hireDate: formData.hireDate
      });

      if (staffRes.success) {
        const newStaffId = staffRes.staffId;

        // 2. If JMO is selected, automatically register JMO Credentials
        if (formData.role === 'JMO') {
          if (!formData.medicalRegNo) {
            setErrorMessage('Medical Registration Number is required for JMO role.');
            return;
          }

          const docRes = await staffAPI.createDoctor({
            staffId: newStaffId,
            medicalRegNo: formData.medicalRegNo,
            specialization: formData.specialization,
            designation: formData.designation,
            qualifications: formData.qualifications
          });

          if (!docRes.success) {
            setErrorMessage('Staff member created, but Doctor credential linkage failed.');
            return;
          }
        }

        setSuccessMessage('Personnel added and credentials linked successfully!');
        setFormData({
          firstName: '',
          lastName: '',
          role: 'Clerk',
          department: 'Forensic Medicine',
          phone: '',
          email: '',
          hireDate: new Date().toISOString().split('T')[0],
          medicalRegNo: '',
          specialization: 'Forensic Medicine',
          designation: 'Judicial Medical Officer',
          qualifications: 'MBBS'
        });
        fetchStaff();
      } else {
        setErrorMessage(staffRes.message || 'Failed to create staff member');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Error submitting staff credentials');
    }
  };

  const isAdmin = user?.RoleName === 'System Administrator';

  return (
    <div className="page-content animate-slide-up">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Forensic Staff & Doctor Directory</h1>
        <p style={{ margin: 0, color: 'var(--text-muted)' }}>Manage forensic medical officers, lab technicians, clerical staff, and permissions.</p>
      </div>

      {successMessage && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)',
          color: '#34d399', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.875rem'
        }}>
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#f87171', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.875rem'
        }}>
          {errorMessage}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: isAdmin ? '2fr 1.3fr' : '1fr', gap: '2rem' }}>
        
        {/* Directory List */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ margin: '0 0 1.25rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ion-icon name="people-outline" style={{ color: 'var(--primary)' }}></ion-icon>
            Personnel Records
          </h3>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Staff ID</th>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Department</th>
                  <th>Contact Info</th>
                  <th>Credentials</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {staffList.length > 0 ? (
                  staffList.map((s) => (
                    <tr key={s.StaffID}>
                      <td style={{ fontFamily: 'monospace' }}>STF-{String(s.StaffID).padStart(3, '0')}</td>
                      <td><b>{s.FirstName} {s.LastName}</b></td>
                      <td>
                        <span className={`badge ${
                          s.Role === 'JMO' ? 'badge-primary' :
                          s.Role === 'Lab Technician' ? 'badge-success' : 'badge-secondary'
                        }`}>{s.Role}</span>
                      </td>
                      <td>{s.Department}</td>
                      <td>
                        <div style={{ fontSize: '0.8rem' }}>{s.Email}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.Phone}</div>
                      </td>
                      <td>
                        {s.Role === 'JMO' && s.MedicalRegNo ? (
                          <div style={{ fontSize: '0.78rem' }}>
                            <code style={{ color: '#3b82f6' }}>{s.MedicalRegNo}</code>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{s.Qualifications || 'MBBS'} ({s.Designation})</div>
                          </div>
                        ) : '--'}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(s.StaffID, s.IsActive)}
                            disabled={!isAdmin}
                            className={`btn ${s.IsActive ? 'btn-primary' : 'btn-secondary'}`}
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', cursor: isAdmin ? 'pointer' : 'default' }}
                          >
                            {s.IsActive ? 'Active' : 'Inactive'}
                          </button>
                          
                          {isAdmin && s.StaffID !== 1 && (
                            <button
                              type="button"
                              onClick={() => handleDeleteStaff(s.StaffID)}
                              className="btn btn-secondary"
                              style={{ 
                                padding: '0.25rem 0.5rem', 
                                fontSize: '0.75rem', 
                                background: 'rgba(239, 68, 68, 0.1)', 
                                borderColor: 'rgba(239, 68, 68, 0.3)', 
                                color: '#f87171' 
                              }}
                              title="Delete Personnel"
                            >
                              <ion-icon name="trash-outline" style={{ pointerEvents: 'none' }}></ion-icon>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                      {loading ? 'Fetching personnel directory...' : 'No staff members registered in database.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Personnel Form */}
        {isAdmin && (
          <div className="glass-panel" style={{ padding: '1.5rem', height: 'fit-content' }}>
            <h3 style={{ margin: '0 0 1.25rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ion-icon name="person-add-outline" style={{ color: 'var(--primary)' }}></ion-icon>
              Add New Staff Member
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">First Name *</label>
                <input type="text" name="firstName" className="form-control" value={formData.firstName} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label className="form-label">Last Name *</label>
                <input type="text" name="lastName" className="form-control" value={formData.lastName} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label className="form-label">System Role *</label>
                <select name="role" className="form-control" value={formData.role} onChange={handleChange} required>
                  <option value="Clerk">Registrar Clerk</option>
                  <option value="JMO">Judicial Medical Officer (JMO)</option>
                  <option value="Lab Technician">Lab Technician</option>
                  <option value="Nurse">Department Nurse</option>
                  <option value="Attendant">Attendant / Staff</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input type="text" name="phone" className="form-control" value={formData.phone} onChange={handleChange} />
                </div>
              </div>

              {/* JMO Doctor Fields */}
              {formData.role === 'JMO' && (
                <div style={{ background: 'rgba(59, 130, 246, 0.05)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.15)', marginTop: '1.25rem', marginBottom: '1.25rem' }}>
                  <h4 style={{ margin: '0 0 0.75rem', fontSize: '0.9rem', color: 'var(--primary)' }}>JMO Credentials</h4>
                  
                  <div className="form-group">
                    <label className="form-label">SLMC Medical Reg No. *</label>
                    <input type="text" name="medicalRegNo" className="form-control" value={formData.medicalRegNo} onChange={handleChange} placeholder="e.g. SLMC-45210" required />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Qualifications</label>
                    <input type="text" name="qualifications" className="form-control" value={formData.qualifications} onChange={handleChange} placeholder="e.g. MBBS, MD(Col)" />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Designation</label>
                    <input type="text" name="designation" className="form-control" value={formData.designation} onChange={handleChange} placeholder="Act. Consultant JMO" />
                  </div>
                </div>
              )}

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '0.85rem' }}>
                Add Personnel & Link
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};

export default StaffManagement;

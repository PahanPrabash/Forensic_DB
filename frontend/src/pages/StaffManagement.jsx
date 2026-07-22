import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { staffAPI, roleAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const StaffManagement = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('registry'); // 'registry' or 'permissions'
  
  // Staff Directory states
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Form State for new staff
  const [formData, setFormData] = useState({
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

  // Access Permissions states
  const [selectedRoleId, setSelectedRoleId] = useState(2); // Default to JMO
  const [permissions, setPermissions] = useState([]);
  const [loadingPerms, setLoadingPerms] = useState(false);
  const [roles, setRoles] = useState([]);

  const isAdmin = user?.RoleName === 'System Administrator';

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

  const fetchPermissions = async (roleId) => {
    setLoadingPerms(true);
    try {
      const res = await roleAPI.getPermissions(roleId);
      if (res.success) {
        setPermissions(res.data || []);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to load role permissions');
    } finally {
      setLoadingPerms(false);
    }
  };

  // Fetch initial directory list and roles list
  useEffect(() => {
    fetchStaff();
    
    if (isAdmin) {
      roleAPI.getAllRoles().then(res => {
        if (res.success) {
          // Exclude System Admin (RoleID 1) to avoid accidental lockout
          setRoles(res.data.filter(r => r.RoleID !== 1) || []);
        }
      }).catch(err => console.error('Error fetching roles:', err));
    }
  }, [isAdmin]);

  // Fetch permissions when permissions tab is selected or roleId changes
  useEffect(() => {
    if (activeTab === 'permissions' && isAdmin) {
      fetchPermissions(selectedRoleId);
    }
  }, [activeTab, selectedRoleId, isAdmin]);

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
        setSuccessMessage('Staff member status updated successfully!');
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

  const handleCheckboxToggle = async (moduleName, fieldName, currentValue) => {
    setErrorMessage('');
    setSuccessMessage('');
    
    // Find matching permission or set default
    const permObj = permissions.find(p => p.Module === moduleName) || {
      CanCreate: 0, CanRead: 0, CanUpdate: 0, CanDelete: 0
    };

    const updatedValue = currentValue === 1 ? 0 : 1;

    const payload = {
      module: moduleName,
      canCreate: fieldName === 'CanCreate' ? updatedValue : (permObj.CanCreate ? 1 : 0),
      canRead: fieldName === 'CanRead' ? updatedValue : (permObj.CanRead ? 1 : 0),
      canUpdate: fieldName === 'CanUpdate' ? updatedValue : (permObj.CanUpdate ? 1 : 0),
      canDelete: fieldName === 'CanDelete' ? updatedValue : (permObj.CanDelete ? 1 : 0),
    };

    try {
      const res = await roleAPI.updatePermission(selectedRoleId, payload);
      if (res.success) {
        setSuccessMessage(`Updated access rules for ${moduleName} successfully!`);
        fetchPermissions(selectedRoleId);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to update access permission rules.');
    }
  };

  return (
    <div className="page-content animate-slide-up">
      {/* Dynamic Header with Breadcrumbs */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
          <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--primary)' }}>
            <ion-icon name="home-outline"></ion-icon> Home
          </Link>
          <span>/</span>
          <span>Staff Directory</span>
        </div>
        <h1 style={{ fontSize: '1.75rem', margin: 0 }}>Forensic Staff & Doctor Directory</h1>
        <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-muted)' }}>Manage forensic medical officers, lab technicians, clerical staff, and permissions.</p>
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

      {/* Tabs Menu */}
      {isAdmin && (
        <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border)', marginBottom: '1.5rem' }}>
          <button 
            type="button" 
            onClick={() => setActiveTab('registry')}
            style={{ 
              padding: '0.75rem 1.5rem', cursor: 'pointer', fontWeight: '500', background: 'none', border: 'none',
              color: activeTab === 'registry' ? 'var(--primary)' : 'var(--text-muted)',
              borderBottom: activeTab === 'registry' ? '2px solid var(--primary)' : '2px solid transparent'
            }}
          >
            Personnel Directory
          </button>
          <button 
            type="button" 
            onClick={() => setActiveTab('permissions')}
            style={{ 
              padding: '0.75rem 1.5rem', cursor: 'pointer', fontWeight: '500', background: 'none', border: 'none',
              color: activeTab === 'permissions' ? 'var(--primary)' : 'var(--text-muted)',
              borderBottom: activeTab === 'permissions' ? '2px solid var(--primary)' : '2px solid transparent'
            }}
          >
            Access Permissions Manager
          </button>
        </div>
      )}

      {/* Tab 1: Personnel Directory */}
      {activeTab === 'registry' && (
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
                            s.Role === 'Clerk' ? 'badge-secondary' : 'badge-warning'
                          }`}>
                            {s.Role}
                          </span>
                        </td>
                        <td>{s.Department}</td>
                        <td style={{ fontSize: '0.8rem', lineHeight: '1.4' }}>
                          <div>{s.Email}</div>
                          <div style={{ color: 'var(--text-muted)' }}>{s.Phone}</div>
                        </td>
                        <td style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {s.MedicalRegNo ? (
                            <div>
                              <a href={`https://slmc.gov.lk`} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>
                                {s.MedicalRegNo}
                              </a>
                              <div>{s.Qualifications} ({s.Specialization})</div>
                            </div>
                          ) : '--'}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <button 
                              className={`btn ${s.IsActive ? 'btn-primary' : 'btn-secondary'}`}
                              onClick={() => handleToggleStatus(s.StaffID, s.IsActive)}
                              style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                            >
                              {s.IsActive ? 'Active' : 'Inactive'}
                            </button>
                            {isAdmin && s.StaffID !== 1 && (
                              <button 
                                className="btn btn-secondary"
                                onClick={() => handleDeleteStaff(s.StaffID)}
                                style={{ padding: '0.25rem 0.5rem', color: 'var(--danger)' }}
                                title="Delete Personnel"
                              >
                                <ion-icon name="trash-outline"></ion-icon>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2.5rem' }}>
                        No staff members registered in database.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Form Side panel */}
          {isAdmin && (
            <div className="glass-panel" style={{ padding: '1.5rem', height: 'fit-content' }}>
              <h3 style={{ margin: '0 0 1.25rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ion-icon name="person-add-outline" style={{ color: 'var(--primary)' }}></ion-icon>
                Add New Staff Member
              </h3>

              <form onSubmit={handleSubmit}>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label">First Name *</label>
                  <input type="text" name="firstName" className="form-control" value={formData.firstName} onChange={handleChange} required />
                </div>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label">LastName *</label>
                  <input type="text" name="lastName" className="form-control" value={formData.lastName} onChange={handleChange} required />
                </div>
                
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label">System Role *</label>
                  <select name="role" className="form-control" value={formData.role} onChange={handleChange} required>
                    <option value="JMO">Judicial Medical Officer (JMO)</option>
                    <option value="Clerk">Registrar Clerk</option>
                    <option value="Lab Technician">Laboratory Staff</option>
                    <option value="Other">Other Staff</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '1rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Email</label>
                    <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Phone</label>
                    <input type="text" name="phone" className="form-control" value={formData.phone} onChange={handleChange} />
                  </div>
                </div>

                {/* If JMO selected, display Doctor details */}
                {formData.role === 'JMO' && (
                  <div style={{ 
                    marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px dashed var(--border)',
                    animation: 'fadeIn 0.3s ease'
                  }}>
                    <h4 style={{ fontSize: '0.95rem', color: 'var(--primary)', marginBottom: '1rem' }}>JMO Doctor Credentials</h4>
                    
                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                      <label className="form-label">SLMC Registration No. *</label>
                      <input type="text" name="medicalRegNo" className="form-control" placeholder="e.g. SLMC-12345" value={formData.medicalRegNo} onChange={handleChange} />
                    </div>

                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                      <label className="form-label">Qualifications</label>
                      <input type="text" name="qualifications" className="form-control" placeholder="e.g. MBBS, MD" value={formData.qualifications} onChange={handleChange} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '1rem' }}>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Designation</label>
                        <input type="text" name="designation" className="form-control" value={formData.designation} onChange={handleChange} />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Specialization</label>
                        <input type="text" name="specialization" className="form-control" value={formData.specialization} onChange={handleChange} />
                      </div>
                    </div>
                  </div>
                )}

                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', marginTop: '1.5rem' }}>
                  Add Personnel & Link
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Access Permissions Manager */}
      {activeTab === 'permissions' && isAdmin && (
        <div className="glass-panel animate-slide-up" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ion-icon name="shield-half-outline" style={{ color: 'var(--primary)' }}></ion-icon>
              Access Permissions Control
            </h3>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <label className="form-label" style={{ margin: 0, fontWeight: '600' }}>Select Role to Manage:</label>
              <select 
                className="form-control" 
                value={selectedRoleId} 
                onChange={(e) => setSelectedRoleId(parseInt(e.target.value))}
                style={{ width: '250px', padding: '0.5rem' }}
              >
                {roles.map(r => (
                  <option key={r.RoleID} value={r.RoleID}>{r.RoleName}</option>
                ))}
              </select>
            </div>
          </div>

          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Toggle the checkboxes below to dynamically grant or revoke resource-level access permissions in the MySQL database grid.
          </p>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Database Module</th>
                  <th style={{ textAlign: 'center' }}>Create (C)</th>
                  <th style={{ textAlign: 'center' }}>Read (R)</th>
                  <th style={{ textAlign: 'center' }}>Update (U)</th>
                  <th style={{ textAlign: 'center' }}>Delete (D)</th>
                </tr>
              </thead>
              <tbody>
                {loadingPerms ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                      Loading permission grid registry...
                    </td>
                  </tr>
                ) : permissions.length > 0 ? (
                  permissions.map((p) => (
                    <tr key={p.Module}>
                      <td><b>{p.Module}</b></td>
                      <td style={{ textAlign: 'center' }}>
                        <input 
                          type="checkbox" 
                          checked={p.CanCreate === 1 || p.CanCreate === true} 
                          onChange={() => handleCheckboxToggle(p.Module, 'CanCreate', p.CanCreate)}
                          style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                        />
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <input 
                          type="checkbox" 
                          checked={p.CanRead === 1 || p.CanRead === true} 
                          onChange={() => handleCheckboxToggle(p.Module, 'CanRead', p.CanRead)}
                          style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                        />
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <input 
                          type="checkbox" 
                          checked={p.CanUpdate === 1 || p.CanUpdate === true} 
                          onChange={() => handleCheckboxToggle(p.Module, 'CanUpdate', p.CanUpdate)}
                          style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                        />
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <input 
                          type="checkbox" 
                          checked={p.CanDelete === 1 || p.CanDelete === true} 
                          onChange={() => handleCheckboxToggle(p.Module, 'CanDelete', p.CanDelete)}
                          style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                      No role permissions recorded in database.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;

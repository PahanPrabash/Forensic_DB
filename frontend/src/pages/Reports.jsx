import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { roleAPI } from '../services/api';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('reports'); // 'reports' or 'templates'
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Templates States
  const [templates, setTemplates] = useState([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateForm, setTemplateForm] = useState({
    templateName: '',
    templateType: 'MLR',
    templateContent: '',
    isActive: true
  });

  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/reports', { headers });
      const data = await res.json();
      setReports(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    setLoadingTemplates(true);
    try {
      const res = await fetch('http://localhost:5000/api/reports/templates', { headers });
      const json = await res.json();
      if (json.success) {
        setTemplates(json.data || []);
        if (json.data.length > 0 && !selectedTemplate) {
          handleSelectTemplate(json.data[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTemplates(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'reports') {
      fetchReports();
    } else {
      fetchTemplates();
    }
  }, [activeTab]);

  const handleSelectTemplate = (tpl) => {
    setSelectedTemplate(tpl);
    setTemplateForm({
      templateName: tpl.TemplateName,
      templateType: tpl.TemplateType,
      templateContent: tpl.TemplateContent || '',
      isActive: tpl.IsActive === 1 || tpl.IsActive === true
    });
  };

  const handleTemplateFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTemplateForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSaveTemplate = async (e) => {
    e.preventDefault();
    if (!selectedTemplate) return;
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await fetch(`http://localhost:5000/api/reports/templates/${selectedTemplate.TemplateID}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(templateForm)
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Report template updated successfully!');
        fetchTemplates();
      } else {
        setErrorMsg(data.error || 'Failed to update template');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Network error saving template');
    }
  };

  return (
    <div className="page-content animate-fade-in">
      {/* Header Breadcrumbs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
            <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--primary)' }}>
              <ion-icon name="home-outline"></ion-icon> Home
            </Link>
            <span>/</span>
            <span>Reports & Statistics</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', margin: 0 }}>Department Reports & Templates</h1>
        </div>
        <button className="btn btn-primary" onClick={() => window.print()}>
          <ion-icon name="print-outline"></ion-icon> Print Selected
        </button>
      </div>

      {successMsg && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)',
          color: '#34d399', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.875rem'
        }}>
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#f87171', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.875rem'
        }}>
          {errorMsg}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border)', marginBottom: '1.5rem' }}>
        <button 
          onClick={() => setActiveTab('reports')}
          style={{ 
            padding: '0.75rem 1.5rem', cursor: 'pointer', fontWeight: '500', background: 'none', border: 'none',
            color: activeTab === 'reports' ? 'var(--primary)' : 'var(--text-muted)',
            borderBottom: activeTab === 'reports' ? '2px solid var(--primary)' : '2px solid transparent'
          }}
        >
          Generated Reports
        </button>
        <button 
          onClick={() => setActiveTab('templates')}
          style={{ 
            padding: '0.75rem 1.5rem', cursor: 'pointer', fontWeight: '500', background: 'none', border: 'none',
            color: activeTab === 'templates' ? 'var(--primary)' : 'var(--text-muted)',
            borderBottom: activeTab === 'templates' ? '2px solid var(--primary)' : '2px solid transparent'
          }}
        >
          Boilerplate Template Editor
        </button>
      </div>

      {/* Tab 1: Generated Reports List */}
      {activeTab === 'reports' && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.15)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', textAlign: 'center', cursor: 'pointer' }}>
              <ion-icon name="document-text" style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '0.5rem' }}></ion-icon>
              <h4 style={{ margin: 0 }}>Medico-Legal Report (MLR)</h4>
              <p style={{ fontSize: '0.85rem', margin: '5px 0 0 0', color: 'var(--text-muted)' }}>Generate clinical court report</p>
            </div>
            <div style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.15)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', textAlign: 'center', cursor: 'pointer' }}>
              <ion-icon name="flask" style={{ fontSize: '2.5rem', color: 'var(--accent)', marginBottom: '0.5rem' }}></ion-icon>
              <h4 style={{ margin: 0 }}>Postmortem Report (PMR)</h4>
              <p style={{ fontSize: '0.85rem', margin: '5px 0 0 0', color: 'var(--text-muted)' }}>Generate autopsy report</p>
            </div>
            <div style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.15)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', textAlign: 'center', cursor: 'pointer' }}>
              <ion-icon name="stats-chart" style={{ fontSize: '2.5rem', color: 'var(--success)', marginBottom: '0.5rem' }}></ion-icon>
              <h4 style={{ margin: 0 }}>Monthly Statistics</h4>
              <p style={{ fontSize: '0.85rem', margin: '5px 0 0 0', color: 'var(--text-muted)' }}>Generate department statistics</p>
            </div>
          </div>

          <h3 style={{ marginTop: '2rem', fontSize: '1.1rem' }}>Recently Generated Reports</h3>
          
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Report ID</th>
                  <th>Type</th>
                  <th>Related Case</th>
                  <th>Generated By</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                      Loading reports...
                    </td>
                  </tr>
                ) : reports.length > 0 ? (
                  reports.map((r) => (
                    <tr key={r.ReportID}>
                      <td style={{ fontFamily: 'monospace' }}>REP-{String(r.ReportID).padStart(3, '0')}</td>
                      <td><span className="badge badge-primary">{r.ReportType || 'MLR'}</span></td>
                      <td>{r.CaseNumber}</td>
                      <td>{r.DoctorFirstName ? `Dr. ${r.DoctorFirstName} ${r.DoctorLastName}` : 'JMO Officer'}</td>
                      <td>{r.IssuedDate ? new Date(r.IssuedDate).toLocaleDateString() : 'N/A'}</td>
                      <td>
                        <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>
                          <ion-icon name="download-outline"></ion-icon> PDF
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2.5rem' }}>
                      No generated reports in database yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Boilerplate Templates Manager */}
      {activeTab === 'templates' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
          
          {/* Template Selectors Panel */}
          <div className="glass-panel" style={{ padding: '1.5rem', height: 'fit-content' }}>
            <h3 style={{ margin: '0 0 1.25rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ion-icon name="copy-outline" style={{ color: 'var(--primary)' }}></ion-icon>
              Boilerplate Files
            </h3>

            {loadingTemplates ? (
              <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)' }}>Loading...</div>
            ) : templates.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {templates.map(tpl => (
                  <div 
                    key={tpl.TemplateID} 
                    onClick={() => handleSelectTemplate(tpl)}
                    style={{
                      padding: '1rem',
                      borderRadius: '8px',
                      border: selectedTemplate?.TemplateID === tpl.TemplateID ? '1.5px solid var(--primary)' : '1px solid var(--border)',
                      background: selectedTemplate?.TemplateID === tpl.TemplateID ? 'var(--primary-soft)' : 'rgba(0,0,0,0.1)',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem', color: selectedTemplate?.TemplateID === tpl.TemplateID ? 'var(--primary)' : 'inherit' }}>
                      {tpl.TemplateName}
                    </h4>
                    <span className="badge badge-secondary" style={{ fontSize: '0.7rem' }}>{tpl.TemplateType}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                No templates seeded.
              </div>
            )}
          </div>

          {/* Template Editor Form Panel */}
          {selectedTemplate ? (
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h3 style={{ margin: '0 0 1.25rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ion-icon name="create-outline" style={{ color: 'var(--primary)' }}></ion-icon>
                Boilerplate Editor
              </h3>

              <form onSubmit={handleSaveTemplate}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '1rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Template Name *</label>
                    <input 
                      type="text" 
                      name="templateName" 
                      className="form-control" 
                      value={templateForm.templateName} 
                      onChange={handleTemplateFormChange} 
                      required 
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Template Type *</label>
                    <select 
                      name="templateType" 
                      className="form-control" 
                      value={templateForm.templateType} 
                      onChange={handleTemplateFormChange} 
                      required
                    >
                      <option value="MLR">Medico-Legal (MLR)</option>
                      <option value="PMR">Postmortem (PMR)</option>
                      <option value="Court Report">Court Report</option>
                      <option value="Statistical">Statistical</option>
                      <option value="Custom">Custom</option>
                    </select>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label className="form-label">Boilerplate Markup / Text Content *</label>
                  <textarea 
                    name="templateContent" 
                    className="form-control" 
                    rows="15" 
                    value={templateForm.templateContent} 
                    onChange={handleTemplateFormChange}
                    placeholder="Enter HTML template markup, keywords tags, or plain text boilerplate..."
                    required
                    style={{ fontFamily: 'monospace', fontSize: '0.9rem', lineHeight: '1.5' }}
                  ></textarea>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      name="isActive" 
                      checked={templateForm.isActive} 
                      onChange={handleTemplateFormChange} 
                      style={{ width: '18px', height: '18px' }}
                    />
                    Mark Template as Active
                  </label>
                  
                  <button type="submit" className="btn btn-primary" style={{ padding: '0.65rem 1.5rem' }}>
                    Save Boilerplate Changes
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="glass-panel" style={{ padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              Select a boilerplate template file from the left column to edit.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Reports;

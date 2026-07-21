import React, { useState } from 'react';

const ReferralsAndReviews = () => {
  const [activeTab, setActiveTab] = useState('referrals');
  const [showCreateReferral, setShowCreateReferral] = useState(false);
  const [showCreateReview, setShowCreateReview] = useState(false);

  // Sample referral data
  const referrals = [
    {
      id: 1, caseNumber: 'CW/2026/001', mlefNumber: 'MLEF/2026/001', patient: 'Kamal Jayasuriya',
      referredTo: 'Radiology — Teaching Hospital Peradeniya',
      referralDate: '2026-01-16', reason: 'X-ray of left rib cage to confirm suspected fractures of 5th and 6th ribs',
      responseReceived: true, responseDate: '2026-01-17',
      responseFindings: 'X-ray confirms non-displaced fractures of left 5th and 6th ribs. No pneumothorax. Conservative management advised.'
    },
    {
      id: 2, caseNumber: 'CW/2026/002', mlefNumber: 'MLEF/2026/002', patient: 'Nimal Rathnayake',
      referredTo: 'Psychiatry — Teaching Hospital Peradeniya',
      referralDate: '2026-02-10', reason: 'Psychological assessment for domestic violence victim — exhibits symptoms of PTSD and depression',
      responseReceived: true, responseDate: '2026-02-20',
      responseFindings: 'Patient diagnosed with PTSD and moderate depressive disorder. Commenced on counseling and pharmacotherapy. Follow-up scheduled.'
    },
    {
      id: 3, caseNumber: 'CW/2026/004', mlefNumber: 'MLEF/2026/004', patient: 'Child (Protected)',
      referredTo: 'Paediatrics — Teaching Hospital Peradeniya',
      referralDate: '2026-04-23', reason: 'Child abuse case — requires paediatric evaluation for growth assessment and nutritional status',
      responseReceived: false, responseDate: null, responseFindings: null
    },
    {
      id: 4, caseNumber: 'CW/2026/003', mlefNumber: 'MLEF/2026/003', patient: 'Sanduni Herath',
      referredTo: 'Gynaecology — Teaching Hospital Peradeniya',
      referralDate: '2026-03-11', reason: 'Specialist gynecological examination required for sexual assault case',
      responseReceived: true, responseDate: '2026-03-15',
      responseFindings: 'Detailed gynecological examination completed. Findings documented and sealed report submitted to JMO.'
    }
  ];

  // Sample review appointment data
  const reviews = [
    {
      id: 1, caseNumber: 'CW/2026/001', patient: 'Kamal Jayasuriya', phone: '0771234567',
      reviewType: 'Outpatient', scheduledDate: '2026-02-16', doctor: 'Dr. C. Wickramasinghe',
      notes: 'Review after 4 weeks to assess healing of rib fractures and document recovery progress for court report',
      status: 'Completed'
    },
    {
      id: 2, caseNumber: 'CW/2026/002', patient: 'Nimal Rathnayake', phone: '0782345678',
      reviewType: 'Outpatient', scheduledDate: '2026-03-09', doctor: 'Dr. N. Fernando',
      notes: 'Follow-up to assess new injuries and collect updated psychiatric report for MLR finalization',
      status: 'Scheduled'
    },
    {
      id: 3, caseNumber: 'CW/2026/004', patient: 'Child (Protected)', phone: '0764567890',
      reviewType: 'Inward', scheduledDate: '2026-05-23', doctor: 'Dr. N. Fernando',
      notes: 'Follow-up examination — reassess healing of ulna fracture and check for new injuries',
      status: 'Scheduled'
    },
    {
      id: 4, caseNumber: 'CW/2026/003', patient: 'Sanduni Herath', phone: '0793456789',
      reviewType: 'Outpatient', scheduledDate: '2026-04-11', doctor: 'Dr. C. Wickramasinghe',
      notes: 'Review appointment to discuss laboratory results and finalize MLR',
      status: 'Cancelled'
    }
  ];

  const getReviewStatusBadge = (status) => {
    const map = { 'Scheduled': 'badge-primary', 'Completed': 'badge-success', 'Cancelled': 'badge-danger' };
    return map[status] || 'badge-primary';
  };

  const getDepartmentIcon = (dept) => {
    if (dept.includes('Radiology')) return 'scan-outline';
    if (dept.includes('Psychiatry')) return 'happy-outline';
    if (dept.includes('Paediatrics')) return 'people-outline';
    if (dept.includes('Gynaecology')) return 'medkit-outline';
    return 'medical-outline';
  };

  const getDepartmentColor = (dept) => {
    if (dept.includes('Radiology')) return '#3b82f6';
    if (dept.includes('Psychiatry')) return '#8b5cf6';
    if (dept.includes('Paediatrics')) return '#f59e0b';
    if (dept.includes('Gynaecology')) return '#ec4899';
    return '#0ea5e9';
  };

  return (
    <div className="page-content animate-fade-in">
      {/* ─── Header ──────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700' }}>
            <ion-icon name="git-branch-outline" style={{ verticalAlign: 'middle', marginRight: '8px', color: 'var(--primary)' }}></ion-icon>
            Referrals & Review Appointments
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: '0.9rem' }}>Manage clinical referrals and patient follow-up reviews</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => activeTab === 'referrals' ? setShowCreateReferral(true) : setShowCreateReview(true)}
        >
          <ion-icon name="add-circle-outline"></ion-icon>
          {activeTab === 'referrals' ? 'New Referral' : 'Schedule Review'}
        </button>
      </div>

      {/* ─── Stats ───────────────────────────────────────────────────── */}
      <div className="grid-cards" style={{ marginBottom: '2rem' }}>
        <div className="glass-panel stat-card">
          <div className="stat-icon primary"><ion-icon name="git-branch-outline"></ion-icon></div>
          <div className="stat-info">
            <h3>{referrals.length}</h3>
            <p>Total Referrals</p>
          </div>
        </div>
        <div className="glass-panel stat-card">
          <div className="stat-icon success"><ion-icon name="checkmark-done-outline"></ion-icon></div>
          <div className="stat-info">
            <h3>{referrals.filter(r => r.responseReceived).length}</h3>
            <p>Responses Received</p>
          </div>
        </div>
        <div className="glass-panel stat-card">
          <div className="stat-icon warning"><ion-icon name="time-outline"></ion-icon></div>
          <div className="stat-info">
            <h3>{referrals.filter(r => !r.responseReceived).length}</h3>
            <p>Awaiting Response</p>
          </div>
        </div>
        <div className="glass-panel stat-card">
          <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' }}>
            <ion-icon name="calendar-outline"></ion-icon>
          </div>
          <div className="stat-info">
            <h3>{reviews.filter(r => r.status === 'Scheduled').length}</h3>
            <p>Upcoming Reviews</p>
          </div>
        </div>
      </div>

      {/* ─── Tab Switcher ────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: '0', marginBottom: '1.5rem' }}>
        {['referrals', 'reviews'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '0.75rem 2rem', cursor: 'pointer', fontWeight: '600', fontSize: '0.95rem',
              background: activeTab === tab ? 'var(--primary)' : 'var(--glass-bg)',
              color: activeTab === tab ? '#fff' : 'var(--text-muted)',
              border: activeTab === tab ? 'none' : '1px solid var(--border)',
              borderRadius: tab === 'referrals' ? 'var(--radius-sm) 0 0 var(--radius-sm)' : '0 var(--radius-sm) var(--radius-sm) 0',
              transition: 'all 0.2s'
            }}
          >
            <ion-icon name={tab === 'referrals' ? 'git-branch-outline' : 'calendar-outline'} style={{ verticalAlign: 'middle', marginRight: '6px' }}></ion-icon>
            {tab === 'referrals' ? 'Clinical Referrals' : 'Review Appointments'}
          </button>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* REFERRALS TAB                                                  */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {activeTab === 'referrals' && (
        <>
          {/* Create Referral Form */}
          {showCreateReferral && (
            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '1.5rem', borderLeft: '3px solid var(--primary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.15rem' }}>
                  <ion-icon name="add-circle" style={{ verticalAlign: 'middle', marginRight: '8px', color: 'var(--primary)' }}></ion-icon>
                  Create New Referral
                </h2>
                <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem' }} onClick={() => setShowCreateReferral(false)}>
                  <ion-icon name="close-outline"></ion-icon>
                </button>
              </div>
              <form>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div className="form-group">
                    <label className="form-label">Linked Case *</label>
                    <select className="form-control">
                      <option value="">Select case...</option>
                      <option>CW/2026/001 — Kamal Jayasuriya (Trauma)</option>
                      <option>CW/2026/002 — Nimal Rathnayake (Domestic Abuse)</option>
                      <option>CW/2026/003 — Sanduni Herath (Sexual Abuse)</option>
                      <option>CW/2026/004 — Child (Child Abuse)</option>
                      <option>CW/2026/005 — Ruwan Wijesinghe (Age Estimation)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Linked MLEF (optional)</label>
                    <select className="form-control">
                      <option value="">Select MLEF...</option>
                      <option>MLEF/2026/001</option>
                      <option>MLEF/2026/002</option>
                      <option>MLEF/2026/003</option>
                      <option>MLEF/2026/004</option>
                      <option>MLEF/2026/005</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Referred To *</label>
                    <select className="form-control">
                      <option value="">Select department...</option>
                      <option>Radiology — Teaching Hospital Peradeniya</option>
                      <option>Psychiatry — Teaching Hospital Peradeniya</option>
                      <option>Paediatrics — Teaching Hospital Peradeniya</option>
                      <option>Gynaecology — Teaching Hospital Peradeniya</option>
                      <option>Orthopaedics — Teaching Hospital Peradeniya</option>
                      <option>General Surgery — Teaching Hospital Peradeniya</option>
                      <option>Government Analyst Department</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Referral Date *</label>
                    <input type="date" className="form-control" />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Referral Reason *</label>
                    <textarea className="form-control" rows="3" placeholder="Describe the reason for this referral..."></textarea>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', paddingTop: '1rem' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowCreateReferral(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary"><ion-icon name="paper-plane-outline"></ion-icon> Submit Referral</button>
                </div>
              </form>
            </div>
          )}

          {/* Referral Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {referrals.map((ref) => (
              <div key={ref.id} className="glass-panel" style={{
                padding: '1.5rem', transition: 'transform 0.2s, box-shadow 0.2s',
                borderLeft: `3px solid ${getDepartmentColor(ref.referredTo)}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '42px', height: '42px', borderRadius: '10px', display: 'flex',
                      alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem',
                      background: `${getDepartmentColor(ref.referredTo)}15`,
                      color: getDepartmentColor(ref.referredTo)
                    }}>
                      <ion-icon name={getDepartmentIcon(ref.referredTo)}></ion-icon>
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.05rem' }}>{ref.referredTo}</h3>
                      <p style={{ margin: '2px 0 0', fontSize: '0.85rem' }}>
                        {ref.caseNumber} • {ref.patient} • {ref.mlefNumber}
                      </p>
                    </div>
                  </div>
                  <span className={`badge ${ref.responseReceived ? 'badge-success' : 'badge-warning'}`}>
                    {ref.responseReceived ? '✓ Response Received' : '⏳ Awaiting Response'}
                  </span>
                </div>

                <div style={{
                  padding: '0.75rem 1rem', background: 'rgba(0,0,0,0.15)', borderRadius: 'var(--radius-sm)',
                  marginBottom: ref.responseReceived ? '1rem' : '0', fontSize: '0.9rem', lineHeight: '1.6'
                }}>
                  <span style={{ color: 'var(--text-muted)', fontWeight: '500' }}>Reason: </span>
                  {ref.reason}
                </div>

                {ref.responseReceived && (
                  <div style={{
                    padding: '0.75rem 1rem',
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(16, 185, 129, 0.02))',
                    borderRadius: 'var(--radius-sm)', border: '1px solid rgba(16, 185, 129, 0.15)',
                    fontSize: '0.9rem', lineHeight: '1.6'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <ion-icon name="checkmark-circle" style={{ color: 'var(--success)' }}></ion-icon>
                      <span style={{ fontWeight: '600', color: 'var(--success)', fontSize: '0.82rem' }}>
                        Response ({ref.responseDate})
                      </span>
                    </div>
                    {ref.responseFindings}
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-light)' }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    <ion-icon name="calendar-outline" style={{ verticalAlign: 'middle', marginRight: '4px' }}></ion-icon>
                    Referred on {ref.referralDate}
                  </span>
                  {!ref.responseReceived && (
                    <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.82rem' }}>
                      <ion-icon name="create-outline"></ion-icon> Record Response
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* REVIEW APPOINTMENTS TAB                                        */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {activeTab === 'reviews' && (
        <>
          {/* Create Review Form */}
          {showCreateReview && (
            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '1.5rem', borderLeft: '3px solid #8b5cf6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.15rem' }}>
                  <ion-icon name="calendar" style={{ verticalAlign: 'middle', marginRight: '8px', color: '#8b5cf6' }}></ion-icon>
                  Schedule Review Appointment
                </h2>
                <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem' }} onClick={() => setShowCreateReview(false)}>
                  <ion-icon name="close-outline"></ion-icon>
                </button>
              </div>
              <form>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div className="form-group">
                    <label className="form-label">Case *</label>
                    <select className="form-control">
                      <option value="">Select case...</option>
                      <option>CW/2026/001 — Kamal Jayasuriya</option>
                      <option>CW/2026/002 — Nimal Rathnayake</option>
                      <option>CW/2026/003 — Sanduni Herath</option>
                      <option>CW/2026/004 — Child (Protected)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Review Type *</label>
                    <select className="form-control">
                      <option value="Outpatient">Outpatient</option>
                      <option value="Inward">Inward</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Scheduled Date & Time *</label>
                    <input type="datetime-local" className="form-control" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Assigned Doctor</label>
                    <select className="form-control">
                      <option>Dr. C. Wickramasinghe (Consultant JMO)</option>
                      <option>Dr. N. Fernando (Senior Registrar)</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Review Notes</label>
                    <textarea className="form-control" rows="3" placeholder="Purpose of the review appointment..."></textarea>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', paddingTop: '1rem' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowCreateReview(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" style={{ background: '#8b5cf6', boxShadow: '0 4px 14px rgba(139, 92, 246, 0.4)' }}>
                    <ion-icon name="calendar-outline"></ion-icon> Schedule Appointment
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Review Appointments Table */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.15rem' }}>Review Appointments</h2>
              <div style={{ display: 'flex', gap: '10px' }}>
                <select className="form-control" style={{ width: 'auto', padding: '0.5rem 1rem' }}>
                  <option value="">All Statuses</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Case</th>
                    <th>Patient</th>
                    <th>Type</th>
                    <th>Scheduled Date</th>
                    <th>Doctor</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((review) => (
                    <tr key={review.id}>
                      <td style={{ fontWeight: '600', color: 'var(--primary)' }}>{review.caseNumber}</td>
                      <td>
                        <div>{review.patient}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{review.phone}</div>
                      </td>
                      <td>
                        <span style={{
                          padding: '2px 10px', borderRadius: '4px', fontSize: '0.82rem', fontWeight: '500',
                          background: review.reviewType === 'Inward' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(14, 165, 233, 0.1)',
                          color: review.reviewType === 'Inward' ? '#f59e0b' : '#0ea5e9'
                        }}>
                          {review.reviewType}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <ion-icon name="calendar-outline" style={{ color: 'var(--text-muted)' }}></ion-icon>
                          {review.scheduledDate}
                        </div>
                      </td>
                      <td>{review.doctor}</td>
                      <td><span className={`badge ${getReviewStatusBadge(review.status)}`}>{review.status}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          {review.status === 'Scheduled' && (
                            <>
                              <button className="btn btn-secondary" style={{ padding: '0.35rem 0.6rem', fontSize: '0.78rem' }} title="Mark Completed">
                                <ion-icon name="checkmark-outline"></ion-icon>
                              </button>
                              <button className="btn btn-secondary" style={{ padding: '0.35rem 0.6rem', fontSize: '0.78rem' }} title="Cancel">
                                <ion-icon name="close-outline"></ion-icon>
                              </button>
                            </>
                          )}
                          <button className="btn btn-secondary" style={{ padding: '0.35rem 0.6rem', fontSize: '0.78rem' }} title="View Notes">
                            <ion-icon name="eye-outline"></ion-icon>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Upcoming Reviews Calendar-like Cards */}
          <div style={{ marginTop: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-main)' }}>
              <ion-icon name="notifications-outline" style={{ verticalAlign: 'middle', marginRight: '6px', color: '#8b5cf6' }}></ion-icon>
              Upcoming Reviews
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
              {reviews.filter(r => r.status === 'Scheduled').map((review) => (
                <div key={review.id} className="glass-panel" style={{
                  padding: '1.25rem', borderTop: '3px solid #8b5cf6',
                  transition: 'transform 0.2s'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1rem' }}>{review.patient}</h4>
                      <p style={{ margin: '2px 0 0', fontSize: '0.82rem' }}>{review.caseNumber}</p>
                    </div>
                    <span style={{
                      padding: '2px 10px', borderRadius: '4px', fontSize: '0.78rem', fontWeight: '600',
                      background: 'rgba(139, 92, 246, 0.15)', color: '#a78bfa'
                    }}>
                      {review.reviewType}
                    </span>
                  </div>

                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '8px', padding: '0.6rem 0.8rem',
                    background: 'rgba(139, 92, 246, 0.05)', borderRadius: 'var(--radius-sm)',
                    marginBottom: '0.75rem', border: '1px solid rgba(139, 92, 246, 0.1)'
                  }}>
                    <ion-icon name="calendar" style={{ color: '#8b5cf6', fontSize: '1.1rem' }}></ion-icon>
                    <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{review.scheduledDate}</span>
                  </div>

                  <p style={{ fontSize: '0.85rem', lineHeight: '1.5', margin: '0 0 0.75rem' }}>{review.notes}</p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border-light)' }}>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      <ion-icon name="person-outline" style={{ verticalAlign: 'middle', marginRight: '4px' }}></ion-icon>
                      {review.doctor}
                    </span>
                    <button className="btn btn-primary" style={{ padding: '0.35rem 0.8rem', fontSize: '0.8rem' }}>
                      <ion-icon name="checkmark-circle-outline"></ion-icon> Complete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ReferralsAndReviews;

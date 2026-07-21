// ═══════════════════════════════════════════════════════════════════════════
// Referral & Review Appointment Controller
// Member 3: Clinical Forensic Module
// ═══════════════════════════════════════════════════════════════════════════

import pool from '../config/db.js';

// ═══════════════════════════════════════════════════════════════════════════
// REFERRALS
// ═══════════════════════════════════════════════════════════════════════════

// ─── GET /api/referrals ─ List all referrals ────────────────────────────
export const getAllReferrals = async (req, res) => {
  try {
    const { caseId, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        ref.ReferralID, ref.ReferredTo, ref.ReferralDate, ref.ReferralReason,
        ref.ResponseReceived, ref.ResponseDate, ref.ResponseFindings,
        c.CaseNumber, c.SubCategory,
        m.MLEFNumber,
        CONCAT(p.FirstName, ' ', p.LastName) AS PatientName
      FROM Referral ref
      JOIN \`Case\` c ON ref.CaseID = c.CaseID
      JOIN Patient p ON c.PatientID = p.PatientID
      LEFT JOIN MedicoLegalExamForm m ON ref.MLEFID = m.MLEFID
    `;

    const params = [];
    if (caseId) {
      query += ` WHERE ref.CaseID = ?`;
      params.push(parseInt(caseId));
    }

    query += ` ORDER BY ref.ReferralDate DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));

    const [rows] = await pool.query(query, params);

    const [countResult] = await pool.query(
      `SELECT COUNT(*) AS total FROM Referral${caseId ? ' WHERE CaseID = ?' : ''}`,
      caseId ? [parseInt(caseId)] : []
    );

    res.json({
      data: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult[0].total,
        totalPages: Math.ceil(countResult[0].total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching referrals:', error);
    res.status(500).json({ error: 'Failed to fetch referral records' });
  }
};

// ─── POST /api/referrals ─ Create new referral ──────────────────────────
export const createReferral = async (req, res) => {
  try {
    const { CaseID, MLEFID, ReferredTo, ReferralDate, ReferralReason } = req.body;

    if (!CaseID || !ReferredTo || !ReferralDate) {
      return res.status(400).json({ error: 'CaseID, ReferredTo, and ReferralDate are required' });
    }

    const [result] = await pool.query(`
      INSERT INTO Referral (CaseID, MLEFID, ReferredTo, ReferralDate, ReferralReason)
      VALUES (?, ?, ?, ?, ?)
    `, [CaseID, MLEFID || null, ReferredTo, ReferralDate, ReferralReason]);

    res.status(201).json({
      message: 'Referral created successfully',
      data: { ReferralID: result.insertId }
    });
  } catch (error) {
    console.error('Error creating referral:', error);
    res.status(500).json({ error: 'Failed to create referral' });
  }
};

// ─── PUT /api/referrals/:id ─ Update referral (record response) ────────
export const updateReferral = async (req, res) => {
  try {
    const { id } = req.params;
    const { ResponseReceived, ResponseDate, ResponseFindings, ReferredTo, ReferralReason } = req.body;

    const [existing] = await pool.query(
      'SELECT ReferralID FROM Referral WHERE ReferralID = ?', [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: 'Referral not found' });
    }

    const [result] = await pool.query(`
      UPDATE Referral SET
        ReferredTo = COALESCE(?, ReferredTo),
        ReferralReason = COALESCE(?, ReferralReason),
        ResponseReceived = COALESCE(?, ResponseReceived),
        ResponseDate = COALESCE(?, ResponseDate),
        ResponseFindings = COALESCE(?, ResponseFindings)
      WHERE ReferralID = ?
    `, [ReferredTo, ReferralReason, ResponseReceived, ResponseDate, ResponseFindings, id]);

    res.json({ message: 'Referral updated successfully' });
  } catch (error) {
    console.error('Error updating referral:', error);
    res.status(500).json({ error: 'Failed to update referral' });
  }
};


// ═══════════════════════════════════════════════════════════════════════════
// REVIEW APPOINTMENTS
// ═══════════════════════════════════════════════════════════════════════════

// ─── GET /api/referrals/reviews ─ List review appointments ──────────────
export const getAllReviews = async (req, res) => {
  try {
    const { status, caseId, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        ra.ReviewID, ra.ReviewType, ra.ScheduledDate, ra.ReviewNotes, ra.Status,
        c.CaseNumber, c.SubCategory,
        CONCAT(p.FirstName, ' ', p.LastName) AS PatientName, p.Phone AS PatientPhone,
        CONCAT(s.FirstName, ' ', s.LastName) AS DoctorName
      FROM ReviewAppointment ra
      JOIN \`Case\` c ON ra.CaseID = c.CaseID
      JOIN Patient p ON ra.PatientID = p.PatientID
      LEFT JOIN Doctor d ON ra.DoctorID = d.DoctorID
      LEFT JOIN Staff s ON d.StaffID = s.StaffID
    `;

    const conditions = [];
    const params = [];

    if (status) {
      conditions.push('ra.Status = ?');
      params.push(status);
    }
    if (caseId) {
      conditions.push('ra.CaseID = ?');
      params.push(parseInt(caseId));
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += ` ORDER BY ra.ScheduledDate ASC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));

    const [rows] = await pool.query(query, params);

    res.json({ data: rows });
  } catch (error) {
    console.error('Error fetching review appointments:', error);
    res.status(500).json({ error: 'Failed to fetch review appointments' });
  }
};

// ─── POST /api/referrals/reviews ─ Schedule review appointment ──────────
export const createReview = async (req, res) => {
  try {
    const { CaseID, PatientID, ReviewType, ScheduledDate, DoctorID, ReviewNotes } = req.body;

    if (!CaseID || !PatientID || !ScheduledDate) {
      return res.status(400).json({ error: 'CaseID, PatientID, and ScheduledDate are required' });
    }

    const [result] = await pool.query(`
      INSERT INTO ReviewAppointment (CaseID, PatientID, ReviewType, ScheduledDate, DoctorID, ReviewNotes, Status)
      VALUES (?, ?, ?, ?, ?, ?, 'Scheduled')
    `, [CaseID, PatientID, ReviewType || 'Outpatient', ScheduledDate, DoctorID || null, ReviewNotes]);

    res.status(201).json({
      message: 'Review appointment scheduled successfully',
      data: { ReviewID: result.insertId }
    });
  } catch (error) {
    console.error('Error creating review appointment:', error);
    res.status(500).json({ error: 'Failed to schedule review appointment' });
  }
};

// ─── PUT /api/referrals/reviews/:id ─ Update review appointment status ──
export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { Status, ReviewNotes, ScheduledDate, DoctorID } = req.body;

    const [existing] = await pool.query(
      'SELECT ReviewID, Status FROM ReviewAppointment WHERE ReviewID = ?', [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: 'Review appointment not found' });
    }

    const [result] = await pool.query(`
      UPDATE ReviewAppointment SET
        Status = COALESCE(?, Status),
        ReviewNotes = COALESCE(?, ReviewNotes),
        ScheduledDate = COALESCE(?, ScheduledDate),
        DoctorID = COALESCE(?, DoctorID)
      WHERE ReviewID = ?
    `, [Status, ReviewNotes, ScheduledDate, DoctorID, id]);

    res.json({ message: 'Review appointment updated successfully' });
  } catch (error) {
    console.error('Error updating review appointment:', error);
    res.status(500).json({ error: 'Failed to update review appointment' });
  }
};

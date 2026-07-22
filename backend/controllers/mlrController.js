// ═══════════════════════════════════════════════════════════════════════════
// MLR Controller — Medico-Legal Report CRUD & Finalization
// Member 3: Clinical Forensic Module
// ═══════════════════════════════════════════════════════════════════════════

import pool from '../config/db.js';

// ─── GET /api/mlr ─ List all MLRs ───────────────────────────────────────
export const getAllMLRs = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        r.MLRID, r.MLRNumber, r.ReportDate, r.Status, r.CertificateOfReceipt,
        m.MLEFNumber, m.ExaminationDate AS MLEFDate,
        c.CaseNumber, c.CaseType, c.SubCategory,
        CONCAT(p.FirstName, ' ', p.LastName) AS PatientName,
        CONCAT(s.FirstName, ' ', s.LastName) AS PreparedByDoctor
      FROM MedicoLegalReport r
      JOIN MedicoLegalExamForm m ON r.MLEFID = m.MLEFID
      JOIN \`Case\` c ON r.CaseID = c.CaseID
      JOIN Patient p ON m.PatientID = p.PatientID
      LEFT JOIN Doctor d ON r.PreparedBy = d.DoctorID
      LEFT JOIN Staff s ON d.StaffID = s.StaffID
    `;

    const params = [];
    if (status) {
      query += ` WHERE r.Status = ?`;
      params.push(status);
    }

    query += ` ORDER BY r.ReportDate DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));

    const [rows] = await pool.query(query, params);

    const [countResult] = await pool.query(
      `SELECT COUNT(*) AS total FROM MedicoLegalReport${status ? ' WHERE Status = ?' : ''}`,
      status ? [status] : []
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
    console.error('Error fetching MLRs:', error);
    res.status(500).json({ error: 'Failed to fetch MLR records' });
  }
};

// ─── GET /api/mlr/:id ─ Get single MLR with full MLEF data ─────────────
export const getMLRById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(`
      SELECT 
        r.*,
        m.MLEFNumber, m.ExaminationDate, m.ReferralSource, m.LegalAuthorization,
        m.ClinicalFindings, m.Injuries, m.Opinion AS MLEFOpinion,
        c.CaseNumber, c.CaseType, c.SubCategory, c.IncidentDate, c.IncidentLocation,
        CONCAT(p.FirstName, ' ', p.LastName) AS PatientName, p.NIC, p.DateOfBirth, p.Gender,
        CONCAT(s.FirstName, ' ', s.LastName) AS PreparedByDoctor, d.MedicalRegNo, d.Designation
      FROM MedicoLegalReport r
      JOIN MedicoLegalExamForm m ON r.MLEFID = m.MLEFID
      JOIN \`Case\` c ON r.CaseID = c.CaseID
      JOIN Patient p ON m.PatientID = p.PatientID
      LEFT JOIN Doctor d ON r.PreparedBy = d.DoctorID
      LEFT JOIN Staff s ON d.StaffID = s.StaffID
      WHERE r.MLRID = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'MLR record not found' });
    }

    res.json({ data: rows[0] });
  } catch (error) {
    console.error('Error fetching MLR:', error);
    res.status(500).json({ error: 'Failed to fetch MLR record' });
  }
};

// ─── POST /api/mlr ─ Create new MLR from a linked MLEF ─────────────────
export const createMLR = async (req, res) => {
  try {
    const { MLRNumber, MLEFID, CaseID, PreparedBy, ReportDate, ReportContent, Conclusion } = req.body;

    if (!MLEFID || !CaseID || !ReportDate) {
      return res.status(400).json({ error: 'MLEFID, CaseID, and ReportDate are required' });
    }

    // Check that the MLEF exists and is in Issued status
    const [mlef] = await pool.query(
      'SELECT MLEFID, Status FROM MedicoLegalExamForm WHERE MLEFID = ?', [MLEFID]
    );

    if (mlef.length === 0) {
      return res.status(404).json({ error: 'Linked MLEF not found' });
    }

    // Check that no MLR already exists for this MLEF (1:1 relationship)
    const [existingMLR] = await pool.query(
      'SELECT MLRID FROM MedicoLegalReport WHERE MLEFID = ?', [MLEFID]
    );

    if (existingMLR.length > 0) {
      return res.status(409).json({ error: 'An MLR already exists for this MLEF' });
    }

    const [result] = await pool.query(`
      INSERT INTO MedicoLegalReport 
        (MLRNumber, MLEFID, CaseID, PreparedBy, ReportDate, ReportContent, Conclusion, Status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'Draft')
    `, [MLRNumber, MLEFID, CaseID, PreparedBy, ReportDate, ReportContent, Conclusion]);

    res.status(201).json({
      message: 'MLR created successfully',
      data: { MLRID: result.insertId, MLRNumber }
    });
  } catch (error) {
    console.error('Error creating MLR:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'MLR number already exists or MLEF already linked' });
    }
    res.status(500).json({ error: 'Failed to create MLR record' });
  }
};

// ─── PUT /api/mlr/:id ─ Update draft MLR ────────────────────────────────
export const updateMLR = async (req, res) => {
  try {
    const { id } = req.params;
    const { ReportContent, Conclusion, ReportDate } = req.body;

    // Check if MLR exists and is in Draft status
    const [existing] = await pool.query(
      'SELECT Status FROM MedicoLegalReport WHERE MLRID = ?', [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: 'MLR record not found' });
    }

    if (existing[0].Status !== 'Draft') {
      return res.status(400).json({
        error: `Cannot edit MLR in "${existing[0].Status}" status. Only Draft MLRs can be modified.`
      });
    }

    const [result] = await pool.query(`
      UPDATE MedicoLegalReport SET
        ReportContent = COALESCE(?, ReportContent),
        Conclusion = COALESCE(?, Conclusion),
        ReportDate = COALESCE(?, ReportDate)
      WHERE MLRID = ? AND Status = 'Draft'
    `, [ReportContent, Conclusion, ReportDate, id]);

    res.json({ message: 'MLR updated successfully' });
  } catch (error) {
    console.error('Error updating MLR:', error);
    res.status(500).json({ error: 'Failed to update MLR record' });
  }
};

// ─── PUT /api/mlr/issue/:id ─ Finalize/Issue an MLR ────────────────────
export const issueMLR = async (req, res) => {
  try {
    const { id } = req.params;
    const { CertificateOfReceipt } = req.body;

    // Check current status
    const [existing] = await pool.query(
      'SELECT Status, ReportContent, Conclusion FROM MedicoLegalReport WHERE MLRID = ?', [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: 'MLR record not found' });
    }

    if (existing[0].Status !== 'Draft') {
      return res.status(400).json({
        error: `MLR is already "${existing[0].Status}". Only Draft MLRs can be finalized.`
      });
    }

    // Ensure report has content before finalizing
    if (!existing[0].ReportContent || !existing[0].Conclusion) {
      return res.status(400).json({
        error: 'Cannot finalize MLR without ReportContent and Conclusion'
      });
    }

    const [result] = await pool.query(`
      UPDATE MedicoLegalReport SET
        Status = 'Finalized',
        CertificateOfReceipt = ?
      WHERE MLRID = ? AND Status = 'Draft'
    `, [CertificateOfReceipt, id]);

    if (result.affectedRows === 0) {
      return res.status(400).json({ error: 'Failed to finalize MLR' });
    }

    res.json({
      message: 'MLR finalized successfully. The report is now locked from further editing.',
      data: { MLRID: parseInt(id), Status: 'Finalized', CertificateOfReceipt }
    });
  } catch (error) {
    console.error('Error finalizing MLR:', error);
    res.status(500).json({ error: 'Failed to finalize MLR' });
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// MLEF Controller — Medico-Legal Examination Form CRUD Operations
// Member 3: Clinical Forensic Module
// ═══════════════════════════════════════════════════════════════════════════

import pool from '../config/db.js';

// ─── GET /api/mlef ─ List all MLEFs with pagination & filtering ──────────
export const getAllMLEFs = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        m.MLEFID, m.MLEFNumber, m.ExaminationDate, m.ReferralSource,
        m.LegalAuthorization, m.Status, m.IssuedDate, m.PoliceCopyIssued,
        c.CaseNumber, c.CaseType, c.SubCategory,
        CONCAT(p.FirstName, ' ', p.LastName) AS PatientName, p.NIC,
        CONCAT(s.FirstName, ' ', s.LastName) AS DoctorName, d.MedicalRegNo
      FROM MedicoLegalExamForm m
      JOIN \`Case\` c ON m.CaseID = c.CaseID
      JOIN Patient p ON m.PatientID = p.PatientID
      LEFT JOIN Doctor d ON m.ExaminingDoctorID = d.DoctorID
      LEFT JOIN Staff s ON d.StaffID = s.StaffID
    `;

    const params = [];
    if (status) {
      query += ` WHERE m.Status = ?`;
      params.push(status);
    }

    query += ` ORDER BY m.ExaminationDate DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));

    const [rows] = await pool.query(query, params);

    // Get total count for pagination
    const [countResult] = await pool.query(
      `SELECT COUNT(*) AS total FROM MedicoLegalExamForm${status ? ' WHERE Status = ?' : ''}`,
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
    console.error('Error fetching MLEFs:', error);
    res.status(500).json({ error: 'Failed to fetch MLEF records' });
  }
};

// ─── GET /api/mlef/:id ─ Get single MLEF with full details ──────────────
export const getMLEFById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(`
      SELECT 
        m.*,
        c.CaseNumber, c.CaseType, c.SubCategory, c.IncidentDate, c.Description AS CaseDescription,
        CONCAT(p.FirstName, ' ', p.LastName) AS PatientName, p.NIC, p.DateOfBirth, p.Gender, p.Address, p.Phone AS PatientPhone,
        CONCAT(s.FirstName, ' ', s.LastName) AS DoctorName, d.MedicalRegNo, d.Specialization, d.Designation
      FROM MedicoLegalExamForm m
      JOIN \`Case\` c ON m.CaseID = c.CaseID
      JOIN Patient p ON m.PatientID = p.PatientID
      LEFT JOIN Doctor d ON m.ExaminingDoctorID = d.DoctorID
      LEFT JOIN Staff s ON d.StaffID = s.StaffID
      WHERE m.MLEFID = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'MLEF record not found' });
    }

    res.json({ data: rows[0] });
  } catch (error) {
    console.error('Error fetching MLEF:', error);
    res.status(500).json({ error: 'Failed to fetch MLEF record' });
  }
};

// ─── POST /api/mlef ─ Create new MLEF ───────────────────────────────────
export const createMLEF = async (req, res) => {
  try {
    const {
      MLEFNumber, CaseID, PatientID, ExaminingDoctorID,
      ExaminationDate, ReferralSource, LegalAuthorization,
      ClinicalFindings, Injuries, Opinion
    } = req.body;

    // Validate required fields
    if (!MLEFNumber || !CaseID || !PatientID || !ExaminationDate) {
      return res.status(400).json({ error: 'MLEFNumber, CaseID, PatientID, and ExaminationDate are required' });
    }

    const [result] = await pool.query(`
      INSERT INTO MedicoLegalExamForm 
        (MLEFNumber, CaseID, PatientID, ExaminingDoctorID, ExaminationDate, 
         ReferralSource, LegalAuthorization, ClinicalFindings, Injuries, Opinion, Status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Draft')
    `, [MLEFNumber, CaseID, PatientID, ExaminingDoctorID, ExaminationDate,
        ReferralSource, LegalAuthorization, ClinicalFindings, Injuries, Opinion]);

    res.status(201).json({
      message: 'MLEF created successfully',
      data: { MLEFID: result.insertId, MLEFNumber }
    });
  } catch (error) {
    console.error('Error creating MLEF:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'MLEF number already exists' });
    }
    res.status(500).json({ error: 'Failed to create MLEF record' });
  }
};

// ─── PUT /api/mlef/:id ─ Update draft MLEF ──────────────────────────────
export const updateMLEF = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      ExaminationDate, ReferralSource, LegalAuthorization,
      ClinicalFindings, Injuries, Opinion, Status, IssuedDate, PoliceCopyIssued
    } = req.body;

    // Check if MLEF exists and is editable
    const [existing] = await pool.query(
      'SELECT Status FROM MedicoLegalExamForm WHERE MLEFID = ?', [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: 'MLEF record not found' });
    }

    if (existing[0].Status === 'Issued' && Status !== 'Issued') {
      return res.status(400).json({ error: 'Cannot modify an Issued MLEF' });
    }

    const [result] = await pool.query(`
      UPDATE MedicoLegalExamForm SET
        ExaminationDate = COALESCE(?, ExaminationDate),
        ReferralSource = COALESCE(?, ReferralSource),
        LegalAuthorization = COALESCE(?, LegalAuthorization),
        ClinicalFindings = COALESCE(?, ClinicalFindings),
        Injuries = COALESCE(?, Injuries),
        Opinion = COALESCE(?, Opinion),
        Status = COALESCE(?, Status),
        IssuedDate = COALESCE(?, IssuedDate),
        PoliceCopyIssued = COALESCE(?, PoliceCopyIssued)
      WHERE MLEFID = ?
    `, [ExaminationDate, ReferralSource, LegalAuthorization,
        ClinicalFindings, Injuries, Opinion, Status, IssuedDate, PoliceCopyIssued, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'MLEF record not found' });
    }

    res.json({ message: 'MLEF updated successfully' });
  } catch (error) {
    console.error('Error updating MLEF:', error);
    res.status(500).json({ error: 'Failed to update MLEF record' });
  }
};

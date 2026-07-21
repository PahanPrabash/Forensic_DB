import pool from '../config/db.js';

/**
 * GET /api/mlef
 * List all Medico-Legal Examination Forms.
 */
export const getMLEFs = async (req, res, next) => {
  try {
    const [mlefs] = await pool.execute(
      `SELECT m.MLEFID, m.MLEFNumber, m.ExaminationDate, m.Status, m.ReferralSource, m.IssuedDate,
              c.CaseNumber, c.CaseType,
              CONCAT(p.FirstName, ' ', p.LastName) AS PatientName,
              CONCAT('Dr. ', s.LastName) AS DoctorName
       FROM MedicoLegalExamForm m
       JOIN \`Case\` c ON m.CaseID = c.CaseID
       JOIN Patient p ON m.PatientID = p.PatientID
       LEFT JOIN Doctor d ON m.ExaminingDoctorID = d.DoctorID
       LEFT JOIN Staff s ON d.StaffID = s.StaffID
       ORDER BY m.ExaminationDate DESC`
    );

    res.json(mlefs);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/mlef/:id
 * Get single MLEF with all details.
 */
export const getMLEFById = async (req, res, next) => {
  try {
    const [mlefs] = await pool.execute(
      `SELECT m.*,
              c.CaseNumber, c.CaseType, c.SubCategory,
              CONCAT(p.FirstName, ' ', p.LastName) AS PatientName, p.PatientID,
              CONCAT('Dr. ', s.FirstName, ' ', s.LastName) AS DoctorName, d.DoctorID
       FROM MedicoLegalExamForm m
       JOIN \`Case\` c ON m.CaseID = c.CaseID
       JOIN Patient p ON m.PatientID = p.PatientID
       LEFT JOIN Doctor d ON m.ExaminingDoctorID = d.DoctorID
       LEFT JOIN Staff s ON d.StaffID = s.StaffID
       WHERE m.MLEFID = ?`,
      [req.params.id]
    );

    if (mlefs.length === 0) {
      return res.status(404).json({ error: 'MLEF not found.' });
    }

    // Get related referrals
    const [referrals] = await pool.execute(
      `SELECT * FROM Referral WHERE MLEFID = ? ORDER BY ReferralDate DESC`,
      [req.params.id]
    );

    res.json({ ...mlefs[0], referrals });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/mlef
 * Create a new MLEF.
 */
export const createMLEF = async (req, res, next) => {
  try {
    const {
      caseId, patientId, examiningDoctorId, examinationDate,
      referralSource, legalAuthorization, clinicalFindings, injuries, opinion,
    } = req.body;

    if (!caseId || !patientId || !examinationDate) {
      return res.status(400).json({ error: 'Case ID, Patient ID, and Examination Date are required.' });
    }

    // Generate MLEF number
    const [[{ cnt }]] = await pool.execute(`SELECT COUNT(*) AS cnt FROM MedicoLegalExamForm`);
    const mlefNumber = `MLEF/${new Date().getFullYear()}/${String(cnt + 1).padStart(3, '0')}`;

    const [result] = await pool.execute(
      `INSERT INTO MedicoLegalExamForm
       (MLEFNumber, CaseID, PatientID, ExaminingDoctorID, ExaminationDate, ReferralSource, LegalAuthorization, ClinicalFindings, Injuries, Opinion, Status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Draft')`,
      [mlefNumber, caseId, patientId, examiningDoctorId || null, examinationDate,
       referralSource || null, legalAuthorization || null, clinicalFindings || null, injuries || null, opinion || null]
    );

    res.status(201).json({
      message: 'MLEF created successfully.',
      mlefId: result.insertId,
      mlefNumber,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/mlef/:id
 * Update an MLEF (save draft or finalize).
 */
export const updateMLEF = async (req, res, next) => {
  try {
    const {
      referralSource, legalAuthorization, clinicalFindings, injuries, opinion,
      status, examinationDate,
    } = req.body;
    const mlefId = req.params.id;

    const fields = [];
    const params = [];

    if (referralSource !== undefined) { fields.push('ReferralSource = ?'); params.push(referralSource); }
    if (legalAuthorization !== undefined) { fields.push('LegalAuthorization = ?'); params.push(legalAuthorization); }
    if (clinicalFindings !== undefined) { fields.push('ClinicalFindings = ?'); params.push(clinicalFindings); }
    if (injuries !== undefined) { fields.push('Injuries = ?'); params.push(injuries); }
    if (opinion !== undefined) { fields.push('Opinion = ?'); params.push(opinion); }
    if (examinationDate) { fields.push('ExaminationDate = ?'); params.push(examinationDate); }
    if (status) {
      fields.push('Status = ?');
      params.push(status);
      if (status === 'Issued') {
        fields.push('IssuedDate = CURDATE()');
      }
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields to update.' });
    }

    params.push(mlefId);
    await pool.execute(`UPDATE MedicoLegalExamForm SET ${fields.join(', ')} WHERE MLEFID = ?`, params);

    res.json({ message: 'MLEF updated successfully.' });
  } catch (err) {
    next(err);
  }
};

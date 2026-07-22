import pool from '../config/db.js';

/**
 * GET /api/cases
 * List cases with optional search, type filter, and status filter.
 */
export const getCases = async (req, res, next) => {
  try {
    const { search, type, status } = req.query;

    let query = `
      SELECT c.CaseID, c.CaseNumber, c.CaseType, c.SubCategory, c.IncidentDate, c.Status, c.CreatedAt,
             CONCAT(p.FirstName, ' ', p.LastName) AS PatientName, p.NIC,
             CONCAT('Dr. ', s.LastName) AS DoctorName
      FROM \`Case\` c
      LEFT JOIN Patient p ON c.PatientID = p.PatientID
      LEFT JOIN Doctor d ON c.AssignedDoctorID = d.DoctorID
      LEFT JOIN Staff s ON d.StaffID = s.StaffID
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      query += ` AND (c.CaseNumber LIKE ? OR p.FirstName LIKE ? OR p.LastName LIKE ? OR p.NIC LIKE ?)`;
      const term = `%${search}%`;
      params.push(term, term, term, term);
    }

    if (type) {
      query += ` AND c.CaseType = ?`;
      params.push(type === 'clinical' ? 'Clinical' : 'Autopsy');
    }

    if (status) {
      const statusMap = { open: 'Open', closed: 'Closed', court: 'Pending Court', investigation: 'Under Investigation' };
      if (statusMap[status]) {
        query += ` AND c.Status = ?`;
        params.push(statusMap[status]);
      }
    }

    query += ` ORDER BY c.CreatedAt DESC LIMIT 50`;

    const [cases] = await pool.execute(query, params);
    res.json(cases);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/cases/:id
 * Get single case with patient, doctor, and history.
 */
export const getCaseById = async (req, res, next) => {
  try {
    const [cases] = await pool.execute(
      `SELECT c.*, 
              CONCAT(p.FirstName, ' ', p.LastName) AS PatientName, p.NIC, p.Gender, p.DateOfBirth, p.Phone AS PatientPhone,
              CONCAT('Dr. ', s.LastName) AS DoctorName, d.DoctorID, d.Specialization
       FROM \`Case\` c
       LEFT JOIN Patient p ON c.PatientID = p.PatientID
       LEFT JOIN Doctor d ON c.AssignedDoctorID = d.DoctorID
       LEFT JOIN Staff s ON d.StaffID = s.StaffID
       WHERE c.CaseID = ?`,
      [req.params.id]
    );

    if (cases.length === 0) {
      return res.status(404).json({ error: 'Case not found.' });
    }

    // Get case history
    const [history] = await pool.execute(
      `SELECT ch.*, CONCAT(s.FirstName, ' ', s.LastName) AS ActionByName
       FROM CaseHistory ch
       LEFT JOIN User u ON ch.ActionBy = u.UserID
       LEFT JOIN Staff s ON u.StaffID = s.StaffID
       WHERE ch.CaseID = ?
       ORDER BY ch.ActionDate DESC`,
      [req.params.id]
    );

    res.json({ ...cases[0], history });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/cases/:id
 * Update a case's status or details.
 */
export const updateCase = async (req, res, next) => {
  try {
    const { status, subCategory, description, assignedDoctorId } = req.body;
    const caseId = req.params.id;

    const fields = [];
    const params = [];

    if (status) { fields.push('Status = ?'); params.push(status); }
    if (subCategory) { fields.push('SubCategory = ?'); params.push(subCategory); }
    if (description) { fields.push('Description = ?'); params.push(description); }
    if (assignedDoctorId) { fields.push('AssignedDoctorID = ?'); params.push(assignedDoctorId); }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields to update.' });
    }

    params.push(caseId);
    await pool.execute(`UPDATE \`Case\` SET ${fields.join(', ')} WHERE CaseID = ?`, params);

    // Log to history
    await pool.execute(
      `INSERT INTO CaseHistory (CaseID, ActionDate, ActionDescription, ActionBy)
       VALUES (?, NOW(), ?, ?)`,
      [caseId, `Case updated: ${fields.map(f => f.split(' =')[0]).join(', ')}`, req.user.userId]
    );

    res.json({ message: 'Case updated successfully.' });
  } catch (err) {
    next(err);
  }
};

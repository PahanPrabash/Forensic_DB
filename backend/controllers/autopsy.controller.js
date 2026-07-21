import pool from '../config/db.js';

/**
 * GET /api/autopsy
 * List all postmortem records.
 */
export const getAutopsies = async (req, res, next) => {
  try {
    const [autopsies] = await pool.execute(
      `SELECT pm.PostmortemID, pm.PMNumber, pm.DeathType, pm.DeathSource, pm.AutopsyDate, pm.Status,
              c.CaseNumber, c.CaseType,
              CONCAT(p.FirstName, ' ', p.LastName) AS DeceasedName,
              CONCAT('Dr. ', s.LastName) AS DoctorName
       FROM Postmortem pm
       JOIN \`Case\` c ON pm.CaseID = c.CaseID
       LEFT JOIN Patient p ON pm.DeceasedPatientID = p.PatientID
       LEFT JOIN Doctor d ON pm.PerformingDoctorID = d.DoctorID
       LEFT JOIN Staff s ON d.StaffID = s.StaffID
       ORDER BY pm.AutopsyDate DESC`
    );

    res.json(autopsies);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/autopsy/:id
 * Get single postmortem with cause of death.
 */
export const getAutopsyById = async (req, res, next) => {
  try {
    const [autopsies] = await pool.execute(
      `SELECT pm.*,
              c.CaseNumber,
              CONCAT(p.FirstName, ' ', p.LastName) AS DeceasedName,
              CONCAT('Dr. ', s.FirstName, ' ', s.LastName) AS DoctorName
       FROM Postmortem pm
       JOIN \`Case\` c ON pm.CaseID = c.CaseID
       LEFT JOIN Patient p ON pm.DeceasedPatientID = p.PatientID
       LEFT JOIN Doctor d ON pm.PerformingDoctorID = d.DoctorID
       LEFT JOIN Staff s ON d.StaffID = s.StaffID
       WHERE pm.PostmortemID = ?`,
      [req.params.id]
    );

    if (autopsies.length === 0) {
      return res.status(404).json({ error: 'Postmortem record not found.' });
    }

    // Get cause of death if exists
    const [cod] = await pool.execute(
      `SELECT * FROM CauseOfDeath WHERE PostmortemID = ?`,
      [req.params.id]
    );

    // Get inquest orders
    const [inquests] = await pool.execute(
      `SELECT * FROM InquestOrder WHERE PostmortemID = ? ORDER BY IssuedDate DESC`,
      [req.params.id]
    );

    res.json({
      ...autopsies[0],
      causeOfDeath: cod.length > 0 ? cod[0] : null,
      inquestOrders: inquests,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/autopsy
 * Create a new postmortem record.
 */
export const createAutopsy = async (req, res, next) => {
  try {
    const {
      caseId, deceasedPatientId, deathType, deathSource, autopsyDate,
      performingDoctorId, preAutopsyInfo, externalFindings, internalFindings, pmrContent,
    } = req.body;

    if (!caseId || !autopsyDate) {
      return res.status(400).json({ error: 'Case ID and Autopsy Date are required.' });
    }

    // Generate PM number
    const [[{ cnt }]] = await pool.execute(`SELECT COUNT(*) AS cnt FROM Postmortem`);
    const pmNumber = `PM-${new Date().getFullYear()}-${String(cnt + 1).padStart(3, '0')}`;

    const [result] = await pool.execute(
      `INSERT INTO Postmortem
       (PMNumber, CaseID, DeceasedPatientID, DeathType, DeathSource, AutopsyDate, PerformingDoctorID, PreAutopsyInfo, ExternalFindings, InternalFindings, PMRContent, Status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending')`,
      [pmNumber, caseId, deceasedPatientId || null, deathType || null, deathSource || null,
       autopsyDate, performingDoctorId || null, preAutopsyInfo || null, externalFindings || null,
       internalFindings || null, pmrContent || null]
    );

    res.status(201).json({
      message: 'Postmortem record created.',
      postmortemId: result.insertId,
      pmNumber,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/autopsy/:id
 * Update a postmortem record.
 */
export const updateAutopsy = async (req, res, next) => {
  try {
    const {
      deathType, deathSource, preAutopsyInfo, externalFindings,
      internalFindings, pmrContent, status,
    } = req.body;
    const pmId = req.params.id;

    const fields = [];
    const params = [];

    if (deathType) { fields.push('DeathType = ?'); params.push(deathType); }
    if (deathSource) { fields.push('DeathSource = ?'); params.push(deathSource); }
    if (preAutopsyInfo !== undefined) { fields.push('PreAutopsyInfo = ?'); params.push(preAutopsyInfo); }
    if (externalFindings !== undefined) { fields.push('ExternalFindings = ?'); params.push(externalFindings); }
    if (internalFindings !== undefined) { fields.push('InternalFindings = ?'); params.push(internalFindings); }
    if (pmrContent !== undefined) { fields.push('PMRContent = ?'); params.push(pmrContent); }
    if (status) { fields.push('Status = ?'); params.push(status); }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields to update.' });
    }

    params.push(pmId);
    await pool.execute(`UPDATE Postmortem SET ${fields.join(', ')} WHERE PostmortemID = ?`, params);

    res.json({ message: 'Postmortem updated successfully.' });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/autopsy/:id/cause-of-death
 * Create or update cause of death for a postmortem.
 */
export const upsertCauseOfDeath = async (req, res, next) => {
  try {
    const pmId = req.params.id;
    const {
      immediateCause, antecedentCause1, antecedentCause2,
      underlyingCause, otherSignificantConditions, mannerOfDeath,
    } = req.body;

    if (!immediateCause) {
      return res.status(400).json({ error: 'Immediate cause is required.' });
    }

    // Check if COD already exists
    const [existing] = await pool.execute(
      `SELECT CODID FROM CauseOfDeath WHERE PostmortemID = ?`,
      [pmId]
    );

    if (existing.length > 0) {
      // Update
      await pool.execute(
        `UPDATE CauseOfDeath SET
         ImmediateCause = ?, AntecedentCause1 = ?, AntecedentCause2 = ?,
         UnderlyingCause = ?, OtherSignificantConditions = ?, MannerOfDeath = ?, IssuedDate = CURDATE()
         WHERE PostmortemID = ?`,
        [immediateCause, antecedentCause1 || null, antecedentCause2 || null,
         underlyingCause || null, otherSignificantConditions || null, mannerOfDeath || null, pmId]
      );
      res.json({ message: 'Cause of death updated.' });
    } else {
      // Insert
      // Get doctor ID from user's staff record
      let issuedBy = null;
      if (req.user.staffId) {
        const [docs] = await pool.execute(`SELECT DoctorID FROM Doctor WHERE StaffID = ?`, [req.user.staffId]);
        if (docs.length > 0) issuedBy = docs[0].DoctorID;
      }

      await pool.execute(
        `INSERT INTO CauseOfDeath
         (PostmortemID, ImmediateCause, AntecedentCause1, AntecedentCause2, UnderlyingCause, OtherSignificantConditions, MannerOfDeath, IssuedDate, IssuedBy)
         VALUES (?, ?, ?, ?, ?, ?, ?, CURDATE(), ?)`,
        [pmId, immediateCause, antecedentCause1 || null, antecedentCause2 || null,
         underlyingCause || null, otherSignificantConditions || null, mannerOfDeath || null, issuedBy]
      );
      res.status(201).json({ message: 'Cause of death created.' });
    }
  } catch (err) {
    next(err);
  }
};

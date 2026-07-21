import pool from '../config/db.js';

export const getAllAutopsies = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.*, c.CaseNumber, pat.FirstName, pat.LastName
      FROM Postmortem p
      LEFT JOIN \`Case\` c ON p.CaseID = c.CaseID
      LEFT JOIN Patient pat ON p.DeceasedPatientID = pat.PatientID
      ORDER BY p.AutopsyDate DESC
    `);
    res.json({ data: rows });
  } catch (error) {
    console.error('Error fetching autopsies:', error);
    res.status(500).json({ error: 'Failed to fetch autopsies' });
  }
};

export const createAutopsy = async (req, res) => {
  try {
    const { caseId, deceasedPatientId, deathType, deathSource, autopsyDate, externalFindings, internalFindings, doctorId, pmNumber } = req.body;

    const [result] = await pool.query(
      `INSERT INTO Postmortem 
      (PMNumber, CaseID, DeceasedPatientID, DeathType, DeathSource, AutopsyDate, PerformingDoctorID, ExternalFindings, InternalFindings, Status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Completed')`,
      [pmNumber || `PM-${Date.now()}`, caseId, deceasedPatientId || null, deathType, deathSource, autopsyDate, doctorId || null, externalFindings, internalFindings]
    );

    res.status(201).json({ message: 'Autopsy logged successfully', postmortemId: result.insertId });
  } catch (error) {
    console.error('Error creating autopsy:', error);
    res.status(500).json({ error: 'Failed to log autopsy' });
  }
};

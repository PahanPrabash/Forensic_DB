import pool from '../config/db.js';

export const getAllEvidence = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT e.*, c.CaseNumber, s.FirstName as CollectorFirstName, s.LastName as CollectorLastName
      FROM Evidence e
      LEFT JOIN \`Case\` c ON e.CaseID = c.CaseID
      LEFT JOIN Staff s ON e.CollectedBy = s.StaffID
      ORDER BY e.CollectedDate DESC
    `);
    res.json({ data: rows });
  } catch (error) {
    console.error('Error fetching evidence:', error);
    res.status(500).json({ error: 'Failed to fetch evidence' });
  }
};

export const createEvidence = async (req, res) => {
  try {
    const { caseId, evidenceType, description, collectedDate, collectedBy, storageLocation, barcode } = req.body;

    // Check if Case exists, if not just use a mock CaseID or fail
    if (!caseId) {
      return res.status(400).json({ error: 'Case ID is required' });
    }

    const [result] = await pool.query(
      `INSERT INTO Evidence 
      (CaseID, EvidenceType, Description, CollectedDate, CollectedBy, StorageLocation, BarcodeQR) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [caseId, evidenceType, description, collectedDate || new Date(), collectedBy || null, storageLocation, barcode || null]
    );

    res.status(201).json({ message: 'Evidence logged successfully', evidenceId: result.insertId });
  } catch (error) {
    console.error('Error creating evidence:', error);
    res.status(500).json({ error: 'Failed to log evidence' });
  }
};

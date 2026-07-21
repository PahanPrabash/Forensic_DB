import pool from '../config/db.js';

export const getAllReports = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT r.*, c.CaseNumber, s.FirstName as DoctorFirstName, s.LastName as DoctorLastName
      FROM CourtReport r
      LEFT JOIN \`Case\` c ON r.CaseID = c.CaseID
      LEFT JOIN Doctor d ON r.IssuedBy = d.DoctorID
      LEFT JOIN Staff s ON d.StaffID = s.StaffID
      ORDER BY r.IssuedDate DESC
    `);
    res.json({ data: rows });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
};

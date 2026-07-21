import pool from '../config/db.js';

export const getAllCases = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT c.*, 
             p.FirstName as PatientFirstName, p.LastName as PatientLastName, p.NIC,
             d.MedicalRegNo, s.FirstName as DoctorFirstName, s.LastName as DoctorLastName
      FROM \`Case\` c
      LEFT JOIN Patient p ON c.PatientID = p.PatientID
      LEFT JOIN Doctor d ON c.AssignedDoctorID = d.DoctorID
      LEFT JOIN Staff s ON d.StaffID = s.StaffID
      ORDER BY c.CreatedAt DESC
    `);
    res.json({ data: rows });
  } catch (error) {
    console.error('Error fetching cases:', error);
    res.status(500).json({ error: 'Failed to fetch cases' });
  }
};

export const createCase = async (req, res) => {
  try {
    const { caseNumber, caseType, subCategory, incidentDate, incidentLocation, description, status, patientId, doctorId, createdBy } = req.body;

    const [result] = await pool.query(
      `INSERT INTO \`Case\` 
      (CaseNumber, CaseType, SubCategory, IncidentDate, IncidentLocation, Description, Status, PatientID, AssignedDoctorID, CreatedBy) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [caseNumber, caseType, subCategory, incidentDate, incidentLocation, description, status || 'Open', patientId || null, doctorId || null, createdBy || null]
    );

    res.status(201).json({ message: 'Case created successfully', caseId: result.insertId });
  } catch (error) {
    console.error('Error creating case:', error);
    res.status(500).json({ error: 'Failed to create case' });
  }
};

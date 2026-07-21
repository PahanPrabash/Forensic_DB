import pool from '../config/db.js';

export const getAllPatients = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Patient ORDER BY RegisteredDate DESC');
    res.json({ data: rows });
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ error: 'Failed to fetch patients' });
  }
};

export const createPatient = async (req, res) => {
  try {
    const { firstName, lastName, dateOfBirth, gender, nic, address, phone, emergencyContact, bloodGroup } = req.body;

    // Calculate age if dateOfBirth is provided
    let age = null;
    if (dateOfBirth) {
      const dob = new Date(dateOfBirth);
      const diff_ms = Date.now() - dob.getTime();
      const age_dt = new Date(diff_ms); 
      age = Math.abs(age_dt.getUTCFullYear() - 1970);
    }

    const [result] = await pool.query(
      `INSERT INTO Patient 
      (FirstName, LastName, DateOfBirth, Age, Gender, NIC, Address, Phone, EmergencyContact, BloodGroup) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [firstName, lastName, dateOfBirth || null, age, gender, nic || null, address, phone, emergencyContact, bloodGroup]
    );

    res.status(201).json({ message: 'Patient registered successfully', patientId: result.insertId });
  } catch (error) {
    console.error('Error creating patient:', error);
    res.status(500).json({ error: 'Failed to register patient' });
  }
};

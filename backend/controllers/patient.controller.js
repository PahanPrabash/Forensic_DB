import pool from '../config/db.js';

/**
 * GET /api/patients
 * List all patients with optional search.
 */
export const getPatients = async (req, res, next) => {
  try {
    const { search } = req.query;
    let query = `SELECT * FROM Patient ORDER BY RegisteredDate DESC`;
    let params = [];

    if (search) {
      query = `SELECT * FROM Patient
               WHERE FirstName LIKE ? OR LastName LIKE ? OR NIC LIKE ?
               ORDER BY RegisteredDate DESC`;
      const term = `%${search}%`;
      params = [term, term, term];
    }

    const [patients] = await pool.execute(query, params);
    res.json(patients);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/patients/:id
 * Get single patient by ID.
 */
export const getPatientById = async (req, res, next) => {
  try {
    const [patients] = await pool.execute(
      `SELECT * FROM Patient WHERE PatientID = ?`,
      [req.params.id]
    );

    if (patients.length === 0) {
      return res.status(404).json({ error: 'Patient not found.' });
    }

    res.json(patients[0]);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/patients
 * Create a new patient AND a linked case (combined registration form).
 * This matches the PatientRegistration.jsx form which collects both.
 */
export const createPatientWithCase = async (req, res, next) => {
  try {
    const {
      // Patient fields
      firstName, lastName, nic, dateOfBirth, age, gender, phone, address,
      // Case fields
      caseType, subCategory, incidentDate, incidentLocation, description, assignedDoctorId,
    } = req.body;

    if (!firstName || !lastName || !gender) {
      return res.status(400).json({ error: 'First name, last name, and gender are required.' });
    }

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      // 1. Insert Patient
      const [patientResult] = await conn.execute(
        `INSERT INTO Patient (FirstName, LastName, NIC, DateOfBirth, Age, Gender, Phone, Address)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [firstName, lastName, nic || null, dateOfBirth || null, age || null, gender, phone || null, address || null]
      );
      const patientId = patientResult.insertId;

      // 2. Insert Case (leave CaseNumber empty so trigger auto-generates it)
      const [caseResult] = await conn.execute(
        `INSERT INTO \`Case\` (CaseNumber, CaseType, SubCategory, IncidentDate, IncidentLocation, Description, PatientID, AssignedDoctorID, CreatedBy)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          '',
          caseType || 'Clinical',
          subCategory || null,
          incidentDate || new Date().toISOString().split('T')[0],
          incidentLocation || null,
          description || null,
          patientId,
          assignedDoctorId || null,
          req.user.userId,
        ]
      );

      // 3. Fetch the trigger-generated CaseNumber from database
      const [[dbCase]] = await conn.execute(
        `SELECT CaseNumber FROM \`Case\` WHERE CaseID = ?`,
        [caseResult.insertId]
      );
      const caseNumber = dbCase.CaseNumber;

      // 4. Log case history
      await conn.execute(
        `INSERT INTO CaseHistory (CaseID, ActionDate, ActionDescription, ActionBy)
         VALUES (?, NOW(), ?, ?)`,
        [caseResult.insertId, 'Case created with patient registration', req.user.userId]
      );

      await conn.commit();

      res.status(201).json({
        message: 'Patient and case created successfully.',
        patientId,
        caseId: caseResult.insertId,
        caseNumber,
      });
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/doctors
 * List all doctors for dropdown selections.
 */
export const getDoctors = async (req, res, next) => {
  try {
    const [doctors] = await pool.execute(
      `SELECT d.DoctorID, d.MedicalRegNo, d.Specialization, d.Designation,
              s.FirstName, s.LastName, CONCAT('Dr. ', s.FirstName, ' ', s.LastName) AS FullName
       FROM Doctor d
       JOIN Staff s ON d.StaffID = s.StaffID
       WHERE s.IsActive = TRUE
       ORDER BY s.LastName`
    );

    res.json(doctors);
  } catch (err) {
    next(err);
  }
};

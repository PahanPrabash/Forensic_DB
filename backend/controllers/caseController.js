import pool from '../config/db.js';

// @desc    Get all cases with patient and assigned doctor details
// @route   GET /api/cases
// @access  Private
export const getCases = async (req, res) => {
  const { type, status, search } = req.query;

  try {
    let query = `
      SELECT c.CaseID, c.CaseNumber, c.CaseType, c.SubCategory, c.IncidentDate, 
             c.IncidentLocation, c.Description, c.Status, c.CreatedAt,
             p.PatientID, p.FirstName AS PatientFirstName, p.LastName AS PatientLastName, p.NIC, p.Gender, p.Phone,
             s.FirstName AS DoctorFirstName, s.LastName AS DoctorLastName
      FROM \`Case\` c
      LEFT JOIN Patient p ON c.PatientID = p.PatientID
      LEFT JOIN Doctor d ON c.AssignedDoctorID = d.DoctorID
      LEFT JOIN Staff s ON d.StaffID = s.StaffID
      WHERE 1=1
    `;

    const params = [];

    if (type) {
      query += ' AND c.CaseType = ?';
      params.push(type);
    }

    if (status) {
      query += ' AND c.Status = ?';
      params.push(status);
    }

    if (search) {
      query += ' AND (c.CaseNumber LIKE ? OR p.FirstName LIKE ? OR p.LastName LIKE ? OR p.NIC LIKE ?)';
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern, searchPattern);
    }

    query += ' ORDER BY c.CreatedAt DESC';

    const [cases] = await pool.query(query, params);

    res.json({
      success: true,
      count: cases.length,
      data: cases
    });
  } catch (error) {
    console.error('getCases Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch case records', error: error.message });
  }
};

// @desc    Create new Patient and Case Record
// @route   POST /api/cases
// @access  Private
export const createCase = async (req, res) => {
  const {
    firstName, lastName, nic, dob, age, gender, phone, address,
    caseType, subCategory, incidentDate, incidentLocation, description, assignedDoctorId
  } = req.body;

  if (!firstName || !lastName || !caseType) {
    return res.status(400).json({ success: false, message: 'Patient First Name, Last Name, and Case Type are required' });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Check or Insert Patient
    let patientId;
    if (nic && nic.trim() !== '') {
      const [existingPatient] = await connection.query('SELECT PatientID FROM Patient WHERE NIC = ?', [nic.trim()]);
      if (existingPatient.length > 0) {
        patientId = existingPatient[0].PatientID;
      }
    }

    if (!patientId) {
      const formattedDob = dob && dob.trim() !== '' ? dob : null;
      const parsedAge = age ? parseInt(age) : null;

      const [patientResult] = await connection.query(
        `INSERT INTO Patient (FirstName, LastName, DateOfBirth, Age, Gender, NIC, Address, Phone, RegisteredDate)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [firstName.trim(), lastName.trim(), formattedDob, parsedAge, gender || 'Other', nic ? nic.trim() : null, address || null, phone || null]
      );
      patientId = patientResult.insertId;
    }

    // 2. Generate Unique Case Number (CAS-2026-001, etc.)
    const year = new Date().getFullYear();
    const [[{ caseCount }]] = await connection.query('SELECT COUNT(*) AS caseCount FROM `Case`');
    const seqNum = String(caseCount + 1).padStart(3, '0');
    const caseNumber = `CAS-${year}-${seqNum}`;

    // 3. Validate Assigned Doctor ID
    let docId = assignedDoctorId ? parseInt(assignedDoctorId) : null;
    if (docId) {
      const [docCheck] = await connection.query('SELECT DoctorID FROM Doctor WHERE DoctorID = ?', [docId]);
      if (docCheck.length === 0) {
        // Fallback to first available doctor or NULL
        const [firstDoc] = await connection.query('SELECT DoctorID FROM Doctor LIMIT 1');
        docId = firstDoc.length > 0 ? firstDoc[0].DoctorID : null;
      }
    }

    // 4. Format Incident Date (YYYY-MM-DD)
    let formattedIncidentDate = new Date().toISOString().split('T')[0];
    if (incidentDate && incidentDate.trim() !== '') {
      formattedIncidentDate = incidentDate.split('T')[0];
    }

    // 5. Insert Case Record into `Case` table
    const createdByUserId = req.user ? req.user.UserID : null;

    const [caseResult] = await connection.query(
      `INSERT INTO \`Case\`
         (CaseNumber, CaseType, SubCategory, IncidentDate, IncidentLocation, Description, Status, PatientID, AssignedDoctorID, CreatedBy, CreatedAt, UpdatedAt)
       VALUES (?, ?, ?, ?, ?, ?, 'Open', ?, ?, ?, NOW(), NOW())`,
      [
        caseNumber,
        caseType.toLowerCase() === 'autopsy' ? 'Autopsy' : 'Clinical',
        subCategory || 'General',
        formattedIncidentDate,
        incidentLocation || null,
        description || null,
        patientId,
        docId,
        createdByUserId
      ]
    );

    // 6. Log Action in CaseHistory if table exists
    try {
      await connection.query(
        `INSERT INTO CaseHistory (CaseID, ActionDate, ActionDescription, ActionBy)
         VALUES (?, NOW(), 'Case registered and created', ?)`,
        [caseResult.insertId, createdByUserId]
      );
    } catch (historyErr) {
      console.warn('CaseHistory Insert Notice:', historyErr.message);
    }

    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'New case created successfully',
      caseId: caseResult.insertId,
      caseNumber,
      patientId
    });
  } catch (error) {
    await connection.rollback();
    console.error('createCase Error Details:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to create new case',
      error: error.message 
    });
  } finally {
    connection.release();
  }
};

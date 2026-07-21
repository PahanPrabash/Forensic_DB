import pool from '../config/db.js';

// @desc    Get all staff members
// @route   GET /api/staff
// @access  Private
export const getAllStaff = async (req, res) => {
  try {
    const [staff] = await pool.query(
      `SELECT s.*, d.DoctorID, d.MedicalRegNo, d.Specialization, d.Designation
       FROM Staff s
       LEFT JOIN Doctor d ON s.StaffID = d.StaffID
       ORDER BY s.LastName, s.FirstName`
    );
    res.json({ success: true, count: staff.length, data: staff });
  } catch (error) {
    console.error('getAllStaff Error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve staff records', error: error.message });
  }
};

// @desc    Create new staff member
// @route   POST /api/staff
// @access  Private (Admin)
export const createStaff = async (req, res) => {
  const { firstName, lastName, role, department, phone, email, hireDate } = req.body;

  if (!firstName || !lastName || !role) {
    return res.status(400).json({ success: false, message: 'First name, last name, and role are required' });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO Staff (FirstName, LastName, Role, Department, Phone, Email, HireDate, IsActive)
       VALUES (?, ?, ?, ?, ?, ?, ?, TRUE)`,
      [firstName, lastName, role, department || 'Forensic Medicine', phone || null, email || null, hireDate || new Date().toISOString().split('T')[0]]
    );

    res.status(201).json({
      success: true,
      message: 'Staff member added successfully',
      staffId: result.insertId
    });
  } catch (error) {
    console.error('createStaff Error:', error);
    res.status(500).json({ success: false, message: 'Failed to add staff member', error: error.message });
  }
};

// @desc    Get all registered doctors (JMOs)
// @route   GET /api/staff/doctors
// @access  Private
export const getAllDoctors = async (req, res) => {
  try {
    const [doctors] = await pool.query(
      `SELECT d.DoctorID, d.MedicalRegNo, d.Specialization, d.Designation, d.Qualifications,
              s.StaffID, s.FirstName, s.LastName, s.Phone, s.Email
       FROM Doctor d
       JOIN Staff s ON d.StaffID = s.StaffID
       WHERE s.IsActive = TRUE`
    );
    res.json({ success: true, count: doctors.length, data: doctors });
  } catch (error) {
    console.error('getAllDoctors Error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve doctors list' });
  }
};

// @desc    Create / register new doctor record
// @route   POST /api/staff/doctors
// @access  Private (Admin)
export const createDoctor = async (req, res) => {
  const { staffId, medicalRegNo, specialization, designation, qualifications } = req.body;

  if (!staffId || !medicalRegNo) {
    return res.status(400).json({ success: false, message: 'StaffID and MedicalRegNo are required' });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO Doctor (StaffID, MedicalRegNo, Specialization, Designation, Qualifications)
       VALUES (?, ?, ?, ?, ?)`,
      [staffId, medicalRegNo, specialization || 'Forensic Medicine', designation || 'Judicial Medical Officer', qualifications || 'MBBS']
    );

    res.status(201).json({
      success: true,
      message: 'Doctor registered successfully',
      doctorId: result.insertId
    });
  } catch (error) {
    console.error('createDoctor Error:', error);
    res.status(500).json({ success: false, message: 'Failed to register doctor', error: error.message });
  }
};

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

// Helper: Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'forensic_med_secret_key_2026_uop', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  const { username, password } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Please provide username and password' });
  }

  try {
    const [users] = await pool.query(
      `SELECT u.UserID, u.Username, u.PasswordHash, u.StaffID, u.RoleID, u.IsActive, r.RoleName,
              s.FirstName, s.LastName, s.Email
       FROM User u
       JOIN Role r ON u.RoleID = r.RoleID
       LEFT JOIN Staff s ON u.StaffID = s.StaffID
       WHERE u.Username = ?`,
      [username]
    );

    if (users.length === 0) {
      await pool.query(
        "INSERT INTO AuditLog (Action, TableAffected, RecordID, NewValue, IPAddress) VALUES ('FAILED_LOGIN', 'User', NULL, ?, ?)",
        [JSON.stringify({ AttemptedUsername: username, Reason: 'Username not found' }), ip]
      );
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    const user = users[0];

    if (!user.IsActive) {
      await pool.query(
        "INSERT INTO AuditLog (UserID, Action, TableAffected, RecordID, NewValue, IPAddress) VALUES (?, 'FAILED_LOGIN', 'User', ?, ?, ?)",
        [user.UserID, user.UserID, JSON.stringify({ AttemptedUsername: username, Reason: 'Account is deactivated' }), ip]
      );
      return res.status(403).json({ success: false, message: 'Account is deactivated. Contact System Admin.' });
    }

    const isMatch = await bcrypt.compare(password, user.PasswordHash);
    if (!isMatch) {
      await pool.query(
        "INSERT INTO AuditLog (UserID, Action, TableAffected, RecordID, NewValue, IPAddress) VALUES (?, 'FAILED_LOGIN', 'User', ?, ?, ?)",
        [user.UserID, user.UserID, JSON.stringify({ AttemptedUsername: username, Reason: 'Incorrect password' }), ip]
      );
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    // Update last login timestamp
    await pool.query('UPDATE User SET LastLogin = NOW() WHERE UserID = ?', [user.UserID]);

    // Audit Success Login
    await pool.query(
      "INSERT INTO AuditLog (UserID, Action, TableAffected, RecordID, NewValue, IPAddress) VALUES (?, 'LOGIN', 'User', ?, 'Session authenticated successfully', ?)",
      [user.UserID, user.UserID, ip]
    );

    const token = generateToken(user.UserID);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.UserID,
        username: user.Username,
        roleId: user.RoleID,
        role: user.RoleName,
        staffId: user.StaffID,
        firstName: user.FirstName || user.Username,
        lastName: user.LastName || '',
        email: user.Email || ''
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ success: false, message: 'Server error during authentication', error: error.message });
  }
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public (or Admin)
export const register = async (req, res) => {
  const { username, password, roleId, staffId, email } = req.body;

  if (!username || !password || !roleId) {
    return res.status(400).json({ success: false, message: 'Username, password, and roleId are required' });
  }

  try {
    // 1. Check if username already exists
    const [existing] = await pool.query('SELECT UserID FROM User WHERE Username = ?', [username]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Username already taken' });
    }

    let finalStaffId = null;

    // 2. Double verification for non-admin accounts
    if (parseInt(roleId) !== 1) {
      if (!staffId || !email) {
        return res.status(400).json({ success: false, message: 'Staff ID and registered Email Address are required for this role.' });
      }

      // Parse formatted Staff ID (e.g. "STF-002" or "stf-002" or "2" into integer 2)
      let parsedStaffId;
      const cleanStaffId = String(staffId).trim().toUpperCase();
      if (cleanStaffId.startsWith('STF-')) {
        parsedStaffId = parseInt(cleanStaffId.replace('STF-', ''), 10);
      } else {
        parsedStaffId = parseInt(cleanStaffId, 10);
      }

      if (isNaN(parsedStaffId)) {
        return res.status(400).json({ success: false, message: 'Invalid Staff ID format. Please use the format STF-001.' });
      }

      // Fetch staff details by ID
      const [staffRows] = await pool.query(
        'SELECT StaffID, Role, Email, IsActive FROM Staff WHERE StaffID = ?',
        [parsedStaffId]
      );

      if (staffRows.length === 0) {
        return res.status(400).json({ success: false, message: `Staff ID STF-${String(parsedStaffId).padStart(3, '0')} not found in the directory.` });
      }

      const staff = staffRows[0];

      if (!staff.IsActive) {
        return res.status(400).json({ success: false, message: 'Staff profile is currently marked as Inactive. Contact Admin.' });
      }

      // Verify email combination
      if (staff.Email.trim().toLowerCase() !== email.trim().toLowerCase()) {
        return res.status(400).json({ success: false, message: 'Registered Email Address does not match the provided Staff ID.' });
      }

      // Verify role mapping compatibility
      // RoleID 2 -> JMO, RoleID 3 -> Clerk, RoleID 4 -> Lab Technician
      const selectedRoleId = parseInt(roleId);
      const isJmoMatch = (selectedRoleId === 2 && staff.Role === 'JMO');
      const isClerkMatch = (selectedRoleId === 3 && staff.Role === 'Clerk');
      const isLabMatch = (selectedRoleId === 4 && staff.Role === 'Lab Technician');

      if (!isJmoMatch && !isClerkMatch && !isLabMatch) {
        return res.status(400).json({ success: false, message: `Selected role does not match the registered staff directory profile (${staff.Role}).` });
      }

      // Verify if a login account is already linked to this StaffID
      const [existingUser] = await pool.query('SELECT UserID FROM User WHERE StaffID = ?', [staff.StaffID]);
      if (existingUser.length > 0) {
        return res.status(400).json({ success: false, message: 'A user login account is already registered for this Staff ID.' });
      }

      finalStaffId = staff.StaffID;
    }

    // 3. Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 4. Insert user
    const [result] = await pool.query(
      'INSERT INTO User (Username, PasswordHash, StaffID, RoleID, IsActive) VALUES (?, ?, ?, ?, TRUE)',
      [username, passwordHash, finalStaffId, roleId]
    );

    const token = generateToken(result.insertId);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      userId: result.insertId
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration', error: error.message });
  }
};

// @desc    Get currently logged in user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const [users] = await pool.query(
      `SELECT u.UserID, u.Username, u.StaffID, u.RoleID, r.RoleName,
              s.FirstName, s.LastName, s.Email, s.Phone, d.MedicalRegNo, d.Specialization, d.Designation, d.Qualifications
       FROM User u
       JOIN Role r ON u.RoleID = r.RoleID
       LEFT JOIN Staff s ON u.StaffID = s.StaffID
       LEFT JOIN Doctor d ON s.StaffID = d.StaffID
       WHERE u.UserID = ?`,
      [req.user.UserID]
    );

    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, user: users[0], data: users[0] });
  } catch (error) {
    console.error('getMe Error:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving profile' });
  }
};

// @desc    Update user profile & password settings
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  const { password, phone, email } = req.body;
  const userId = req.user.UserID;
  const staffId = req.user.StaffID;

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Update contact details in Staff profile if linked
    if (staffId) {
      await connection.query(
        'UPDATE Staff SET Phone = ?, Email = ? WHERE StaffID = ?',
        [phone || null, email || null, staffId]
      );
    }

    // 2. Hash and update password if provided
    if (password && password.trim() !== '') {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      await connection.query(
        'UPDATE User SET PasswordHash = ?, PasswordLastChanged = NOW() WHERE UserID = ?',
        [passwordHash, userId]
      );
    }

    await connection.commit();
    res.json({ success: true, message: 'Profile settings updated successfully' });
  } catch (error) {
    await connection.rollback();
    console.error('updateProfile Error:', error);
    res.status(500).json({ success: false, message: 'Failed to update profile settings', error: error.message });
  } finally {
    connection.release();
  }
};

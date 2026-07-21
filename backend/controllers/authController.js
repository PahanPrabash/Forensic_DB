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
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    const user = users[0];

    if (!user.IsActive) {
      return res.status(403).json({ success: false, message: 'Account is deactivated. Contact System Admin.' });
    }

    const isMatch = await bcrypt.compare(password, user.PasswordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    // Update last login timestamp
    await pool.query('UPDATE User SET LastLogin = NOW() WHERE UserID = ?', [user.UserID]);

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
  const { username, password, roleId, staffId } = req.body;

  if (!username || !password || !roleId) {
    return res.status(400).json({ success: false, message: 'Username, password, and roleId are required' });
  }

  try {
    // Check if username already exists
    const [existing] = await pool.query('SELECT UserID FROM User WHERE Username = ?', [username]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Username already taken' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Insert user
    const [result] = await pool.query(
      'INSERT INTO User (Username, PasswordHash, StaffID, RoleID, IsActive) VALUES (?, ?, ?, ?, TRUE)',
      [username, passwordHash, staffId || null, roleId]
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
      `SELECT u.UserID, u.Username, u.StaffID, u.RoleID, u.IsActive, u.LastLogin, u.CreatedAt, r.RoleName,
              s.FirstName, s.LastName, s.Email, s.Phone, s.Department
       FROM User u
       JOIN Role r ON u.RoleID = r.RoleID
       LEFT JOIN Staff s ON u.StaffID = s.StaffID
       WHERE u.UserID = ?`,
      [req.user.UserID]
    );

    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User profile not found' });
    }

    res.json({
      success: true,
      user: users[0]
    });
  } catch (error) {
    console.error('GetMe Error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching user profile' });
  }
};

// @desc    Update profile details, username & password
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  const { username, firstName, lastName, email, phone, department, currentPassword, newPassword } = req.body;
  const userId = req.user.UserID;
  const staffId = req.user.StaffID;

  try {
    // 1. Update Username if provided and unique
    if (username && username !== req.user.Username) {
      const [existing] = await pool.query('SELECT UserID FROM User WHERE Username = ? AND UserID != ?', [username, userId]);
      if (existing.length > 0) {
        return res.status(400).json({ success: false, message: 'Username is already in use by another user' });
      }
      await pool.query('UPDATE User SET Username = ? WHERE UserID = ?', [username, userId]);
    }

    // 2. Update Staff details if StaffID exists
    if (staffId) {
      await pool.query(
        `UPDATE Staff 
         SET FirstName = COALESCE(?, FirstName),
             LastName = COALESCE(?, LastName),
             Email = COALESCE(?, Email),
             Phone = COALESCE(?, Phone),
             Department = COALESCE(?, Department)
         WHERE StaffID = ?`,
        [firstName, lastName, email, phone, department, staffId]
      );
    } else if (firstName && lastName) {
      // Create new Staff record if missing
      const [newStaff] = await pool.query(
        `INSERT INTO Staff (FirstName, LastName, Role, Department, Phone, Email, HireDate, IsActive)
         VALUES (?, ?, 'Other', ?, ?, ?, CURDATE(), TRUE)`,
        [firstName, lastName, department || 'Forensic Medicine', phone || null, email || null]
      );
      await pool.query('UPDATE User SET StaffID = ? WHERE UserID = ?', [newStaff.insertId, userId]);
    }

    // 3. Change password if provided
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ success: false, message: 'Current password is required to set new password' });
      }

      const [userRows] = await pool.query('SELECT PasswordHash FROM User WHERE UserID = ?', [userId]);
      const isMatch = await bcrypt.compare(currentPassword, userRows[0].PasswordHash);

      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Incorrect current password' });
      }

      const salt = await bcrypt.genSalt(10);
      const newHash = await bcrypt.hash(newPassword, salt);
      await pool.query('UPDATE User SET PasswordHash = ? WHERE UserID = ?', [newHash, userId]);
    }

    // Return updated user object
    const [updatedUsers] = await pool.query(
      `SELECT u.UserID, u.Username, u.StaffID, u.RoleID, r.RoleName,
              s.FirstName, s.LastName, s.Email, s.Phone, s.Department
       FROM User u
       JOIN Role r ON u.RoleID = r.RoleID
       LEFT JOIN Staff s ON u.StaffID = s.StaffID
       WHERE u.UserID = ?`,
      [userId]
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUsers[0]
    });
  } catch (error) {
    console.error('updateProfile Error:', error);
    res.status(500).json({ success: false, message: 'Failed to update profile', error: error.message });
  }
};

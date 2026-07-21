import pool from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// ─── POST /api/auth/register ─ Register a new user ─────────────
export const register = async (req, res) => {
  try {
    const { firstName, lastName, role, department, username, password } = req.body;

    if (!firstName || !lastName || !role || !username || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if username already exists
    const [existingUsers] = await pool.query('SELECT UserID FROM User WHERE Username = ?', [username]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Determine RoleID for User table (default to 2 (JMO) or 1 (Admin) for demo)
    const roleId = 2; // Hardcoding to JMO role for simplicity in this module

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Use a transaction since we are inserting into Staff and User
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // 1. Insert into Staff
      const [staffResult] = await connection.query(
        'INSERT INTO Staff (FirstName, LastName, Role, Department) VALUES (?, ?, ?, ?)',
        [firstName, lastName, role, department || 'Clinical Forensic']
      );
      const staffId = staffResult.insertId;

      // 2. Insert into User
      await connection.query(
        'INSERT INTO User (Username, PasswordHash, StaffID, RoleID) VALUES (?, ?, ?, ?)',
        [username, passwordHash, staffId, roleId]
      );

      await connection.commit();
      connection.release();

      res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
      await connection.rollback();
      connection.release();
      throw err;
    }

  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
};

// ─── POST /api/auth/login ─ Login a user ───────────────────────
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Find the user
    const [users] = await pool.query(`
      SELECT u.*, s.FirstName, s.LastName, s.Role, r.RoleName 
      FROM User u
      LEFT JOIN Staff s ON u.StaffID = s.StaffID
      LEFT JOIN Role r ON u.RoleID = r.RoleID
      WHERE u.Username = ?
    `, [username]);

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];

    // Verify password
    const isMatch = await bcrypt.compare(password, user.PasswordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT Token (mock secret if not in env)
    const jwtSecret = process.env.JWT_SECRET || 'super_secret_forensic_key_123';
    const token = jwt.sign(
      { userId: user.UserID, staffId: user.StaffID, role: user.RoleName },
      jwtSecret,
      { expiresIn: '1d' }
    );

    // Update LastLogin
    await pool.query('UPDATE User SET LastLogin = NOW() WHERE UserID = ?', [user.UserID]);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.UserID,
        username: user.Username,
        firstName: user.FirstName,
        lastName: user.LastName,
        fullName: `${user.FirstName} ${user.LastName}`,
        role: user.Role,
        systemRole: user.RoleName
      }
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
};

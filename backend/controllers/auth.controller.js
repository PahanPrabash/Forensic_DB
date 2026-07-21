import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

/**
 * POST /api/auth/signup
 * Register a new user — creates Staff row + User row.
 */
export const signup = async (req, res, next) => {
  try {
    const { firstName, lastName, staffId, role, password } = req.body;

    if (!firstName || !lastName || !staffId || !role || !password) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      // Map frontend role values to Staff.Role enum and Role table
      const roleMap = {
        doctor: { staffRole: 'Other', roleName: 'Medical Officer' },
        jmo: { staffRole: 'JMO', roleName: 'JMO' },
        lab: { staffRole: 'Lab Technician', roleName: 'Lab Technician' },
        admin: { staffRole: 'Other', roleName: 'Admin' },
      };

      const mapped = roleMap[role] || { staffRole: 'Other', roleName: 'Medical Officer' };

      // 1. Insert into Staff
      const [staffResult] = await conn.execute(
        `INSERT INTO Staff (FirstName, LastName, Role, IsActive) VALUES (?, ?, ?, TRUE)`,
        [firstName, lastName, mapped.staffRole]
      );
      const newStaffId = staffResult.insertId;

      // 2. If doctor or JMO, also insert into Doctor table
      if (role === 'doctor' || role === 'jmo') {
        await conn.execute(
          `INSERT INTO Doctor (StaffID, MedicalRegNo, Specialization, Designation) VALUES (?, ?, ?, ?)`,
          [newStaffId, staffId, role === 'jmo' ? 'Forensic Medicine' : 'General', mapped.roleName]
        );
      }

      // 3. Get or create Role
      let [roles] = await conn.execute(`SELECT RoleID FROM Role WHERE RoleName = ?`, [mapped.roleName]);
      let roleId;
      if (roles.length > 0) {
        roleId = roles[0].RoleID;
      } else {
        const [roleResult] = await conn.execute(`INSERT INTO Role (RoleName) VALUES (?)`, [mapped.roleName]);
        roleId = roleResult.insertId;
      }

      // 4. Hash password and create User
      const passwordHash = await bcrypt.hash(password, 12);
      const username = staffId; // Use staffId as username

      const [userResult] = await conn.execute(
        `INSERT INTO User (Username, PasswordHash, StaffID, RoleID, IsActive) VALUES (?, ?, ?, ?, TRUE)`,
        [username, passwordHash, newStaffId, roleId]
      );

      await conn.commit();

      res.status(201).json({
        message: 'Account created successfully.',
        userId: userResult.insertId,
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
 * POST /api/auth/login
 * Authenticate user and return JWT.
 */
export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    // Get user with staff and role info
    const [users] = await pool.execute(
      `SELECT u.UserID, u.Username, u.PasswordHash, u.StaffID, u.RoleID, u.IsActive,
              s.FirstName, s.LastName, s.Role AS StaffRole,
              r.RoleName
       FROM User u
       LEFT JOIN Staff s ON u.StaffID = s.StaffID
       LEFT JOIN Role r ON u.RoleID = r.RoleID
       WHERE u.Username = ?`,
      [username]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const user = users[0];

    if (!user.IsActive) {
      return res.status(403).json({ error: 'Account is deactivated. Contact admin.' });
    }

    const validPassword = await bcrypt.compare(password, user.PasswordHash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // Update last login
    await pool.execute(`UPDATE User SET LastLogin = NOW() WHERE UserID = ?`, [user.UserID]);

    // Generate JWT
    const token = jwt.sign(
      {
        userId: user.UserID,
        username: user.Username,
        staffId: user.StaffID,
        roleId: user.RoleID,
        roleName: user.RoleName,
        firstName: user.FirstName,
        lastName: user.LastName,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    res.json({
      message: 'Login successful.',
      token,
      user: {
        userId: user.UserID,
        username: user.Username,
        firstName: user.FirstName,
        lastName: user.LastName,
        role: user.RoleName,
        staffRole: user.StaffRole,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/auth/me
 * Get current user info from JWT token.
 */
export const getMe = async (req, res, next) => {
  try {
    const [users] = await pool.execute(
      `SELECT u.UserID, u.Username, u.StaffID, u.LastLogin,
              s.FirstName, s.LastName, s.Role AS StaffRole, s.Email, s.Phone,
              r.RoleName
       FROM User u
       LEFT JOIN Staff s ON u.StaffID = s.StaffID
       LEFT JOIN Role r ON u.RoleID = r.RoleID
       WHERE u.UserID = ?`,
      [req.user.userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const user = users[0];

    // Check if user is also a doctor
    let doctorInfo = null;
    const [doctors] = await pool.execute(
      `SELECT DoctorID, MedicalRegNo, Specialization, Designation FROM Doctor WHERE StaffID = ?`,
      [user.StaffID]
    );
    if (doctors.length > 0) {
      doctorInfo = doctors[0];
    }

    res.json({
      userId: user.UserID,
      username: user.Username,
      firstName: user.FirstName,
      lastName: user.LastName,
      role: user.RoleName,
      staffRole: user.StaffRole,
      email: user.Email,
      phone: user.Phone,
      lastLogin: user.LastLogin,
      doctor: doctorInfo,
    });
  } catch (err) {
    next(err);
  }
};

import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'forensic_med_secret_key_2026_uop');

      const [users] = await pool.query(
        `SELECT u.UserID, u.Username, u.StaffID, u.RoleID, u.IsActive, r.RoleName
         FROM User u
         JOIN Role r ON u.RoleID = r.RoleID
         WHERE u.UserID = ?`,
        [decoded.id]
      );

      if (users.length === 0 || !users[0].IsActive) {
        return res.status(401).json({ success: false, message: 'User not authorized or account deactivated' });
      }

      req.user = users[0];
      next();
    } catch (error) {
      console.error('JWT Verification Error:', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.RoleName)) {
      return res.status(403).json({
        success: false,
        message: `Role (${req.user?.RoleName || 'Guest'}) is not authorized to access this route`
      });
    }
    next();
  };
};

export const checkModulePermission = (moduleName, action) => {
  return async (req, res, next) => {
    try {
      const roleId = req.user.RoleID;
      const [permissions] = await pool.query(
        `SELECT CanCreate, CanRead, CanUpdate, CanDelete 
         FROM RolePermission 
         WHERE RoleID = ? AND Module = ?`,
        [roleId, moduleName]
      );

      if (permissions.length === 0) {
        return res.status(403).json({ success: false, message: `No permissions configured for module: ${moduleName}` });
      }

      const perm = permissions[0];
      let allowed = false;
      if (action === 'create' && perm.CanCreate) allowed = true;
      if (action === 'read' && perm.CanRead) allowed = true;
      if (action === 'update' && perm.CanUpdate) allowed = true;
      if (action === 'delete' && perm.CanDelete) allowed = true;

      if (!allowed) {
        return res.status(403).json({ success: false, message: `Permission denied for ${action} on module: ${moduleName}` });
      }

      next();
    } catch (error) {
      console.error('Permission Check Error:', error.message);
      return res.status(500).json({ success: false, message: 'Internal permission validation error' });
    }
  };
};

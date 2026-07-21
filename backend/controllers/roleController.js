import pool from '../config/db.js';

// @desc    Get all system roles
// @route   GET /api/roles
// @access  Private
export const getAllRoles = async (req, res) => {
  try {
    const [roles] = await pool.query('SELECT * FROM Role ORDER BY RoleID');
    res.json({ success: true, count: roles.length, data: roles });
  } catch (error) {
    console.error('getAllRoles Error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve roles' });
  }
};

// @desc    Get permissions for a role
// @route   GET /api/roles/:roleId/permissions
// @access  Private
export const getRolePermissions = async (req, res) => {
  const { roleId } = req.params;

  try {
    const [permissions] = await pool.query(
      'SELECT * FROM RolePermission WHERE RoleID = ?',
      [roleId]
    );
    res.json({ success: true, count: permissions.length, data: permissions });
  } catch (error) {
    console.error('getRolePermissions Error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve role permissions' });
  }
};

// @desc    Update permissions for a role module
// @route   PUT /api/roles/:roleId/permissions
// @access  Private (Admin)
export const updateRolePermission = async (req, res) => {
  const { roleId } = req.params;
  const { module, canCreate, canRead, canUpdate, canDelete } = req.body;

  if (!module) {
    return res.status(400).json({ success: false, message: 'Module name is required' });
  }

  try {
    const [existing] = await pool.query(
      'SELECT PermissionID FROM RolePermission WHERE RoleID = ? AND Module = ?',
      [roleId, module]
    );

    if (existing.length > 0) {
      await pool.query(
        `UPDATE RolePermission 
         SET CanCreate = ?, CanRead = ?, CanUpdate = ?, CanDelete = ?
         WHERE RoleID = ? AND Module = ?`,
        [canCreate, canRead, canUpdate, canDelete, roleId, module]
      );
    } else {
      await pool.query(
        `INSERT INTO RolePermission (RoleID, Module, CanCreate, CanRead, CanUpdate, CanDelete)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [roleId, module, canCreate, canRead, canUpdate, canDelete]
      );
    }

    res.json({ success: true, message: 'Role permission updated successfully' });
  } catch (error) {
    console.error('updateRolePermission Error:', error);
    res.status(500).json({ success: false, message: 'Failed to update role permission' });
  }
};

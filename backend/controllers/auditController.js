import pool from '../config/db.js';

export const getAuditLogs = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT a.LogID AS AuditID, a.UserID, u.Username, a.Action, a.TableAffected, a.RecordID, a.Timestamp, a.IPAddress, a.OldValue, a.NewValue 
      FROM AuditLog a 
      LEFT JOIN User u ON a.UserID = u.UserID 
      ORDER BY a.Timestamp DESC LIMIT 100
    `);
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getNotifications = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Notification ORDER BY CreatedAt DESC LIMIT 100');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

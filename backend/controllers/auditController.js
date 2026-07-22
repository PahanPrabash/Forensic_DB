const db = require('../config/db');

exports.getAuditLogs = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM AuditLog ORDER BY Timestamp DESC LIMIT 100');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Notification ORDER BY CreatedAt DESC LIMIT 100');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const db = require('../config/db');

exports.createCourtSummons = async (req, res) => {
  try {
    const { caseId, doctorId, courtName, hearingDate, summonsDate, purpose, status } = req.body;
    const [result] = await db.query(
      'INSERT INTO CourtSummons (CaseID, DoctorID, CourtName, HearingDate, SummonsDate, Purpose, Status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [caseId, doctorId, courtName, hearingDate, summonsDate, purpose, status]
    );
    res.status(201).json({ success: true, summonsId: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getCourtSummons = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM CourtSummons');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const db = require('../config/db');

exports.createPostmortem = async (req, res) => {
  try {
    const { pmNumber, caseId, deceasedPatientId, deathType, deathSource, autopsyDate, performingDoctorId, preAutopsyInfo, externalFindings, internalFindings, pmrContent, status } = req.body;
    const [result] = await db.query(
      'INSERT INTO Postmortem (PMNumber, CaseID, DeceasedPatientID, DeathType, DeathSource, AutopsyDate, PerformingDoctorID, PreAutopsyInfo, ExternalFindings, InternalFindings, PMRContent, Status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [pmNumber, caseId, deceasedPatientId, deathType, deathSource, autopsyDate, performingDoctorId, preAutopsyInfo, externalFindings, internalFindings, pmrContent, status]
    );
    res.status(201).json({ success: true, postmortemId: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getPostmortems = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Postmortem');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.createCauseOfDeath = async (req, res) => {
  try {
    const { postmortemId, immediateCause, antecedentCause1, antecedentCause2, underlyingCause, otherConditions, mannerOfDeath, issuedBy, issuedDate } = req.body;
    const [result] = await db.query(
      'INSERT INTO CauseOfDeath (PostmortemID, ImmediateCause, AntecedentCause1, AntecedentCause2, UnderlyingCause, OtherSignificantConditions, MannerOfDeath, IssuedBy, IssuedDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [postmortemId, immediateCause, antecedentCause1, antecedentCause2, underlyingCause, otherConditions, mannerOfDeath, issuedBy, issuedDate]
    );
    res.status(201).json({ success: true, codId: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getCauseOfDeaths = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM CauseOfDeath');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

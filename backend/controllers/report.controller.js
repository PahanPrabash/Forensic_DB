import pool from '../config/db.js';

/**
 * GET /api/reports
 * List generated court reports.
 */
export const getReports = async (req, res, next) => {
  try {
    const [reports] = await pool.execute(
      `SELECT cr.ReportID, cr.ReportType, cr.SubmissionDate, cr.CourtName, cr.Status,
              c.CaseNumber,
              CONCAT('Dr. ', s.LastName) AS PreparedByName
       FROM CourtReport cr
       JOIN \`Case\` c ON cr.CaseID = c.CaseID
       LEFT JOIN Doctor d ON cr.PreparedBy = d.DoctorID
       LEFT JOIN Staff s ON d.StaffID = s.StaffID
       ORDER BY cr.SubmissionDate DESC`
    );

    res.json(reports);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/reports/:id
 * Get single report detail.
 */
export const getReportById = async (req, res, next) => {
  try {
    const [reports] = await pool.execute(
      `SELECT cr.*,
              c.CaseNumber, c.CaseType,
              CONCAT('Dr. ', s.FirstName, ' ', s.LastName) AS PreparedByName
       FROM CourtReport cr
       JOIN \`Case\` c ON cr.CaseID = c.CaseID
       LEFT JOIN Doctor d ON cr.PreparedBy = d.DoctorID
       LEFT JOIN Staff s ON d.StaffID = s.StaffID
       WHERE cr.ReportID = ?`,
      [req.params.id]
    );

    if (reports.length === 0) {
      return res.status(404).json({ error: 'Report not found.' });
    }

    res.json(reports[0]);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/reports
 * Generate a new court report.
 */
export const createReport = async (req, res, next) => {
  try {
    const { caseId, reportType, courtName, caseNumberCourt, reportContent } = req.body;

    if (!caseId || !reportType) {
      return res.status(400).json({ error: 'Case ID and report type are required.' });
    }

    // Get doctor ID from user's staff record
    let preparedBy = null;
    if (req.user.staffId) {
      const [docs] = await pool.execute(`SELECT DoctorID FROM Doctor WHERE StaffID = ?`, [req.user.staffId]);
      if (docs.length > 0) preparedBy = docs[0].DoctorID;
    }

    const [result] = await pool.execute(
      `INSERT INTO CourtReport (CaseID, ReportType, PreparedBy, SubmissionDate, CourtName, CaseNumberCourt, Status, ReportContent)
       VALUES (?, ?, ?, CURDATE(), ?, ?, 'Draft', ?)`,
      [caseId, reportType, preparedBy, courtName || null, caseNumberCourt || null, reportContent || null]
    );

    res.status(201).json({
      message: 'Report generated.',
      reportId: result.insertId,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/reports/templates
 * List report templates.
 */
export const getTemplates = async (req, res, next) => {
  try {
    const [templates] = await pool.execute(
      `SELECT TemplateID, TemplateName, TemplateType, IsActive, CreatedAt
       FROM ReportTemplate
       WHERE IsActive = TRUE
       ORDER BY TemplateName`
    );

    res.json(templates);
  } catch (err) {
    next(err);
  }
};

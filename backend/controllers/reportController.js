import pool from '../config/db.js';

// @desc    Get all court reports
// @route   GET /api/reports
// @access  Private
export const getAllReports = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT r.*, c.CaseNumber, s.FirstName as DoctorFirstName, s.LastName as DoctorLastName
      FROM CourtReport r
      LEFT JOIN \`Case\` c ON r.CaseID = c.CaseID
      LEFT JOIN Doctor d ON r.IssuedBy = d.DoctorID
      LEFT JOIN Staff s ON d.StaffID = s.StaffID
      ORDER BY r.IssuedDate DESC
    `);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch reports' });
  }
};

// @desc    Create a new court report
// @route   POST /api/reports
// @access  Private
export const createReport = async (req, res) => {
  try {
    const { caseId, reportType, courtName, caseNumberCourt, reportContent } = req.body;

    if (!caseId || !reportType) {
      return res.status(400).json({ success: false, error: 'Case ID and report type are required.' });
    }

    // Get doctor ID from user's staff record
    let issuedBy = null;
    if (req.user.StaffID) {
      const [docs] = await pool.query(`SELECT DoctorID FROM Doctor WHERE StaffID = ?`, [req.user.StaffID]);
      if (docs.length > 0) issuedBy = docs[0].DoctorID;
    }

    const [result] = await pool.query(
      `INSERT INTO CourtReport (CaseID, ReportType, IssuedBy, IssuedDate, Status, Content)
       VALUES (?, ?, ?, CURDATE(), 'Draft', ?)`,
      [caseId, reportType, issuedBy, reportContent || '']
    );

    res.status(201).json({
      success: true,
      message: 'Report generated successfully.',
      reportId: result.insertId,
    });
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({ success: false, error: 'Failed to create report' });
  }
};

// @desc    Get all report templates
// @route   GET /api/reports/templates
// @access  Private
export const getTemplates = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT TemplateID, TemplateName, TemplateType, TemplateContent, IsActive, CreatedAt
      FROM ReportTemplate
      ORDER BY TemplateName
    `);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch templates' });
  }
};

// @desc    Update a report template
// @route   PUT /api/reports/templates/:id
// @access  Private
export const updateTemplate = async (req, res) => {
  const { id } = req.params;
  const { templateName, templateType, templateContent, isActive } = req.body;

  try {
    const [existing] = await pool.query('SELECT TemplateID FROM ReportTemplate WHERE TemplateID = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, error: 'Report template not found.' });
    }

    await pool.query(
      `UPDATE ReportTemplate 
       SET TemplateName = ?, TemplateType = ?, TemplateContent = ?, IsActive = ?
       WHERE TemplateID = ?`,
      [templateName, templateType, templateContent, isActive === undefined ? true : isActive, id]
    );

    res.json({ success: true, message: 'Template updated successfully.' });
  } catch (error) {
    console.error('Error updating template:', error);
    res.status(500).json({ success: false, error: 'Failed to update template' });
  }
};

import pool from '../config/db.js';

/**
 * GET /api/dashboard/stats
 * Returns aggregate counts for dashboard stat cards.
 */
export const getStats = async (req, res, next) => {
  try {
    const [[activeCases]] = await pool.execute(
      `SELECT COUNT(*) AS count FROM \`Case\` WHERE Status IN ('Open', 'Under Investigation')`
    );

    const [[draftMLEFs]] = await pool.execute(
      `SELECT COUNT(*) AS count FROM MedicoLegalExamForm WHERE Status = 'Draft'`
    );

    const [[courtSummons]] = await pool.execute(
      `SELECT COUNT(*) AS count FROM CourtSummons
       WHERE Status = 'Pending'
         AND HearingDate >= CURDATE()
         AND HearingDate < DATE_ADD(CURDATE(), INTERVAL 7 DAY)`
    );

    const [[pendingLabTests]] = await pool.execute(
      `SELECT COUNT(*) AS count FROM LaboratoryTest WHERE Status IN ('Requested', 'In Progress')`
    );

    res.json({
      activeCases: activeCases.count,
      draftMLEFs: draftMLEFs.count,
      courtSummons: courtSummons.count,
      pendingLabTests: pendingLabTests.count,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/dashboard/recent-cases
 * Returns the 5 most recent cases with patient and doctor names.
 */
export const getRecentCases = async (req, res, next) => {
  try {
    const [cases] = await pool.execute(
      `SELECT c.CaseID, c.CaseNumber, c.CaseType, c.SubCategory, c.IncidentDate, c.Status, c.CreatedAt,
              CONCAT(p.FirstName, ' ', p.LastName) AS PatientName,
              CONCAT('Dr. ', s.LastName) AS DoctorName
       FROM \`Case\` c
       LEFT JOIN Patient p ON c.PatientID = p.PatientID
       LEFT JOIN Doctor d ON c.AssignedDoctorID = d.DoctorID
       LEFT JOIN Staff s ON d.StaffID = s.StaffID
       ORDER BY c.CreatedAt DESC
       LIMIT 5`
    );

    res.json(cases);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/dashboard/notifications
 * Returns unread notifications for the authenticated user.
 */
export const getNotifications = async (req, res, next) => {
  try {
    const [notifications] = await pool.execute(
      `SELECT n.NotificationID, n.Title, n.Message, n.NotificationType, n.IsRead, n.CreatedAt,
              c.CaseNumber
       FROM Notification n
       LEFT JOIN \`Case\` c ON n.RelatedCaseID = c.CaseID
       WHERE n.UserID = ?
       ORDER BY n.CreatedAt DESC
       LIMIT 10`,
      [req.user.userId]
    );

    res.json(notifications);
  } catch (err) {
    next(err);
  }
};

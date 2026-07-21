import pool from '../config/db.js';

// @desc    Get live dashboard summary metrics & recent cases
// @route   GET /api/dashboard/stats
// @access  Private
export const getDashboardStats = async (req, res) => {
  try {
    // 1. Active Cases Count
    const [[{ activeCases }]] = await pool.query(
      "SELECT COUNT(*) AS activeCases FROM `Case` WHERE Status IN ('Open', 'Under Investigation')"
    );

    // 2. Draft MLEFs Count
    const [[{ draftMlefs }]] = await pool.query(
      "SELECT COUNT(*) AS draftMlefs FROM MedicoLegalExamForm WHERE Status = 'Draft'"
    );

    // 3. Pending Court Summons Count
    const [[{ courtSummons }]] = await pool.query(
      "SELECT COUNT(*) AS courtSummons FROM CourtSummons WHERE Status = 'Pending'"
    );

    // 4. Pending Lab Tests Count
    const [[{ pendingLabTests }]] = await pool.query(
      "SELECT COUNT(*) AS pendingLabTests FROM LaboratoryTest WHERE Status = 'Requested'"
    );

    // 5. Recent Cases (Latest 5)
    const [recentCases] = await pool.query(
      `SELECT c.CaseID, c.CaseNumber, c.CaseType, c.SubCategory, c.Status, c.CreatedAt,
              p.FirstName, p.LastName
       FROM \`Case\` c
       LEFT JOIN Patient p ON c.PatientID = p.PatientID
       ORDER BY c.CreatedAt DESC LIMIT 5`
    );

    // 6. Notifications / Pending Actions
    const [notifications] = await pool.query(
      `SELECT NotificationID, Title, Message, NotificationType, CreatedAt
       FROM Notification
       ORDER BY CreatedAt DESC LIMIT 5`
    );

    res.json({
      success: true,
      stats: {
        activeCases: activeCases || 0,
        draftMlefs: draftMlefs || 0,
        courtSummons: courtSummons || 0,
        pendingLabTests: pendingLabTests || 0
      },
      recentCases: recentCases || [],
      notifications: notifications || []
    });
  } catch (error) {
    console.error('getDashboardStats Error:', error);
    // Return fallback zeros if tables are empty
    res.json({
      success: true,
      stats: { activeCases: 0, draftMlefs: 0, courtSummons: 0, pendingLabTests: 0 },
      recentCases: [],
      notifications: []
    });
  }
};

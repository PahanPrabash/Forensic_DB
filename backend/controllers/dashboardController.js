import pool from '../config/db.js';

export const getDashboardStats = async (req, res) => {
  try {
    // We run a few simple count queries for the dashboard widgets
    const [[{ totalCases }]] = await pool.query('SELECT COUNT(*) as totalCases FROM \`Case\`');
    const [[{ pendingMLRs }]] = await pool.query("SELECT COUNT(*) as pendingMLRs FROM MedicoLegalReport WHERE Status = 'Draft'");
    const [[{ totalEvidence }]] = await pool.query('SELECT COUNT(*) as totalEvidence FROM Evidence');
    const [[{ pendingAutopsies }]] = await pool.query("SELECT COUNT(*) as pendingAutopsies FROM Postmortem WHERE Status = 'Pending' OR Status = 'In Progress'");

    res.json({
      data: {
        totalCases,
        pendingMLRs,
        totalEvidence,
        pendingAutopsies
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
};

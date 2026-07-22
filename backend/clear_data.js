import pool, { testConnection } from './config/db.js';

const clearDatabase = async () => {
  console.log('🧹 Starting database clean-up script...');

  const connected = await testConnection();
  if (!connected) {
    console.error('❌ Could not connect to MySQL database.');
    process.exit(1);
  }

  try {
    // Correct order to avoid foreign key violations
    console.log('➡️ Clearing notifications and audit logs...');
    await pool.query('DELETE FROM Notification');
    await pool.query('DELETE FROM AuditLog');
    
    try {
      await pool.query('DELETE FROM CaseHistory');
    } catch (e) {
      console.log('Note: CaseHistory table clear skipped or empty.');
    }

    console.log('➡️ Clearing case records and patient profiles...');
    await pool.query('DELETE FROM `Case`');
    await pool.query('DELETE FROM Patient');

    console.log('➡️ Clearing JMO doctor credentials...');
    // Do not delete Admin doctor if any, but admin has StaffID = 1
    await pool.query('DELETE FROM Doctor WHERE StaffID != 1');

    console.log('➡️ Clearing non-admin user accounts...');
    await pool.query('DELETE FROM User WHERE UserID != 1');

    console.log('➡️ Clearing non-admin staff profiles...');
    await pool.query('DELETE FROM Staff WHERE StaffID != 1');

    console.log('✅ Database successfully cleared! Only the System Administrator remains.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Clean-up script failed:', error);
    process.exit(1);
  }
};

clearDatabase();

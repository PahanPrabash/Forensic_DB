import pool from './config/db.js';

const resetAutoIncrement = async () => {
  try {
    console.log('🔄 Resetting database auto-increment counters...');
    
    // Find max ID currently in Staff table
    const [[{ maxStaffId }]] = await pool.query('SELECT MAX(StaffID) AS maxStaffId FROM Staff');
    const nextStaffId = (maxStaffId || 1) + 1;
    await pool.query(`ALTER TABLE Staff AUTO_INCREMENT = ${nextStaffId}`);
    
    // Find max ID currently in Doctor table
    const [[{ maxDoctorId }]] = await pool.query('SELECT MAX(DoctorID) AS maxDoctorId FROM Doctor');
    const nextDoctorId = (maxDoctorId || 0) + 1;
    await pool.query(`ALTER TABLE Doctor AUTO_INCREMENT = ${nextDoctorId}`);

    // Find max ID currently in User table
    const [[{ maxUserId }]] = await pool.query('SELECT MAX(UserID) AS maxUserId FROM User');
    const nextUserId = (maxUserId || 1) + 1;
    await pool.query(`ALTER TABLE User AUTO_INCREMENT = ${nextUserId}`);

    console.log(`✅ Counters reset. Next Staff ID will be STF-${String(nextStaffId).padStart(3, '0')}.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to reset auto-increment counters:', error.message);
    process.exit(1);
  }
};

resetAutoIncrement();

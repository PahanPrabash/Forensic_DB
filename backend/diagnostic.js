import pool from './config/db.js';

const diagnose = async () => {
  try {
    console.log('=== User Records ===');
    const [users] = await pool.query('SELECT UserID, Username, StaffID, RoleID FROM User');
    console.log(JSON.stringify(users, null, 2));

    console.log('=== Staff Records ===');
    const [staff] = await pool.query('SELECT StaffID, FirstName, LastName, Role, Email FROM Staff');
    console.log(JSON.stringify(staff, null, 2));

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

diagnose();

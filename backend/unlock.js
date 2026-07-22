import pool from './config/db.js';

const showProcesslist = async () => {
  try {
    console.log('🔍 Querying MySQL Processlist...');
    const [rows] = await pool.query('SHOW PROCESSLIST');
    console.log(JSON.stringify(rows, null, 2));

    // Kill any non-daemon connections that have been asleep for a long time or holding locks
    for (const r of rows) {
      if (r.Command === 'Sleep' && r.Time > 10 && r.Id !== rows[0].Id) {
        console.log(`Killing sleepy process ${r.Id}...`);
        await pool.query(`KILL ${r.Id}`);
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error listing/killing processes:', error.message);
    process.exit(1);
  }
};

showProcesslist();

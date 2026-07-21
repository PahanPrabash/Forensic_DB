import bcrypt from 'bcryptjs';
import pool, { testConnection } from './config/db.js';

const seedDatabase = async () => {
  console.log('🌱 Starting database seed script...');

  const connected = await testConnection();
  if (!connected) {
    console.error('❌ Could not connect to MySQL. Ensure MySQL server is running and forensic_medicine_db is created.');
    process.exit(1);
  }

  try {
    // 1. Seed Roles
    console.log('➡️ Seeding Roles...');
    const roles = [
      { id: 1, name: 'System Administrator', desc: 'Full system management and security control' },
      { id: 2, name: 'Examining Doctor (JMO)', desc: 'Judicial Medical Officer - performs clinical and postmortem examinations' },
      { id: 3, name: 'Registrar Clerk', desc: 'Handles patient registration, case creation, and summons' },
      { id: 4, name: 'Laboratory Staff', desc: 'Manages evidence tracking and laboratory test entries' }
    ];

    for (const r of roles) {
      await pool.query(
        `INSERT INTO Role (RoleID, RoleName, Description) 
         VALUES (?, ?, ?) 
         ON DUPLICATE KEY UPDATE RoleName = VALUES(RoleName), Description = VALUES(Description)`,
        [r.id, r.name, r.desc]
      );
    }

    // 2. Seed RolePermissions
    console.log('➡️ Seeding Role Permissions...');
    const modules = ['Patient', 'Case', 'Clinical', 'Autopsy', 'Evidence', 'Court', 'Staff', 'UserAdmin'];
    
    // System Admin gets full permissions
    for (const m of modules) {
      await pool.query(
        `INSERT INTO RolePermission (RoleID, Module, CanCreate, CanRead, CanUpdate, CanDelete)
         VALUES (1, ?, TRUE, TRUE, TRUE, TRUE)
         ON DUPLICATE KEY UPDATE CanCreate=TRUE, CanRead=TRUE, CanUpdate=TRUE, CanDelete=TRUE`,
        [m]
      );
    }

    // JMO Doctor permissions
    const jmoModules = [
      { m: 'Clinical', c: true, r: true, u: true, d: false },
      { m: 'Autopsy', c: true, r: true, u: true, d: false },
      { m: 'Case', c: false, r: true, u: true, d: false },
      { m: 'Evidence', c: true, r: true, u: false, d: false }
    ];
    for (const j of jmoModules) {
      await pool.query(
        `INSERT INTO RolePermission (RoleID, Module, CanCreate, CanRead, CanUpdate, CanDelete)
         VALUES (2, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE CanCreate=VALUES(CanCreate), CanRead=VALUES(CanRead), CanUpdate=VALUES(CanUpdate), CanDelete=VALUES(CanDelete)`,
        [j.m, j.c, j.r, j.u, j.d]
      );
    }

    // 3. Seed Default Admin Staff Record
    console.log('➡️ Seeding Default Admin Staff...');
    await pool.query(
      `INSERT INTO Staff (StaffID, FirstName, LastName, Role, Department, Phone, Email, HireDate, IsActive)
       VALUES (1, 'System', 'Administrator', 'Other', 'Forensic Medicine', '081-2393000', 'admin@forensic.pdn.ac.lk', '2026-01-01', TRUE)
       ON DUPLICATE KEY UPDATE FirstName=VALUES(FirstName), LastName=VALUES(LastName)`
    );

    // 4. Seed Default Admin User Account (admin / admin123)
    console.log('➡️ Seeding Default Admin User Account (username: admin, password: admin123)...');
    const salt = await bcrypt.genSalt(10);
    const adminPasswordHash = await bcrypt.hash('admin123', salt);

    await pool.query(
      `INSERT INTO User (UserID, Username, PasswordHash, StaffID, RoleID, IsActive)
       VALUES (1, 'admin', ?, 1, 1, TRUE)
       ON DUPLICATE KEY UPDATE PasswordHash = VALUES(PasswordHash), IsActive = TRUE`,
      [adminPasswordHash]
    );

    // 5. Seed Sample JMO Doctor Staff Record
    console.log('➡️ Seeding Sample JMO Doctor Record...');
    await pool.query(
      `INSERT INTO Staff (StaffID, FirstName, LastName, Role, Department, Phone, Email, HireDate, IsActive)
       VALUES (2, 'Chathula', 'Wickramasinghe', 'JMO', 'Forensic Medicine', '077-1234567', 'chathula_wick@yahoo.com', '2024-01-01', TRUE)
       ON DUPLICATE KEY UPDATE FirstName=VALUES(FirstName), LastName=VALUES(LastName)`
    );

    await pool.query(
      `INSERT INTO Doctor (DoctorID, StaffID, MedicalRegNo, Specialization, Designation, Qualifications)
       VALUES (1, 2, 'SLMC-45210', 'Forensic Medicine', 'Act. Consultant JMO / Lecturer', 'MBBS(Perad), MD(Col), DLM(Col)')
       ON DUPLICATE KEY UPDATE MedicalRegNo = VALUES(MedicalRegNo)`
    );

    const doctorPasswordHash = await bcrypt.hash('jmo123', salt);
    await pool.query(
      `INSERT INTO User (UserID, Username, PasswordHash, StaffID, RoleID, IsActive)
       VALUES (2, 'drchathula', ?, 2, 2, TRUE)
       ON DUPLICATE KEY UPDATE PasswordHash = VALUES(PasswordHash)`,
      [doctorPasswordHash]
    );

    console.log('✅ Database seeding complete!');
    console.log('📌 Test Accounts Created:');
    console.log('   1. Username: admin      | Password: admin123  (Role: System Administrator)');
    console.log('   2. Username: drchathula | Password: jmo123     (Role: Examining Doctor JMO)');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed Script Failed:', error);
    process.exit(1);
  }
};

seedDatabase();

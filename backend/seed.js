import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import pool from './config/db.js';

dotenv.config();

/**
 * Database seeder.
 * Inserts default roles, an admin user, sample doctors, patients, and cases.
 * Run with: npm run seed
 */
async function seed() {
  const conn = await pool.getConnection();

  try {
    console.log('🌱 Starting database seed...\n');

    // ─── 1. Roles ──────────────────────────────────────────────
    console.log('  → Inserting roles...');
    const roles = ['Admin', 'JMO', 'Medical Officer', 'Lab Technician'];
    for (const roleName of roles) {
      await conn.execute(
        `INSERT IGNORE INTO Role (RoleName, Description) VALUES (?, ?)`,
        [roleName, `${roleName} role`]
      );
    }

    // Get role IDs
    const [[adminRole]] = await conn.execute(`SELECT RoleID FROM Role WHERE RoleName = 'Admin'`);
    const [[jmoRole]] = await conn.execute(`SELECT RoleID FROM Role WHERE RoleName = 'JMO'`);
    const [[moRole]] = await conn.execute(`SELECT RoleID FROM Role WHERE RoleName = 'Medical Officer'`);
    const [[labRole]] = await conn.execute(`SELECT RoleID FROM Role WHERE RoleName = 'Lab Technician'`);

    // ─── 2. Staff ──────────────────────────────────────────────
    console.log('  → Inserting staff members...');
    const staffMembers = [
      { firstName: 'System', lastName: 'Admin', role: 'Other' },
      { firstName: 'Chaminda', lastName: 'Wickramasinghe', role: 'JMO' },
      { firstName: 'Nimal', lastName: 'Silva', role: 'JMO' },
      { firstName: 'Kumara', lastName: 'Perera', role: 'JMO' },
      { firstName: 'Rashmi', lastName: 'Fernando', role: 'Lab Technician' },
      { firstName: 'Dilshan', lastName: 'Jayasuriya', role: 'Nurse' },
    ];

    const staffIds = [];
    for (const staff of staffMembers) {
      const [result] = await conn.execute(
        `INSERT INTO Staff (FirstName, LastName, Role, IsActive) VALUES (?, ?, ?, TRUE)
         ON DUPLICATE KEY UPDATE StaffID = LAST_INSERT_ID(StaffID)`,
        [staff.firstName, staff.lastName, staff.role]
      );
      staffIds.push(result.insertId);
    }

    // ─── 3. Doctors ────────────────────────────────────────────
    console.log('  → Inserting doctors...');
    const doctors = [
      { staffIdx: 1, regNo: 'DOC-1001', spec: 'Forensic Medicine', desig: 'Consultant JMO' },
      { staffIdx: 2, regNo: 'DOC-1002', spec: 'Forensic Medicine', desig: 'Senior JMO' },
      { staffIdx: 3, regNo: 'DOC-1003', spec: 'Forensic Medicine', desig: 'JMO' },
    ];

    const doctorIds = [];
    for (const doc of doctors) {
      const [result] = await conn.execute(
        `INSERT INTO Doctor (StaffID, MedicalRegNo, Specialization, Designation) VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE DoctorID = LAST_INSERT_ID(DoctorID)`,
        [staffIds[doc.staffIdx], doc.regNo, doc.spec, doc.desig]
      );
      doctorIds.push(result.insertId);
    }

    // ─── 4. Users ──────────────────────────────────────────────
    console.log('  → Creating user accounts...');
    const passwordHash = await bcrypt.hash('admin123', 12);

    const users = [
      { username: 'admin', staffIdx: 0, roleId: adminRole.RoleID },
      { username: 'DOC-1001', staffIdx: 1, roleId: jmoRole.RoleID },
      { username: 'DOC-1002', staffIdx: 2, roleId: moRole.RoleID },
      { username: 'DOC-1003', staffIdx: 3, roleId: moRole.RoleID },
      { username: 'LAB-001', staffIdx: 4, roleId: labRole.RoleID },
    ];

    const userIds = [];
    for (const user of users) {
      const [result] = await conn.execute(
        `INSERT INTO User (Username, PasswordHash, StaffID, RoleID, IsActive) VALUES (?, ?, ?, ?, TRUE)
         ON DUPLICATE KEY UPDATE UserID = LAST_INSERT_ID(UserID)`,
        [user.username, passwordHash, staffIds[user.staffIdx], user.roleId]
      );
      userIds.push(result.insertId);
    }

    // ─── 5. Patients ───────────────────────────────────────────
    console.log('  → Inserting sample patients...');
    const patients = [
      { first: 'Anura', last: 'Perera', nic: '199512345678', dob: '1995-05-12', gender: 'Male', phone: '0771234567' },
      { first: 'Malini', last: 'Silva', nic: '198876543210', dob: '1988-11-03', gender: 'Female', phone: '0712345678' },
      { first: 'Kamal', last: 'Jayasuriya', nic: '197534567890', dob: '1975-08-21', gender: 'Male', phone: '0769876543' },
      { first: 'Sithmini', last: 'De Silva', nic: '200098765432', dob: '2000-02-14', gender: 'Female', phone: '0751122334' },
      { first: 'Ruwan', last: 'Bandara', nic: '199245678901', dob: '1992-06-30', gender: 'Male', phone: '0783344556' },
    ];

    const patientIds = [];
    for (const p of patients) {
      const [result] = await conn.execute(
        `INSERT INTO Patient (FirstName, LastName, NIC, DateOfBirth, Gender, Phone) VALUES (?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE PatientID = LAST_INSERT_ID(PatientID)`,
        [p.first, p.last, p.nic, p.dob, p.gender, p.phone]
      );
      patientIds.push(result.insertId);
    }

    // ─── 6. Cases ──────────────────────────────────────────────
    console.log('  → Inserting sample cases...');
    const cases = [
      { num: 'CAS-2026-085', type: 'Autopsy', sub: 'Homicidal', date: '2026-07-08', status: 'Pending Court', patIdx: 2, docIdx: 0 },
      { num: 'CAS-2026-087', type: 'Clinical', sub: 'Domestic Abuse', date: '2026-07-09', status: 'Closed', patIdx: 3, docIdx: 1 },
      { num: 'CAS-2026-088', type: 'Autopsy', sub: 'Trauma', date: '2026-07-10', status: 'Under Investigation', patIdx: 1, docIdx: 0 },
      { num: 'CAS-2026-089', type: 'Clinical', sub: 'Trauma', date: '2026-07-11', status: 'Under Investigation', patIdx: 0, docIdx: 0 },
      { num: 'CAS-2026-090', type: 'Clinical', sub: 'Age Estimation', date: '2026-07-15', status: 'Open', patIdx: 4, docIdx: 2 },
    ];

    const caseIds = [];
    for (const c of cases) {
      const [result] = await conn.execute(
        `INSERT INTO \`Case\` (CaseNumber, CaseType, SubCategory, IncidentDate, Status, PatientID, AssignedDoctorID, CreatedBy)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE CaseID = LAST_INSERT_ID(CaseID)`,
        [c.num, c.type, c.sub, c.date, c.status, patientIds[c.patIdx], doctorIds[c.docIdx], userIds[0]]
      );
      caseIds.push(result.insertId);
    }

    // ─── 7. MLEF ───────────────────────────────────────────────
    console.log('  → Inserting sample MLEFs...');
    await conn.execute(
      `INSERT INTO MedicoLegalExamForm (MLEFNumber, CaseID, PatientID, ExaminingDoctorID, ExaminationDate, ReferralSource, Status)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE MLEFID = LAST_INSERT_ID(MLEFID)`,
      ['MLEF/2026/045', caseIds[3], patientIds[0], doctorIds[0], '2026-07-11 09:30:00', 'Police Station', 'Draft']
    );
    await conn.execute(
      `INSERT INTO MedicoLegalExamForm (MLEFNumber, CaseID, PatientID, ExaminingDoctorID, ExaminationDate, ReferralSource, Status)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE MLEFID = LAST_INSERT_ID(MLEFID)`,
      ['MLEF/2026/044', caseIds[1], patientIds[3], doctorIds[1], '2026-07-09 14:00:00', 'Hospital Ward', 'Issued']
    );

    // ─── 8. Postmortem ─────────────────────────────────────────
    console.log('  → Inserting sample postmortem records...');
    const [pmResult] = await conn.execute(
      `INSERT INTO Postmortem (PMNumber, CaseID, DeceasedPatientID, DeathType, DeathSource, AutopsyDate, PerformingDoctorID, Status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE PostmortemID = LAST_INSERT_ID(PostmortemID)`,
      ['PM-2026-031', caseIds[0], patientIds[2], 'Homicidal', 'Outside', '2026-07-08 10:00:00', doctorIds[0], 'Completed']
    );
    const [pm2Result] = await conn.execute(
      `INSERT INTO Postmortem (PMNumber, CaseID, DeceasedPatientID, DeathType, DeathSource, AutopsyDate, PerformingDoctorID, Status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE PostmortemID = LAST_INSERT_ID(PostmortemID)`,
      ['PM-2026-052', caseIds[2], patientIds[1], 'Accidental', 'Hospital', '2026-07-10 08:00:00', doctorIds[0], 'In Progress']
    );

    // ─── 9. Evidence ───────────────────────────────────────────
    console.log('  → Inserting sample evidence...');
    await conn.execute(
      `INSERT INTO Evidence (CaseID, EvidenceType, CollectedDate, CollectedBy, BarcodeQR, ChainOfCustodyStatus)
       VALUES (?, ?, NOW(), ?, ?, ?)`,
      [caseIds[3], 'Blood Swab', staffIds[4], 'EV-84729', 'In Lab']
    );
    await conn.execute(
      `INSERT INTO Evidence (CaseID, EvidenceType, CollectedDate, CollectedBy, BarcodeQR, ChainOfCustodyStatus)
       VALUES (?, ?, NOW(), ?, ?, ?)`,
      [caseIds[2], 'Clothing', staffIds[4], 'EV-84728', 'In Custody']
    );
    await conn.execute(
      `INSERT INTO Evidence (CaseID, EvidenceType, CollectedDate, CollectedBy, BarcodeQR, ChainOfCustodyStatus)
       VALUES (?, ?, NOW(), ?, ?, ?)`,
      [caseIds[0], 'Weapon', staffIds[4], 'EV-84725', 'Transferred']
    );

    // ─── 10. Lab Tests ─────────────────────────────────────────
    console.log('  → Inserting sample lab tests...');
    await conn.execute(
      `INSERT INTO LaboratoryTest (CaseID, EvidenceID, TestType, RequestedBy, RequestDate, Status)
       VALUES (?, (SELECT EvidenceID FROM Evidence WHERE BarcodeQR = 'EV-84729'), ?, ?, CURDATE(), ?)`,
      [caseIds[3], 'Toxicology', doctorIds[1], 'In Progress']
    );
    await conn.execute(
      `INSERT INTO LaboratoryTest (CaseID, TestType, RequestedBy, RequestDate, Status)
       VALUES (?, ?, ?, CURDATE(), ?)`,
      [caseIds[2], 'Histology', doctorIds[2], 'Requested']
    );
    await conn.execute(
      `INSERT INTO LaboratoryTest (CaseID, EvidenceID, TestType, RequestedBy, RequestDate, Status, Result, ResultDate)
       VALUES (?, (SELECT EvidenceID FROM Evidence WHERE BarcodeQR = 'EV-84725'), ?, ?, '2026-07-05', ?, ?, '2026-07-10')`,
      [caseIds[0], 'DNA Analysis', doctorIds[0], 'Completed', 'DNA match confirmed with suspect sample.']
    );

    // ─── 11. Court Reports ─────────────────────────────────────
    console.log('  → Inserting sample court reports...');
    await conn.execute(
      `INSERT INTO CourtReport (CaseID, ReportType, PreparedBy, SubmissionDate, Status)
       VALUES (?, ?, ?, ?, ?)`,
      [caseIds[0], 'Medico-Legal Opinion', doctorIds[0], '2026-07-10', 'Finalized']
    );
    await conn.execute(
      `INSERT INTO CourtReport (CaseID, ReportType, PreparedBy, SubmissionDate, Status)
       VALUES (?, ?, ?, ?, ?)`,
      [caseIds[2], 'Expert Testimony', doctorIds[1], '2026-07-08', 'Draft']
    );

    // ─── 12. Court Summons ─────────────────────────────────────
    console.log('  → Inserting sample court summons...');
    await conn.execute(
      `INSERT INTO CourtSummons (CaseID, DoctorID, CourtName, HearingDate, Status)
       VALUES (?, ?, ?, ?, ?)`,
      [caseIds[0], doctorIds[0], 'Magistrate Court Kandy', '2026-07-25 09:00:00', 'Pending']
    );
    await conn.execute(
      `INSERT INTO CourtSummons (CaseID, DoctorID, CourtName, HearingDate, Status)
       VALUES (?, ?, ?, ?, ?)`,
      [caseIds[1], doctorIds[1], 'District Court Colombo', '2026-07-28 10:00:00', 'Pending']
    );
    await conn.execute(
      `INSERT INTO CourtSummons (CaseID, DoctorID, CourtName, HearingDate, Status)
       VALUES (?, ?, ?, ?, ?)`,
      [caseIds[0], doctorIds[0], 'High Court Kandy', '2026-07-30 14:00:00', 'Pending']
    );

    // ─── 13. Notifications ─────────────────────────────────────
    console.log('  → Inserting sample notifications...');
    await conn.execute(
      `INSERT INTO Notification (UserID, Title, Message, NotificationType, RelatedCaseID)
       VALUES (?, ?, ?, ?, ?)`,
      [userIds[1], 'Court Appearance', 'Magistrate Court Kandy regarding Case CAS-2026-085 on July 25, 2026.', 'Court Date', caseIds[0]]
    );
    await conn.execute(
      `INSERT INTO Notification (UserID, Title, Message, NotificationType, RelatedCaseID)
       VALUES (?, ?, ?, ?, ?)`,
      [userIds[1], 'MLEF Draft Pending', 'MLEF for Patient Anura Perera has not been finalized yet.', 'MLEF Pending', caseIds[3]]
    );
    await conn.execute(
      `INSERT INTO Notification (UserID, Title, Message, NotificationType, RelatedCaseID)
       VALUES (?, ?, ?, ?, ?)`,
      [userIds[1], 'Lab Results Ready', 'Toxicology results for Autopsy PM-2026-031 are available.', 'Report Due', caseIds[0]]
    );

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📋 Default login credentials:');
    console.log('   ──────────────────────────────────');
    console.log('   Admin:    username=admin       password=admin123');
    console.log('   Doctor:   username=DOC-1001    password=admin123');
    console.log('   Doctor:   username=DOC-1002    password=admin123');
    console.log('   Lab Tech: username=LAB-001     password=admin123');
    console.log('   ──────────────────────────────────\n');

  } catch (err) {
    console.error('\n❌ Seed failed:', err.message);
    console.error(err);
  } finally {
    conn.release();
    process.exit(0);
  }
}

seed();

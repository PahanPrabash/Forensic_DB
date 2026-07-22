import pool from './config/db.js';

const triggers = [
  // 1. Patient Triggers
  {
    name: 'after_patient_insert',
    drop: 'DROP TRIGGER IF EXISTS after_patient_insert',
    create: `
      CREATE TRIGGER after_patient_insert
      AFTER INSERT ON Patient
      FOR EACH ROW
      BEGIN
        INSERT INTO AuditLog (Action, TableAffected, RecordID, NewValue)
        VALUES ('INSERT', 'Patient', NEW.PatientID, CONCAT('Name: ', NEW.FirstName, ' ', NEW.LastName, ', NIC: ', COALESCE(NEW.NIC, 'N/A')));
      END
    `
  },
  {
    name: 'after_patient_update',
    drop: 'DROP TRIGGER IF EXISTS after_patient_update',
    create: `
      CREATE TRIGGER after_patient_update
      AFTER UPDATE ON Patient
      FOR EACH ROW
      BEGIN
        INSERT INTO AuditLog (Action, TableAffected, RecordID, OldValue, NewValue)
        VALUES ('UPDATE', 'Patient', NEW.PatientID, CONCAT('NIC: ', COALESCE(OLD.NIC, 'N/A')), CONCAT('NIC: ', COALESCE(NEW.NIC, 'N/A')));
      END
    `
  },
  {
    name: 'after_patient_delete',
    drop: 'DROP TRIGGER IF EXISTS after_patient_delete',
    create: `
      CREATE TRIGGER after_patient_delete
      AFTER DELETE ON Patient
      FOR EACH ROW
      BEGIN
        INSERT INTO AuditLog (Action, TableAffected, RecordID, OldValue)
        VALUES ('DELETE', 'Patient', OLD.PatientID, CONCAT('Name: ', OLD.FirstName, ' ', OLD.LastName, ', NIC: ', COALESCE(OLD.NIC, 'N/A')));
      END
    `
  },

  // 2. Case Triggers
  {
    name: 'after_case_insert',
    drop: 'DROP TRIGGER IF EXISTS after_case_insert',
    create: `
      CREATE TRIGGER after_case_insert
      AFTER INSERT ON \`Case\`
      FOR EACH ROW
      BEGIN
        INSERT INTO AuditLog (Action, TableAffected, RecordID, NewValue)
        VALUES ('INSERT', 'Case', NEW.CaseID, CONCAT('CaseNo: ', NEW.CaseNumber, ', Type: ', NEW.CaseType));
      END
    `
  },
  {
    name: 'after_case_update',
    drop: 'DROP TRIGGER IF EXISTS after_case_update',
    create: `
      CREATE TRIGGER after_case_update
      AFTER UPDATE ON \`Case\`
      FOR EACH ROW
      BEGIN
        INSERT INTO AuditLog (Action, TableAffected, RecordID, OldValue, NewValue)
        VALUES ('UPDATE', 'Case', NEW.CaseID, CONCAT('Status: ', OLD.Status), CONCAT('Status: ', NEW.Status));
      END
    `
  },

  // 3. User Triggers
  {
    name: 'after_user_insert',
    drop: 'DROP TRIGGER IF EXISTS after_user_insert',
    create: `
      CREATE TRIGGER after_user_insert
      AFTER INSERT ON User
      FOR EACH ROW
      BEGIN
        INSERT INTO AuditLog (Action, TableAffected, RecordID, NewValue)
        VALUES ('INSERT', 'User', NEW.UserID, CONCAT('Username: ', NEW.Username, ', RoleID: ', NEW.RoleID));
      END
    `
  },
  {
    name: 'after_user_update',
    drop: 'DROP TRIGGER IF EXISTS after_user_update',
    create: `
      CREATE TRIGGER after_user_update
      AFTER UPDATE ON User
      FOR EACH ROW
      BEGIN
        INSERT INTO AuditLog (Action, TableAffected, RecordID, OldValue, NewValue)
        VALUES ('UPDATE', 'User', NEW.UserID, CONCAT('IsActive: ', OLD.IsActive), CONCAT('IsActive: ', NEW.IsActive));
      END
    `
  },

  // 4. Postmortem & Court Summons Triggers (Teammate's triggers)
  {
    name: 'after_postmortem_insert',
    drop: 'DROP TRIGGER IF EXISTS after_postmortem_insert',
    create: `
      CREATE TRIGGER after_postmortem_insert
      AFTER INSERT ON Postmortem
      FOR EACH ROW
      BEGIN
        INSERT INTO AuditLog (Action, TableAffected, RecordID, NewValue)
        VALUES ('INSERT', 'Postmortem', NEW.PostmortemID, CONCAT('PMNumber: ', NEW.PMNumber, ', Status: ', NEW.Status));
      END
    `
  },
  {
    name: 'after_postmortem_update',
    drop: 'DROP TRIGGER IF EXISTS after_postmortem_update',
    create: `
      CREATE TRIGGER after_postmortem_update
      AFTER UPDATE ON Postmortem
      FOR EACH ROW
      BEGIN
        INSERT INTO AuditLog (Action, TableAffected, RecordID, OldValue, NewValue)
        VALUES ('UPDATE', 'Postmortem', NEW.PostmortemID, CONCAT('Status: ', OLD.Status), CONCAT('Status: ', NEW.Status));
      END
    `
  },
  {
    name: 'after_courtsummons_insert',
    drop: 'DROP TRIGGER IF EXISTS after_courtsummons_insert',
    create: `
      CREATE TRIGGER after_courtsummons_insert
      AFTER INSERT ON CourtSummons
      FOR EACH ROW
      BEGIN
        INSERT INTO AuditLog (Action, TableAffected, RecordID, NewValue)
        VALUES ('INSERT', 'CourtSummons', NEW.SummonsID, CONCAT('CourtName: ', NEW.CourtName, ', HearingDate: ', NEW.HearingDate));
      END
    `
  },
  {
    name: 'after_courtsummons_update',
    drop: 'DROP TRIGGER IF EXISTS after_courtsummons_update',
    create: `
      CREATE TRIGGER after_courtsummons_update
      AFTER UPDATE ON CourtSummons
      FOR EACH ROW
      BEGIN
        INSERT INTO AuditLog (Action, TableAffected, RecordID, OldValue, NewValue)
        VALUES ('UPDATE', 'CourtSummons', NEW.SummonsID, CONCAT('Status: ', OLD.Status), CONCAT('Status: ', NEW.Status));
      END
    `
  }
];

const applyTriggers = async () => {
  console.log('⚡ Applying database audit triggers to MySQL...');
  try {
    for (const t of triggers) {
      console.log(`➡️ Dropping existing ${t.name}...`);
      await pool.query(t.drop);

      console.log(`➡️ Creating trigger ${t.name}...`);
      await pool.query(t.create);
    }
    console.log('✅ All triggers successfully created in forensic_medicine_db!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to apply database triggers:', error);
    process.exit(1);
  }
};

applyTriggers();

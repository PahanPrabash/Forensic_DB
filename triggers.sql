-- ═══════════════════════════════════════════════════════════════════════════
-- FORENSIC MEDICINE DEPARTMENT DATABASE SYSTEM
-- Trigger Definitions for Audit Logging (Member 4 Task)
-- ═══════════════════════════════════════════════════════════════════════════

USE forensic_medicine_db;

DELIMITER //

-- Example trigger for Postmortem Table INSERT
CREATE TRIGGER after_postmortem_insert
AFTER INSERT ON Postmortem
FOR EACH ROW
BEGIN
    INSERT INTO AuditLog (Action, TableAffected, RecordID, NewValue)
    VALUES ('INSERT', 'Postmortem', NEW.PostmortemID, CONCAT('PMNumber: ', NEW.PMNumber, ', Status: ', NEW.Status));
END //

-- Example trigger for Postmortem Table UPDATE
CREATE TRIGGER after_postmortem_update
AFTER UPDATE ON Postmortem
FOR EACH ROW
BEGIN
    INSERT INTO AuditLog (Action, TableAffected, RecordID, OldValue, NewValue)
    VALUES ('UPDATE', 'Postmortem', NEW.PostmortemID, CONCAT('Status: ', OLD.Status), CONCAT('Status: ', NEW.Status));
END //

-- Example trigger for CourtSummons Table INSERT
CREATE TRIGGER after_courtsummons_insert
AFTER INSERT ON CourtSummons
FOR EACH ROW
BEGIN
    INSERT INTO AuditLog (Action, TableAffected, RecordID, NewValue)
    VALUES ('INSERT', 'CourtSummons', NEW.SummonsID, CONCAT('CourtName: ', NEW.CourtName, ', HearingDate: ', NEW.HearingDate));
END //

-- Example trigger for CourtSummons Table UPDATE
CREATE TRIGGER after_courtsummons_update
AFTER UPDATE ON CourtSummons
FOR EACH ROW
BEGIN
    INSERT INTO AuditLog (Action, TableAffected, RecordID, OldValue, NewValue)
    VALUES ('UPDATE', 'CourtSummons', NEW.SummonsID, CONCAT('Status: ', OLD.Status), CONCAT('Status: ', NEW.Status));
END //

DELIMITER ;

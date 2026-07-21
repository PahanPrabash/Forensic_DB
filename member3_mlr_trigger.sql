-- ═══════════════════════════════════════════════════════════════════════════
-- MEMBER 3: MLR Lock Trigger
-- Prevents editing MedicoLegalReport once status is 'Finalized'
-- ═══════════════════════════════════════════════════════════════════════════

USE forensic_medicine_db;

DELIMITER //

-- Trigger: Prevent updates to finalized MLRs
CREATE TRIGGER trg_mlr_lock_finalized
BEFORE UPDATE ON MedicoLegalReport
FOR EACH ROW
BEGIN
    -- If the existing record is already Finalized, block any content changes
    IF OLD.Status = 'Finalized' AND NEW.Status != 'Submitted to Court' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot modify a Finalized Medico-Legal Report. Only status change to "Submitted to Court" is allowed.';
    END IF;

    -- If changing FROM Finalized back to Draft, block it
    IF OLD.Status = 'Finalized' AND NEW.Status = 'Draft' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot revert a Finalized Medico-Legal Report back to Draft status.';
    END IF;

    -- If the record has been submitted to court, block ALL changes
    IF OLD.Status = 'Submitted to Court' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot modify a Medico-Legal Report that has been Submitted to Court.';
    END IF;
END //

DELIMITER ;

-- ═══════════════════════════════════════════════════════════════════════════
-- VERIFICATION: Show trigger info
-- ═══════════════════════════════════════════════════════════════════════════
SHOW TRIGGERS LIKE 'MedicoLegalReport';

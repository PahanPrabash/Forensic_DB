import pool from '../config/db.js';

/**
 * GET /api/evidence
 * List all evidence with chain-of-custody status.
 */
export const getEvidence = async (req, res, next) => {
  try {
    const [evidence] = await pool.execute(
      `SELECT e.EvidenceID, e.EvidenceType, e.Description, e.CollectedDate, e.StorageLocation,
              e.BarcodeQR, e.ChainOfCustodyStatus,
              c.CaseNumber,
              CONCAT(s.FirstName, ' ', s.LastName) AS CollectedByName
       FROM Evidence e
       JOIN \`Case\` c ON e.CaseID = c.CaseID
       LEFT JOIN Staff s ON e.CollectedBy = s.StaffID
       ORDER BY e.CollectedDate DESC`
    );

    res.json(evidence);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/evidence
 * Log new evidence.
 */
export const createEvidence = async (req, res, next) => {
  try {
    const { caseId, evidenceType, description, storageLocation, barcodeQR } = req.body;

    if (!caseId || !evidenceType) {
      return res.status(400).json({ error: 'Case ID and evidence type are required.' });
    }

    // Get staff ID for the current user
    let collectedBy = null;
    if (req.user.staffId) {
      collectedBy = req.user.staffId;
    }

    // Auto-generate barcode if not provided
    const barcode = barcodeQR || `EV-${String(Date.now()).slice(-5)}`;

    const [result] = await pool.execute(
      `INSERT INTO Evidence (CaseID, EvidenceType, Description, CollectedDate, CollectedBy, StorageLocation, BarcodeQR)
       VALUES (?, ?, ?, NOW(), ?, ?, ?)`,
      [caseId, evidenceType, description || null, collectedBy, storageLocation || null, barcode]
    );

    res.status(201).json({
      message: 'Evidence logged successfully.',
      evidenceId: result.insertId,
      barcodeQR: barcode,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/evidence/:id/transfer
 * Record a custody transfer.
 */
export const transferCustody = async (req, res, next) => {
  try {
    const evidenceId = req.params.id;
    const { transferredTo, purpose, remarks, newStatus } = req.body;

    if (!transferredTo) {
      return res.status(400).json({ error: 'Transferred-to staff ID is required.' });
    }

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      // Insert custody record
      await conn.execute(
        `INSERT INTO ChainOfCustody (EvidenceID, TransferredFrom, TransferredTo, TransferDate, Purpose, Remarks)
         VALUES (?, ?, ?, NOW(), ?, ?)`,
        [evidenceId, req.user.staffId || null, transferredTo, purpose || null, remarks || null]
      );

      // Update evidence status
      if (newStatus) {
        await conn.execute(
          `UPDATE Evidence SET ChainOfCustodyStatus = ? WHERE EvidenceID = ?`,
          [newStatus, evidenceId]
        );
      }

      await conn.commit();
      res.json({ message: 'Custody transfer recorded.' });
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/lab-tests
 * List laboratory test requests.
 */
export const getLabTests = async (req, res, next) => {
  try {
    const [tests] = await pool.execute(
      `SELECT lt.TestID, lt.TestType, lt.RequestDate, lt.Result, lt.ResultDate, lt.Status,
              c.CaseNumber,
              e.BarcodeQR AS EvidenceBarcode,
              CONCAT('Dr. ', s.LastName) AS RequestedByName,
              CONCAT(ls.FirstName, ' ', ls.LastName) AS LabStaffName
       FROM LaboratoryTest lt
       JOIN \`Case\` c ON lt.CaseID = c.CaseID
       LEFT JOIN Evidence e ON lt.EvidenceID = e.EvidenceID
       LEFT JOIN Doctor d ON lt.RequestedBy = d.DoctorID
       LEFT JOIN Staff s ON d.StaffID = s.StaffID
       LEFT JOIN Staff ls ON lt.LabStaffID = ls.StaffID
       ORDER BY lt.RequestDate DESC`
    );

    res.json(tests);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/lab-tests
 * Request a new lab test.
 */
export const createLabTest = async (req, res, next) => {
  try {
    const { caseId, evidenceId, testType, requestedBy } = req.body;

    if (!caseId || !testType) {
      return res.status(400).json({ error: 'Case ID and test type are required.' });
    }

    const [result] = await pool.execute(
      `INSERT INTO LaboratoryTest (CaseID, EvidenceID, TestType, RequestedBy, RequestDate, Status)
       VALUES (?, ?, ?, ?, CURDATE(), 'Requested')`,
      [caseId, evidenceId || null, testType, requestedBy || null]
    );

    res.status(201).json({
      message: 'Lab test requested.',
      testId: result.insertId,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/lab-tests/:id
 * Update lab test result/status.
 */
export const updateLabTest = async (req, res, next) => {
  try {
    const { result, status, labStaffId } = req.body;
    const testId = req.params.id;

    const fields = [];
    const params = [];

    if (result !== undefined) { fields.push('Result = ?'); params.push(result); }
    if (status) { fields.push('Status = ?'); params.push(status); }
    if (labStaffId) { fields.push('LabStaffID = ?'); params.push(labStaffId); }

    if (status === 'Completed') {
      fields.push('ResultDate = CURDATE()');
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields to update.' });
    }

    params.push(testId);
    await pool.execute(`UPDATE LaboratoryTest SET ${fields.join(', ')} WHERE TestID = ?`, params);

    res.json({ message: 'Lab test updated.' });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/evidence/staff
 * List all active staff members for custody transfer options.
 */
export const getStaff = async (req, res, next) => {
  try {
    const [staff] = await pool.execute(
      `SELECT StaffID, FirstName, LastName, Role, CONCAT(FirstName, ' ', LastName, ' (', Role, ')') AS FullName
       FROM Staff
       WHERE IsActive = TRUE
       ORDER BY Role, LastName`
    );
    res.json(staff);
  } catch (err) {
    next(err);
  }
};

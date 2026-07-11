-- ═══════════════════════════════════════════════════════════════════════════
-- FORENSIC MEDICINE DEPARTMENT DATABASE SYSTEM
-- MySQL CREATE TABLE Scripts — 25 Tables
-- University of Peradeniya, Dept. Forensic Medicine
-- ═══════════════════════════════════════════════════════════════════════════

-- Drop database if exists and create fresh
DROP DATABASE IF EXISTS forensic_medicine_db;
CREATE DATABASE forensic_medicine_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE forensic_medicine_db;

-- ═══════════════════════════════════════════════════════════════════════════
-- MODULE 6: STAFF & DOCTORS (created first — referenced by many tables)
-- ═══════════════════════════════════════════════════════════════════════════

-- Table 16: Staff
CREATE TABLE Staff (
    StaffID       INT            AUTO_INCREMENT PRIMARY KEY,
    FirstName     VARCHAR(100)   NOT NULL,
    LastName      VARCHAR(100)   NOT NULL,
    Role          ENUM('JMO', 'Lab Technician', 'Clerk', 'Nurse', 'Attendant', 'Other') NOT NULL,
    Department    VARCHAR(100),
    Phone         VARCHAR(15),
    Email         VARCHAR(150),
    HireDate      DATE,
    IsActive      BOOLEAN        DEFAULT TRUE,
    INDEX idx_staff_role (Role),
    INDEX idx_staff_active (IsActive)
) ENGINE=InnoDB;

-- Table 17: Doctor
CREATE TABLE Doctor (
    DoctorID        INT            AUTO_INCREMENT PRIMARY KEY,
    StaffID         INT            NOT NULL UNIQUE,
    MedicalRegNo    VARCHAR(50)    NOT NULL UNIQUE,
    Specialization  VARCHAR(100),
    Designation     VARCHAR(100),
    Qualifications  TEXT,
    FOREIGN KEY (StaffID) REFERENCES Staff(StaffID)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    INDEX idx_doctor_specialization (Specialization)
) ENGINE=InnoDB;


-- ═══════════════════════════════════════════════════════════════════════════
-- MODULE 7: USER AUTHENTICATION & SECURITY
-- ═══════════════════════════════════════════════════════════════════════════

-- Table 19: Role
CREATE TABLE Role (
    RoleID      INT            AUTO_INCREMENT PRIMARY KEY,
    RoleName    VARCHAR(50)    NOT NULL UNIQUE,
    Description TEXT
) ENGINE=InnoDB;

-- Table 20: RolePermission
CREATE TABLE RolePermission (
    PermissionID INT          AUTO_INCREMENT PRIMARY KEY,
    RoleID       INT          NOT NULL,
    Module       VARCHAR(100) NOT NULL,
    CanCreate    BOOLEAN      DEFAULT FALSE,
    CanRead      BOOLEAN      DEFAULT TRUE,
    CanUpdate    BOOLEAN      DEFAULT FALSE,
    CanDelete    BOOLEAN      DEFAULT FALSE,
    FOREIGN KEY (RoleID) REFERENCES Role(RoleID)
        ON UPDATE CASCADE ON DELETE CASCADE,
    UNIQUE KEY uk_role_module (RoleID, Module),
    INDEX idx_perm_role (RoleID)
) ENGINE=InnoDB;

-- Table 18: User
CREATE TABLE User (
    UserID       INT            AUTO_INCREMENT PRIMARY KEY,
    Username     VARCHAR(50)    NOT NULL UNIQUE,
    PasswordHash VARCHAR(255)   NOT NULL,
    StaffID      INT,
    RoleID       INT            NOT NULL,
    IsActive     BOOLEAN        DEFAULT TRUE,
    LastLogin    DATETIME,
    CreatedAt    DATETIME       DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (StaffID) REFERENCES Staff(StaffID)
        ON UPDATE CASCADE ON DELETE SET NULL,
    FOREIGN KEY (RoleID) REFERENCES Role(RoleID)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    INDEX idx_user_active (IsActive),
    INDEX idx_user_role (RoleID)
) ENGINE=InnoDB;


-- ═══════════════════════════════════════════════════════════════════════════
-- MODULE 1: PATIENT & CASE MANAGEMENT (Core)
-- ═══════════════════════════════════════════════════════════════════════════

-- Table 1: Patient
CREATE TABLE Patient (
    PatientID        INT            AUTO_INCREMENT PRIMARY KEY,
    FirstName        VARCHAR(100)   NOT NULL,
    LastName         VARCHAR(100)   NOT NULL,
    DateOfBirth      DATE,
    Age              INT,
    Gender           ENUM('Male', 'Female', 'Other') NOT NULL,
    NIC              VARCHAR(20)    UNIQUE,
    Address          TEXT,
    Phone            VARCHAR(15),
    EmergencyContact VARCHAR(15),
    BloodGroup       VARCHAR(5),
    RegisteredDate   DATETIME       DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_patient_name (LastName, FirstName),
    INDEX idx_patient_nic (NIC),
    INDEX idx_patient_gender (Gender)
) ENGINE=InnoDB;

-- Table 2: Case
CREATE TABLE `Case` (
    CaseID            INT            AUTO_INCREMENT PRIMARY KEY,
    CaseNumber        VARCHAR(50)    NOT NULL UNIQUE,
    CaseType          ENUM('Clinical', 'Autopsy') NOT NULL,
    SubCategory       VARCHAR(100)   COMMENT 'e.g., Trauma, Domestic Abuse, Sexual Abuse, Child Abuse, Detainee, Drug, Age Estimation',
    IncidentDate      DATE           NOT NULL,
    IncidentLocation  TEXT,
    Description       TEXT,
    Status            ENUM('Open', 'Under Investigation', 'Closed', 'Pending Court') DEFAULT 'Open',
    PatientID         INT,
    AssignedDoctorID  INT,
    CreatedBy         INT,
    CreatedAt         DATETIME       DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt         DATETIME       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (PatientID) REFERENCES Patient(PatientID)
        ON UPDATE CASCADE ON DELETE SET NULL,
    FOREIGN KEY (AssignedDoctorID) REFERENCES Doctor(DoctorID)
        ON UPDATE CASCADE ON DELETE SET NULL,
    FOREIGN KEY (CreatedBy) REFERENCES User(UserID)
        ON UPDATE CASCADE ON DELETE SET NULL,
    INDEX idx_case_number (CaseNumber),
    INDEX idx_case_type (CaseType),
    INDEX idx_case_status (Status),
    INDEX idx_case_date (IncidentDate),
    INDEX idx_case_patient (PatientID),
    INDEX idx_case_doctor (AssignedDoctorID)
) ENGINE=InnoDB;

-- Table 3: CaseHistory
CREATE TABLE CaseHistory (
    HistoryID         INT            AUTO_INCREMENT PRIMARY KEY,
    CaseID            INT            NOT NULL,
    ActionDate        DATETIME       NOT NULL,
    ActionDescription TEXT,
    ActionBy          INT,
    FOREIGN KEY (CaseID) REFERENCES `Case`(CaseID)
        ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (ActionBy) REFERENCES User(UserID)
        ON UPDATE CASCADE ON DELETE SET NULL,
    INDEX idx_history_case (CaseID),
    INDEX idx_history_date (ActionDate)
) ENGINE=InnoDB;


-- ═══════════════════════════════════════════════════════════════════════════
-- MODULE 2: CLINICAL FORENSIC COMPONENT
-- ═══════════════════════════════════════════════════════════════════════════

-- Table 4: MedicoLegalExamForm (MLEF)
CREATE TABLE MedicoLegalExamForm (
    MLEFID              INT            AUTO_INCREMENT PRIMARY KEY,
    MLEFNumber          VARCHAR(50)    NOT NULL UNIQUE,
    CaseID              INT            NOT NULL,
    PatientID           INT            NOT NULL,
    ExaminingDoctorID   INT,
    ExaminationDate     DATETIME       NOT NULL,
    ReferralSource      VARCHAR(200)   COMMENT 'e.g., Ward, Police Station, AG Office, Human Rights Commission',
    LegalAuthorization  VARCHAR(200)   COMMENT 'e.g., MLEF, Request Letter, Court Order',
    ClinicalFindings    TEXT,
    Injuries            TEXT,
    Opinion             TEXT,
    Status              ENUM('Draft', 'Issued', 'Pending') DEFAULT 'Draft',
    IssuedDate          DATE,
    PoliceCopyIssued    BOOLEAN        DEFAULT FALSE,
    FOREIGN KEY (CaseID) REFERENCES `Case`(CaseID)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (PatientID) REFERENCES Patient(PatientID)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (ExaminingDoctorID) REFERENCES Doctor(DoctorID)
        ON UPDATE CASCADE ON DELETE SET NULL,
    INDEX idx_mlef_case (CaseID),
    INDEX idx_mlef_patient (PatientID),
    INDEX idx_mlef_status (Status),
    INDEX idx_mlef_date (ExaminationDate)
) ENGINE=InnoDB;

-- Table 5: MedicoLegalReport (MLR)
CREATE TABLE MedicoLegalReport (
    MLRID                INT            AUTO_INCREMENT PRIMARY KEY,
    MLRNumber            VARCHAR(50)    UNIQUE,
    MLEFID               INT            NOT NULL UNIQUE COMMENT '1:1 relationship with MLEF',
    CaseID               INT            NOT NULL,
    PreparedBy           INT,
    ReportDate           DATE           NOT NULL,
    ReportContent        TEXT,
    Conclusion           TEXT,
    Status               ENUM('Draft', 'Finalized', 'Submitted to Court') DEFAULT 'Draft',
    CertificateOfReceipt VARCHAR(100),
    FOREIGN KEY (MLEFID) REFERENCES MedicoLegalExamForm(MLEFID)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (CaseID) REFERENCES `Case`(CaseID)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (PreparedBy) REFERENCES Doctor(DoctorID)
        ON UPDATE CASCADE ON DELETE SET NULL,
    INDEX idx_mlr_case (CaseID),
    INDEX idx_mlr_status (Status)
) ENGINE=InnoDB;

-- Table 6: Referral
CREATE TABLE Referral (
    ReferralID       INT            AUTO_INCREMENT PRIMARY KEY,
    CaseID           INT            NOT NULL,
    MLEFID           INT,
    ReferredTo       VARCHAR(200)   COMMENT 'e.g., Psychiatry, Paediatrics, Gynaecology',
    ReferralDate     DATE           NOT NULL,
    ReferralReason   TEXT,
    ResponseReceived BOOLEAN        DEFAULT FALSE,
    ResponseDate     DATE,
    ResponseFindings TEXT,
    FOREIGN KEY (CaseID) REFERENCES `Case`(CaseID)
        ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (MLEFID) REFERENCES MedicoLegalExamForm(MLEFID)
        ON UPDATE CASCADE ON DELETE SET NULL,
    INDEX idx_referral_case (CaseID),
    INDEX idx_referral_date (ReferralDate)
) ENGINE=InnoDB;

-- Table 7: ReviewAppointment
CREATE TABLE ReviewAppointment (
    ReviewID      INT            AUTO_INCREMENT PRIMARY KEY,
    CaseID        INT            NOT NULL,
    PatientID     INT            NOT NULL,
    ReviewType    ENUM('Inward', 'Outpatient'),
    ScheduledDate DATETIME       NOT NULL,
    DoctorID      INT,
    ReviewNotes   TEXT,
    Status        ENUM('Scheduled', 'Completed', 'Cancelled') DEFAULT 'Scheduled',
    FOREIGN KEY (CaseID) REFERENCES `Case`(CaseID)
        ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (PatientID) REFERENCES Patient(PatientID)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (DoctorID) REFERENCES Doctor(DoctorID)
        ON UPDATE CASCADE ON DELETE SET NULL,
    INDEX idx_review_case (CaseID),
    INDEX idx_review_date (ScheduledDate),
    INDEX idx_review_status (Status)
) ENGINE=InnoDB;


-- ═══════════════════════════════════════════════════════════════════════════
-- MODULE 3: AUTOPSY COMPONENT
-- ═══════════════════════════════════════════════════════════════════════════

-- Table 8: Postmortem
CREATE TABLE Postmortem (
    PostmortemID       INT            AUTO_INCREMENT PRIMARY KEY,
    PMNumber           VARCHAR(50)    NOT NULL UNIQUE,
    CaseID             INT            NOT NULL UNIQUE COMMENT '1:1 relationship with Case (autopsy)',
    DeceasedPatientID  INT,
    DeathType          ENUM('Natural', 'Accidental', 'Suicidal', 'Homicidal', 'Undetermined'),
    DeathSource        ENUM('Hospital', 'Outside'),
    AutopsyDate        DATETIME       NOT NULL,
    PerformingDoctorID INT,
    PreAutopsyInfo     TEXT           COMMENT 'Info from crime scene, BHT, family/eye witness statements, police statements',
    ExternalFindings   TEXT,
    InternalFindings   TEXT,
    PMRContent         TEXT           COMMENT 'Postmortem Report content (audio-to-text recording)',
    Status             ENUM('Pending', 'In Progress', 'Completed') DEFAULT 'Pending',
    FOREIGN KEY (CaseID) REFERENCES `Case`(CaseID)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (DeceasedPatientID) REFERENCES Patient(PatientID)
        ON UPDATE CASCADE ON DELETE SET NULL,
    FOREIGN KEY (PerformingDoctorID) REFERENCES Doctor(DoctorID)
        ON UPDATE CASCADE ON DELETE SET NULL,
    INDEX idx_pm_case (CaseID),
    INDEX idx_pm_date (AutopsyDate),
    INDEX idx_pm_deathtype (DeathType),
    INDEX idx_pm_status (Status)
) ENGINE=InnoDB;

-- Table 9: CauseOfDeath
CREATE TABLE CauseOfDeath (
    CODID                     INT            AUTO_INCREMENT PRIMARY KEY,
    PostmortemID              INT            NOT NULL UNIQUE COMMENT '1:1 relationship with Postmortem',
    ImmediateCause            VARCHAR(500)   NOT NULL,
    AntecedentCause1          VARCHAR(500),
    AntecedentCause2          VARCHAR(500),
    UnderlyingCause           VARCHAR(500),
    OtherSignificantConditions TEXT,
    MannerOfDeath             ENUM('Natural', 'Accident', 'Suicide', 'Homicide', 'Undetermined'),
    IssuedDate                DATE,
    IssuedBy                  INT,
    FOREIGN KEY (PostmortemID) REFERENCES Postmortem(PostmortemID)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (IssuedBy) REFERENCES Doctor(DoctorID)
        ON UPDATE CASCADE ON DELETE SET NULL,
    INDEX idx_cod_manner (MannerOfDeath)
) ENGINE=InnoDB;

-- Table 10: InquestOrder
CREATE TABLE InquestOrder (
    OrderID       INT            AUTO_INCREMENT PRIMARY KEY,
    CaseID        INT            NOT NULL,
    PostmortemID  INT,
    OrderType     ENUM('Inquest Order', 'Court Order') NOT NULL,
    OrderNumber   VARCHAR(50),
    IssuedBy      VARCHAR(200)   COMMENT 'Magistrate name or court',
    IssuedDate    DATE           NOT NULL,
    OrderDocument VARCHAR(500)   COMMENT 'File path to scanned document',
    FOREIGN KEY (CaseID) REFERENCES `Case`(CaseID)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (PostmortemID) REFERENCES Postmortem(PostmortemID)
        ON UPDATE CASCADE ON DELETE SET NULL,
    INDEX idx_inquest_case (CaseID),
    INDEX idx_inquest_type (OrderType)
) ENGINE=InnoDB;


-- ═══════════════════════════════════════════════════════════════════════════
-- MODULE 4: EVIDENCE & INVESTIGATIONS
-- ═══════════════════════════════════════════════════════════════════════════

-- Table 11: Evidence
CREATE TABLE Evidence (
    EvidenceID           INT            AUTO_INCREMENT PRIMARY KEY,
    CaseID               INT            NOT NULL,
    EvidenceType         VARCHAR(100)   NOT NULL COMMENT 'e.g., Blood, Swab, Clothing, Weapon, DNA Sample',
    Description          TEXT,
    CollectedDate        DATETIME       NOT NULL,
    CollectedBy          INT,
    StorageLocation      VARCHAR(200),
    BarcodeQR            VARCHAR(200)   UNIQUE COMMENT 'Barcode/QR code for evidence tracking',
    ChainOfCustodyStatus ENUM('In Custody', 'Transferred', 'Disposed', 'In Lab') DEFAULT 'In Custody',
    FOREIGN KEY (CaseID) REFERENCES `Case`(CaseID)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (CollectedBy) REFERENCES Staff(StaffID)
        ON UPDATE CASCADE ON DELETE SET NULL,
    INDEX idx_evidence_case (CaseID),
    INDEX idx_evidence_type (EvidenceType),
    INDEX idx_evidence_barcode (BarcodeQR),
    INDEX idx_evidence_status (ChainOfCustodyStatus)
) ENGINE=InnoDB;

-- Table 12: ChainOfCustody
CREATE TABLE ChainOfCustody (
    CustodyID       INT            AUTO_INCREMENT PRIMARY KEY,
    EvidenceID      INT            NOT NULL,
    TransferredFrom INT,
    TransferredTo   INT,
    TransferDate    DATETIME       NOT NULL,
    Purpose         TEXT,
    Remarks         TEXT,
    FOREIGN KEY (EvidenceID) REFERENCES Evidence(EvidenceID)
        ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (TransferredFrom) REFERENCES Staff(StaffID)
        ON UPDATE CASCADE ON DELETE SET NULL,
    FOREIGN KEY (TransferredTo) REFERENCES Staff(StaffID)
        ON UPDATE CASCADE ON DELETE SET NULL,
    INDEX idx_custody_evidence (EvidenceID),
    INDEX idx_custody_date (TransferDate)
) ENGINE=InnoDB;

-- Table 13: LaboratoryTest
CREATE TABLE LaboratoryTest (
    TestID         INT            AUTO_INCREMENT PRIMARY KEY,
    CaseID         INT            NOT NULL,
    EvidenceID     INT            COMMENT 'Nullable — test may not be linked to specific evidence',
    TestType       VARCHAR(100)   NOT NULL COMMENT 'e.g., Toxicology, Histology, X-Ray, CT, Blood Investigation',
    RequestedBy    INT,
    RequestDate    DATE           NOT NULL,
    LabStaffID     INT,
    Result         TEXT,
    ResultDate     DATE,
    Status         ENUM('Requested', 'In Progress', 'Completed') DEFAULT 'Requested',
    ReportFilePath VARCHAR(500),
    FOREIGN KEY (CaseID) REFERENCES `Case`(CaseID)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (EvidenceID) REFERENCES Evidence(EvidenceID)
        ON UPDATE CASCADE ON DELETE SET NULL,
    FOREIGN KEY (RequestedBy) REFERENCES Doctor(DoctorID)
        ON UPDATE CASCADE ON DELETE SET NULL,
    FOREIGN KEY (LabStaffID) REFERENCES Staff(StaffID)
        ON UPDATE CASCADE ON DELETE SET NULL,
    INDEX idx_labtest_case (CaseID),
    INDEX idx_labtest_type (TestType),
    INDEX idx_labtest_status (Status)
) ENGINE=InnoDB;


-- ═══════════════════════════════════════════════════════════════════════════
-- MODULE 5: COURT & LEGAL
-- ═══════════════════════════════════════════════════════════════════════════

-- Table 14: CourtReport
CREATE TABLE CourtReport (
    ReportID         INT            AUTO_INCREMENT PRIMARY KEY,
    CaseID           INT            NOT NULL,
    ReportType       VARCHAR(100)   COMMENT 'e.g., Medico-Legal Opinion, Expert Testimony',
    PreparedBy       INT,
    SubmissionDate   DATE,
    CourtName        VARCHAR(200),
    CaseNumberCourt  VARCHAR(100),
    Status           ENUM('Draft', 'Finalized', 'Submitted', 'Accepted') DEFAULT 'Draft',
    ReportContent    TEXT,
    DigitalSignature VARCHAR(500)   COMMENT 'Digital signature reference/hash',
    FOREIGN KEY (CaseID) REFERENCES `Case`(CaseID)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (PreparedBy) REFERENCES Doctor(DoctorID)
        ON UPDATE CASCADE ON DELETE SET NULL,
    INDEX idx_courtreport_case (CaseID),
    INDEX idx_courtreport_status (Status)
) ENGINE=InnoDB;

-- Table 15: CourtSummons
CREATE TABLE CourtSummons (
    SummonsID    INT            AUTO_INCREMENT PRIMARY KEY,
    CaseID       INT            NOT NULL,
    DoctorID     INT,
    CourtName    VARCHAR(200),
    HearingDate  DATETIME       NOT NULL,
    SummonsDate  DATE,
    Purpose      TEXT,
    Status       ENUM('Pending', 'Attended', 'Postponed', 'Cancelled') DEFAULT 'Pending',
    FOREIGN KEY (CaseID) REFERENCES `Case`(CaseID)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (DoctorID) REFERENCES Doctor(DoctorID)
        ON UPDATE CASCADE ON DELETE SET NULL,
    INDEX idx_summons_case (CaseID),
    INDEX idx_summons_date (HearingDate),
    INDEX idx_summons_status (Status)
) ENGINE=InnoDB;


-- ═══════════════════════════════════════════════════════════════════════════
-- MODULE 8: DOCUMENTS & MEDIA
-- ═══════════════════════════════════════════════════════════════════════════

-- Table 21: Document
CREATE TABLE Document (
    DocumentID   INT            AUTO_INCREMENT PRIMARY KEY,
    CaseID       INT            NOT NULL,
    DocumentType VARCHAR(100)   COMMENT 'e.g., MLEF Scan, PMR Scan, Court Order, Certificate of Receipt',
    FilePath     VARCHAR(500)   NOT NULL,
    UploadedBy   INT,
    UploadedAt   DATETIME       DEFAULT CURRENT_TIMESTAMP,
    Description  TEXT,
    FOREIGN KEY (CaseID) REFERENCES `Case`(CaseID)
        ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (UploadedBy) REFERENCES User(UserID)
        ON UPDATE CASCADE ON DELETE SET NULL,
    INDEX idx_doc_case (CaseID),
    INDEX idx_doc_type (DocumentType)
) ENGINE=InnoDB;

-- Table 22: Photograph
CREATE TABLE Photograph (
    PhotoID      INT            AUTO_INCREMENT PRIMARY KEY,
    CaseID       INT            NOT NULL,
    PostmortemID INT            COMMENT 'Nullable — not all photos are related to postmortem',
    PhotoType    ENUM('Crime Scene', 'Clinical', 'Postmortem', 'Evidence'),
    FilePath     VARCHAR(500)   NOT NULL,
    Caption      TEXT,
    TakenDate    DATETIME,
    TakenBy      INT,
    FOREIGN KEY (CaseID) REFERENCES `Case`(CaseID)
        ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (PostmortemID) REFERENCES Postmortem(PostmortemID)
        ON UPDATE CASCADE ON DELETE SET NULL,
    FOREIGN KEY (TakenBy) REFERENCES Staff(StaffID)
        ON UPDATE CASCADE ON DELETE SET NULL,
    INDEX idx_photo_case (CaseID),
    INDEX idx_photo_pm (PostmortemID),
    INDEX idx_photo_type (PhotoType)
) ENGINE=InnoDB;


-- ═══════════════════════════════════════════════════════════════════════════
-- MODULE 9: NOTIFICATIONS & AUDIT
-- ═══════════════════════════════════════════════════════════════════════════

-- Table 23: Notification
CREATE TABLE Notification (
    NotificationID   INT            AUTO_INCREMENT PRIMARY KEY,
    UserID           INT            NOT NULL,
    Title            VARCHAR(200)   NOT NULL,
    Message          TEXT,
    NotificationType ENUM('MLEF Pending', 'COD Pending', 'Court Date', 'Report Due', 'System'),
    RelatedCaseID    INT,
    IsRead           BOOLEAN        DEFAULT FALSE,
    CreatedAt        DATETIME       DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES User(UserID)
        ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (RelatedCaseID) REFERENCES `Case`(CaseID)
        ON UPDATE CASCADE ON DELETE SET NULL,
    INDEX idx_notif_user (UserID),
    INDEX idx_notif_read (IsRead),
    INDEX idx_notif_type (NotificationType),
    INDEX idx_notif_date (CreatedAt)
) ENGINE=InnoDB;

-- Table 24: AuditLog
CREATE TABLE AuditLog (
    LogID         INT            AUTO_INCREMENT PRIMARY KEY,
    UserID        INT,
    Action        VARCHAR(50)    NOT NULL COMMENT 'e.g., INSERT, UPDATE, DELETE, LOGIN, LOGOUT',
    TableAffected VARCHAR(100),
    RecordID      INT,
    OldValue      TEXT,
    NewValue      TEXT,
    IPAddress     VARCHAR(45),
    Timestamp     DATETIME       DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES User(UserID)
        ON UPDATE CASCADE ON DELETE SET NULL,
    INDEX idx_audit_user (UserID),
    INDEX idx_audit_action (Action),
    INDEX idx_audit_table (TableAffected),
    INDEX idx_audit_time (Timestamp)
) ENGINE=InnoDB;


-- ═══════════════════════════════════════════════════════════════════════════
-- MODULE 10: REPORTS & STATISTICS
-- ═══════════════════════════════════════════════════════════════════════════

-- Table 25: ReportTemplate
CREATE TABLE ReportTemplate (
    TemplateID      INT            AUTO_INCREMENT PRIMARY KEY,
    TemplateName    VARCHAR(200)   NOT NULL,
    TemplateType    ENUM('MLR', 'PMR', 'Court Report', 'Statistical', 'Custom'),
    TemplateContent TEXT           COMMENT 'HTML/template markup for auto-generating reports',
    CreatedBy       INT,
    CreatedAt       DATETIME       DEFAULT CURRENT_TIMESTAMP,
    IsActive        BOOLEAN        DEFAULT TRUE,
    FOREIGN KEY (CreatedBy) REFERENCES User(UserID)
        ON UPDATE CASCADE ON DELETE SET NULL,
    INDEX idx_template_type (TemplateType),
    INDEX idx_template_active (IsActive)
) ENGINE=InnoDB;


-- ═══════════════════════════════════════════════════════════════════════════
-- VERIFICATION: List all tables
-- ═══════════════════════════════════════════════════════════════════════════
SHOW TABLES;

-- ═══════════════════════════════════════════════════════════════════════════
-- SUMMARY
-- ═══════════════════════════════════════════════════════════════════════════
-- Total Tables Created: 25
-- 
-- Module 1 (Patient & Case):    Patient, Case, CaseHistory
-- Module 2 (Clinical):          MedicoLegalExamForm, MedicoLegalReport, Referral, ReviewAppointment
-- Module 3 (Autopsy):           Postmortem, CauseOfDeath, InquestOrder
-- Module 4 (Evidence):          Evidence, ChainOfCustody, LaboratoryTest
-- Module 5 (Court):             CourtReport, CourtSummons
-- Module 6 (Staff):             Staff, Doctor
-- Module 7 (Auth):              User, Role, RolePermission
-- Module 8 (Documents):         Document, Photograph
-- Module 9 (Notifications):     Notification, AuditLog
-- Module 10 (Reports):          ReportTemplate
-- 
-- All tables use InnoDB engine for transaction support and foreign key constraints.
-- Proper indexes are created on frequently queried columns.
-- Referential integrity is enforced with ON UPDATE CASCADE and appropriate ON DELETE actions.

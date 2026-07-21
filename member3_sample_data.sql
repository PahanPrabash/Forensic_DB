-- ═══════════════════════════════════════════════════════════════════════════
-- MEMBER 3: Sample Data for Clinical Forensic Module
-- MedicoLegalExamForm, MedicoLegalReport, Referral, ReviewAppointment
-- ═══════════════════════════════════════════════════════════════════════════

USE forensic_medicine_db;

-- ───────────────────────────────────────────────────────────────────────────
-- Prerequisites: Ensure referenced records exist
-- (Staff, Doctor, Patient, Case, User must be populated first)
-- ───────────────────────────────────────────────────────────────────────────

-- Insert sample Staff members (if not already present)
INSERT IGNORE INTO Staff (StaffID, FirstName, LastName, Role, Department, Phone, Email, HireDate, IsActive) VALUES
(1, 'Chaminda', 'Wickramasinghe', 'JMO', 'Forensic Medicine', '0712345678', 'chaminda.w@med.pdn.ac.lk', '2018-03-15', TRUE),
(2, 'Niluka', 'Fernando', 'JMO', 'Forensic Medicine', '0723456789', 'niluka.f@med.pdn.ac.lk', '2019-07-01', TRUE),
(3, 'Saman', 'Perera', 'Lab Technician', 'Forensic Medicine', '0734567890', 'saman.p@med.pdn.ac.lk', '2020-01-10', TRUE),
(4, 'Kumari', 'Silva', 'Nurse', 'Forensic Medicine', '0745678901', 'kumari.s@med.pdn.ac.lk', '2021-06-20', TRUE),
(5, 'Ranjith', 'Bandara', 'Clerk', 'Forensic Medicine', '0756789012', 'ranjith.b@med.pdn.ac.lk', '2017-11-05', TRUE);

-- Insert sample Doctors
INSERT IGNORE INTO Doctor (DoctorID, StaffID, MedicalRegNo, Specialization, Designation, Qualifications) VALUES
(1, 1, 'SLMC-12345', 'Forensic Pathology', 'Consultant JMO', 'MBBS, MD (Forensic Medicine), DMJ'),
(2, 2, 'SLMC-23456', 'Clinical Forensic Medicine', 'Senior Registrar', 'MBBS, MD (Forensic Medicine)');

-- Insert sample Roles and Users
INSERT IGNORE INTO Role (RoleID, RoleName, Description) VALUES
(1, 'Admin', 'Full system access'),
(2, 'JMO', 'Judicial Medical Officer — clinical and autopsy access'),
(3, 'Registrar', 'Senior Registrar — clinical access');

INSERT IGNORE INTO User (UserID, Username, PasswordHash, StaffID, RoleID, IsActive) VALUES
(1, 'dr.chaminda', '$2b$10$dummyhash1234567890abcdefghijklmnopqrstuvwxyz', 1, 2, TRUE),
(2, 'dr.niluka', '$2b$10$dummyhash0987654321zyxwvutsrqponmlkjihgfedcba', 2, 3, TRUE);

-- Insert sample Patients
INSERT IGNORE INTO Patient (PatientID, FirstName, LastName, DateOfBirth, Age, Gender, NIC, Address, Phone, EmergencyContact, BloodGroup) VALUES
(1, 'Kamal', 'Jayasuriya', '1985-04-12', 41, 'Male', '198512345678', '45 Temple Road, Kandy', '0771234567', '0779876543', 'O+'),
(2, 'Nimal', 'Rathnayake', '1992-08-25', 33, 'Male', '199287654321', '12 Lake View, Peradeniya', '0782345678', '0788765432', 'A+'),
(3, 'Sanduni', 'Herath', '1998-11-03', 27, 'Female', '199856789012', '78 Hill Street, Gampola', '0793456789', '0797654321', 'B+'),
(4, 'Priya', 'Dissanayake', '2001-02-14', 25, 'Female', '200112345679', '23 Main Street, Kadugannawa', '0764567890', '0766543210', 'AB+'),
(5, 'Ruwan', 'Wijesinghe', '1978-06-30', 48, 'Male', '197845678901', '56 Station Road, Kandy', '0715678901', '0715432109', 'O-');

-- Insert sample Cases
INSERT IGNORE INTO `Case` (CaseID, CaseNumber, CaseType, SubCategory, IncidentDate, IncidentLocation, Description, Status, PatientID, AssignedDoctorID, CreatedBy) VALUES
(1, 'CW/2026/001', 'Clinical', 'Trauma', '2026-01-15', 'Kandy Police Division', 'Assault victim with multiple injuries — referred by Kandy Police', 'Open', 1, 1, 1),
(2, 'CW/2026/002', 'Clinical', 'Domestic Abuse', '2026-02-08', 'Peradeniya Hospital Ward', 'Domestic violence case — patient admitted to TH Peradeniya', 'Under Investigation', 2, 2, 1),
(3, 'CW/2026/003', 'Clinical', 'Sexual Abuse', '2026-03-10', 'Gampola Police Station', 'Sexual assault case — referred by Gampola Police', 'Open', 3, 1, 2),
(4, 'CW/2026/004', 'Clinical', 'Child Abuse', '2026-04-22', 'Kadugannawa Base Hospital', 'Suspected child abuse — referred by paediatric ward', 'Under Investigation', 4, 2, 2),
(5, 'CW/2026/005', 'Clinical', 'Age Estimation', '2026-05-05', 'Kandy Magistrate Court', 'Age estimation requested by court for disputed minor status', 'Pending Court', 5, 1, 1);


-- ═══════════════════════════════════════════════════════════════════════════
-- MEDICO-LEGAL EXAMINATION FORMS (MLEF)
-- ═══════════════════════════════════════════════════════════════════════════

INSERT INTO MedicoLegalExamForm (MLEFID, MLEFNumber, CaseID, PatientID, ExaminingDoctorID, ExaminationDate, ReferralSource, LegalAuthorization, ClinicalFindings, Injuries, Opinion, Status, IssuedDate, PoliceCopyIssued) VALUES
(1, 'MLEF/2026/001', 1, 1, 1, '2026-01-16 09:30:00',
 'Kandy Police Station',
 'MLEF Request',
 'Patient conscious and oriented. Vitals stable. BP 130/85 mmHg, PR 88/min. No signs of intoxication. Tenderness noted over left temporal region and right forearm.',
 '1. Contusion (3x2 cm) over left temporal region — bluish-purple, swollen, tender.\n2. Laceration (4 cm) over right forearm — irregular edges, bleeding controlled.\n3. Abrasion (5x3 cm) over right knee — superficial, with gravel particles.\n4. Swelling and tenderness over left 5th and 6th ribs — suspected fracture.',
 'Injuries are consistent with assault using a blunt weapon. Category of hurt: Grievous. Recommended X-ray of left rib cage.',
 'Issued', '2026-01-18', TRUE),

(2, 'MLEF/2026/002', 2, 2, 2, '2026-02-09 14:00:00',
 'Hospital Ward',
 'Request Letter',
 'Patient brought from Ward 12, TH Peradeniya. Emotional distress evident. Multiple old and new injuries observed. Vitals: BP 120/75, PR 76/min.',
 '1. Healing contusion (4x3 cm) over left cheek — yellowish-green discoloration (approx 5-7 days old).\n2. Fresh contusion (2x2 cm) over right upper arm — bluish, tender.\n3. Linear abrasion (8 cm) over back — consistent with belt mark.\n4. Tenderness over right shoulder — no visible external injury.',
 'Pattern of injuries (old and new) is consistent with repeated domestic violence. Category of hurt: Non-Grievous. Referral to psychiatry recommended for psychological assessment.',
 'Issued', '2026-02-11', TRUE),

(3, 'MLEF/2026/003', 3, 3, 1, '2026-03-11 10:15:00',
 'Police Station',
 'MLEF Request',
 'Patient examined in private examination room. Detailed history obtained. Examination conducted with female nurse chaperone present.',
 'Findings documented in sealed confidential section — details restricted per protocol for sexual assault cases. Samples collected for DNA analysis.',
 'Examination findings are documented. Samples sent to Government Analyst Department. Final opinion to be issued upon receipt of laboratory results.',
 'Pending', NULL, FALSE),

(4, 'MLEF/2026/004', 4, 4, 2, '2026-04-23 11:00:00',
 'Hospital Ward',
 'Request Letter',
 'Child (age 8) examined in presence of mother and female nurse. Child cooperative but anxious. Growth parameters within normal limits.',
 '1. Multiple circular burn marks (0.5 cm diameter) over both forearms — consistent with cigarette burns, various stages of healing.\n2. Linear bruises over buttocks — parallel pattern, consistent with cane marks.\n3. Healing fracture of left ulna (confirmed by X-ray) — approximately 3 weeks old.',
 'Injuries are highly suggestive of non-accidental injury (child abuse). Multiple injuries at different stages of healing indicate repeated physical abuse. Category of hurt: Grievous. Immediate referral to Paediatrics and NCPA recommended.',
 'Issued', '2026-04-25', TRUE),

(5, 'MLEF/2026/005', 5, 5, 1, '2026-05-06 09:00:00',
 'AG Office',
 'Court Order',
 'Age estimation examination as per Magistrate Court order. Dental examination and skeletal maturity assessment performed. OPG X-ray and wrist X-ray obtained.',
 'No injuries noted. Examination focused on age estimation parameters:\n- Dental: Third molars fully erupted, all permanent teeth present.\n- Skeletal: Fusion of epiphyses at wrist (complete), clavicle (partial medial end).\n- Secondary sexual characteristics: Fully developed (Tanner Stage V).',
 'Based on dental, skeletal, and physical maturity assessment, the estimated age of the individual is between 25 and 30 years, consistent with being above 18 years of age.',
 'Issued', '2026-05-08', TRUE);


-- ═══════════════════════════════════════════════════════════════════════════
-- MEDICO-LEGAL REPORTS (MLR)
-- ═══════════════════════════════════════════════════════════════════════════

INSERT INTO MedicoLegalReport (MLRID, MLRNumber, MLEFID, CaseID, PreparedBy, ReportDate, ReportContent, Conclusion, Status, CertificateOfReceipt) VALUES
(1, 'MLR/2026/001', 1, 1, 1, '2026-01-20',
 'MEDICO-LEGAL REPORT\n\nI, Dr. Chaminda Wickramasinghe, Consultant Judicial Medical Officer, Teaching Hospital Peradeniya, examined Mr. Kamal Jayasuriya (NIC: 198512345678) on 16th January 2026 at 09:30 hours at the request of Kandy Police.\n\nHISTORY: The patient states he was assaulted by two unknown persons with an iron rod on 15/01/2026 at approximately 20:00 hours near Temple Road, Kandy.\n\nFINDINGS:\n1. Contusion (3x2 cm) over left temporal region\n2. Laceration (4 cm) over right forearm\n3. Abrasion (5x3 cm) over right knee\n4. X-ray confirmed fractures of left 5th and 6th ribs\n\nAll injuries are consistent with blunt force trauma.',
 'The injuries described above are consistent with assault using a hard blunt weapon such as an iron rod. The fracture of ribs constitutes GRIEVOUS HURT as defined under Section 311 of the Penal Code of Sri Lanka. The injuries could not have been self-inflicted.',
 'Finalized', 'CR/2026/001'),

(2, 'MLR/2026/002', 2, 2, 2, '2026-02-15',
 'MEDICO-LEGAL REPORT\n\nI, Dr. Niluka Fernando, Senior Registrar in Forensic Medicine, Teaching Hospital Peradeniya, examined Mr. Nimal Rathnayake (NIC: 199287654321) on 9th February 2026.\n\nHISTORY: Patient admitted to Ward 12 following a domestic incident. States he was assaulted by spouse with household objects over the past several months.\n\nFINDINGS:\n1. Healing contusion over left cheek (5-7 days old)\n2. Fresh contusion over right upper arm\n3. Linear abrasion over back consistent with belt mark\n4. Psychological assessment indicates significant emotional trauma',
 'The pattern of old and new injuries at different stages of healing is consistent with repeated physical abuse (domestic violence). Individual injuries are NON-GRIEVOUS. Psychiatric referral has been made for psychological trauma assessment.',
 'Draft', NULL),

(3, 'MLR/2026/004', 4, 4, 2, '2026-04-28',
 'MEDICO-LEGAL REPORT\n\nI, Dr. Niluka Fernando, Senior Registrar in Forensic Medicine, examined the child (name withheld, age 8 years) on 23rd April 2026 at the request of Kadugannawa Base Hospital.\n\nHISTORY: Child presented with multiple injuries at various stages of healing. History provided by mother indicates repeated physical punishment by father.\n\nFINDINGS:\n1. Multiple circular cigarette burn marks on forearms\n2. Parallel linear bruises on buttocks (cane marks)\n3. Healing fracture of left ulna (3 weeks old, confirmed by X-ray)\n\nAll findings are strongly indicative of Non-Accidental Injury (NAI).',
 'The injuries are GRIEVOUS in nature and strongly suggestive of repeated child abuse (Non-Accidental Injury). The case has been referred to the National Child Protection Authority (NCPA). Immediate child protection measures are recommended.',
 'Submitted to Court', 'CR/2026/004'),

(4, 'MLR/2026/005', 5, 5, 1, '2026-05-10',
 'MEDICO-LEGAL REPORT — AGE ESTIMATION\n\nI, Dr. Chaminda Wickramasinghe, Consultant JMO, examined Mr. Ruwan Wijesinghe on 6th May 2026 as per the order of the Kandy Magistrate Court.\n\nMETHODS USED:\n1. Dental examination and OPG X-ray\n2. Skeletal maturity assessment (wrist and clavicle X-rays)\n3. Physical maturity assessment (Tanner staging)\n\nFINDINGS:\n- All permanent teeth erupted including third molars\n- Complete epiphyseal fusion at wrist\n- Partial fusion of medial end of clavicle\n- Tanner Stage V for secondary sexual characteristics',
 'Based on the combined assessment of dental, skeletal, and physical maturity, the estimated age of the subject is between 25 and 30 years. The individual is definitively above the age of 18 years.',
 'Finalized', 'CR/2026/005');


-- ═══════════════════════════════════════════════════════════════════════════
-- REFERRALS
-- ═══════════════════════════════════════════════════════════════════════════

INSERT INTO Referral (ReferralID, CaseID, MLEFID, ReferredTo, ReferralDate, ReferralReason, ResponseReceived, ResponseDate, ResponseFindings) VALUES
(1, 1, 1, 'Radiology — Teaching Hospital Peradeniya',
 '2026-01-16', 'X-ray of left rib cage to confirm suspected fractures of 5th and 6th ribs',
 TRUE, '2026-01-17', 'X-ray confirms non-displaced fractures of left 5th and 6th ribs. No pneumothorax. Conservative management advised.'),

(2, 2, 2, 'Psychiatry — Teaching Hospital Peradeniya',
 '2026-02-10', 'Psychological assessment for domestic violence victim — exhibits symptoms of PTSD and depression',
 TRUE, '2026-02-20', 'Patient diagnosed with PTSD and moderate depressive disorder secondary to chronic domestic abuse. Commenced on counseling and pharmacotherapy. Follow-up scheduled.'),

(3, 4, 4, 'Paediatrics — Teaching Hospital Peradeniya',
 '2026-04-23', 'Child abuse case — requires paediatric evaluation for growth assessment and nutritional status',
 FALSE, NULL, NULL),

(4, 3, 3, 'Gynaecology — Teaching Hospital Peradeniya',
 '2026-03-11', 'Specialist gynecological examination required for sexual assault case',
 TRUE, '2026-03-15', 'Detailed gynecological examination completed. Findings documented and sealed report submitted to JMO.');


-- ═══════════════════════════════════════════════════════════════════════════
-- REVIEW APPOINTMENTS
-- ═══════════════════════════════════════════════════════════════════════════

INSERT INTO ReviewAppointment (ReviewID, CaseID, PatientID, ReviewType, ScheduledDate, DoctorID, ReviewNotes, Status) VALUES
(1, 1, 1, 'Outpatient', '2026-02-16 09:00:00', 1,
 'Review after 4 weeks to assess healing of rib fractures and document recovery progress for court report',
 'Completed'),

(2, 2, 2, 'Outpatient', '2026-03-09 14:00:00', 2,
 'Follow-up to assess new injuries and collect updated psychiatric report for MLR finalization',
 'Scheduled'),

(3, 4, 4, 'Inward', '2026-05-23 10:00:00', 2,
 'Follow-up examination of child — reassess healing of ulna fracture and check for any new injuries',
 'Scheduled'),

(4, 3, 3, 'Outpatient', '2026-04-11 11:00:00', 1,
 'Review appointment to discuss laboratory results and finalize MLR',
 'Cancelled');


-- ═══════════════════════════════════════════════════════════════════════════
-- VERIFICATION: Check inserted records
-- ═══════════════════════════════════════════════════════════════════════════
SELECT 'MedicoLegalExamForm' AS TableName, COUNT(*) AS Records FROM MedicoLegalExamForm
UNION ALL
SELECT 'MedicoLegalReport', COUNT(*) FROM MedicoLegalReport
UNION ALL
SELECT 'Referral', COUNT(*) FROM Referral
UNION ALL
SELECT 'ReviewAppointment', COUNT(*) FROM ReviewAppointment;

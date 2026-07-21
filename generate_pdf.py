import sys
import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_header_footer(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_header_footer(self, page_count):
        self.saveState()
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#1A365D"))
        
        # Header (Only on page 2 and later)
        if self._pageNumber > 1:
            self.drawString(54, 750, "CO2050 DATABASE SYSTEMS — EQUAL SOFTWARE WORKLOAD ALLOCATION (GITHUB AUDIT)")
            self.setStrokeColor(colors.HexColor("#CBD5E0"))
            self.setLineWidth(0.5)
            self.line(54, 742, 558, 742)
        
        # Footer
        self.setFont("Helvetica", 8)
        self.setStrokeColor(colors.HexColor("#CBD5E0"))
        self.setLineWidth(0.5)
        self.line(54, 45, 558, 45)
        
        self.drawString(54, 32, "Faculty of Engineering, UOP | Equal Software Division for GitHub Evaluation")
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(558, 32, page_text)
        self.restoreState()

def build_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )
    
    styles = getSampleStyleSheet()
    
    PRIMARY = colors.HexColor("#1A365D")   # Deep Navy
    SECONDARY = colors.HexColor("#0D9488") # Teal Accent
    DARK_TEXT = colors.HexColor("#2D3748") # Charcoal Body
    LIGHT_BG = colors.HexColor("#F8FAFC")  # Off-white / Table Light
    BORDER_COLOR = colors.HexColor("#CBD5E0")

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=PRIMARY,
        spaceAfter=4
    )

    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10.5,
        leading=14,
        textColor=colors.HexColor("#4A5568"),
        spaceAfter=12
    )

    h1_style = ParagraphStyle(
        'SectionH1',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=PRIMARY,
        spaceBefore=12,
        spaceAfter=6,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=DARK_TEXT,
        spaceAfter=6
    )

    bullet_style = ParagraphStyle(
        'BulletDark',
        parent=body_style,
        leftIndent=10,
        bulletIndent=3,
        spaceAfter=3
    )

    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.white,
        alignment=1
    )

    table_cell_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=DARK_TEXT
    )

    table_cell_bold = ParagraphStyle(
        'TableCellBold',
        parent=table_cell_style,
        fontName='Helvetica-Bold'
    )

    table_cell_center = ParagraphStyle(
        'TableCellCenter',
        parent=table_cell_style,
        alignment=1
    )

    story = []

    # Title Banner
    story.append(Paragraph("FORENSIC MEDICINE DEPARTMENT DATABASE SYSTEM", title_style))
    story.append(Paragraph("Equal Full-Stack Software Division & GitHub Contribution Plan (4 Members)", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=2, color=PRIMARY, spaceBefore=0, spaceAfter=10))

    # Meta Note
    meta_data = [
        [Paragraph("<b>Evaluation Strategy:</b> Equal GitHub Code Commits across Frontend, Backend & Database", table_cell_style),
         Paragraph("<b>Team Structure:</b> 4 Full-Stack Members (Equal Workload)", table_cell_style)],
        [Paragraph("<b>Frontend Framework:</b> React + Vite (HTML/CSS/JS)", table_cell_style),
         Paragraph("<b>Backend & Database:</b> Node.js / Express (or Flask) + MySQL", table_cell_style)]
    ]
    t_meta = Table(meta_data, colWidths=[250, 254])
    t_meta.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), LIGHT_BG),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t_meta)
    story.append(Spacer(1, 10))

    # EXECUTIVE PURPOSE
    story.append(Paragraph("1. Purpose of Equal Software Division for GitHub Evaluation", h1_style))
    story.append(Paragraph(
        "To ensure that course evaluators reviewing the group's GitHub repository see <b>equal commit history, code volume, and full-stack technical contribution</b> from all 4 team members, the software application is divided into <b>4 vertical feature modules</b>. Each member builds a complete end-to-end slice containing React Frontend Views, Express/Flask REST API Endpoints, MySQL Queries/Triggers, and Unit Tests.",
        body_style
    ))
    story.append(Spacer(1, 8))

    # EQUAL WORKLOAD MATRIX
    story.append(Paragraph("2. Full-Stack Software Workload Distribution Matrix", h1_style))
    
    matrix_data = [
        [Paragraph("Member", table_header_style), Paragraph("Feature Module Slices", table_header_style), Paragraph("Frontend React Components", table_header_style), Paragraph("Backend API Endpoints", table_header_style), Paragraph("SQL Tables & Triggers", table_header_style)],
        
        [Paragraph("<b>Member 1</b>", table_cell_center),
         Paragraph("<b>Auth, Security & Staff Administration</b>", table_cell_bold),
         Paragraph("• <code>Login.jsx</code> & <code>Signup.jsx</code><br/>• <code>StaffManagement.jsx</code><br/>• <code>RolePermissionManager.jsx</code>", table_cell_style),
         Paragraph("• <code>POST /api/auth/login</code><br/>• <code>GET/POST /api/staff</code><br/>• <code>GET/POST /api/doctors</code><br/>• <code>PUT /api/roles/permissions</code>", table_cell_style),
         Paragraph("• <code>User</code>, <code>Role</code>, <code>RolePermission</code>, <code>Staff</code>, <code>Doctor</code><br/>• Password hash procedure", table_cell_style)],

        [Paragraph("<b>Member 2</b>", table_cell_center),
         Paragraph("<b>Patient Intake, Case & Evidence Tracking</b>", table_cell_bold),
         Paragraph("• <code>PatientRegistration.jsx</code><br/>• <code>Cases.jsx</code> (Case Record UI)<br/>• <code>Evidence.jsx</code> (QR Code & Custody)", table_cell_style),
         Paragraph("• <code>GET/POST /api/patients</code><br/>• <code>GET/POST /api/cases</code><br/>• <code>GET/POST /api/evidence</code><br/>• <code>POST /api/evidence/transfer</code>", table_cell_style),
         Paragraph("• <code>Patient</code>, <code>CaseRecord</code>, <code>CaseHistory</code>, <code>Evidence</code>, <code>ChainOfCustody</code>, <code>LaboratoryTest</code><br/>• Case auto-number trigger", table_cell_style)],

        [Paragraph("<b>Member 3</b>", table_cell_center),
         Paragraph("<b>Clinical Forensic Examinations & MLR</b>", table_cell_bold),
         Paragraph("• <code>MlefForm.jsx</code> (Clinical exam)<br/>• <code>MlReport.jsx</code> (MLR generation)<br/>• <code>ReferralsAndReviews.jsx</code>", table_cell_style),
         Paragraph("• <code>GET/POST /api/mlef</code><br/>• <code>GET/POST /api/mlr</code><br/>• <code>PUT /api/mlr/issue</code><br/>• <code>GET/POST /api/referrals</code>", table_cell_style),
         Paragraph("• <code>MedicoLegalExamForm</code>, <code>MedicoLegalReport</code>, <code>Referral</code>, <code>ReviewAppointment</code><br/>• MLR lock trigger", table_cell_style)],

        [Paragraph("<b>Member 4</b>", table_cell_center),
         Paragraph("<b>Autopsy, Court Summons & Audit/Notifications</b>", table_cell_bold),
         Paragraph("• <code>AutopsyForm.jsx</code> (PM Autopsy)<br/>• <code>CauseOfDeathForm.jsx</code><br/>• <code>CourtSummons.jsx</code><br/>• <code>AuditAndNotifications.jsx</code>", table_cell_style),
         Paragraph("• <code>GET/POST /api/postmortem</code><br/>• <code>GET/POST /api/cause-of-death</code><br/>• <code>GET/POST /api/court-summons</code><br/>• <code>GET /api/audit-logs</code>", table_cell_style),
         Paragraph("• <code>Postmortem</code>, <code>CauseOfDeath</code>, <code>InquestOrder</code>, <code>CourtReport</code>, <code>CourtSummons</code>, <code>AuditLog</code>, <code>Notification</code>, <code>Document</code>, <code>Photograph</code>, <code>ReportTemplate</code><br/>• AuditLog trigger", table_cell_style)]
    ]

    t_matrix = Table(matrix_data, colWidths=[55, 110, 115, 114, 110])
    t_matrix.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, LIGHT_BG]),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_matrix)
    story.append(Spacer(1, 12))

    # DETAILED CODE RESPONSIBILITIES PER MEMBER
    story.append(Paragraph("3. Detailed Full-Stack Software Tasks & GitHub Commit Plan", h1_style))

    # MEMBER 1
    m1_content = [
        [Paragraph("MEMBER 1: Auth, Security & Staff Admin (Full-Stack Vertical)", table_header_style)],
        [Paragraph(
            "<b>Frontend Code (React)</b>: Build <code>Login.jsx</code>, <code>Signup.jsx</code>, <code>StaffManagement.jsx</code>, and <code>RolePermissionManager.jsx</code>. Implement JWT token persistence in <code>localStorage</code>, login state context, and permission-based UI routing.<br/>"
            "<b>Backend Code (API)</b>: Create <code>authController.js</code> and <code>staffController.js</code> routes. Implement bcrypt password hashing, token verification middleware (<code>authMiddleware.js</code>), and staff CRUD endpoints.<br/>"
            "<b>Database Code (SQL)</b>: Write SQL scripts for <code>User</code>, <code>Role</code>, <code>RolePermission</code>, <code>Staff</code>, <code>Doctor</code> tables. Write stored procedure for credential validation.<br/>"
            "<b>GitHub Commit Targets</b>: Auth UI components, Auth controller API routes, JWT middleware, Staff/Doctor management components.",
            table_cell_style
        )]
    ]
    t_m1 = Table(m1_content, colWidths=[504])
    t_m1.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY),
        ('BACKGROUND', (0,1), (-1,1), LIGHT_BG),
        ('BOX', (0,0), (-1,-1), 1, PRIMARY),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 7),
        ('RIGHTPADDING', (0,0), (-1,-1), 7),
    ]))
    story.append(t_m1)
    story.append(Spacer(1, 8))

    # MEMBER 2
    m2_content = [
        [Paragraph("MEMBER 2: Patient Intake, Cases & Evidence Tracking (Full-Stack Vertical)", table_header_style)],
        [Paragraph(
            "<b>Frontend Code (React)</b>: Build <code>PatientRegistration.jsx</code>, <code>Cases.jsx</code>, and <code>Evidence.jsx</code>. Implement barcode/QR code rendering component using <code>qrcode.react</code> library for evidence samples.<br/>"
            "<b>Backend Code (API)</b>: Create <code>patientController.js</code>, <code>caseController.js</code>, and <code>evidenceController.js</code>. Build endpoints for patient creation, case intake assignment, evidence chain of custody transfers, and lab test status updates.<br/>"
            "<b>Database Code (SQL)</b>: Write SQL scripts for <code>Patient</code>, <code>CaseRecord</code>, <code>CaseHistory</code>, <code>Evidence</code>, <code>ChainOfCustody</code>, <code>LaboratoryTest</code>. Write trigger for auto-generating unique case numbers (`CW/2026/XXX`).<br/>"
            "<b>GitHub Commit Targets</b>: Patient reg UI, Case management routes, Evidence QR component, Chain of custody transfer API.",
            table_cell_style
        )]
    ]
    t_m2 = Table(m2_content, colWidths=[504])
    t_m2.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), SECONDARY),
        ('BACKGROUND', (0,1), (-1,1), LIGHT_BG),
        ('BOX', (0,0), (-1,-1), 1, SECONDARY),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 7),
        ('RIGHTPADDING', (0,0), (-1,-1), 7),
    ]))
    story.append(t_m2)
    story.append(Spacer(1, 8))

    # MEMBER 3
    m3_content = [
        [Paragraph("MEMBER 3: Clinical Forensic Exams & Medico-Legal Reports (Full-Stack Vertical)", table_header_style)],
        [Paragraph(
            "<b>Frontend Code (React)</b>: Build <code>MlefForm.jsx</code>, <code>MlReport.jsx</code>, and <code>ReferralsAndReviews.jsx</code>. Include interactive injury location selector and printable MLR report preview screen.<br/>"
            "<b>Backend Code (API)</b>: Create <code>mlefController.js</code>, <code>mlrController.js</code>, and <code>referralController.js</code>. Build routes for saving examination findings, finalizing MLRs, generating receipt certificates, and managing clinical referrals.<br/>"
            "<b>Database Code (SQL)</b>: Write SQL scripts for <code>MedicoLegalExamForm</code>, <code>MedicoLegalReport</code>, <code>Referral</code>, <code>ReviewAppointment</code>. Write trigger to prevent editing MLRs once status is 'Finalized'.<br/>"
            "<b>GitHub Commit Targets</b>: MLEF form component, MLR generation controller, Referral tracking UI, PDF/Print report stylesheet.",
            table_cell_style
        )]
    ]
    t_m3 = Table(m3_content, colWidths=[504])
    t_m3.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY),
        ('BACKGROUND', (0,1), (-1,1), LIGHT_BG),
        ('BOX', (0,0), (-1,-1), 1, PRIMARY),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 7),
        ('RIGHTPADDING', (0,0), (-1,-1), 7),
    ]))
    story.append(t_m3)
    story.append(Spacer(1, 8))

    # MEMBER 4
    m4_content = [
        [Paragraph("MEMBER 4: Autopsy Component, Court Summons & Audit/Notifications (Full-Stack Vertical)", table_header_style)],
        [Paragraph(
            "<b>Frontend Code (React)</b>: Build <code>AutopsyForm.jsx</code>, <code>CauseOfDeathForm.jsx</code>, <code>CourtSummons.jsx</code>, and <code>AuditAndNotifications.jsx</code>. Include postmortem internal/external findings inputs and court appearance calendar.<br/>"
            "<b>Backend Code (API)</b>: Create <code>autopsyController.js</code>, <code>courtController.js</code>, and <code>auditController.js</code>. Build API routes for postmortem procedures, cause of death forms, summons tracking, and fetching immutable audit logs.<br/>"
            "<b>Database Code (SQL)</b>: Write SQL scripts for <code>Postmortem</code>, <code>CauseOfDeath</code>, <code>InquestOrder</code>, <code>CourtReport</code>, <code>CourtSummons</code>, <code>AuditLog</code>, <code>Notification</code>, <code>Document</code>, <code>Photograph</code>, <code>ReportTemplate</code>. Write automated MySQL <code>AuditLog</code> trigger for all table changes.<br/>"
            "<b>GitHub Commit Targets</b>: Autopsy intake UI, Cause of Death API, Court summons calendar component, Audit log trigger script.",
            table_cell_style
        )]
    ]
    t_m4 = Table(m4_content, colWidths=[504])
    t_m4.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), SECONDARY),
        ('BACKGROUND', (0,1), (-1,1), LIGHT_BG),
        ('BOX', (0,0), (-1,-1), 1, SECONDARY),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 7),
        ('RIGHTPADDING', (0,0), (-1,-1), 7),
    ]))
    story.append(t_m4)
    story.append(Spacer(1, 10))

    # SECTION 4: GITHUB COMMIT & VERIFICATION BEST PRACTICES
    story.append(Paragraph("4. Recommended GitHub Commit Guidelines for Evaluator Audit", h1_style))
    story.append(Paragraph("To ensure evaluators see strong, distinct contributions from all 4 members:", body_style))
    story.append(Paragraph("• <b>Individual Feature Branches:</b> Each member should work on their own git branch (e.g., <code>feature/auth-m1</code>, <code>feature/cases-m2</code>, <code>feature/mlef-m3</code>, <code>feature/autopsy-m4</code>).", bullet_style))
    story.append(Paragraph("• <b>Commit Frequency:</b> Every member should make 10-15 meaningful commits covering their assigned frontend components, backend controllers, and SQL files.", bullet_style))
    story.append(Paragraph("• <b>Descriptive Commit Messages:</b> Use structured commit prefixes (e.g., <code>feat(auth): add JWT login controller</code>, <code>feat(cases): build patient registration form</code>).", bullet_style))
    story.append(Paragraph("• <b>Pull Request Reviews:</b> Merge feature branches into <code>main</code> using Pull Requests so GitHub records code reviews by team members.", bullet_style))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Updated PDF created at: {filename}")

if __name__ == "__main__":
    out_path = os.path.join(r"c:\Users\DRONE SUDDA\Desktop\Com\Sem 04\C02050 Database Systems\mini project\Forensic_DB", "Forensic_DB_Work_Division_Report.pdf")
    build_pdf(out_path)

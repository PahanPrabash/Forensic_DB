import html as html_lib
import sys
sys.stdout.reconfigure(encoding='utf-8')

# ═══════════════════════════════════════════════════════════════
# DATA DEFINITIONS
# ═══════════════════════════════════════════════════════════════

MODULES = [
    {'id':'core',     'name':'Patient & Case Management', 'color':'#6366f1', 'stroke':'#4338ca'},
    {'id':'clinical', 'name':'Clinical Forensic',          'color':'#0891b2', 'stroke':'#0e7490'},
    {'id':'autopsy',  'name':'Autopsy Component',          'color':'#dc2626', 'stroke':'#b91c1c'},
    {'id':'evidence', 'name':'Evidence & Investigations',   'color':'#d97706', 'stroke':'#b45309'},
    {'id':'court',    'name':'Court & Legal',               'color':'#7c3aed', 'stroke':'#6d28d9'},
    {'id':'staff',    'name':'Staff & Doctors',             'color':'#059669', 'stroke':'#047857'},
    {'id':'auth',     'name':'Authentication & Security',   'color':'#2563eb', 'stroke':'#1d4ed8'},
    {'id':'docs',     'name':'Documents & Media',           'color':'#db2777', 'stroke':'#be185d'},
    {'id':'notify',   'name':'Notifications & Audit',       'color':'#ea580c', 'stroke':'#c2410c'},
    {'id':'reports',  'name':'Reports & Statistics',         'color':'#65a30d', 'stroke':'#4d7c0f'},
]

TABLES = [
    # ── Module: core ──
    {'id':'Patient', 'module':'core', 'x':160, 'y':420, 'cols':[
        {'name':'PatientID',      'type':'INT',         'pk':True},
        {'name':'FirstName',      'type':'VARCHAR(100)'},
        {'name':'LastName',       'type':'VARCHAR(100)'},
        {'name':'DateOfBirth',    'type':'DATE'},
        {'name':'Age',            'type':'INT'},
        {'name':'Gender',         'type':'ENUM'},
        {'name':'NIC',            'type':'VARCHAR(20)'},
        {'name':'Address',        'type':'TEXT'},
        {'name':'Phone',          'type':'VARCHAR(15)'},
        {'name':'EmergencyContact','type':'VARCHAR(15)'},
        {'name':'BloodGroup',     'type':'VARCHAR(5)'},
        {'name':'RegisteredDate', 'type':'DATETIME'},
    ]},
    {'id':'Case', 'module':'core', 'x':900, 'y':380, 'cols':[
        {'name':'CaseID',          'type':'INT',         'pk':True},
        {'name':'CaseNumber',      'type':'VARCHAR(50)'},
        {'name':'CaseType',        'type':'ENUM'},
        {'name':'SubCategory',     'type':'VARCHAR(100)'},
        {'name':'IncidentDate',    'type':'DATE'},
        {'name':'IncidentLocation','type':'TEXT'},
        {'name':'Description',     'type':'TEXT'},
        {'name':'Status',          'type':'ENUM'},
        {'name':'PatientID',       'type':'INT',         'fk':'Patient'},
        {'name':'AssignedDoctorID','type':'INT',         'fk':'Doctor'},
        {'name':'CreatedBy',       'type':'INT',         'fk':'User'},
        {'name':'CreatedAt',       'type':'DATETIME'},
        {'name':'UpdatedAt',       'type':'DATETIME'},
    ]},
    {'id':'CaseHistory', 'module':'core', 'x':1640, 'y':420, 'cols':[
        {'name':'HistoryID',        'type':'INT',    'pk':True},
        {'name':'CaseID',           'type':'INT',    'fk':'Case'},
        {'name':'ActionDate',       'type':'DATETIME'},
        {'name':'ActionDescription','type':'TEXT'},
        {'name':'ActionBy',         'type':'INT',    'fk':'User'},
    ]},

    # ── Module: clinical ──
    {'id':'MedicoLegalExamForm', 'module':'clinical', 'x':40, 'y':920, 'cols':[
        {'name':'MLEFID',            'type':'INT',         'pk':True},
        {'name':'MLEFNumber',        'type':'VARCHAR(50)'},
        {'name':'CaseID',            'type':'INT',         'fk':'Case'},
        {'name':'PatientID',         'type':'INT',         'fk':'Patient'},
        {'name':'ExaminingDoctorID', 'type':'INT',         'fk':'Doctor'},
        {'name':'ExaminationDate',   'type':'DATETIME'},
        {'name':'ReferralSource',    'type':'VARCHAR(200)'},
        {'name':'LegalAuthorization','type':'VARCHAR(200)'},
        {'name':'ClinicalFindings',  'type':'TEXT'},
        {'name':'Injuries',          'type':'TEXT'},
        {'name':'Opinion',           'type':'TEXT'},
        {'name':'Status',            'type':'ENUM'},
        {'name':'IssuedDate',        'type':'DATE'},
        {'name':'PoliceCopyIssued',  'type':'BOOLEAN'},
    ]},
    {'id':'MedicoLegalReport', 'module':'clinical', 'x':500, 'y':920, 'cols':[
        {'name':'MLRID',              'type':'INT',         'pk':True},
        {'name':'MLRNumber',          'type':'VARCHAR(50)'},
        {'name':'MLEFID',             'type':'INT',         'fk':'MedicoLegalExamForm'},
        {'name':'CaseID',             'type':'INT',         'fk':'Case'},
        {'name':'PreparedBy',         'type':'INT',         'fk':'Doctor'},
        {'name':'ReportDate',         'type':'DATE'},
        {'name':'ReportContent',      'type':'TEXT'},
        {'name':'Conclusion',         'type':'TEXT'},
        {'name':'Status',             'type':'ENUM'},
        {'name':'CertificateOfReceipt','type':'VARCHAR(100)'},
    ]},
    {'id':'Referral', 'module':'clinical', 'x':40, 'y':1420, 'cols':[
        {'name':'ReferralID',       'type':'INT',    'pk':True},
        {'name':'CaseID',           'type':'INT',    'fk':'Case'},
        {'name':'MLEFID',           'type':'INT',    'fk':'MedicoLegalExamForm'},
        {'name':'ReferredTo',       'type':'VARCHAR(200)'},
        {'name':'ReferralDate',     'type':'DATE'},
        {'name':'ReferralReason',   'type':'TEXT'},
        {'name':'ResponseReceived', 'type':'BOOLEAN'},
        {'name':'ResponseDate',     'type':'DATE'},
        {'name':'ResponseFindings', 'type':'TEXT'},
    ]},
    {'id':'ReviewAppointment', 'module':'clinical', 'x':500, 'y':1420, 'cols':[
        {'name':'ReviewID',     'type':'INT',    'pk':True},
        {'name':'CaseID',       'type':'INT',    'fk':'Case'},
        {'name':'PatientID',    'type':'INT',    'fk':'Patient'},
        {'name':'ReviewType',   'type':'ENUM'},
        {'name':'ScheduledDate','type':'DATETIME'},
        {'name':'DoctorID',     'type':'INT',    'fk':'Doctor'},
        {'name':'ReviewNotes',  'type':'TEXT'},
        {'name':'Status',       'type':'ENUM'},
    ]},

    # ── Module: autopsy ──
    {'id':'Postmortem', 'module':'autopsy', 'x':1700, 'y':920, 'cols':[
        {'name':'PostmortemID',      'type':'INT',         'pk':True},
        {'name':'PMNumber',          'type':'VARCHAR(50)'},
        {'name':'CaseID',            'type':'INT',         'fk':'Case'},
        {'name':'DeceasedPatientID', 'type':'INT',         'fk':'Patient'},
        {'name':'DeathType',         'type':'ENUM'},
        {'name':'DeathSource',       'type':'ENUM'},
        {'name':'AutopsyDate',       'type':'DATETIME'},
        {'name':'PerformingDoctorID','type':'INT',         'fk':'Doctor'},
        {'name':'PreAutopsyInfo',    'type':'TEXT'},
        {'name':'ExternalFindings',  'type':'TEXT'},
        {'name':'InternalFindings',  'type':'TEXT'},
        {'name':'PMRContent',        'type':'TEXT'},
        {'name':'Status',            'type':'ENUM'},
    ]},
    {'id':'CauseOfDeath', 'module':'autopsy', 'x':2200, 'y':920, 'cols':[
        {'name':'CODID',                 'type':'INT',         'pk':True},
        {'name':'PostmortemID',          'type':'INT',         'fk':'Postmortem'},
        {'name':'ImmediateCause',        'type':'VARCHAR(500)'},
        {'name':'AntecedentCause1',      'type':'VARCHAR(500)'},
        {'name':'AntecedentCause2',      'type':'VARCHAR(500)'},
        {'name':'UnderlyingCause',       'type':'VARCHAR(500)'},
        {'name':'OtherSignificantCond',  'type':'TEXT'},
        {'name':'MannerOfDeath',         'type':'ENUM'},
        {'name':'IssuedDate',            'type':'DATE'},
        {'name':'IssuedBy',              'type':'INT',         'fk':'Doctor'},
    ]},
    {'id':'InquestOrder', 'module':'autopsy', 'x':2200, 'y':1420, 'cols':[
        {'name':'OrderID',      'type':'INT',         'pk':True},
        {'name':'CaseID',       'type':'INT',         'fk':'Case'},
        {'name':'PostmortemID', 'type':'INT',         'fk':'Postmortem'},
        {'name':'OrderType',    'type':'ENUM'},
        {'name':'OrderNumber',  'type':'VARCHAR(50)'},
        {'name':'IssuedBy',     'type':'VARCHAR(200)'},
        {'name':'IssuedDate',   'type':'DATE'},
        {'name':'OrderDocument','type':'VARCHAR(500)'},
    ]},

    # ── Module: evidence ──
    {'id':'Evidence', 'module':'evidence', 'x':160, 'y':1920, 'cols':[
        {'name':'EvidenceID',           'type':'INT',         'pk':True},
        {'name':'CaseID',               'type':'INT',         'fk':'Case'},
        {'name':'EvidenceType',         'type':'VARCHAR(100)'},
        {'name':'Description',          'type':'TEXT'},
        {'name':'CollectedDate',        'type':'DATETIME'},
        {'name':'CollectedBy',          'type':'INT',         'fk':'Staff'},
        {'name':'StorageLocation',      'type':'VARCHAR(200)'},
        {'name':'BarcodeQR',            'type':'VARCHAR(200)'},
        {'name':'ChainOfCustodyStatus', 'type':'ENUM'},
    ]},
    {'id':'ChainOfCustody', 'module':'evidence', 'x':620, 'y':1920, 'cols':[
        {'name':'CustodyID',       'type':'INT',    'pk':True},
        {'name':'EvidenceID',      'type':'INT',    'fk':'Evidence'},
        {'name':'TransferredFrom', 'type':'INT',    'fk':'Staff'},
        {'name':'TransferredTo',   'type':'INT',    'fk':'Staff'},
        {'name':'TransferDate',    'type':'DATETIME'},
        {'name':'Purpose',         'type':'TEXT'},
        {'name':'Remarks',         'type':'TEXT'},
    ]},
    {'id':'LaboratoryTest', 'module':'evidence', 'x':1080, 'y':1920, 'cols':[
        {'name':'TestID',         'type':'INT',         'pk':True},
        {'name':'CaseID',         'type':'INT',         'fk':'Case'},
        {'name':'EvidenceID',     'type':'INT',         'fk':'Evidence'},
        {'name':'TestType',       'type':'VARCHAR(100)'},
        {'name':'RequestedBy',    'type':'INT',         'fk':'Doctor'},
        {'name':'RequestDate',    'type':'DATE'},
        {'name':'LabStaffID',     'type':'INT',         'fk':'Staff'},
        {'name':'Result',         'type':'TEXT'},
        {'name':'ResultDate',     'type':'DATE'},
        {'name':'Status',         'type':'ENUM'},
        {'name':'ReportFilePath', 'type':'VARCHAR(500)'},
    ]},

    # ── Module: court ──
    {'id':'CourtReport', 'module':'court', 'x':1600, 'y':1920, 'cols':[
        {'name':'ReportID',        'type':'INT',         'pk':True},
        {'name':'CaseID',          'type':'INT',         'fk':'Case'},
        {'name':'ReportType',      'type':'VARCHAR(100)'},
        {'name':'PreparedBy',      'type':'INT',         'fk':'Doctor'},
        {'name':'SubmissionDate',  'type':'DATE'},
        {'name':'CourtName',       'type':'VARCHAR(200)'},
        {'name':'CaseNumberCourt', 'type':'VARCHAR(100)'},
        {'name':'Status',          'type':'ENUM'},
        {'name':'ReportContent',   'type':'TEXT'},
        {'name':'DigitalSignature','type':'VARCHAR(500)'},
    ]},
    {'id':'CourtSummons', 'module':'court', 'x':2100, 'y':1920, 'cols':[
        {'name':'SummonsID',   'type':'INT',         'pk':True},
        {'name':'CaseID',      'type':'INT',         'fk':'Case'},
        {'name':'DoctorID',    'type':'INT',         'fk':'Doctor'},
        {'name':'CourtName',   'type':'VARCHAR(200)'},
        {'name':'HearingDate', 'type':'DATETIME'},
        {'name':'SummonsDate', 'type':'DATE'},
        {'name':'Purpose',     'type':'TEXT'},
        {'name':'Status',      'type':'ENUM'},
    ]},

    # ── Module: staff ──
    {'id':'Staff', 'module':'staff', 'x':2160, 'y':60, 'cols':[
        {'name':'StaffID',   'type':'INT',         'pk':True},
        {'name':'FirstName', 'type':'VARCHAR(100)'},
        {'name':'LastName',  'type':'VARCHAR(100)'},
        {'name':'Role',      'type':'ENUM'},
        {'name':'Department','type':'VARCHAR(100)'},
        {'name':'Phone',     'type':'VARCHAR(15)'},
        {'name':'Email',     'type':'VARCHAR(150)'},
        {'name':'HireDate',  'type':'DATE'},
        {'name':'IsActive',  'type':'BOOLEAN'},
    ]},
    {'id':'Doctor', 'module':'staff', 'x':2620, 'y':60, 'cols':[
        {'name':'DoctorID',       'type':'INT',         'pk':True},
        {'name':'StaffID',        'type':'INT',         'fk':'Staff'},
        {'name':'MedicalRegNo',   'type':'VARCHAR(50)'},
        {'name':'Specialization', 'type':'VARCHAR(100)'},
        {'name':'Designation',    'type':'VARCHAR(100)'},
        {'name':'Qualifications', 'type':'TEXT'},
    ]},

    # ── Module: auth ──
    {'id':'User', 'module':'auth', 'x':160, 'y':60, 'cols':[
        {'name':'UserID',       'type':'INT',         'pk':True},
        {'name':'Username',     'type':'VARCHAR(50)'},
        {'name':'PasswordHash', 'type':'VARCHAR(255)'},
        {'name':'StaffID',      'type':'INT',         'fk':'Staff'},
        {'name':'RoleID',       'type':'INT',         'fk':'Role'},
        {'name':'IsActive',     'type':'BOOLEAN'},
        {'name':'LastLogin',    'type':'DATETIME'},
        {'name':'CreatedAt',    'type':'DATETIME'},
    ]},
    {'id':'Role', 'module':'auth', 'x':660, 'y':60, 'cols':[
        {'name':'RoleID',     'type':'INT',         'pk':True},
        {'name':'RoleName',   'type':'VARCHAR(50)'},
        {'name':'Description','type':'TEXT'},
    ]},
    {'id':'RolePermission', 'module':'auth', 'x':1100, 'y':60, 'cols':[
        {'name':'PermissionID','type':'INT',    'pk':True},
        {'name':'RoleID',      'type':'INT',    'fk':'Role'},
        {'name':'Module',      'type':'VARCHAR(100)'},
        {'name':'CanCreate',   'type':'BOOLEAN'},
        {'name':'CanRead',     'type':'BOOLEAN'},
        {'name':'CanUpdate',   'type':'BOOLEAN'},
        {'name':'CanDelete',   'type':'BOOLEAN'},
    ]},

    # ── Module: docs ──
    {'id':'Document', 'module':'docs', 'x':160, 'y':2440, 'cols':[
        {'name':'DocumentID',  'type':'INT',         'pk':True},
        {'name':'CaseID',      'type':'INT',         'fk':'Case'},
        {'name':'DocumentType','type':'VARCHAR(100)'},
        {'name':'FilePath',    'type':'VARCHAR(500)'},
        {'name':'UploadedBy',  'type':'INT',         'fk':'User'},
        {'name':'UploadedAt',  'type':'DATETIME'},
        {'name':'Description', 'type':'TEXT'},
    ]},
    {'id':'Photograph', 'module':'docs', 'x':620, 'y':2440, 'cols':[
        {'name':'PhotoID',     'type':'INT',    'pk':True},
        {'name':'CaseID',      'type':'INT',    'fk':'Case'},
        {'name':'PostmortemID','type':'INT',    'fk':'Postmortem'},
        {'name':'PhotoType',   'type':'ENUM'},
        {'name':'FilePath',    'type':'VARCHAR(500)'},
        {'name':'Caption',     'type':'TEXT'},
        {'name':'TakenDate',   'type':'DATETIME'},
        {'name':'TakenBy',     'type':'INT',    'fk':'Staff'},
    ]},

    # ── Module: notify ──
    {'id':'Notification', 'module':'notify', 'x':1200, 'y':2440, 'cols':[
        {'name':'NotificationID',  'type':'INT',    'pk':True},
        {'name':'UserID',          'type':'INT',    'fk':'User'},
        {'name':'Title',           'type':'VARCHAR(200)'},
        {'name':'Message',         'type':'TEXT'},
        {'name':'NotificationType','type':'ENUM'},
        {'name':'RelatedCaseID',   'type':'INT',    'fk':'Case'},
        {'name':'IsRead',          'type':'BOOLEAN'},
        {'name':'CreatedAt',       'type':'DATETIME'},
    ]},
    {'id':'AuditLog', 'module':'notify', 'x':1700, 'y':2440, 'cols':[
        {'name':'LogID',        'type':'INT',    'pk':True},
        {'name':'UserID',       'type':'INT',    'fk':'User'},
        {'name':'Action',       'type':'VARCHAR(50)'},
        {'name':'TableAffected','type':'VARCHAR(100)'},
        {'name':'RecordID',     'type':'INT'},
        {'name':'OldValue',     'type':'TEXT'},
        {'name':'NewValue',     'type':'TEXT'},
        {'name':'IPAddress',    'type':'VARCHAR(45)'},
        {'name':'Timestamp',    'type':'DATETIME'},
    ]},

    # ── Module: reports ──
    {'id':'ReportTemplate', 'module':'reports', 'x':2200, 'y':2440, 'cols':[
        {'name':'TemplateID',     'type':'INT',         'pk':True},
        {'name':'TemplateName',   'type':'VARCHAR(200)'},
        {'name':'TemplateType',   'type':'ENUM'},
        {'name':'TemplateContent','type':'TEXT'},
        {'name':'CreatedBy',      'type':'INT',         'fk':'User'},
        {'name':'CreatedAt',      'type':'DATETIME'},
        {'name':'IsActive',       'type':'BOOLEAN'},
    ]},
]

RELATIONSHIPS = [
    {'from':'Case',       'fromCol':'PatientID',        'to':'Patient',             'card':'M:1'},
    {'from':'Case',       'fromCol':'AssignedDoctorID',  'to':'Doctor',              'card':'M:1'},
    {'from':'Case',       'fromCol':'CreatedBy',         'to':'User',                'card':'M:1'},
    {'from':'CaseHistory','fromCol':'CaseID',            'to':'Case',                'card':'M:1'},
    {'from':'CaseHistory','fromCol':'ActionBy',           'to':'User',                'card':'M:1'},
    {'from':'MedicoLegalExamForm','fromCol':'CaseID',     'to':'Case',                'card':'M:1'},
    {'from':'MedicoLegalExamForm','fromCol':'PatientID',   'to':'Patient',             'card':'M:1'},
    {'from':'MedicoLegalExamForm','fromCol':'ExaminingDoctorID', 'to':'Doctor',        'card':'M:1'},
    {'from':'MedicoLegalReport','fromCol':'MLEFID',        'to':'MedicoLegalExamForm', 'card':'1:1'},
    {'from':'MedicoLegalReport','fromCol':'CaseID',         'to':'Case',                'card':'M:1'},
    {'from':'MedicoLegalReport','fromCol':'PreparedBy',     'to':'Doctor',              'card':'M:1'},
    {'from':'Referral',   'fromCol':'CaseID',             'to':'Case',                'card':'M:1'},
    {'from':'Referral',   'fromCol':'MLEFID',             'to':'MedicoLegalExamForm', 'card':'M:1'},
    {'from':'ReviewAppointment','fromCol':'CaseID',        'to':'Case',                'card':'M:1'},
    {'from':'ReviewAppointment','fromCol':'PatientID',      'to':'Patient',             'card':'M:1'},
    {'from':'ReviewAppointment','fromCol':'DoctorID',       'to':'Doctor',              'card':'M:1'},
    {'from':'Postmortem', 'fromCol':'CaseID',              'to':'Case',                'card':'1:1'},
    {'from':'Postmortem', 'fromCol':'DeceasedPatientID',    'to':'Patient',             'card':'M:1'},
    {'from':'Postmortem', 'fromCol':'PerformingDoctorID',   'to':'Doctor',              'card':'M:1'},
    {'from':'CauseOfDeath','fromCol':'PostmortemID',        'to':'Postmortem',          'card':'1:1'},
    {'from':'CauseOfDeath','fromCol':'IssuedBy',            'to':'Doctor',              'card':'M:1'},
    {'from':'InquestOrder','fromCol':'CaseID',              'to':'Case',                'card':'M:1'},
    {'from':'InquestOrder','fromCol':'PostmortemID',         'to':'Postmortem',          'card':'1:1'},
    {'from':'Evidence',   'fromCol':'CaseID',              'to':'Case',                'card':'M:1'},
    {'from':'Evidence',   'fromCol':'CollectedBy',          'to':'Staff',               'card':'M:1'},
    {'from':'ChainOfCustody','fromCol':'EvidenceID',        'to':'Evidence',            'card':'M:1'},
    {'from':'ChainOfCustody','fromCol':'TransferredFrom',   'to':'Staff',               'card':'M:1'},
    {'from':'ChainOfCustody','fromCol':'TransferredTo',     'to':'Staff',               'card':'M:1'},
    {'from':'LaboratoryTest','fromCol':'CaseID',            'to':'Case',                'card':'M:1'},
    {'from':'LaboratoryTest','fromCol':'EvidenceID',         'to':'Evidence',            'card':'M:1'},
    {'from':'LaboratoryTest','fromCol':'RequestedBy',        'to':'Doctor',              'card':'M:1'},
    {'from':'LaboratoryTest','fromCol':'LabStaffID',         'to':'Staff',               'card':'M:1'},
    {'from':'CourtReport','fromCol':'CaseID',               'to':'Case',                'card':'M:1'},
    {'from':'CourtReport','fromCol':'PreparedBy',            'to':'Doctor',              'card':'M:1'},
    {'from':'CourtSummons','fromCol':'CaseID',              'to':'Case',                'card':'M:1'},
    {'from':'CourtSummons','fromCol':'DoctorID',             'to':'Doctor',              'card':'M:1'},
    {'from':'Doctor',     'fromCol':'StaffID',              'to':'Staff',               'card':'1:1'},
    {'from':'User',       'fromCol':'StaffID',              'to':'Staff',               'card':'1:1'},
    {'from':'User',       'fromCol':'RoleID',               'to':'Role',                'card':'M:1'},
    {'from':'RolePermission','fromCol':'RoleID',            'to':'Role',                'card':'M:1'},
    {'from':'Document',   'fromCol':'CaseID',              'to':'Case',                'card':'M:1'},
    {'from':'Document',   'fromCol':'UploadedBy',           'to':'User',                'card':'M:1'},
    {'from':'Photograph', 'fromCol':'CaseID',              'to':'Case',                'card':'M:1'},
    {'from':'Photograph', 'fromCol':'PostmortemID',          'to':'Postmortem',          'card':'M:1'},
    {'from':'Photograph', 'fromCol':'TakenBy',              'to':'Staff',               'card':'M:1'},
    {'from':'Notification','fromCol':'UserID',              'to':'User',                'card':'M:1'},
    {'from':'Notification','fromCol':'RelatedCaseID',       'to':'Case',                'card':'M:1'},
    {'from':'AuditLog',   'fromCol':'UserID',              'to':'User',                'card':'M:1'},
    {'from':'ReportTemplate','fromCol':'CreatedBy',         'to':'User',                'card':'M:1'},
]

MODULE_LABELS = [
    {'text':'Authentication &amp; Security',   'x':160,  'y':25,   'module':'auth'},
    {'text':'Patient &amp; Case Management',   'x':900,  'y':345,  'module':'core'},
    {'text':'Clinical Forensic Component',     'x':40,   'y':885,  'module':'clinical'},
    {'text':'Autopsy Component',               'x':1700, 'y':885,  'module':'autopsy'},
    {'text':'Evidence &amp; Investigations',    'x':160,  'y':1885, 'module':'evidence'},
    {'text':'Court &amp; Legal',                'x':1600, 'y':1885, 'module':'court'},
    {'text':'Staff &amp; Doctors',              'x':2160, 'y':25,   'module':'staff'},
    {'text':'Documents &amp; Media',            'x':160,  'y':2405, 'module':'docs'},
    {'text':'Notifications &amp; Audit',        'x':1200, 'y':2405, 'module':'notify'},
    {'text':'Reports &amp; Statistics',          'x':2200, 'y':2405, 'module':'reports'},
]


# ═══════════════════════════════════════════════════════════════
# XML GENERATION
# ═══════════════════════════════════════════════════════════════

def esc(s):
    """XML-escape a string for use in attribute values."""
    return html_lib.escape(str(s), quote=True)

def col_label_html(col):
    """Generate HTML label for a column row."""
    if col.get('pk') and col.get('fk'):
        marker = '&lt;b style=&quot;color:#c084fc&quot;&gt;PFK&lt;/b&gt; '
    elif col.get('pk'):
        marker = '&lt;b style=&quot;color:#fbbf24&quot;&gt;PK&lt;/b&gt;  '
    elif col.get('fk'):
        marker = '&lt;b style=&quot;color:#38bdf8&quot;&gt;FK&lt;/b&gt;  '
    else:
        marker = '       '
    
    name = esc(col['name'])
    typ = esc(col['type'])
    return f'{marker}{name} &lt;i style=&quot;color:#94a3b8;font-size:10px&quot;&gt;{typ}&lt;/i&gt;'

def generate():
    cells = []
    cell_counter = 2  # 0 and 1 are reserved
    
    # ── Module label annotations ──
    for ml in MODULE_LABELS:
        mod = next(m for m in MODULES if m['id'] == ml['module'])
        style = (f'text;html=1;align=left;verticalAlign=bottom;'
                 f'fontSize=12;fontStyle=1;fontColor={mod["color"]};'
                 f'strokeColor=none;fillColor=none;whiteSpace=wrap;')
        cells.append(
            f'        <mxCell id="{cell_counter}" value="{ml["text"]}" '
            f'style="{style}" vertex="1" parent="1">\n'
            f'          <mxGeometry x="{ml["x"]}" y="{ml["y"]}" width="300" height="28" as="geometry"/>\n'
            f'        </mxCell>'
        )
        cell_counter += 1
    
    # ── Table entities ──
    for table in TABLES:
        mod = next(m for m in MODULES if m['id'] == table['module'])
        num_cols = len(table['cols'])
        row_h = 24
        header_h = 32
        total_h = header_h + num_cols * row_h
        width = 270
        
        # Container (swimlane)
        container_style = (
            f'swimlane;fontStyle=1;align=center;startSize={header_h};html=1;'
            f'fillColor={mod["color"]};fontColor=#FFFFFF;strokeColor={mod["stroke"]};'
            f'rounded=1;arcSize=6;whiteSpace=wrap;fontSize=13;collapsible=0;'
            f'swimlaneLine=1;shadow=1;glass=0;'
        )
        cells.append(
            f'        <mxCell id="t_{table["id"]}" value="{esc(table["id"])}" '
            f'style="{container_style}" vertex="1" parent="1">\n'
            f'          <mxGeometry x="{table["x"]}" y="{table["y"]}" width="{width}" height="{total_h}" as="geometry"/>\n'
            f'        </mxCell>'
        )
        
        # Column rows
        for i, col in enumerate(table['cols']):
            col_id = f't_{table["id"]}_c{i}'
            label = col_label_html(col)
            y = header_h + i * row_h
            
            # Alternate row backgrounds for readability
            bg = '#f8fafc' if i % 2 == 0 else '#ffffff'
            
            col_style = (
                f'text;strokeColor=none;fillColor={bg};align=left;verticalAlign=middle;'
                f'spacingLeft=8;spacingRight=4;overflow=hidden;'
                f'points=[[0,0.5],[1,0.5]];portConstraint=eastwest;'
                f'rotatable=0;html=1;fontSize=11;whiteSpace=wrap;'
            )
            cells.append(
                f'        <mxCell id="{col_id}" value="{label}" '
                f'style="{col_style}" vertex="1" parent="t_{table["id"]}">\n'
                f'          <mxGeometry y="{y}" width="{width}" height="{row_h}" as="geometry"/>\n'
                f'        </mxCell>'
            )
    
    # ── Relationship edges ──
    for i, rel in enumerate(RELATIONSHIPS):
        if rel['card'] == '1:1':
            arrows = 'endArrow=ERone;endFill=0;startArrow=ERone;startFill=0;'
            label = '1:1'
        else:  # M:1
            arrows = 'endArrow=ERone;endFill=0;startArrow=ERmany;startFill=0;'
            label = 'M:1'
        
        # Use the FK column in the source table for the label
        fk_label = esc(rel.get('fromCol', ''))
        
        edge_style = (
            f'edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;'
            f'jettySize=auto;html=1;{arrows}'
            f'strokeColor=#94a3b8;strokeWidth=1;'
            f'fontSize=9;fontColor=#64748b;'
            f'exitX=0.5;exitY=0;exitDx=0;exitDy=0;'
            f'entryX=0.5;entryY=1;entryDx=0;entryDy=0;'
        )
        
        cells.append(
            f'        <mxCell id="r_{i}" value="{label}" '
            f'style="{edge_style}" edge="1" '
            f'source="t_{rel["from"]}" target="t_{rel["to"]}" parent="1">\n'
            f'          <mxGeometry relative="1" as="geometry"/>\n'
            f'        </mxCell>'
        )
    
    # ── Title ──
    title_style = ('text;html=1;align=center;verticalAlign=middle;'
                   'fontSize=22;fontStyle=1;fontColor=#1e293b;'
                   'strokeColor=none;fillColor=none;whiteSpace=wrap;')
    cells.append(
        f'        <mxCell id="title" value="Forensic Medicine Department Database System — ER Diagram (25 Tables)" '
        f'style="{title_style}" vertex="1" parent="1">\n'
        f'          <mxGeometry x="700" y="-60" width="1200" height="40" as="geometry"/>\n'
        f'        </mxCell>'
    )
    
    subtitle_style = ('text;html=1;align=center;verticalAlign=middle;'
                      'fontSize=13;fontStyle=0;fontColor=#64748b;'
                      'strokeColor=none;fillColor=none;whiteSpace=wrap;')
    cells.append(
        f'        <mxCell id="subtitle" value="University of Peradeniya — Dept. of Forensic Medicine" '
        f'style="{subtitle_style}" vertex="1" parent="1">\n'
        f'          <mxGeometry x="900" y="-25" width="800" height="25" as="geometry"/>\n'
        f'        </mxCell>'
    )
    
    # ── Build final XML ──
    xml = f'''<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="app.diagrams.net" modified="2026-07-11T10:45:00.000Z" agent="Antigravity" version="24.7.6" type="device">
  <diagram id="forensic-medicine-er" name="ER Diagram - Forensic Medicine">
    <mxGraphModel dx="2000" dy="1500" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="0" pageScale="1" pageWidth="5000" pageHeight="4000" math="0" shadow="0">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>
{chr(10).join(cells)}
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>'''
    
    return xml

# ═══════════════════════════════════════════════════════════════
# WRITE FILE
# ═══════════════════════════════════════════════════════════════

xml_content = generate()

output_path = r'd:\database_project\er_diagram.drawio'
with open(output_path, 'w', encoding='utf-8') as f:
    f.write(xml_content)

print(f'Successfully generated: {output_path}')
print(f'Tables: {len(TABLES)}')
print(f'Relationships: {len(RELATIONSHIPS)}')
print(f'Total columns: {sum(len(t["cols"]) for t in TABLES)}')

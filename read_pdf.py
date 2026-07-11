import PyPDF2
import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'd:\database_project\Digital database.pdf', 'rb') as f:
    reader = PyPDF2.PdfReader(f)
    for i in range(15, len(reader.pages)):
        text = reader.pages[i].extract_text()
        print(f"--- PAGE {i+1} ---")
        print(text[:2000])
        print()

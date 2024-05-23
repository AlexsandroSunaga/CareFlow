"""Generate a demo intake PDF with synthetic PHI for redaction testing."""
from pathlib import Path

import fitz

out = Path(__file__).resolve().parents[1] / "data" / "sample_intake.pdf"
out.parent.mkdir(parents=True, exist_ok=True)
doc = fitz.open()
page = doc.new_page()
text = """
Patient Intake (DEMO ONLY)
Name: Jane Q. Public
SSN: 123-45-6789
Phone: (555) 010-9988
Email: jane.public@example.com
MRN: PT-99887766
DOB: 03/15/1988
Address: 742 Evergreen Terrace, Springfield 62704

Chief complaint: Follow-up visit.
"""
page.insert_text((72, 72), text, fontsize=11)
doc.save(out)
print(f"Wrote {out}")

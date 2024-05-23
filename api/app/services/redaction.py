"""PDF PHI redaction: pattern search + optional manual quads (PDF points)."""
import re
from dataclasses import dataclass
from pathlib import Path

import fitz  # PyMuPDF

BLUE = (0.12, 0.35, 0.95)

PATTERNS: list[tuple[str, re.Pattern[str]]] = [
    ("ssn", re.compile(r"\b\d{3}-\d{2}-\d{4}\b")),
    ("ssn_compact", re.compile(r"\b\d{9}\b")),
    ("phone", re.compile(r"\b(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b")),
    ("email", re.compile(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b")),
    ("mrn", re.compile(r"\b(?:MRN|Patient\s*ID|UID)[:\s#-]*[A-Z0-9-]{6,}\b", re.I)),
    ("dob", re.compile(r"\b(?:DOB|Date of Birth)[:\s]*\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b", re.I)),
    ("zip", re.compile(r"\b\d{5}(?:-\d{4})?\b")),
]


@dataclass
class RedactionResult:
    hits: int
    output_path: Path
    preview_text: str


def _redact_rect(page: fitz.Page, rect: fitz.Rect) -> None:
    pad = 1.5
    r = fitz.Rect(rect.x0 - pad, rect.y0 - pad, rect.x1 + pad, rect.y1 + pad)
    page.add_redact_annot(r, fill=BLUE, text="")
    page.apply_redactions(images=fitz.PDF_REDACT_IMAGE_PIXELS)


def redact_pdf(
    source: Path,
    destination: Path,
    manual_regions: list[dict] | None = None,
) -> RedactionResult:
    destination.parent.mkdir(parents=True, exist_ok=True)
    doc = fitz.open(source)
    hits = 0
    preview_parts: list[str] = []

    for page_index, page in enumerate(doc):
        for _label, pattern in PATTERNS:
            for block in page.get_text("blocks"):
                text = block[4] if len(block) > 4 else ""
                for match in pattern.finditer(text):
                    areas = page.search_for(match.group())
                    for rect in areas:
                        _redact_rect(page, rect)
                        hits += 1

        if manual_regions:
            for region in manual_regions:
                if int(region.get("page", 0)) != page_index:
                    continue
                rect = fitz.Rect(
                    float(region["x0"]),
                    float(region["y0"]),
                    float(region["x1"]),
                    float(region["y1"]),
                )
                _redact_rect(page, rect)
                hits += 1

        preview_parts.append(page.get_text()[:2000])

    doc.save(destination, deflate=True, garbage=4)
    doc.close()
    return RedactionResult(
        hits=hits,
        output_path=destination,
        preview_text="\n".join(preview_parts)[:8000],
    )

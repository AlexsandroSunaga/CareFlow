import json
import secrets
from datetime import datetime
from pathlib import Path

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from fastapi.responses import FileResponse
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.deps import get_current_user, get_optional_user
from app.db import get_db
from app.models import AuditLog, DocumentJob, User
from app.services.ai_summary import summarize_redacted_text
from app.services.redaction import redact_pdf

router = APIRouter(prefix="/documents", tags=["documents"])


class DocumentOut(BaseModel):
    id: int
    case_id: str
    original_name: str
    status: str
    redaction_hits: int
    ai_summary: str | None
    created_at: datetime

    class Config:
        from_attributes = True


@router.get("", response_model=list[DocumentOut])
async def list_documents(
    user: User | None = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db),
):
    if not user:
        return []
    result = await db.execute(select(DocumentJob).order_by(DocumentJob.created_at.desc()).limit(100))
    return list(result.scalars().all())


@router.post("/upload", response_model=DocumentOut)
async def upload_document(
    file: UploadFile = File(...),
    manual_regions: str = Form("[]"),
    case_id: str | None = Form(None),
    db: AsyncSession = Depends(get_db),
):
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(400, "PDF files only")

    upload_root = Path(settings.upload_dir)
    redacted_root = Path(settings.redacted_dir)
    upload_root.mkdir(parents=True, exist_ok=True)
    redacted_root.mkdir(parents=True, exist_ok=True)

    token = secrets.token_hex(8)
    source = upload_root / f"{token}_{file.filename}"
    dest = redacted_root / f"{token}_redacted.pdf"
    content = await file.read()
    source.write_bytes(content)

    try:
        regions = json.loads(manual_regions) if manual_regions else []
    except json.JSONDecodeError:
        regions = []

    job = DocumentJob(
        case_id=case_id or f"CASE-{datetime.utcnow():%Y}-{secrets.token_hex(3).upper()}",
        original_name=file.filename,
        status="processing",
    )
    db.add(job)
    await db.commit()
    await db.refresh(job)

    try:
        result = redact_pdf(source, dest, manual_regions=regions)
        summary = summarize_redacted_text(result.preview_text)
        job.status = "ready"
        job.redaction_hits = result.hits
        job.redacted_path = str(dest)
        job.ai_summary = summary
    except Exception as exc:  # noqa: BLE001
        job.status = "failed"
        job.ai_summary = f"Redaction failed: {exc}"

    await db.commit()
    await db.refresh(job)
    return job


@router.get("/{job_id}/download")
async def download_redacted(
    job_id: int,
    _user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    job = await db.get(DocumentJob, job_id)
    if not job or not job.redacted_path or job.status != "ready":
        raise HTTPException(404, "Redacted file not available")
    path = Path(job.redacted_path)
    if not path.is_file():
        raise HTTPException(404, "File missing on disk")
    return FileResponse(path, filename=f"{job.case_id}_redacted.pdf", media_type="application/pdf")

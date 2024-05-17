from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_current_user
from app.db import get_db
from app.models import Department, PatientCase, User

router = APIRouter(prefix="/cases", tags=["cases"])


class CasePatch(BaseModel):
    status: str | None = None
    acuity: str | None = None


@router.get("")
async def list_cases(_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    rows = (
        await db.execute(select(PatientCase, Department).join(Department).order_by(PatientCase.created_at.desc()))
    ).all()
    return [
        {
            "id": c.id,
            "case_id": c.case_id,
            "department_code": d.code,
            "department_name": d.name,
            "acuity": c.acuity,
            "status": c.status,
            "presentation": c.presentation,
            "created_at": c.created_at.isoformat(),
        }
        for c, d in rows
    ]


@router.patch("/{case_pk}")
async def patch_case(case_pk: int, body: CasePatch, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    row = await db.get(PatientCase, case_pk)
    if not row:
        raise HTTPException(404, "Case not found")
    if body.status:
        row.status = body.status
    if body.acuity:
        row.acuity = body.acuity
    await db.commit()
    return {"ok": True}

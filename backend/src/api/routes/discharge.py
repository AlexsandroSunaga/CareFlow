"""Discharge planning workflow (ADT extension demo)."""

from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.api.dependencies.auth import get_current_user
from src.api.dependencies.session import get_db_session as get_db
from src.models.db.hospital import PatientCase, User

router = APIRouter(prefix="/discharge", tags=["discharge"])


class DischargePlanCreate(BaseModel):
    case_id: str
    destination: str = "home"
    follow_up_days: int = 7
    notes: str = ""


@router.get("/queue")
async def discharge_queue(_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    rows = (
        await db.execute(select(PatientCase).where(PatientCase.status.in_(("open", "admitted", "active"))))
    ).scalars().all()
    return {
        "items": [
            {
                "case_id": r.case_id,
                "acuity": r.acuity,
                "presentation": r.presentation,
                "status": r.status,
            }
            for r in rows[:25]
        ],
        "total": len(rows),
    }


@router.post("/plan")
async def create_discharge_plan(
    body: DischargePlanCreate,
    _user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    row = (await db.execute(select(PatientCase).where(PatientCase.case_id == body.case_id))).scalar_one_or_none()
    if not row:
        raise HTTPException(404, "Case not found")
    row.status = "discharge_pending"
    await db.commit()
    return {
        "case_id": body.case_id,
        "status": "discharge_pending",
        "destination": body.destination,
        "follow_up_days": body.follow_up_days,
        "planned_at": datetime.now(timezone.utc).isoformat(),
        "notes": body.notes,
    }

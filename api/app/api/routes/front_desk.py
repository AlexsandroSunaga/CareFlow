from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_current_user
from app.db import get_db
from app.models import Appointment, AuditLog, Department, User

router = APIRouter(prefix="/front-desk", tags=["front-desk"])


class CheckInPatch(BaseModel):
    check_in_status: str


@router.get("/queue")
async def arrival_queue(_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    rows = (
        await db.execute(
            select(Appointment, Department)
            .join(Department)
            .where(Appointment.check_in_status != "completed")
            .order_by(Appointment.created_at.desc())
            .limit(50)
        )
    ).all()
    return [
        {
            "id": a.id,
            "case_id": a.case_id,
            "department": d.code,
            "provider": a.provider,
            "slot": a.slot,
            "status": a.status,
            "check_in_status": a.check_in_status,
        }
        for a, d in rows
    ]


@router.patch("/appointments/{appt_id}/check-in")
async def check_in(
    appt_id: int,
    body: CheckInPatch,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    row = await db.get(Appointment, appt_id)
    if not row:
        raise HTTPException(404, "Appointment not found")
    row.check_in_status = body.check_in_status
    db.add(AuditLog(actor_email=user.email, action="check_in.update", resource=f"appt:{appt_id}"))
    await db.commit()
    return {"ok": True}

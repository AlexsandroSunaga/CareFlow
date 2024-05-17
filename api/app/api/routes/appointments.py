import secrets
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_current_user, get_optional_user
from app.db import get_db
from app.models import Appointment, Department, PatientCase, User

router = APIRouter(prefix="/appointments", tags=["appointments"])


class AppointmentCreate(BaseModel):
    service: str = Field(min_length=2, max_length=120)
    provider: str = Field(min_length=2, max_length=120)
    slot: str = Field(min_length=3, max_length=64)
    contact_email: EmailStr
    department_code: str = Field(default="FD", max_length=16)


class AppointmentOut(BaseModel):
    id: int
    case_id: str
    department_id: int
    service: str
    provider: str
    slot: str
    status: str
    check_in_status: str
    contact_email: str
    created_at: datetime

    class Config:
        from_attributes = True


def _case_id() -> str:
    return f"CASE-{datetime.utcnow():%Y}-{secrets.token_hex(3).upper()}"


@router.post("", response_model=AppointmentOut)
async def create_appointment(body: AppointmentCreate, db: AsyncSession = Depends(get_db)):
    dept = (
        await db.execute(select(Department).where(Department.code == body.department_code.upper()))
    ).scalar_one_or_none()
    if not dept:
        dept = (await db.execute(select(Department).limit(1))).scalar_one_or_none()
    if not dept:
        raise HTTPException(400, "Hospital not configured")

    case_token = _case_id()
    db.add(
        PatientCase(
            case_id=case_token,
            department_id=dept.id,
            acuity="routine",
            status="open",
            presentation=f"Scheduled: {body.service}",
        )
    )
    row = Appointment(
        case_id=case_token,
        department_id=dept.id,
        service=body.service,
        provider=body.provider,
        slot=body.slot,
        status="scheduled",
        check_in_status="not_arrived",
        contact_email=body.contact_email,
    )
    db.add(row)
    await db.commit()
    await db.refresh(row)
    return row


@router.get("")
async def list_appointments(
    user: User | None = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Appointment, Department)
        .join(Department)
        .order_by(Appointment.created_at.desc())
        .limit(200)
    )
    rows = result.all()
    if user:
        return [
            {
                "id": a.id,
                "case_id": a.case_id,
                "department_code": d.code,
                "department_name": d.name,
                "service": a.service,
                "provider": a.provider,
                "slot": a.slot,
                "status": a.status,
                "check_in_status": a.check_in_status,
                "contact_email": a.contact_email,
                "created_at": a.created_at.isoformat(),
            }
            for a, d in rows
        ]
    return [
        {
            "id": a.id,
            "case_id": a.case_id,
            "service": a.service,
            "provider": a.provider,
            "slot": a.slot,
            "status": a.status,
        }
        for a, d in rows
    ]


class StatusPatch(BaseModel):
    status: str


@router.patch("/{appt_id}/status")
async def patch_status(
    appt_id: int,
    body: StatusPatch,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    row = await db.get(Appointment, appt_id)
    if not row:
        raise HTTPException(404, "Not found")
    row.status = body.status
    await db.commit()
    return {"ok": True}

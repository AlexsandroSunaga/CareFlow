from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_current_user
from app.db import get_db
from app.models import (
    Appointment,
    BillingClaim,
    Department,
    ImagingOrder,
    LabOrder,
    MedicationOrder,
    PatientCase,
    User,
)

router = APIRouter(prefix="/command", tags=["command"])


@router.get("/overview")
async def overview(_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    dept_count = await db.scalar(select(func.count()).select_from(Department))
    open_cases = await db.scalar(select(func.count()).select_from(PatientCase).where(PatientCase.status != "closed"))
    appts_today = await db.scalar(select(func.count()).select_from(Appointment))
    labs_pending = await db.scalar(
        select(func.count()).select_from(LabOrder).where(LabOrder.status.in_(["ordered", "in_process"]))
    )
    imaging_scheduled = await db.scalar(
        select(func.count()).select_from(ImagingOrder).where(ImagingOrder.status == "scheduled")
    )
    meds_verify = await db.scalar(
        select(func.count()).select_from(MedicationOrder).where(MedicationOrder.status == "pending_verify")
    )
    claims_open = await db.scalar(
        select(func.count()).select_from(BillingClaim).where(BillingClaim.status.in_(["submitted", "adjudicating"]))
    )
    arrivals = await db.scalar(
        select(func.count()).select_from(Appointment).where(Appointment.check_in_status == "arrived")
    )
    return {
        "departments": dept_count or 0,
        "open_cases": open_cases or 0,
        "appointments": appts_today or 0,
        "lab_orders_pending": labs_pending or 0,
        "imaging_scheduled": imaging_scheduled or 0,
        "pharmacy_pending_verify": meds_verify or 0,
        "claims_in_flight": claims_open or 0,
        "patients_in_lobby": arrivals or 0,
    }

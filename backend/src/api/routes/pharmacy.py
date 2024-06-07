from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.api.dependencies.auth import get_current_user
from src.api.dependencies.session import get_db_session as get_db
from src.models.db.hospital import MedicationOrder, User

router = APIRouter(prefix="/pharmacy", tags=["pharmacy"])


class MedPatch(BaseModel):
    status: str


@router.get("/orders")
async def med_orders(_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    rows = (await db.execute(select(MedicationOrder).order_by(MedicationOrder.id.desc()))).scalars().all()
    return [
        {
            "id": o.id,
            "case_id": o.case_id,
            "formulary_code": o.formulary_code,
            "drug_name": o.drug_name,
            "route": o.route,
            "status": o.status,
        }
        for o in rows
    ]


@router.patch("/orders/{order_id}")
async def patch_med(order_id: int, body: MedPatch, _user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    row = await db.get(MedicationOrder, order_id)
    if row:
        row.status = body.status
        await db.commit()
    return {"ok": True}


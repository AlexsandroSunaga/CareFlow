from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_current_user
from app.db import get_db
from app.models import LabOrder, User

router = APIRouter(prefix="/labs", tags=["labs"])


class LabStatusPatch(BaseModel):
    status: str


@router.get("/orders")
async def lab_orders(_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    rows = (await db.execute(select(LabOrder).order_by(LabOrder.id.desc()))).scalars().all()
    return [
        {
            "id": o.id,
            "case_id": o.case_id,
            "test_code": o.test_code,
            "test_name": o.test_name,
            "priority": o.priority,
            "status": o.status,
        }
        for o in rows
    ]


@router.patch("/orders/{order_id}")
async def update_lab(order_id: int, body: LabStatusPatch, _user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    row = await db.get(LabOrder, order_id)
    if row:
        row.status = body.status
        await db.commit()
    return {"ok": True}

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.api.dependencies.auth import get_current_user
from src.api.dependencies.session import get_db_session as get_db
from src.models.db.hospital import ImagingOrder, User

router = APIRouter(prefix="/imaging", tags=["imaging"])


class ImagingPatch(BaseModel):
    status: str


@router.get("/orders")
async def imaging_orders(_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    rows = (await db.execute(select(ImagingOrder).order_by(ImagingOrder.id.desc()))).scalars().all()
    return [
        {
            "id": o.id,
            "case_id": o.case_id,
            "modality": o.modality,
            "body_region": o.body_region,
            "status": o.status,
        }
        for o in rows
    ]


@router.patch("/orders/{order_id}")
async def patch_imaging(order_id: int, body: ImagingPatch, _user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    row = await db.get(ImagingOrder, order_id)
    if row:
        row.status = body.status
        await db.commit()
    return {"ok": True}


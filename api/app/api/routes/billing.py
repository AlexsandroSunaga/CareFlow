from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_current_user
from app.db import get_db
from app.models import BillingClaim, User

router = APIRouter(prefix="/billing", tags=["billing"])


@router.get("/claims")
async def claims(_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    rows = (await db.execute(select(BillingClaim).order_by(BillingClaim.id.desc()))).scalars().all()
    return [
        {
            "id": c.id,
            "case_id": c.case_id,
            "payer": c.payer,
            "amount_usd": round(c.amount_cents / 100, 2),
            "status": c.status,
            "cpt_bundle": c.cpt_bundle,
        }
        for c in rows
    ]

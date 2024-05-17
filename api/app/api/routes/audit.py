from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_current_user
from app.db import get_db
from app.models import AuditLog, User

router = APIRouter(prefix="/audit", tags=["audit"])


@router.get("")
async def audit_log(_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    rows = (await db.execute(select(AuditLog).order_by(AuditLog.created_at.desc()).limit(200))).scalars().all()
    return [
        {
            "actor_email": a.actor_email,
            "action": a.action,
            "resource": a.resource,
            "at": a.created_at.isoformat(),
        }
        for a in rows
    ]

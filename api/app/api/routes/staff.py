from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_current_user
from app.db import get_db
from app.models import Department, StaffMember, User

router = APIRouter(prefix="/staff", tags=["staff"])


@router.get("")
async def list_staff(_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    rows = (await db.execute(select(StaffMember, Department).join(Department).order_by(StaffMember.full_name))).all()
    return [
        {
            "id": s.id,
            "full_name": s.full_name,
            "title": s.title,
            "role": s.role,
            "email": s.email,
            "pager": s.pager,
            "is_active": s.is_active,
            "department_code": d.code,
            "department_name": d.name,
        }
        for s, d in rows
    ]

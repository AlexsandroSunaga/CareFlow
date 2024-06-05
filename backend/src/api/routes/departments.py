from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.api.dependencies.auth import get_current_user
from src.api.dependencies.session import get_db_session as get_db
from src.models.db.hospital import Department, Room, ServiceLine, StaffMember, User

router = APIRouter(prefix="/departments", tags=["departments"])


@router.get("")
async def list_departments(_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    rows = (await db.execute(select(Department).order_by(Department.code))).scalars().all()
    out = []
    for d in rows:
        staff_n = await db.scalar(select(func.count()).select_from(StaffMember).where(StaffMember.department_id == d.id))
        room_n = await db.scalar(select(func.count()).select_from(Room).where(Room.department_id == d.id))
        out.append(
            {
                "id": d.id,
                "code": d.code,
                "name": d.name,
                "floor": d.floor,
                "kind": d.kind,
                "bed_capacity": d.bed_capacity,
                "staff_count": staff_n or 0,
                "room_count": room_n or 0,
            }
        )
    return out


@router.get("/{dept_id}")
async def department_detail(dept_id: int, _user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    d = await db.get(Department, dept_id)
    if not d:
        raise HTTPException(404, "Not found")
    staff = (
        await db.execute(select(StaffMember).where(StaffMember.department_id == dept_id, StaffMember.is_active.is_(True)))
    ).scalars().all()
    rooms = (await db.execute(select(Room).where(Room.department_id == dept_id))).scalars().all()
    services = (await db.execute(select(ServiceLine).where(ServiceLine.department_id == dept_id))).scalars().all()
    return {
        "department": {
            "id": d.id,
            "code": d.code,
            "name": d.name,
            "floor": d.floor,
            "kind": d.kind,
            "bed_capacity": d.bed_capacity,
        },
        "staff": [
            {"id": s.id, "full_name": s.full_name, "title": s.title, "role": s.role, "email": s.email, "pager": s.pager}
            for s in staff
        ],
        "rooms": [{"id": r.id, "code": r.code, "room_type": r.room_type} for r in rooms],
        "service_lines": [{"id": s.id, "name": s.name, "duration_min": s.duration_min} for s in services],
    }


"""ADT / bed board — comparable to inpatient modules in GNU Health / CARE HMIS."""

from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.api.dependencies.auth import get_current_user
from src.api.dependencies.session import get_db_session as get_db
from src.models.db.hospital import Department, PatientCase, Room, User

router = APIRouter(prefix="/adt", tags=["adt"])


@router.get("/bed-board")
async def bed_board(_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    departments = (await db.execute(select(Department).order_by(Department.code))).scalars().all()
    board = []
    for d in departments:
        occupied = await db.scalar(
            select(func.count()).select_from(PatientCase).where(
                PatientCase.department_id == d.id, PatientCase.status.in_(["open", "admitted", "active"])
            )
        )
        rooms = await db.scalar(select(func.count()).select_from(Room).where(Room.department_id == d.id))
        capacity = d.bed_capacity or max(rooms or 0, 1)
        occ = int(occupied or 0)
        board.append(
            {
                "department_code": d.code,
                "department_name": d.name,
                "floor": d.floor,
                "bed_capacity": capacity,
                "occupied": min(occ, capacity),
                "available": max(capacity - occ, 0),
                "census_pct": round(100 * min(occ, capacity) / capacity, 1),
            }
        )
    return {"units": board, "total_capacity": sum(u["bed_capacity"] for u in board), "total_occupied": sum(u["occupied"] for u in board)}

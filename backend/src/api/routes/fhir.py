"""Read-only FHIR R4 stubs for interoperability demos (CARE HMIS / OpenMRS-style)."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.api.dependencies.auth import get_current_user
from src.api.dependencies.session import get_db_session as get_db
from src.models.db.hospital import PatientCase, User

router = APIRouter(prefix="/fhir", tags=["fhir"])


@router.get("/Patient/{case_id}")
async def read_patient(case_id: str, _user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    row = (await db.execute(select(PatientCase).where(PatientCase.case_id == case_id))).scalar_one_or_none()
    if not row:
        raise HTTPException(404, "Patient case not found")
    return {
        "resourceType": "Patient",
        "id": case_id,
        "identifier": [{"system": "urn:careflow:case", "value": case_id}],
        "active": row.status in ("open", "admitted", "active"),
        "extension": [
            {"url": "urn:careflow:acuity", "valueString": row.acuity},
            {"url": "urn:careflow:department", "valueInteger": row.department_id},
        ],
        "text": {"status": "generated", "div": f"<div>De-identified case {case_id}</div>"},
    }


@router.get("/Encounter/{case_id}")
async def read_encounter(case_id: str, _user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    row = (await db.execute(select(PatientCase).where(PatientCase.case_id == case_id))).scalar_one_or_none()
    if not row:
        raise HTTPException(404, "Encounter not found")
    return {
        "resourceType": "Encounter",
        "id": f"enc-{case_id}",
        "status": "in-progress" if row.status == "open" else "finished",
        "class": {"system": "http://terminology.hl7.org/CodeSystem/v3-ActCode", "code": "AMB"},
        "subject": {"reference": f"Patient/{case_id}"},
        "reasonCode": [{"text": row.presentation}],
    }

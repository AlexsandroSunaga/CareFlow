from fastapi import APIRouter

from src.api.routes import (
    adt,
    appointments,
    audit,
    auth,
    billing,
    cases,
    command,
    departments,
    discharge,
    documents,
    fhir,
    front_desk,
    health,
    integrations,
    imaging,
    labs,
    pharmacy,
    staff,
)

api_router = APIRouter()
api_router.include_router(health.router)
api_router.include_router(integrations.router)
api_router.include_router(fhir.router)
api_router.include_router(auth.router)
api_router.include_router(command.router)
api_router.include_router(departments.router)
api_router.include_router(adt.router)
api_router.include_router(discharge.router)
api_router.include_router(staff.router)
api_router.include_router(cases.router)
api_router.include_router(appointments.router)
api_router.include_router(front_desk.router)
api_router.include_router(documents.router)
api_router.include_router(labs.router)
api_router.include_router(imaging.router)
api_router.include_router(pharmacy.router)
api_router.include_router(billing.router)
api_router.include_router(audit.router)

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.security.hashing.password import hash_password
from src.models.db.hospital import (
    Appointment,
    AuditLog,
    BillingClaim,
    Department,
    ImagingOrder,
    LabOrder,
    MedicationOrder,
    PatientCase,
    Room,
    ServiceLine,
    StaffMember,
    User,
)


async def seed_demo(db: AsyncSession) -> None:
    if (await db.execute(select(Department).limit(1))).scalar_one_or_none():
        return

    departments = [
        Department(code="ED", name="Emergency", floor="G", kind="clinical", bed_capacity=24),
        Department(code="CARD", name="Cardiology", floor="3", kind="clinical", bed_capacity=18),
        Department(code="PEDS", name="Pediatrics", floor="2", kind="clinical", bed_capacity=20),
        Department(code="RAD", name="Radiology & Imaging", floor="B1", kind="diagnostic", bed_capacity=0),
        Department(code="LAB", name="Clinical Laboratory", floor="B1", kind="diagnostic", bed_capacity=0),
        Department(code="PHARM", name="Pharmacy", floor="1", kind="support", bed_capacity=0),
        Department(code="IP", name="Inpatient Units", floor="4-6", kind="clinical", bed_capacity=120),
        Department(code="FD", name="Front Desk & Access", floor="G", kind="support", bed_capacity=0),
        Department(code="REV", name="Revenue Cycle", floor="2", kind="admin", bed_capacity=0),
    ]
    db.add_all(departments)
    await db.flush()

    dept_by_code = {d.code: d.id for d in departments}

    staff_rows = [
        StaffMember(department_id=dept_by_code["ED"], full_name="Dr. Amara Okonkwo", title="Attending", role="physician", email="a.okonkwo@careflow.demo", pager="1101"),
        StaffMember(department_id=dept_by_code["CARD"], full_name="Dr. James Rivera", title="Cardiologist", role="physician", email="j.rivera@careflow.demo", pager="2204"),
        StaffMember(department_id=dept_by_code["PEDS"], full_name="Dr. Lin Chen", title="Pediatrician", role="physician", email="l.chen@careflow.demo", pager="2102"),
        StaffMember(department_id=dept_by_code["RAD"], full_name="Maya Patel", title="Lead Tech", role="technologist", email="m.patel@careflow.demo", pager="3301"),
        StaffMember(department_id=dept_by_code["LAB"], full_name="Omar Hassan", title="Lab Director", role="lab", email="o.hassan@careflow.demo", pager="3400"),
        StaffMember(department_id=dept_by_code["PHARM"], full_name="Elena Voss", title="Pharmacist", role="pharmacist", email="e.voss@careflow.demo", pager="1502"),
        StaffMember(department_id=dept_by_code["FD"], full_name="Chris Morgan", title="Access Manager", role="front_desk", email="c.morgan@careflow.demo", pager="1000"),
        StaffMember(department_id=dept_by_code["REV"], full_name="Priya Nair", title="Claims Lead", role="billing", email="p.nair@careflow.demo", pager="2601"),
    ]
    db.add_all(staff_rows)
    await db.flush()

    services = [
        ServiceLine(department_id=dept_by_code["ED"], name="Triage evaluation", duration_min=45),
        ServiceLine(department_id=dept_by_code["CARD"], name="Echo follow-up", duration_min=40),
        ServiceLine(department_id=dept_by_code["PEDS"], name="Well-child visit", duration_min=30),
        ServiceLine(department_id=dept_by_code["CARD"], name="Stress test review", duration_min=60),
    ]
    db.add_all(services)
    await db.flush()

    rooms = [
        Room(department_id=dept_by_code["ED"], code="ED-01", room_type="trauma bay"),
        Room(department_id=dept_by_code["ED"], code="ED-12", room_type="observation"),
        Room(department_id=dept_by_code["CARD"], code="C-3A", room_type="procedure"),
        Room(department_id=dept_by_code["RAD"], code="MRI-1", room_type="MRI"),
        Room(department_id=dept_by_code["RAD"], code="CT-2", room_type="CT"),
    ]
    db.add_all(rooms)

    cases = [
        PatientCase(case_id="CASE-2026-A100", department_id=dept_by_code["ED"], acuity="urgent", status="active", presentation="Chest pain, rule-out ACS"),
        PatientCase(case_id="CASE-2026-B220", department_id=dept_by_code["CARD"], acuity="routine", status="active", presentation="Post-discharge echo"),
        PatientCase(case_id="CASE-2026-C310", department_id=dept_by_code["PEDS"], acuity="routine", status="open", presentation="Annual wellness"),
        PatientCase(case_id="CASE-2026-D440", department_id=dept_by_code["IP"], acuity="high", status="admitted", presentation="Pneumonia, inpatient med-surg"),
    ]
    db.add_all(cases)

    appts = [
        Appointment(
            case_id="CASE-2026-B220",
            department_id=dept_by_code["CARD"],
            service_line_id=services[1].id,
            staff_id=staff_rows[1].id,
            service="Echo follow-up",
            provider="Dr. James Rivera",
            slot="Today 10:30",
            status="confirmed",
            check_in_status="arrived",
            contact_email="patient-proxy@careflow.demo",
        ),
        Appointment(
            case_id="CASE-2026-C310",
            department_id=dept_by_code["PEDS"],
            staff_id=staff_rows[2].id,
            service="Well-child visit",
            provider="Dr. Lin Chen",
            slot="Today 14:00",
            status="scheduled",
            check_in_status="not_arrived",
            contact_email="guardian@careflow.demo",
        ),
        Appointment(
            case_id="CASE-2026-A100",
            department_id=dept_by_code["ED"],
            staff_id=staff_rows[0].id,
            service="Triage evaluation",
            provider="Dr. Amara Okonkwo",
            slot="Now",
            status="in_progress",
            check_in_status="roomed",
            contact_email="ed-triage@careflow.demo",
        ),
    ]
    appts[1].service_line_id = services[2].id
    appts[2].service_line_id = services[0].id
    db.add_all(appts)

    db.add_all(
        [
            LabOrder(case_id="CASE-2026-A100", test_code="TROP", test_name="Troponin panel", priority="stat", status="in_process", department_id=dept_by_code["LAB"]),
            LabOrder(case_id="CASE-2026-D440", test_code="CMP", test_name="Comprehensive metabolic", priority="routine", status="resulted", department_id=dept_by_code["LAB"]),
            ImagingOrder(case_id="CASE-2026-A100", modality="CT", body_region="Chest", status="completed", department_id=dept_by_code["RAD"]),
            ImagingOrder(case_id="CASE-2026-B220", modality="US", body_region="Heart", status="scheduled", department_id=dept_by_code["RAD"]),
            MedicationOrder(case_id="CASE-2026-D440", formulary_code="ABX-01", drug_name="Ceftriaxone IV", route="IV", status="verified"),
            MedicationOrder(case_id="CASE-2026-A100", formulary_code="ANALG-02", drug_name="Acetaminophen", route="oral", status="pending_verify"),
            BillingClaim(case_id="CASE-2026-B220", payer="Commercial PPO", amount_cents=185000, status="adjudicating", cpt_bundle="93306,99213"),
            BillingClaim(case_id="CASE-2026-D440", payer="Medicare", amount_cents=420000, status="submitted", cpt_bundle="99223,71046"),
        ]
    )

    db.add(
        User(
            email="admin@careflow.demo",
            hashed_password=hash_password("CareflowDemo2026!"),
            staff_id=staff_rows[6].id,
            role="admin",
        )
    )
    db.add(
        User(
            email="clinician@careflow.demo",
            hashed_password=hash_password("CareflowDemo2026!"),
            staff_id=staff_rows[1].id,
            role="clinician",
        )
    )

    db.add(
        AuditLog(actor_email="system@careflow.demo", action="seed.complete", resource="hospital-demo")
    )
    await db.commit()

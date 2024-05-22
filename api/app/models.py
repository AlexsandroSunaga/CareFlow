from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base


class Department(Base):
    __tablename__ = "departments"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    code: Mapped[str] = mapped_column(String(16), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(120))
    floor: Mapped[str] = mapped_column(String(32), default="1")
    kind: Mapped[str] = mapped_column(String(32), default="clinical")
    bed_capacity: Mapped[int] = mapped_column(Integer, default=0)
    staff = relationship("StaffMember", back_populates="department")
    rooms = relationship("Room", back_populates="department")


class StaffMember(Base):
    __tablename__ = "staff"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    department_id: Mapped[int] = mapped_column(ForeignKey("departments.id"), index=True)
    department: Mapped[Department] = relationship(back_populates="staff")
    full_name: Mapped[str] = mapped_column(String(120))
    title: Mapped[str] = mapped_column(String(64))
    role: Mapped[str] = mapped_column(String(32))
    email: Mapped[str] = mapped_column(String(200), unique=True)
    pager: Mapped[str] = mapped_column(String(32), default="")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)


class ServiceLine(Base):
    __tablename__ = "service_lines"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    department_id: Mapped[int] = mapped_column(ForeignKey("departments.id"), index=True)
    name: Mapped[str] = mapped_column(String(120))
    duration_min: Mapped[int] = mapped_column(Integer, default=30)


class Room(Base):
    __tablename__ = "rooms"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    department_id: Mapped[int] = mapped_column(ForeignKey("departments.id"), index=True)
    department: Mapped[Department] = relationship(back_populates="rooms")
    code: Mapped[str] = mapped_column(String(32))
    room_type: Mapped[str] = mapped_column(String(64))


class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    email: Mapped[str] = mapped_column(String(200), unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String(200))
    staff_id = mapped_column(Integer, ForeignKey("staff.id"), nullable=True)
    role: Mapped[str] = mapped_column(String(32), default="staff")


class PatientCase(Base):
    __tablename__ = "patient_cases"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    case_id: Mapped[str] = mapped_column(String(32), unique=True, index=True)
    department_id: Mapped[int] = mapped_column(ForeignKey("departments.id"), index=True)
    acuity: Mapped[str] = mapped_column(String(16), default="routine")
    status: Mapped[str] = mapped_column(String(32), default="open")
    presentation: Mapped[str] = mapped_column(String(200))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class Appointment(Base):
    __tablename__ = "appointments"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    case_id: Mapped[str] = mapped_column(String(32), index=True)
    department_id: Mapped[int] = mapped_column(ForeignKey("departments.id"), index=True)
    service_line_id = mapped_column(Integer, ForeignKey("service_lines.id"), nullable=True)
    staff_id = mapped_column(Integer, ForeignKey("staff.id"), nullable=True)
    room_id = mapped_column(Integer, ForeignKey("rooms.id"), nullable=True)
    service: Mapped[str] = mapped_column(String(120))
    provider: Mapped[str] = mapped_column(String(120))
    slot: Mapped[str] = mapped_column(String(64))
    status: Mapped[str] = mapped_column(String(32), default="scheduled")
    check_in_status: Mapped[str] = mapped_column(String(32), default="not_arrived")
    contact_email: Mapped[str] = mapped_column(String(200))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class DocumentJob(Base):
    __tablename__ = "document_jobs"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    case_id: Mapped[str] = mapped_column(String(32), index=True)
    original_name: Mapped[str] = mapped_column(String(255))
    status: Mapped[str] = mapped_column(String(32), default="processing")
    redaction_hits: Mapped[int] = mapped_column(Integer, default=0)
    redacted_path = mapped_column(String(500), nullable=True)
    ai_summary = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class LabOrder(Base):
    __tablename__ = "lab_orders"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    case_id: Mapped[str] = mapped_column(String(32), index=True)
    test_code: Mapped[str] = mapped_column(String(32))
    test_name: Mapped[str] = mapped_column(String(120))
    priority: Mapped[str] = mapped_column(String(16), default="routine")
    status: Mapped[str] = mapped_column(String(32), default="ordered")
    department_id: Mapped[int] = mapped_column(ForeignKey("departments.id"))


class ImagingOrder(Base):
    __tablename__ = "imaging_orders"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    case_id: Mapped[str] = mapped_column(String(32), index=True)
    modality: Mapped[str] = mapped_column(String(32))
    body_region: Mapped[str] = mapped_column(String(64))
    status: Mapped[str] = mapped_column(String(32), default="scheduled")
    department_id: Mapped[int] = mapped_column(ForeignKey("departments.id"))


class MedicationOrder(Base):
    __tablename__ = "medication_orders"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    case_id: Mapped[str] = mapped_column(String(32), index=True)
    formulary_code: Mapped[str] = mapped_column(String(32))
    drug_name: Mapped[str] = mapped_column(String(120))
    route: Mapped[str] = mapped_column(String(32), default="oral")
    status: Mapped[str] = mapped_column(String(32), default="pending_verify")


class BillingClaim(Base):
    __tablename__ = "billing_claims"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    case_id: Mapped[str] = mapped_column(String(32), index=True)
    payer: Mapped[str] = mapped_column(String(64))
    amount_cents: Mapped[int] = mapped_column(Integer)
    status: Mapped[str] = mapped_column(String(32), default="submitted")
    cpt_bundle: Mapped[str] = mapped_column(String(64), default="")


class AuditLog(Base):
    __tablename__ = "audit_logs"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    actor_email: Mapped[str] = mapped_column(String(200))
    action: Mapped[str] = mapped_column(String(120))
    resource: Mapped[str] = mapped_column(String(200))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

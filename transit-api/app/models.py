"""SQLAlchemy ORM models for TransitOps."""

import uuid
from datetime import datetime, timezone

from sqlalchemy import (
    String,
    Integer,
    Float,
    DateTime,
    Text,
    ForeignKey,
    Enum as SAEnum,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

# ────────────────────────────── helpers ──────────────────────────────

def _uuid() -> str:
    return str(uuid.uuid4())


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


# ────────────────────────────── Vehicle ──────────────────────────────

class Vehicle(Base):
    __tablename__ = "vehicles"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid)
    registration_number: Mapped[str] = mapped_column(String(20), unique=True, index=True)
    make: Mapped[str] = mapped_column(String(50))
    model: Mapped[str] = mapped_column(String(50))
    year: Mapped[int] = mapped_column(Integer)
    type: Mapped[str] = mapped_column(
        SAEnum("BUS", "VAN", "TRUCK", "CAR", name="vehicle_type"),
        default="BUS",
    )
    capacity: Mapped[int] = mapped_column(Integer, default=0)
    status: Mapped[str] = mapped_column(
        SAEnum("ACTIVE", "IN_MAINTENANCE", "RETIRED", "OUT_OF_SERVICE", name="vehicle_status"),
        default="ACTIVE",
    )
    fuel_type: Mapped[str] = mapped_column(String(20), default="DIESEL")
    mileage: Mapped[float] = mapped_column(Float, default=0.0)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utcnow, onupdate=_utcnow)

    # relationships
    trips: Mapped[list["Trip"]] = relationship(back_populates="vehicle", cascade="all, delete-orphan")
    maintenance_logs: Mapped[list["MaintenanceLog"]] = relationship(back_populates="vehicle", cascade="all, delete-orphan")
    fuel_logs: Mapped[list["FuelLog"]] = relationship(back_populates="vehicle", cascade="all, delete-orphan")


# ────────────────────────────── Driver ───────────────────────────────

class Driver(Base):
    __tablename__ = "drivers"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid)
    name: Mapped[str] = mapped_column(String(100))
    email: Mapped[str] = mapped_column(String(120), unique=True, index=True)
    phone: Mapped[str] = mapped_column(String(20))
    license_number: Mapped[str] = mapped_column(String(30), unique=True)
    license_expiry: Mapped[str] = mapped_column(String(10))  # YYYY-MM-DD
    status: Mapped[str] = mapped_column(
        SAEnum("AVAILABLE", "ON_TRIP", "OFF_DUTY", "SUSPENDED", name="driver_status"),
        default="AVAILABLE",
    )
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utcnow, onupdate=_utcnow)

    # relationships
    trips: Mapped[list["Trip"]] = relationship(back_populates="driver", cascade="all, delete-orphan")


# ─────────────────────────────── Trip ────────────────────────────────

class Trip(Base):
    __tablename__ = "trips"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid)
    vehicle_id: Mapped[str] = mapped_column(ForeignKey("vehicles.id"))
    driver_id: Mapped[str] = mapped_column(ForeignKey("drivers.id"))
    route_name: Mapped[str] = mapped_column(String(120))
    origin: Mapped[str] = mapped_column(String(120))
    destination: Mapped[str] = mapped_column(String(120))
    scheduled_departure: Mapped[str] = mapped_column(String(30))  # ISO 8601
    scheduled_arrival: Mapped[str] = mapped_column(String(30))
    actual_departure: Mapped[str | None] = mapped_column(String(30), nullable=True)
    actual_arrival: Mapped[str | None] = mapped_column(String(30), nullable=True)
    status: Mapped[str] = mapped_column(
        SAEnum("SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED", name="trip_status"),
        default="SCHEDULED",
    )
    passengers: Mapped[int] = mapped_column(Integer, default=0)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utcnow, onupdate=_utcnow)

    # relationships
    vehicle: Mapped["Vehicle"] = relationship(back_populates="trips")
    driver: Mapped["Driver"] = relationship(back_populates="trips")


# ───────────────────────── MaintenanceLog ────────────────────────────

class MaintenanceLog(Base):
    __tablename__ = "maintenance_logs"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid)
    vehicle_id: Mapped[str] = mapped_column(ForeignKey("vehicles.id"))
    type: Mapped[str] = mapped_column(
        SAEnum("ROUTINE", "REPAIR", "INSPECTION", "EMERGENCY", name="maintenance_type"),
        default="ROUTINE",
    )
    description: Mapped[str] = mapped_column(Text)
    cost: Mapped[float] = mapped_column(Float, default=0.0)
    odometer_reading: Mapped[float] = mapped_column(Float, default=0.0)
    performed_by: Mapped[str] = mapped_column(String(100))
    performed_at: Mapped[str] = mapped_column(String(30))  # ISO 8601
    next_due_at: Mapped[str | None] = mapped_column(String(30), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utcnow)

    # relationships
    vehicle: Mapped["Vehicle"] = relationship(back_populates="maintenance_logs")


# ─────────────────────────── FuelLog ─────────────────────────────────

class FuelLog(Base):
    __tablename__ = "fuel_logs"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid)
    vehicle_id: Mapped[str] = mapped_column(ForeignKey("vehicles.id"))
    liters: Mapped[float] = mapped_column(Float)
    cost_per_liter: Mapped[float] = mapped_column(Float)
    total_cost: Mapped[float] = mapped_column(Float)
    odometer_reading: Mapped[float] = mapped_column(Float, default=0.0)
    fuel_station: Mapped[str] = mapped_column(String(120), default="")
    fueled_at: Mapped[str] = mapped_column(String(30))  # ISO 8601
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utcnow)

    # relationships
    vehicle: Mapped["Vehicle"] = relationship(back_populates="fuel_logs")

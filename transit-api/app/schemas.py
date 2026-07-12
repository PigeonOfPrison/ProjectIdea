"""Pydantic schemas for request validation and response serialization."""

from __future__ import annotations

from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, Field


# ────────────────────────────── Vehicle ──────────────────────────────

VehicleType = Literal["BUS", "VAN", "TRUCK", "CAR"]
VehicleStatus = Literal["ACTIVE", "IN_MAINTENANCE", "RETIRED", "OUT_OF_SERVICE"]


class VehicleCreate(BaseModel):
    registration_number: str = Field(..., min_length=1, max_length=20)
    make: str = Field(..., min_length=1, max_length=50)
    model: str = Field(..., min_length=1, max_length=50)
    year: int = Field(..., ge=1900, le=2100)
    type: VehicleType = "BUS"
    capacity: int = Field(0, ge=0)
    fuel_type: str = Field("DIESEL", max_length=20)
    mileage: float = Field(0.0, ge=0)


class VehicleUpdate(BaseModel):
    registration_number: Optional[str] = Field(None, min_length=1, max_length=20)
    make: Optional[str] = Field(None, min_length=1, max_length=50)
    model: Optional[str] = Field(None, min_length=1, max_length=50)
    year: Optional[int] = Field(None, ge=1900, le=2100)
    type: Optional[VehicleType] = None
    capacity: Optional[int] = Field(None, ge=0)
    fuel_type: Optional[str] = Field(None, max_length=20)
    mileage: Optional[float] = Field(None, ge=0)


class VehicleStatusUpdate(BaseModel):
    status: VehicleStatus


class VehicleOut(BaseModel):
    id: str
    registration_number: str
    make: str
    model: str
    year: int
    type: VehicleType
    capacity: int
    status: VehicleStatus
    fuel_type: str
    mileage: float
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


# ────────────────────────────── Driver ───────────────────────────────

DriverStatus = Literal["AVAILABLE", "ON_TRIP", "OFF_DUTY", "SUSPENDED"]


class DriverCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: str = Field(..., min_length=1, max_length=120)
    phone: str = Field(..., min_length=1, max_length=20)
    license_number: str = Field(..., min_length=1, max_length=30)
    license_expiry: str = Field(..., pattern=r"^\d{4}-\d{2}-\d{2}$")
    status: DriverStatus = "AVAILABLE"


class DriverUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    email: Optional[str] = Field(None, min_length=1, max_length=120)
    phone: Optional[str] = Field(None, min_length=1, max_length=20)
    license_number: Optional[str] = Field(None, min_length=1, max_length=30)
    license_expiry: Optional[str] = Field(None, pattern=r"^\d{4}-\d{2}-\d{2}$")
    status: Optional[DriverStatus] = None


class DriverOut(BaseModel):
    id: str
    name: str
    email: str
    phone: str
    license_number: str
    license_expiry: str
    status: DriverStatus
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


# ─────────────────────────────── Trip ────────────────────────────────

TripStatus = Literal["SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]


class TripCreate(BaseModel):
    vehicle_id: str
    driver_id: str
    route_name: str = Field(..., min_length=1, max_length=120)
    origin: str = Field(..., min_length=1, max_length=120)
    destination: str = Field(..., min_length=1, max_length=120)
    scheduled_departure: str
    scheduled_arrival: str
    passengers: int = Field(0, ge=0)
    notes: Optional[str] = None


class TripUpdate(BaseModel):
    vehicle_id: Optional[str] = None
    driver_id: Optional[str] = None
    route_name: Optional[str] = Field(None, min_length=1, max_length=120)
    origin: Optional[str] = Field(None, min_length=1, max_length=120)
    destination: Optional[str] = Field(None, min_length=1, max_length=120)
    scheduled_departure: Optional[str] = None
    scheduled_arrival: Optional[str] = None
    passengers: Optional[int] = Field(None, ge=0)
    notes: Optional[str] = None


class TripStatusUpdate(BaseModel):
    status: TripStatus


class TripOut(BaseModel):
    id: str
    vehicle_id: str
    driver_id: str
    route_name: str
    origin: str
    destination: str
    scheduled_departure: str
    scheduled_arrival: str
    actual_departure: Optional[str]
    actual_arrival: Optional[str]
    status: TripStatus
    passengers: int
    notes: Optional[str]
    created_at: datetime
    updated_at: datetime

    # Nested vehicle/driver info for list display
    vehicle: Optional[VehicleOut] = None
    driver: Optional[DriverOut] = None

    model_config = {"from_attributes": True}


# ───────────────────────── MaintenanceLog ────────────────────────────

MaintenanceType = Literal["ROUTINE", "REPAIR", "INSPECTION", "EMERGENCY"]


class MaintenanceCreate(BaseModel):
    vehicle_id: str
    type: MaintenanceType = "ROUTINE"
    description: str = Field(..., min_length=1)
    cost: float = Field(0.0, ge=0)
    odometer_reading: float = Field(0.0, ge=0)
    performed_by: str = Field(..., min_length=1, max_length=100)
    performed_at: str
    next_due_at: Optional[str] = None


class MaintenanceUpdate(BaseModel):
    type: Optional[MaintenanceType] = None
    description: Optional[str] = Field(None, min_length=1)
    cost: Optional[float] = Field(None, ge=0)
    odometer_reading: Optional[float] = Field(None, ge=0)
    performed_by: Optional[str] = Field(None, min_length=1, max_length=100)
    performed_at: Optional[str] = None
    next_due_at: Optional[str] = None


class MaintenanceOut(BaseModel):
    id: str
    vehicle_id: str
    type: MaintenanceType
    description: str
    cost: float
    odometer_reading: float
    performed_by: str
    performed_at: str
    next_due_at: Optional[str]
    created_at: datetime

    vehicle: Optional[VehicleOut] = None

    model_config = {"from_attributes": True}


# ─────────────────────────── FuelLog ─────────────────────────────────


class FuelLogCreate(BaseModel):
    vehicle_id: str
    liters: float = Field(..., gt=0)
    cost_per_liter: float = Field(..., gt=0)
    total_cost: float = Field(..., gt=0)
    odometer_reading: float = Field(0.0, ge=0)
    fuel_station: str = Field("", max_length=120)
    fueled_at: str


class FuelLogOut(BaseModel):
    id: str
    vehicle_id: str
    liters: float
    cost_per_liter: float
    total_cost: float
    odometer_reading: float
    fuel_station: str
    fueled_at: str
    created_at: datetime

    vehicle: Optional[VehicleOut] = None

    model_config = {"from_attributes": True}


# ───────────────────────── Dashboard Stats ───────────────────────────


class DashboardStats(BaseModel):
    total_vehicles: int = 0
    active_vehicles: int = 0
    in_maintenance_vehicles: int = 0
    total_drivers: int = 0
    available_drivers: int = 0
    on_trip_drivers: int = 0
    total_trips: int = 0
    scheduled_trips: int = 0
    in_progress_trips: int = 0
    completed_trips: int = 0
    cancelled_trips: int = 0
    total_maintenance_cost: float = 0.0
    total_fuel_cost: float = 0.0

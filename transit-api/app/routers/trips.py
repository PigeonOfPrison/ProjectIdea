"""Trip CRUD + lifecycle endpoints."""

from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models import Trip, Vehicle, Driver
from app.schemas import TripCreate, TripUpdate, TripStatusUpdate, TripOut

router = APIRouter(prefix="/api/trips", tags=["Trips"])


@router.get("", response_model=list[TripOut])
async def list_trips(
    status: str | None = None,
    vehicle_id: str | None = None,
    driver_id: str | None = None,
    db: AsyncSession = Depends(get_db),
):
    stmt = (
        select(Trip)
        .options(selectinload(Trip.vehicle), selectinload(Trip.driver))
        .order_by(Trip.created_at.desc())
    )
    if status:
        stmt = stmt.where(Trip.status == status)
    if vehicle_id:
        stmt = stmt.where(Trip.vehicle_id == vehicle_id)
    if driver_id:
        stmt = stmt.where(Trip.driver_id == driver_id)
    result = await db.execute(stmt)
    return result.scalars().all()


@router.get("/{trip_id}", response_model=TripOut)
async def get_trip(trip_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Trip)
        .options(selectinload(Trip.vehicle), selectinload(Trip.driver))
        .where(Trip.id == trip_id)
    )
    trip = result.scalar_one_or_none()
    if not trip:
        raise HTTPException(404, "Trip not found")
    return trip


@router.post("", response_model=TripOut, status_code=201)
async def create_trip(body: TripCreate, db: AsyncSession = Depends(get_db)):
    # Validate vehicle exists and is active
    v_result = await db.execute(select(Vehicle).where(Vehicle.id == body.vehicle_id))
    vehicle = v_result.scalar_one_or_none()
    if not vehicle:
        raise HTTPException(400, "Vehicle not found")
    if vehicle.status != "ACTIVE":
        raise HTTPException(400, f"Vehicle is {vehicle.status}, must be ACTIVE to assign a trip")

    # Validate driver exists and is available
    d_result = await db.execute(select(Driver).where(Driver.id == body.driver_id))
    driver = d_result.scalar_one_or_none()
    if not driver:
        raise HTTPException(400, "Driver not found")
    if driver.status not in ("AVAILABLE",):
        raise HTTPException(400, f"Driver is {driver.status}, must be AVAILABLE to assign a trip")

    trip = Trip(**body.model_dump(), status="SCHEDULED")
    db.add(trip)
    await db.commit()
    await db.refresh(trip)

    # Reload with relationships
    result = await db.execute(
        select(Trip)
        .options(selectinload(Trip.vehicle), selectinload(Trip.driver))
        .where(Trip.id == trip.id)
    )
    return result.scalar_one()


@router.put("/{trip_id}", response_model=TripOut)
async def update_trip(trip_id: str, body: TripUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Trip).where(Trip.id == trip_id))
    trip = result.scalar_one_or_none()
    if not trip:
        raise HTTPException(404, "Trip not found")
    for key, value in body.model_dump(exclude_unset=True).items():
        setattr(trip, key, value)
    await db.commit()
    await db.refresh(trip)
    result = await db.execute(
        select(Trip)
        .options(selectinload(Trip.vehicle), selectinload(Trip.driver))
        .where(Trip.id == trip.id)
    )
    return result.scalar_one()


@router.patch("/{trip_id}/status", response_model=TripOut)
async def update_trip_status(
    trip_id: str, body: TripStatusUpdate, db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Trip)
        .options(selectinload(Trip.vehicle), selectinload(Trip.driver))
        .where(Trip.id == trip_id)
    )
    trip = result.scalar_one_or_none()
    if not trip:
        raise HTTPException(404, "Trip not found")

    # Enforce lifecycle transitions
    VALID_TRANSITIONS = {
        "SCHEDULED": ["IN_PROGRESS", "CANCELLED"],
        "IN_PROGRESS": ["COMPLETED", "CANCELLED"],
        "COMPLETED": [],
        "CANCELLED": [],
    }

    if body.status not in VALID_TRANSITIONS.get(trip.status, []):
        raise HTTPException(
            400,
            f"Cannot transition from {trip.status} to {body.status}. "
            f"Valid transitions: {VALID_TRANSITIONS.get(trip.status, [])}",
        )

    now_iso = datetime.now(timezone.utc).isoformat()

    # Update driver status based on trip transition
    if body.status == "IN_PROGRESS":
        trip.actual_departure = now_iso
        # Mark driver as on-trip
        trip.driver.status = "ON_TRIP"
    elif body.status == "COMPLETED":
        trip.actual_arrival = now_iso
        # Free up the driver
        trip.driver.status = "AVAILABLE"
    elif body.status == "CANCELLED":
        # Free up the driver if they were on-trip
        if trip.status == "IN_PROGRESS":
            trip.driver.status = "AVAILABLE"

    trip.status = body.status
    await db.commit()
    await db.refresh(trip)
    return trip


@router.delete("/{trip_id}", status_code=204)
async def delete_trip(trip_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Trip).where(Trip.id == trip_id))
    trip = result.scalar_one_or_none()
    if not trip:
        raise HTTPException(404, "Trip not found")
    await db.delete(trip)
    await db.commit()

"""Vehicle CRUD endpoints."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Vehicle
from app.schemas import VehicleCreate, VehicleUpdate, VehicleStatusUpdate, VehicleOut

router = APIRouter(prefix="/api/vehicles", tags=["Vehicles"])


@router.get("", response_model=list[VehicleOut])
async def list_vehicles(
    status: str | None = None,
    type: str | None = None,
    db: AsyncSession = Depends(get_db),
):
    stmt = select(Vehicle).order_by(Vehicle.created_at.desc())
    if status:
        stmt = stmt.where(Vehicle.status == status)
    if type:
        stmt = stmt.where(Vehicle.type == type)
    result = await db.execute(stmt)
    return result.scalars().all()


@router.get("/{vehicle_id}", response_model=VehicleOut)
async def get_vehicle(vehicle_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Vehicle).where(Vehicle.id == vehicle_id))
    vehicle = result.scalar_one_or_none()
    if not vehicle:
        raise HTTPException(404, "Vehicle not found")
    return vehicle


@router.post("", response_model=VehicleOut, status_code=201)
async def create_vehicle(body: VehicleCreate, db: AsyncSession = Depends(get_db)):
    vehicle = Vehicle(**body.model_dump())
    db.add(vehicle)
    await db.commit()
    await db.refresh(vehicle)
    return vehicle


@router.put("/{vehicle_id}", response_model=VehicleOut)
async def update_vehicle(vehicle_id: str, body: VehicleUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Vehicle).where(Vehicle.id == vehicle_id))
    vehicle = result.scalar_one_or_none()
    if not vehicle:
        raise HTTPException(404, "Vehicle not found")
    for key, value in body.model_dump(exclude_unset=True).items():
        setattr(vehicle, key, value)
    await db.commit()
    await db.refresh(vehicle)
    return vehicle


@router.patch("/{vehicle_id}/status", response_model=VehicleOut)
async def update_vehicle_status(
    vehicle_id: str, body: VehicleStatusUpdate, db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Vehicle).where(Vehicle.id == vehicle_id))
    vehicle = result.scalar_one_or_none()
    if not vehicle:
        raise HTTPException(404, "Vehicle not found")
    vehicle.status = body.status
    await db.commit()
    await db.refresh(vehicle)
    return vehicle


@router.delete("/{vehicle_id}", status_code=204)
async def delete_vehicle(vehicle_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Vehicle).where(Vehicle.id == vehicle_id))
    vehicle = result.scalar_one_or_none()
    if not vehicle:
        raise HTTPException(404, "Vehicle not found")
    await db.delete(vehicle)
    await db.commit()

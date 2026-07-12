"""Fuel log CRUD endpoints."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models import FuelLog, Vehicle
from app.schemas import FuelLogCreate, FuelLogOut

router = APIRouter(prefix="/api/fuel-logs", tags=["Fuel Logs"])


@router.get("", response_model=list[FuelLogOut])
async def list_fuel_logs(
    vehicle_id: str | None = None,
    db: AsyncSession = Depends(get_db),
):
    stmt = (
        select(FuelLog)
        .options(selectinload(FuelLog.vehicle))
        .order_by(FuelLog.created_at.desc())
    )
    if vehicle_id:
        stmt = stmt.where(FuelLog.vehicle_id == vehicle_id)
    result = await db.execute(stmt)
    return result.scalars().all()


@router.get("/{log_id}", response_model=FuelLogOut)
async def get_fuel_log(log_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(FuelLog)
        .options(selectinload(FuelLog.vehicle))
        .where(FuelLog.id == log_id)
    )
    log = result.scalar_one_or_none()
    if not log:
        raise HTTPException(404, "Fuel log not found")
    return log


@router.post("", response_model=FuelLogOut, status_code=201)
async def create_fuel_log(body: FuelLogCreate, db: AsyncSession = Depends(get_db)):
    # Validate vehicle exists
    v_result = await db.execute(select(Vehicle).where(Vehicle.id == body.vehicle_id))
    if not v_result.scalar_one_or_none():
        raise HTTPException(400, "Vehicle not found")

    log = FuelLog(**body.model_dump())
    db.add(log)
    await db.commit()
    await db.refresh(log)

    result = await db.execute(
        select(FuelLog)
        .options(selectinload(FuelLog.vehicle))
        .where(FuelLog.id == log.id)
    )
    return result.scalar_one()


@router.delete("/{log_id}", status_code=204)
async def delete_fuel_log(log_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(FuelLog).where(FuelLog.id == log_id))
    log = result.scalar_one_or_none()
    if not log:
        raise HTTPException(404, "Fuel log not found")
    await db.delete(log)
    await db.commit()

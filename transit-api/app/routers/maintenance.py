"""Maintenance log CRUD endpoints."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models import MaintenanceLog, Vehicle
from app.schemas import MaintenanceCreate, MaintenanceUpdate, MaintenanceOut

router = APIRouter(prefix="/api/maintenance", tags=["Maintenance"])


@router.get("", response_model=list[MaintenanceOut])
async def list_maintenance(
    vehicle_id: str | None = None,
    type: str | None = None,
    db: AsyncSession = Depends(get_db),
):
    stmt = (
        select(MaintenanceLog)
        .options(selectinload(MaintenanceLog.vehicle))
        .order_by(MaintenanceLog.created_at.desc())
    )
    if vehicle_id:
        stmt = stmt.where(MaintenanceLog.vehicle_id == vehicle_id)
    if type:
        stmt = stmt.where(MaintenanceLog.type == type)
    result = await db.execute(stmt)
    return result.scalars().all()


@router.get("/{log_id}", response_model=MaintenanceOut)
async def get_maintenance(log_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(MaintenanceLog)
        .options(selectinload(MaintenanceLog.vehicle))
        .where(MaintenanceLog.id == log_id)
    )
    log = result.scalar_one_or_none()
    if not log:
        raise HTTPException(404, "Maintenance log not found")
    return log


@router.post("", response_model=MaintenanceOut, status_code=201)
async def create_maintenance(body: MaintenanceCreate, db: AsyncSession = Depends(get_db)):
    # Validate vehicle exists
    v_result = await db.execute(select(Vehicle).where(Vehicle.id == body.vehicle_id))
    if not v_result.scalar_one_or_none():
        raise HTTPException(400, "Vehicle not found")

    log = MaintenanceLog(**body.model_dump())
    db.add(log)
    await db.commit()
    await db.refresh(log)

    result = await db.execute(
        select(MaintenanceLog)
        .options(selectinload(MaintenanceLog.vehicle))
        .where(MaintenanceLog.id == log.id)
    )
    return result.scalar_one()


@router.put("/{log_id}", response_model=MaintenanceOut)
async def update_maintenance(
    log_id: str, body: MaintenanceUpdate, db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(MaintenanceLog).where(MaintenanceLog.id == log_id))
    log = result.scalar_one_or_none()
    if not log:
        raise HTTPException(404, "Maintenance log not found")
    for key, value in body.model_dump(exclude_unset=True).items():
        setattr(log, key, value)
    await db.commit()
    await db.refresh(log)
    result = await db.execute(
        select(MaintenanceLog)
        .options(selectinload(MaintenanceLog.vehicle))
        .where(MaintenanceLog.id == log.id)
    )
    return result.scalar_one()


@router.delete("/{log_id}", status_code=204)
async def delete_maintenance(log_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(MaintenanceLog).where(MaintenanceLog.id == log_id))
    log = result.scalar_one_or_none()
    if not log:
        raise HTTPException(404, "Maintenance log not found")
    await db.delete(log)
    await db.commit()

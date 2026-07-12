"""Driver CRUD endpoints."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Driver
from app.schemas import DriverCreate, DriverUpdate, DriverOut

router = APIRouter(prefix="/api/drivers", tags=["Drivers"])


@router.get("", response_model=list[DriverOut])
async def list_drivers(
    status: str | None = None,
    db: AsyncSession = Depends(get_db),
):
    stmt = select(Driver).order_by(Driver.created_at.desc())
    if status:
        stmt = stmt.where(Driver.status == status)
    result = await db.execute(stmt)
    return result.scalars().all()


@router.get("/{driver_id}", response_model=DriverOut)
async def get_driver(driver_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Driver).where(Driver.id == driver_id))
    driver = result.scalar_one_or_none()
    if not driver:
        raise HTTPException(404, "Driver not found")
    return driver


@router.post("", response_model=DriverOut, status_code=201)
async def create_driver(body: DriverCreate, db: AsyncSession = Depends(get_db)):
    driver = Driver(**body.model_dump())
    db.add(driver)
    await db.commit()
    await db.refresh(driver)
    return driver


@router.put("/{driver_id}", response_model=DriverOut)
async def update_driver(driver_id: str, body: DriverUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Driver).where(Driver.id == driver_id))
    driver = result.scalar_one_or_none()
    if not driver:
        raise HTTPException(404, "Driver not found")
    for key, value in body.model_dump(exclude_unset=True).items():
        setattr(driver, key, value)
    await db.commit()
    await db.refresh(driver)
    return driver


@router.delete("/{driver_id}", status_code=204)
async def delete_driver(driver_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Driver).where(Driver.id == driver_id))
    driver = result.scalar_one_or_none()
    if not driver:
        raise HTTPException(404, "Driver not found")
    await db.delete(driver)
    await db.commit()

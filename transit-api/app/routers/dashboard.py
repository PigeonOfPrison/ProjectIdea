"""Dashboard stats endpoint — aggregates counts across all entities."""

from fastapi import APIRouter, Depends
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Vehicle, Driver, Trip, MaintenanceLog, FuelLog
from app.schemas import DashboardStats

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])


@router.get("/stats", response_model=DashboardStats)
async def get_dashboard_stats(db: AsyncSession = Depends(get_db)):
    # Vehicle counts
    total_vehicles = (await db.execute(select(func.count(Vehicle.id)))).scalar() or 0
    active_vehicles = (
        await db.execute(select(func.count(Vehicle.id)).where(Vehicle.status == "ACTIVE"))
    ).scalar() or 0
    in_maintenance_vehicles = (
        await db.execute(
            select(func.count(Vehicle.id)).where(Vehicle.status == "IN_MAINTENANCE")
        )
    ).scalar() or 0

    # Driver counts
    total_drivers = (await db.execute(select(func.count(Driver.id)))).scalar() or 0
    available_drivers = (
        await db.execute(select(func.count(Driver.id)).where(Driver.status == "AVAILABLE"))
    ).scalar() or 0
    on_trip_drivers = (
        await db.execute(select(func.count(Driver.id)).where(Driver.status == "ON_TRIP"))
    ).scalar() or 0

    # Trip counts
    total_trips = (await db.execute(select(func.count(Trip.id)))).scalar() or 0
    scheduled_trips = (
        await db.execute(select(func.count(Trip.id)).where(Trip.status == "SCHEDULED"))
    ).scalar() or 0
    in_progress_trips = (
        await db.execute(select(func.count(Trip.id)).where(Trip.status == "IN_PROGRESS"))
    ).scalar() or 0
    completed_trips = (
        await db.execute(select(func.count(Trip.id)).where(Trip.status == "COMPLETED"))
    ).scalar() or 0
    cancelled_trips = (
        await db.execute(select(func.count(Trip.id)).where(Trip.status == "CANCELLED"))
    ).scalar() or 0

    # Cost aggregates
    total_maintenance_cost = (
        await db.execute(select(func.coalesce(func.sum(MaintenanceLog.cost), 0.0)))
    ).scalar() or 0.0
    total_fuel_cost = (
        await db.execute(select(func.coalesce(func.sum(FuelLog.total_cost), 0.0)))
    ).scalar() or 0.0

    return DashboardStats(
        total_vehicles=total_vehicles,
        active_vehicles=active_vehicles,
        in_maintenance_vehicles=in_maintenance_vehicles,
        total_drivers=total_drivers,
        available_drivers=available_drivers,
        on_trip_drivers=on_trip_drivers,
        total_trips=total_trips,
        scheduled_trips=scheduled_trips,
        in_progress_trips=in_progress_trips,
        completed_trips=completed_trips,
        cancelled_trips=cancelled_trips,
        total_maintenance_cost=total_maintenance_cost,
        total_fuel_cost=total_fuel_cost,
    )

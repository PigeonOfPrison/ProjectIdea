"""Seed the database with realistic demo data for TransitOps."""

import asyncio
import uuid
from datetime import datetime, timedelta, timezone

from app.database import engine, async_session, Base
from app.models import Vehicle, Driver, Trip, MaintenanceLog, FuelLog


def _id() -> str:
    return str(uuid.uuid4())


def _iso(dt: datetime) -> str:
    return dt.isoformat()


NOW = datetime.now(timezone.utc)


async def seed():
    # Create tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session() as db:
        # ─────────── Vehicles ───────────
        vehicles = [
            Vehicle(
                id=_id(),
                registration_number="KA-01-AB-1234",
                make="Tata",
                model="Starbus Ultra",
                year=2022,
                type="BUS",
                capacity=52,
                status="ACTIVE",
                fuel_type="DIESEL",
                mileage=45230.5,
            ),
            Vehicle(
                id=_id(),
                registration_number="KA-01-CD-5678",
                make="Ashok Leyland",
                model="Viking",
                year=2021,
                type="BUS",
                capacity=48,
                status="ACTIVE",
                fuel_type="DIESEL",
                mileage=62150.0,
            ),
            Vehicle(
                id=_id(),
                registration_number="KA-02-EF-9012",
                make="Mahindra",
                model="Supro",
                year=2023,
                type="VAN",
                capacity=12,
                status="ACTIVE",
                fuel_type="CNG",
                mileage=18420.0,
            ),
            Vehicle(
                id=_id(),
                registration_number="KA-03-GH-3456",
                make="Tata",
                model="LPT 1613",
                year=2020,
                type="TRUCK",
                capacity=0,
                status="IN_MAINTENANCE",
                fuel_type="DIESEL",
                mileage=98320.0,
            ),
            Vehicle(
                id=_id(),
                registration_number="KA-04-IJ-7890",
                make="Maruti Suzuki",
                model="Ertiga",
                year=2024,
                type="CAR",
                capacity=7,
                status="ACTIVE",
                fuel_type="PETROL",
                mileage=5210.0,
            ),
            Vehicle(
                id=_id(),
                registration_number="KA-05-KL-2345",
                make="Eicher",
                model="Skyline Pro",
                year=2019,
                type="BUS",
                capacity=56,
                status="RETIRED",
                fuel_type="DIESEL",
                mileage=185400.0,
            ),
            Vehicle(
                id=_id(),
                registration_number="KA-06-MN-6789",
                make="Force",
                model="Traveller 26",
                year=2023,
                type="VAN",
                capacity=26,
                status="ACTIVE",
                fuel_type="DIESEL",
                mileage=22150.0,
            ),
            Vehicle(
                id=_id(),
                registration_number="KA-07-OP-0123",
                make="BharatBenz",
                model="1217C",
                year=2022,
                type="TRUCK",
                capacity=0,
                status="OUT_OF_SERVICE",
                fuel_type="DIESEL",
                mileage=72600.0,
            ),
        ]
        db.add_all(vehicles)

        # ─────────── Drivers ───────────
        drivers = [
            Driver(
                id=_id(),
                name="Ramesh Patil",
                email="ramesh.patil@transitops.in",
                phone="+91-9876543210",
                license_number="KA0120210012345",
                license_expiry="2028-06-15",
                status="AVAILABLE",
            ),
            Driver(
                id=_id(),
                name="Suresh Kumar",
                email="suresh.kumar@transitops.in",
                phone="+91-9876543211",
                license_number="KA0120200054321",
                license_expiry="2027-03-22",
                status="AVAILABLE",
            ),
            Driver(
                id=_id(),
                name="Priya Sharma",
                email="priya.sharma@transitops.in",
                phone="+91-9876543212",
                license_number="KA0220220067890",
                license_expiry="2029-01-10",
                status="AVAILABLE",
            ),
            Driver(
                id=_id(),
                name="Anil Deshmukh",
                email="anil.deshmukh@transitops.in",
                phone="+91-9876543213",
                license_number="KA0320210098765",
                license_expiry="2026-11-30",
                status="ON_TRIP",
            ),
            Driver(
                id=_id(),
                name="Kavitha Reddy",
                email="kavitha.reddy@transitops.in",
                phone="+91-9876543214",
                license_number="KA0420230045678",
                license_expiry="2030-05-20",
                status="AVAILABLE",
            ),
            Driver(
                id=_id(),
                name="Mohan Rao",
                email="mohan.rao@transitops.in",
                phone="+91-9876543215",
                license_number="KA0520190034567",
                license_expiry="2025-09-01",
                status="OFF_DUTY",
            ),
            Driver(
                id=_id(),
                name="Deepa Nair",
                email="deepa.nair@transitops.in",
                phone="+91-9876543216",
                license_number="KA0620220078901",
                license_expiry="2029-07-14",
                status="AVAILABLE",
            ),
        ]
        db.add_all(drivers)
        await db.flush()  # ensure IDs are assigned

        # ─────────── Trips ───────────
        trips = [
            Trip(
                id=_id(),
                vehicle_id=vehicles[0].id,
                driver_id=drivers[3].id,  # Anil (ON_TRIP)
                route_name="Bangalore — Mysore Express",
                origin="Majestic Bus Station, Bangalore",
                destination="KSRTC Bus Stand, Mysore",
                scheduled_departure=_iso(NOW - timedelta(hours=2)),
                scheduled_arrival=_iso(NOW + timedelta(hours=1)),
                actual_departure=_iso(NOW - timedelta(hours=2)),
                status="IN_PROGRESS",
                passengers=38,
                notes="Regular express service",
            ),
            Trip(
                id=_id(),
                vehicle_id=vehicles[1].id,
                driver_id=drivers[0].id,
                route_name="Bangalore — Hubli Rajahamsa",
                origin="Majestic Bus Station, Bangalore",
                destination="KSRTC Bus Stand, Hubli",
                scheduled_departure=_iso(NOW + timedelta(hours=4)),
                scheduled_arrival=_iso(NOW + timedelta(hours=10)),
                status="SCHEDULED",
                passengers=0,
            ),
            Trip(
                id=_id(),
                vehicle_id=vehicles[2].id,
                driver_id=drivers[1].id,
                route_name="Airport Shuttle — T1",
                origin="MG Road, Bangalore",
                destination="Kempegowda International Airport",
                scheduled_departure=_iso(NOW - timedelta(hours=6)),
                scheduled_arrival=_iso(NOW - timedelta(hours=5)),
                actual_departure=_iso(NOW - timedelta(hours=6)),
                actual_arrival=_iso(NOW - timedelta(hours=4, minutes=45)),
                status="COMPLETED",
                passengers=9,
            ),
            Trip(
                id=_id(),
                vehicle_id=vehicles[4].id,
                driver_id=drivers[2].id,
                route_name="VIP Transfer — Hotel Taj",
                origin="Taj West End, Bangalore",
                destination="Kempegowda International Airport",
                scheduled_departure=_iso(NOW + timedelta(hours=8)),
                scheduled_arrival=_iso(NOW + timedelta(hours=9, minutes=30)),
                status="SCHEDULED",
                passengers=3,
                notes="Corporate transfer, premium vehicle",
            ),
            Trip(
                id=_id(),
                vehicle_id=vehicles[6].id,
                driver_id=drivers[4].id,
                route_name="Staff Shuttle — Tech Park",
                origin="Electronic City Phase 1",
                destination="Whitefield ITPL",
                scheduled_departure=_iso(NOW - timedelta(days=1, hours=3)),
                scheduled_arrival=_iso(NOW - timedelta(days=1, hours=1)),
                actual_departure=_iso(NOW - timedelta(days=1, hours=3)),
                actual_arrival=_iso(NOW - timedelta(days=1, hours=1, minutes=15)),
                status="COMPLETED",
                passengers=22,
            ),
            Trip(
                id=_id(),
                vehicle_id=vehicles[0].id,
                driver_id=drivers[0].id,
                route_name="Bangalore — Mangalore Airavat",
                origin="Majestic Bus Station, Bangalore",
                destination="KSRTC Bus Stand, Mangalore",
                scheduled_departure=_iso(NOW - timedelta(days=2)),
                scheduled_arrival=_iso(NOW - timedelta(days=2) + timedelta(hours=8)),
                actual_departure=_iso(NOW - timedelta(days=2)),
                actual_arrival=_iso(NOW - timedelta(days=2) + timedelta(hours=8, minutes=20)),
                status="COMPLETED",
                passengers=44,
            ),
            Trip(
                id=_id(),
                vehicle_id=vehicles[1].id,
                driver_id=drivers[1].id,
                route_name="Bangalore — Shimoga Express",
                origin="Majestic Bus Station, Bangalore",
                destination="KSRTC Bus Stand, Shimoga",
                scheduled_departure=_iso(NOW - timedelta(days=1, hours=8)),
                scheduled_arrival=_iso(NOW - timedelta(days=1, hours=2)),
                status="CANCELLED",
                passengers=0,
                notes="Cancelled due to heavy rainfall",
            ),
        ]
        db.add_all(trips)

        # ─────────── Maintenance Logs ───────────
        maintenance_logs = [
            MaintenanceLog(
                id=_id(),
                vehicle_id=vehicles[3].id,  # The truck IN_MAINTENANCE
                type="REPAIR",
                description="Engine overhaul — replaced pistons, gaskets, and timing belt",
                cost=45000.0,
                odometer_reading=98320.0,
                performed_by="Bangalore Motor Works",
                performed_at=_iso(NOW - timedelta(days=2)),
                next_due_at=_iso(NOW + timedelta(days=180)),
            ),
            MaintenanceLog(
                id=_id(),
                vehicle_id=vehicles[0].id,
                type="ROUTINE",
                description="Scheduled oil change and filter replacement",
                cost=3500.0,
                odometer_reading=44500.0,
                performed_by="KSRTC Depot Workshop",
                performed_at=_iso(NOW - timedelta(days=15)),
                next_due_at=_iso(NOW + timedelta(days=75)),
            ),
            MaintenanceLog(
                id=_id(),
                vehicle_id=vehicles[1].id,
                type="INSPECTION",
                description="Annual fitness certificate inspection",
                cost=1200.0,
                odometer_reading=61000.0,
                performed_by="RTO Bangalore",
                performed_at=_iso(NOW - timedelta(days=30)),
                next_due_at=_iso(NOW + timedelta(days=335)),
            ),
            MaintenanceLog(
                id=_id(),
                vehicle_id=vehicles[2].id,
                type="ROUTINE",
                description="Brake pad replacement — front and rear",
                cost=8500.0,
                odometer_reading=17800.0,
                performed_by="Mahindra Authorised Service",
                performed_at=_iso(NOW - timedelta(days=10)),
            ),
            MaintenanceLog(
                id=_id(),
                vehicle_id=vehicles[7].id,  # OUT_OF_SERVICE truck
                type="EMERGENCY",
                description="Transmission failure on highway — vehicle towed to depot",
                cost=78000.0,
                odometer_reading=72600.0,
                performed_by="Highway Rescue & BharatBenz Service",
                performed_at=_iso(NOW - timedelta(days=5)),
            ),
        ]
        db.add_all(maintenance_logs)

        # ─────────── Fuel Logs ───────────
        fuel_logs = [
            FuelLog(
                id=_id(),
                vehicle_id=vehicles[0].id,
                liters=120.0,
                cost_per_liter=89.50,
                total_cost=10740.0,
                odometer_reading=45230.0,
                fuel_station="Indian Oil — Majestic",
                fueled_at=_iso(NOW - timedelta(hours=12)),
            ),
            FuelLog(
                id=_id(),
                vehicle_id=vehicles[1].id,
                liters=115.0,
                cost_per_liter=89.50,
                total_cost=10292.50,
                odometer_reading=62100.0,
                fuel_station="HP Petrol Pump — Yeshwanthpur",
                fueled_at=_iso(NOW - timedelta(days=1)),
            ),
            FuelLog(
                id=_id(),
                vehicle_id=vehicles[2].id,
                liters=35.0,
                cost_per_liter=76.20,
                total_cost=2667.0,
                odometer_reading=18400.0,
                fuel_station="Indraprastha Gas — Koramangala",
                fueled_at=_iso(NOW - timedelta(days=2)),
            ),
            FuelLog(
                id=_id(),
                vehicle_id=vehicles[4].id,
                liters=40.0,
                cost_per_liter=104.95,
                total_cost=4198.0,
                odometer_reading=5200.0,
                fuel_station="Bharat Petroleum — Indiranagar",
                fueled_at=_iso(NOW - timedelta(days=3)),
            ),
            FuelLog(
                id=_id(),
                vehicle_id=vehicles[6].id,
                liters=80.0,
                cost_per_liter=89.50,
                total_cost=7160.0,
                odometer_reading=22000.0,
                fuel_station="Indian Oil — Electronic City",
                fueled_at=_iso(NOW - timedelta(days=1, hours=8)),
            ),
            FuelLog(
                id=_id(),
                vehicle_id=vehicles[0].id,
                liters=110.0,
                cost_per_liter=89.50,
                total_cost=9845.0,
                odometer_reading=44800.0,
                fuel_station="Shell — Hosur Road",
                fueled_at=_iso(NOW - timedelta(days=4)),
            ),
            FuelLog(
                id=_id(),
                vehicle_id=vehicles[1].id,
                liters=105.0,
                cost_per_liter=89.50,
                total_cost=9397.50,
                odometer_reading=61500.0,
                fuel_station="Indian Oil — Tumkur Road",
                fueled_at=_iso(NOW - timedelta(days=5)),
            ),
        ]
        db.add_all(fuel_logs)

        await db.commit()
        print("[OK] Database seeded successfully!")
        print(f"   {len(vehicles)} vehicles")
        print(f"   {len(drivers)} drivers")
        print(f"   {len(trips)} trips")
        print(f"   {len(maintenance_logs)} maintenance logs")
        print(f"   {len(fuel_logs)} fuel logs")


if __name__ == "__main__":
    asyncio.run(seed())

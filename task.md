# TransitOps — Implementation Tasks

## Backend (`transit-api/`)

- [x] Create `requirements.txt`
- [x] Create `app/database.py` — async SQLAlchemy engine
- [x] Create `app/models.py` — ORM models (Vehicle, Driver, Trip, MaintenanceLog, FuelLog)
- [x] Create `app/schemas.py` — Pydantic request/response schemas
- [x] Create `app/main.py` — FastAPI app with CORS & lifespan
- [x] Create `app/routers/vehicles.py` — Vehicle CRUD endpoints
- [x] Create `app/routers/drivers.py` — Driver CRUD endpoints
- [x] Create `app/routers/trips.py` — Trip CRUD + lifecycle endpoints
- [x] Create `app/routers/maintenance.py` — Maintenance log endpoints
- [x] Create `app/routers/fuel.py` — Fuel log endpoints
- [x] Create `app/routers/dashboard.py` — Dashboard stats endpoint
- [x] Create `app/seed.py` — Demo data seeder
- [x] Verify backend starts and Swagger docs load

## Frontend (`dispatch-console/`)

- [x] Update `.env` and `client.ts` for single API URL
- [x] Rewrite `types.ts` with transit domain types
- [x] Delete old API clients (logsprey, raven, orders)
- [x] Create new API clients (vehicles, drivers, trips, maintenance, fuel, dashboard)
- [x] Rewrite mock data store
- [x] Update `Sidebar.tsx` — new nav items and branding
- [x] Update `Badge.tsx` — transit-domain status badges
- [x] Update `App.tsx` — new routes
- [x] Rewrite `Dashboard.tsx` — transit KPIs
- [x] Create Vehicle pages (List, Detail, Form)
- [x] Create Driver pages (List, Detail, Form)
- [x] Create Trip pages (List, Detail, Form)
- [x] Create Maintenance pages (List, Form)
- [x] Create Fuel Log pages (List, Form)
- [x] Rewrite `Reports.tsx` — transit analytics
- [x] Update `Settings.tsx` — simplified config display
- [x] Verify frontend builds and runs

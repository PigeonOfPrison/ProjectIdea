# TransitOps

TransitOps is a fleet management and transit dispatch project with a FastAPI backend and a React dispatch console. It supports vehicle inventory, driver records, trip scheduling, maintenance history, fuel logs, and dashboard reporting for a transit operation.

## Project Structure

```text
.
+-- transit-api/        # FastAPI backend, SQLite database, seed data
`-- dispatch-console/   # Vite + React + TypeScript frontend
```

## Features

- Vehicle CRUD with status and type filters
- Driver CRUD with availability tracking
- Trip scheduling with lifecycle transitions
- Maintenance log tracking by vehicle and maintenance type
- Fuel log tracking with cost and odometer data
- Dashboard summary metrics for fleet, drivers, trips, and costs
- React dispatch console connected to the API through Axios and TanStack Query

## Backend: transit-api

The API is built with FastAPI, async SQLAlchemy, Pydantic, Uvicorn, and SQLite.

### Setup

From the project root:

```bash
cd transit-api
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

On macOS or Linux, activate the virtual environment with:

```bash
source .venv/bin/activate
```

### Seed Demo Data

The repository includes a seed script with realistic demo vehicles, drivers, trips, maintenance records, and fuel logs.

```bash
python -m app.seed
```

By default, data is stored in:

```text
transit-api/transitops.db
```

### Run the API

```bash
uvicorn app.main:app --reload
```

The API runs at:

```text
http://localhost:8000
```

Useful links:

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
- Health check: `http://localhost:8000/api/health`

### Environment Variables

| Variable | Default | Description |
| --- | --- | --- |
| `DATABASE_URL` | `sqlite+aiosqlite:///./transitops.db` | SQLAlchemy database connection string |

Example:

```bash
set DATABASE_URL=sqlite+aiosqlite:///./transitops.db
```

For PowerShell:

```powershell
$env:DATABASE_URL = "sqlite+aiosqlite:///./transitops.db"
```

## API Overview

| Area | Methods and Routes |
| --- | --- |
| Health | `GET /api/health` |
| Dashboard | `GET /api/dashboard/stats` |
| Vehicles | `GET /api/vehicles`, `GET /api/vehicles/{id}`, `POST /api/vehicles`, `PUT /api/vehicles/{id}`, `PATCH /api/vehicles/{id}/status`, `DELETE /api/vehicles/{id}` |
| Drivers | `GET /api/drivers`, `GET /api/drivers/{id}`, `POST /api/drivers`, `PUT /api/drivers/{id}`, `DELETE /api/drivers/{id}` |
| Trips | `GET /api/trips`, `GET /api/trips/{id}`, `POST /api/trips`, `PUT /api/trips/{id}`, `PATCH /api/trips/{id}/status`, `DELETE /api/trips/{id}` |
| Maintenance | `GET /api/maintenance`, `GET /api/maintenance/{id}`, `POST /api/maintenance`, `PUT /api/maintenance/{id}`, `DELETE /api/maintenance/{id}` |
| Fuel Logs | `GET /api/fuel-logs`, `GET /api/fuel-logs/{id}`, `POST /api/fuel-logs`, `DELETE /api/fuel-logs/{id}` |

Common query filters:

- `GET /api/vehicles?status=ACTIVE&type=BUS`
- `GET /api/drivers?status=AVAILABLE`
- `GET /api/trips?status=SCHEDULED&vehicle_id=<vehicle-id>&driver_id=<driver-id>`
- `GET /api/maintenance?vehicle_id=<vehicle-id>&type=ROUTINE`
- `GET /api/fuel-logs?vehicle_id=<vehicle-id>`

Trip status transitions are validated by the API:

```text
SCHEDULED -> IN_PROGRESS or CANCELLED
IN_PROGRESS -> COMPLETED or CANCELLED
COMPLETED -> no further transitions
CANCELLED -> no further transitions
```

When a trip starts, the assigned driver is marked `ON_TRIP`. When it completes or is cancelled while in progress, the driver is returned to `AVAILABLE`.

## Frontend: dispatch-console

The dispatch console is built with Vite, React, TypeScript, React Router, TanStack Query, Axios, Tailwind CSS, Lucide icons, and Recharts.

### Setup

Open a second terminal from the project root:

```bash
cd dispatch-console
npm install
npm run dev
```

The frontend runs at:

```text
http://localhost:5173
```

The console expects the API at `http://localhost:8000` by default.

### Frontend Environment Variables

Create `dispatch-console/.env` if you need to point the frontend at a different API URL:

```bash
VITE_API_URL=http://localhost:8000
```

## Typical Development Workflow

1. Start the backend:

   ```bash
   cd transit-api
   .venv\Scripts\activate
   uvicorn app.main:app --reload
   ```

2. Start the frontend in a separate terminal:

   ```bash
   cd dispatch-console
   npm run dev
   ```

3. Open the dispatch console:

   ```text
   http://localhost:5173
   ```

4. Open the API docs when testing endpoints:

   ```text
   http://localhost:8000/docs
   ```

## Data Model

TransitOps uses five main entities:

- `Vehicle`: registration, make, model, year, type, capacity, status, fuel type, mileage
- `Driver`: name, contact details, license details, availability status
- `Trip`: route, origin, destination, schedule, actual times, status, passengers, assigned vehicle and driver
- `MaintenanceLog`: vehicle, maintenance type, description, cost, odometer reading, service provider, due dates
- `FuelLog`: vehicle, liters, cost per liter, total cost, odometer reading, station, fuel date

## Notes

- The backend creates database tables automatically on startup.
- CORS is currently open for local development.
- The SQLite database file is convenient for demos and local work. For production, configure a stronger database through `DATABASE_URL`.
- Authentication and authorization are not currently implemented.

"""TransitOps — FastAPI application entry point."""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base
from app.routers import vehicles, drivers, trips, maintenance, fuel, dashboard


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Create database tables on startup."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield


app = FastAPI(
    title="TransitOps API",
    description="Fleet management & transit dispatch backend",
    version="0.1.0",
    lifespan=lifespan,
)

# CORS — allow the Vite dev server (and any other local origin)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(vehicles.router)
app.include_router(drivers.router)
app.include_router(trips.router)
app.include_router(maintenance.router)
app.include_router(fuel.router)
app.include_router(dashboard.router)


@app.get("/api/health", tags=["Health"])
async def health_check():
    return {"status": "ok", "service": "transit-api"}

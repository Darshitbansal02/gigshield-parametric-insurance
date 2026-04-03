"""
GigShield Backend — FastAPI Application Entry Point.

AI-Powered Parametric Income Insurance for India's Gig Workers.
Guidewire DEVTrails 2026 — Phase 2: Automation & Protection.

Features:
  - Worker Registration + AI Risk Scoring
  - Weekly Policy Management (₹49/₹69/₹99)
  - Real-time Weather/AQI Monitoring
  - Parametric Trigger Engine (7 trigger types)
  - Auto-Claim + Fraud Detection
  - Instant UPI Payout Simulation
  - Worker + Admin Dashboards
"""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.asyncio import AsyncIOScheduler

from core.config import settings
from core.database import init_db
from routers import auth, dashboard, blog, policies, triggers, payouts, admin
from scheduler.monitor import run_monitoring_cycle

# ── Logging ──
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-7s | %(name)s | %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("gigshield")

# ── Scheduler ──
scheduler = AsyncIOScheduler()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    # Startup
    logger.info("[GIGSHIELD] Backend starting...")
    await init_db()
    logger.info("[OK] Database tables created")

    # Start weather/AQI monitoring scheduler (every 15 minutes)
    scheduler.add_job(
        run_monitoring_cycle,
        "interval",
        minutes=2,
        id="weather_monitor",
        name="Weather & AQI Monitor",
        replace_existing=True,
    )
    scheduler.start()
    logger.info("[MONITOR] Weather monitor scheduled (every 15 min)")

    logger.info("[READY] GigShield Backend ready at http://localhost:8000")
    logger.info("[DOCS] API docs at http://localhost:8000/docs")

    yield

    # Shutdown
    scheduler.shutdown(wait=False)
    logger.info("[STOP] GigShield Backend stopped")


# ── App ──
app = FastAPI(
    title="GigShield API",
    description="AI-Powered Parametric Income Insurance for India's Gig Workers",
    version="2.0.0",
    lifespan=lifespan,
)

# ── CORS ──
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ──
app.include_router(auth.router)
app.include_router(dashboard.router)
app.include_router(blog.router)
app.include_router(policies.router)
app.include_router(triggers.router)
app.include_router(payouts.router)
app.include_router(admin.router)


# ── Health check ──
@app.get("/", tags=["health"])
async def root():
    return {
        "name": "GigShield API",
        "version": "2.0.0",
        "status": "operational",
        "phase": "Phase 2 - Automation & Protection",
        "features": [
            "Worker Registration + AI Risk Scoring",
            "Weekly Policy Management (₹49/₹69/₹99)",
            "Real-time Weather/AQI Monitoring",
            "Parametric Trigger Engine (7 triggers)",
            "Auto-Claim + Fraud Detection",
            "Instant UPI Payout Simulation",
        ],
    }


@app.get("/api/health", tags=["health"])
async def health_check():
    return {"status": "healthy", "database": "sqlite", "scheduler": "running"}

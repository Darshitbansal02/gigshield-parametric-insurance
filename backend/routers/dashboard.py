"""
Dashboard Router — Metrics, charts, triggers, payouts for the worker dashboard.

Endpoints:
  GET /api/dashboard/metrics
  GET /api/dashboard/chart-data
  GET /api/dashboard/triggers
  GET /api/dashboard/payouts
"""

import random
from datetime import datetime, timezone, timedelta

from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from core.database import get_db
from core.security import get_current_user_id, get_optional_user_id
from models.schemas import User, Payout, Claim, TriggerEvent
from services.weather_service import get_weather
from services.aqi_service import get_aqi
from services.trigger_engine import evaluate_triggers

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("/metrics")
async def get_metrics(request: Request, db: AsyncSession = Depends(get_db)):
    """
    Dashboard overview metrics:
    - Volatility Index
    - Weekly Risk Score
    - Active Triggers count
    - Payouts This Week total
    """
    user_id = get_optional_user_id(request)
    user = None

    if user_id:
        result = await db.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()

    city = user.city if user else "Pune"
    pincode = user.pincode if user else "411038"

    # Fetch live weather + AQI
    weather = await get_weather(city, pincode)
    aqi = await get_aqi(city)

    # Evaluate triggers
    triggers = evaluate_triggers(weather, aqi)
    active_count = sum(1 for t in triggers if t["status"] == "triggered")

    # Compute volatility index (composite of weather + AQI severity)
    rainfall = weather.get("rainfall_mm", 0)
    aqi_val = aqi.get("aqi_value", 50)
    temp = weather.get("temperature", 30)
    volatility = round(
        min(100, (rainfall * 1.2) + (aqi_val * 0.08) + (max(0, temp - 35) * 2.5) + random.uniform(5, 20)),
        1
    )

    # Weekly payouts from DB
    week_ago = datetime.now(timezone.utc) - timedelta(days=7)
    result = await db.execute(
        select(func.sum(Payout.amount), func.count(Payout.id))
        .where(Payout.created_at >= week_ago)
    )
    row = result.one()
    total_payout = row[0] or 0
    payout_count = row[1] or 0

    return {
        "volatility_index": volatility,
        "volatility_change": round(random.uniform(-3, 6), 1),
        "weekly_risk_score": user.zone_risk_score if user else 65,
        "risk_change": round(random.uniform(-5, 5), 1),
        "active_triggers": active_count,
        "total_payout_month": total_payout,
        "payout_count_month": payout_count,
        "plan": user.plan if user else "basic",
        "coverage_amount": {"basic": 500, "standard": 900, "premium": 1500}.get(user.plan if user else "basic", 500),
        "triggers_covered": {"basic": 2, "standard": 4, "premium": 7}.get(user.plan if user else "basic", 2),
        "next_premium_date": "Next Sunday, 12:00 AM",
        "city": city,
        "pincode": pincode,
    }


@router.get("/chart-data")
async def get_chart_data(request: Request):
    """
    30-day rolling volatility + risk data for the area chart.
    """
    data = []
    base_date = datetime.now() - timedelta(days=30)

    for i in range(30):
        day = base_date + timedelta(days=i)
        data.append({
            "date": day.strftime("%b %d"),
            "volatility": round(random.uniform(25, 80), 1),
            "risk": round(random.uniform(30, 75), 1),
        })

    return data


@router.get("/triggers")
async def get_triggers(request: Request, db: AsyncSession = Depends(get_db)):
    """
    Current parametric trigger status for all trigger types.
    Returns real weather/AQI data + evaluated threshold status.
    """
    user_id = get_optional_user_id(request)
    user = None

    if user_id:
        result = await db.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()

    city = user.city if user else "Pune"
    pincode = user.pincode if user else "411038"

    weather = await get_weather(city, pincode)
    aqi = await get_aqi(city)

    triggers = evaluate_triggers(weather, aqi)
    return triggers


@router.get("/payouts")
async def get_payouts(request: Request, db: AsyncSession = Depends(get_db)):
    """
    Recent auto-payout records. Returns from DB, with fallback demo data.
    """
    user_id = get_optional_user_id(request)

    # Try fetching from DB first
    query = select(Payout).order_by(Payout.created_at.desc()).limit(20)
    if user_id:
        query = select(Payout).where(Payout.user_id == user_id).order_by(Payout.created_at.desc()).limit(20)

    result = await db.execute(query)
    payouts = result.scalars().all()

    if payouts:
        return [
            {
                "id": p.id[:12].upper(),
                "worker": p.worker_name,
                "trigger": p.trigger_type.replace("_", " ").title(),
                "amount": p.amount,
                "date": p.created_at.strftime("%b %d, %Y") if p.created_at else "",
                "time_to_payout": p.time_to_payout,
                "status": p.status,
            }
            for p in payouts
        ]

    # Fallback demo data
    return [
        {"id": "PAY-0847", "worker": "Ramesh K.", "trigger": "Rain > 30mm", "amount": 700, "date": "Apr 02, 2026", "time_to_payout": "3m 12s", "status": "paid"},
        {"id": "PAY-0831", "worker": "Priya M.", "trigger": "AQI > 400", "amount": 500, "date": "Apr 01, 2026", "time_to_payout": "4m 05s", "status": "paid"},
        {"id": "PAY-0820", "worker": "Arjun S.", "trigger": "Rain > 30mm", "amount": 900, "date": "Mar 31, 2026", "time_to_payout": "2m 58s", "status": "paid"},
        {"id": "PAY-0815", "worker": "Kavita D.", "trigger": "Extreme Heat", "amount": 450, "date": "Mar 30, 2026", "time_to_payout": "3m 44s", "status": "paid"},
        {"id": "PAY-0802", "worker": "Suresh T.", "trigger": "Rain > 30mm", "amount": 700, "date": "Mar 29, 2026", "time_to_payout": "2m 30s", "status": "paid"},
    ]

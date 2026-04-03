"""
Triggers Router — Monitor and simulate parametric triggers.

Endpoints:
  GET  /api/triggers/status      - Current trigger readings
  POST /api/triggers/simulate    - Simulate a weather event (admin/demo)
  GET  /api/triggers/history     - Past trigger events
"""

from datetime import datetime, timezone, timedelta

from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from core.database import get_db
from core.security import get_current_user_id, get_optional_user_id
from models.schemas import User, TriggerEvent, Claim, Payout
from services.weather_service import get_weather
from services.aqi_service import get_aqi
from services.trigger_engine import evaluate_triggers, get_triggered_events, calculate_lost_hours
from services.fraud_engine import compute_fraud_score
from services.payout_engine import calculate_payout, simulate_upi_payout

router = APIRouter(prefix="/api/triggers", tags=["triggers"])


class SimulateTriggerRequest(BaseModel):
    trigger_type: str = "rain"        # rain / aqi / heat / flood / curfew
    value: float = 47.2               # the trigger value
    city: str = "Pune"
    pincode: str = "411038"


@router.get("/status")
async def get_trigger_status(request: Request, db: AsyncSession = Depends(get_db)):
    """Get current parametric trigger readings for the user's zone."""
    user_id = get_optional_user_id(request)
    user = None

    if user_id:
        result = await db.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()

    city = user.city if user else "Pune"
    pincode = user.pincode if user else "411038"

    weather = await get_weather(city, pincode)
    aqi = await get_aqi(city)
    live_triggers = evaluate_triggers(weather, aqi)
    
    # Fetch regional history: make naive for SQLite
    an_hour_ago = (datetime.now(timezone.utc) - timedelta(hours=1)).replace(tzinfo=None)
    db_result = await db.execute(
        select(TriggerEvent).where(
            TriggerEvent.zone_pincode == pincode,
            TriggerEvent.status == "triggered",
            TriggerEvent.created_at >= an_hour_ago
        )
    )
    db_events = db_result.scalars().all()
    
    # Merge DB events into live triggers
    for db_event in db_events:
        for trigger in live_triggers:
            if trigger["trigger_type"] == db_event.trigger_type:
                trigger["status"] = "triggered"
                trigger["current_value"] = db_event.current_value
                trigger["confidence"] = db_event.confidence
                trigger["data_source"] = f"Network + {db_event.data_source}"
                trigger["event_id"] = db_event.id
                trigger["timestamp"] = db_event.created_at.isoformat() if db_event.created_at else None

    # Calculate overall status
    is_triggered = any(t["status"] == "triggered" for t in live_triggers)
    
    return {
        "overall_status": "triggered" if is_triggered else "normal",
        "conditions": live_triggers
    }


@router.post("/simulate")
async def simulate_trigger(
    req: SimulateTriggerRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    """
    Simulate a parametric trigger event (for demo/admin).
    This triggers the full pipeline: event → fraud check → payout.
    """
    user_id = get_optional_user_id(request)

    # 1. Deduplication: naive comparison for SQLite
    four_hours_ago = (datetime.now(timezone.utc) - timedelta(hours=4)).replace(tzinfo=None)
    existing_event_result = await db.execute(
        select(TriggerEvent).where(
            TriggerEvent.trigger_type == req.trigger_type,
            TriggerEvent.zone_pincode == req.pincode,
            TriggerEvent.status == "triggered",
            TriggerEvent.created_at >= four_hours_ago
        ).order_by(TriggerEvent.created_at.desc())
    )
    trigger_event = existing_event_result.scalar_one_or_none()

    if not trigger_event:
        # Create the trigger event in DB
        trigger_event = TriggerEvent(
            trigger_type=req.trigger_type,
            zone_pincode=req.pincode,
            city=req.city,
            current_value=f"{req.value}{'mm' if req.trigger_type == 'rain' else '°C' if req.trigger_type == 'heat' else ''}",
            threshold=_get_threshold_string(req.trigger_type),
            status="triggered",
            confidence=min(99.5, (req.value / _get_threshold_value(req.trigger_type)) * 100),
            data_source="Simulation",
        )
        db.add(trigger_event)
        await db.flush()  # Get ID via flush
    # If it exists, we reuse trigger_event for the workers check


    # Find all affected workers in the zone
    result = await db.execute(
        select(User).where(User.pincode == req.pincode, User.is_active == True)
    )
    affected_workers = result.scalars().all()

    # If no specific user and no workers in zone, use requesting user
    if not affected_workers and user_id:
        result = await db.execute(select(User).where(User.id == user_id))
        worker = result.scalar_one_or_none()
        if worker:
            affected_workers = [worker]

    payouts_created = []

    for worker in affected_workers:
        # 2. Payout Security: Check if worker already has a claim for THIS trigger event
        claim_check = await db.execute(
            select(Claim).where(
                Claim.user_id == worker.id,
                Claim.trigger_event_id == trigger_event.id
            )
        )
        if claim_check.scalar_one_or_none():
            continue # SKIP worker, already processed this trigger cycle

        # Calculate lost hours
        lost_hours = calculate_lost_hours(req.trigger_type, req.value)
        if lost_hours == 0:
            continue

        # Fraud check
        fraud_result = await compute_fraud_score(
            db, worker.id, req.trigger_type, req.pincode, req.city
        )

        # Create claim
        payout_calc = calculate_payout(lost_hours, worker.hourly_rate, worker.plan)

        claim = Claim(
            user_id=worker.id,
            trigger_event_id=trigger_event.id,
            trigger_type=req.trigger_type,
            lost_hours=lost_hours,
            hourly_rate=worker.hourly_rate,
            payout_amount=payout_calc["net_amount"],
            fraud_score=fraud_result["fraud_score"],
            fraud_status=fraud_result["fraud_status"],
            status="approved" if fraud_result["fraud_status"] == "clean" else "pending",
        )
        db.add(claim)

        # Process payout if fraud check passed
        if fraud_result["fraud_status"] == "clean":
            upi_result = simulate_upi_payout(worker.name, payout_calc["net_amount"])

            payout = Payout(
                user_id=worker.id,
                claim_id=claim.id,
                worker_name=worker.name,
                trigger_type=req.trigger_type,
                amount=payout_calc["net_amount"],
                time_to_payout=upi_result["time_to_payout"],
                payment_method="UPI",
                payment_ref=upi_result["payment_ref"],
                status="paid",
                date=datetime.now(timezone.utc).strftime("%b %d, %Y"),
            )
            db.add(payout)

            payouts_created.append({
                "worker": worker.name,
                "amount": payout_calc["net_amount"],
                "time_to_payout": upi_result["time_to_payout"],
                "payment_ref": upi_result["payment_ref"],
                "fraud_score": fraud_result["fraud_score"],
                "fraud_status": fraud_result["fraud_status"],
            })

    await db.commit()

    msg = f"Simulated {req.trigger_type} trigger in {req.city}."
    if len(payouts_created) > 0:
        msg += f" {len(payouts_created)} new payouts processed."
    else:
        msg += " Trigger already active or workers already paid for this cycle."

    return {
        "trigger_event_id": trigger_event.id,
        "trigger_type": req.trigger_type,
        "value": req.value,
        "zone": f"{req.city} ({req.pincode})",
        "affected_workers": len(affected_workers),
        "payouts_processed": len(payouts_created),
        "payouts": payouts_created,
        "message": msg,
    }


@router.get("/history")
async def get_trigger_history(db: AsyncSession = Depends(get_db)):
    """Get recent trigger events from the database."""
    result = await db.execute(
        select(TriggerEvent).order_by(TriggerEvent.created_at.desc()).limit(50)
    )
    events = result.scalars().all()

    return [
        {
            "id": e.id,
            "trigger_type": e.trigger_type,
            "city": e.city,
            "pincode": e.zone_pincode,
            "value": e.current_value,
            "threshold": e.threshold,
            "status": e.status,
            "confidence": e.confidence,
            "source": e.data_source,
            "created_at": e.created_at.isoformat() if e.created_at else None,
        }
        for e in events
    ]


def _get_threshold_string(trigger_type: str) -> str:
    mapping = {
        "rain": "30mm/hr",
        "aqi": "AQI > 400",
        "heat": "45°C",
        "flood": "100mm/24hr",
        "curfew": "Zone closure",
        "demand_crash": "> 60% drop",
        "platform_outage": "> 30 min",
    }
    return mapping.get(trigger_type, "Unknown")


def _get_threshold_value(trigger_type: str) -> float:
    mapping = {
        "rain": 30.0,
        "aqi": 400.0,
        "heat": 45.0,
        "flood": 100.0,
        "curfew": 1.0,
        "demand_crash": 60.0,
        "platform_outage": 30.0,
    }
    return mapping.get(trigger_type, 1.0)

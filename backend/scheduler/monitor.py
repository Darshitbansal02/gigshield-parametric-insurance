"""
Weather & AQI Monitor — Scheduled task that runs every 15 minutes.

Polls weather/AQI APIs for all active worker zones, evaluates triggers,
auto-creates claims, runs fraud checks, and processes payouts.

This is the core "zero-touch" automation engine from README §4.
"""

import asyncio
import logging
from datetime import datetime, timezone, timedelta

from sqlalchemy import select, func, and_
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import async_session
from models.schemas import User, TriggerEvent, Claim, Payout, WeatherLog, AQILog
from services.weather_service import get_weather
from services.aqi_service import get_aqi
from services.trigger_engine import evaluate_triggers, get_triggered_events, calculate_lost_hours
from services.fraud_engine import compute_fraud_score
from services.payout_engine import calculate_payout, simulate_upi_payout

logger = logging.getLogger(__name__)


async def run_monitoring_cycle():
    """
    Execute one full monitoring cycle:
    1. Get all unique active zones (pincode + city)
    2. Fetch weather + AQI for each zone
    3. Evaluate parametric triggers
    4. For triggered events: create claims, run fraud checks, process payouts
    """
    logger.info("[CYCLE] Starting monitoring cycle...")

    async with async_session() as db:
        try:
            # 1. Get all unique zones with active workers
            result = await db.execute(
                select(User.pincode, User.city)
                .where(User.is_active == True)
                .distinct()
            )
            zones = result.all()

            if not zones:
                logger.info("No active workers found. Skipping cycle.")
                return

            logger.info(f"Monitoring {len(zones)} active zones")

            for pincode, city in zones:
                try:
                    await _process_zone(db, pincode, city)
                except Exception as e:
                    logger.error(f"Error processing zone {pincode} ({city}): {e}")

            await db.commit()
            logger.info("[OK] Monitoring cycle complete")

        except Exception as e:
            logger.error(f"Monitoring cycle failed: {e}")
            await db.rollback()


async def _process_zone(db: AsyncSession, pincode: str, city: str):
    """Process a single zone: fetch data → evaluate → trigger payouts."""

    # Fetch weather + AQI
    weather = await get_weather(city, pincode)
    aqi = await get_aqi(city)

    # Log the readings
    weather_log = WeatherLog(
        city=city,
        pincode=pincode,
        temperature=weather.get("temperature"),
        humidity=weather.get("humidity"),
        rainfall_mm=weather.get("rainfall_mm", 0),
        wind_speed=weather.get("wind_speed"),
        description=weather.get("description"),
        source=weather.get("source", "mock"),
    )
    db.add(weather_log)

    aqi_log = AQILog(
        city=city,
        pincode=pincode,
        aqi_value=aqi.get("aqi_value", 0),
        dominant_pollutant=aqi.get("dominant_pollutant"),
        source=aqi.get("source", "mock"),
    )
    db.add(aqi_log)

    # Evaluate triggers
    triggers = evaluate_triggers(weather, aqi)
    triggered = get_triggered_events(triggers)

    if not triggered:
        return

    logger.info(f"[TRIGGER] {len(triggered)} triggers fired in {city} ({pincode})")

    for trigger in triggered:
        # 1. Deduplication: PostgreSQL-compatible timezone-aware comparison
        four_hours_ago = datetime.now(timezone.utc) - timedelta(hours=4)
        existing_event_result = await db.execute(
            select(TriggerEvent).where(
                TriggerEvent.trigger_type == trigger["trigger_type"],
                TriggerEvent.zone_pincode == pincode,
                TriggerEvent.status == "triggered",
                TriggerEvent.created_at >= four_hours_ago
            ).order_by(TriggerEvent.created_at.desc())
        )
        trigger_event = existing_event_result.scalar_one_or_none()
        
        if not trigger_event:
            # Store new trigger event
            trigger_event = TriggerEvent(
                trigger_type=trigger["trigger_type"],
                zone_pincode=pincode,
                city=city,
                current_value=trigger["current_value"],
                threshold=trigger["threshold"],
                status="triggered",
                confidence=trigger["confidence"],
                data_source=trigger["data_source"],
            )
            db.add(trigger_event)
            await db.flush()  # Get ID
            logger.info(f"[TRIGGER] Created new event {trigger_event.id} for {trigger['trigger_type']} in {city}")
        else:
            logger.info(f"[TRIGGER] Using existing active event {trigger_event.id} for {trigger['trigger_type']}")

        # Find affected workers in this zone
        result = await db.execute(
            select(User).where(User.pincode == pincode, User.is_active == True)
        )
        workers = result.scalars().all()

        for worker in workers:
            # 2. Payout Security: Check if this worker already has a claim for THIS specific trigger event
            claim_check = await db.execute(
                select(Claim).where(
                    Claim.user_id == worker.id,
                    Claim.trigger_event_id == trigger_event.id
                )
            )
            if claim_check.scalar_one_or_none():
                continue  # Already paid for this specific event cycle
            # Calculate lost hours
            try:
                value = float(''.join(c for c in trigger["current_value"] if c.isdigit() or c == '.'))
            except ValueError:
                value = 0

            lost_hours = calculate_lost_hours(trigger["trigger_type"], value)
            if lost_hours == 0:
                continue

            # Fraud check
            fraud = await compute_fraud_score(
                db, worker.id, trigger["trigger_type"], pincode, city
            )

            # Calculate payout
            payout_calc = calculate_payout(lost_hours, worker.hourly_rate, worker.plan)

            # Create claim
            claim = Claim(
                user_id=worker.id,
                trigger_event_id=trigger_event.id,
                trigger_type=trigger["trigger_type"],
                lost_hours=lost_hours,
                hourly_rate=worker.hourly_rate,
                payout_amount=payout_calc["net_amount"],
                fraud_score=fraud["fraud_score"],
                fraud_status=fraud["fraud_status"],
                status="approved" if fraud["fraud_status"] == "clean" else "pending",
            )
            db.add(claim)

            # Process payout if clean
            if fraud["fraud_status"] == "clean":
                upi = simulate_upi_payout(worker.name, payout_calc["net_amount"])

                payout = Payout(
                    user_id=worker.id,
                    claim_id=claim.id,
                    worker_name=worker.name,
                    trigger_type=trigger["trigger_type"],
                    amount=payout_calc["net_amount"],
                    time_to_payout=upi["time_to_payout"],
                    payment_method="UPI",
                    payment_ref=upi["payment_ref"],
                    status="paid",
                    date=datetime.now(timezone.utc).strftime("%b %d, %Y"),
                )
                db.add(payout)
                logger.info(
                    f"[PAYOUT] Auto-payout: Rs.{payout_calc['net_amount']} -> {worker.name} "
                    f"({trigger['trigger_type']}) in {upi['time_to_payout']}"
                )
            else:
                logger.warning(
                    f"[FRAUD] Claim flagged for {worker.name}: "
                    f"fraud_score={fraud['fraud_score']}, status={fraud['fraud_status']}"
                )

"""
Payout Engine — Calculates and processes auto-payouts.

Formula: Payout = lost_hours × hourly_rate
Capped by the worker's plan coverage limit.
Payment simulated via UPI (Razorpay test mode concept).
"""

import random
import logging
from datetime import datetime, timezone

logger = logging.getLogger(__name__)


# ── Plan payout caps (per event) ──
PLAN_CAPS = {
    "basic": 500,
    "standard": 900,
    "premium": 1500,
}


def calculate_payout(
    lost_hours: float,
    hourly_rate: float,
    plan: str = "basic",
) -> dict:
    """
    Calculate the payout amount for a triggered event.
    
    Returns: { gross_amount, cap, net_amount, breakdown }
    """
    gross = round(lost_hours * hourly_rate, 2)
    cap = PLAN_CAPS.get(plan, 500)
    net = min(gross, cap)

    return {
        "lost_hours": lost_hours,
        "hourly_rate": hourly_rate,
        "gross_amount": gross,
        "plan": plan,
        "coverage_cap": cap,
        "net_amount": net,
        "capped": gross > cap,
        "breakdown": f"{lost_hours}hrs × ₹{hourly_rate}/hr = ₹{gross} (cap: ₹{cap})"
    }


def simulate_upi_payout(worker_name: str, amount: float) -> dict:
    """
    Simulate a UPI payout (Razorpay test mode concept).
    In production, this would call Razorpay's payout API.
    
    Returns: { payment_ref, method, status, time_to_payout }
    """
    # Generate realistic payment reference
    ref = f"GS-PAY-{random.randint(1000, 9999)}-{datetime.now().strftime('%d%m')}"

    # Simulate payout time (avg 3.4 min as per README)
    minutes = random.uniform(1.8, 5.2)
    seconds = int((minutes % 1) * 60)
    time_str = f"{int(minutes)}m {seconds:02d}s"

    logger.info(f"[PAYOUT] Simulated UPI payout: Rs.{amount} -> {worker_name} ({ref}) in {time_str}")

    return {
        "payment_ref": ref,
        "method": "UPI",
        "status": "paid",
        "time_to_payout": time_str,
        "simulated": True,
    }

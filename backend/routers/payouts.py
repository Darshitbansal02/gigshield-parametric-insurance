"""
Payouts Router — Payout history and simulation.

Endpoints:
  GET  /api/payouts/history      - Get user's payout history
  GET  /api/payouts/all          - Get all payouts (admin)
  POST /api/payouts/simulate     - Simulate a manual payout
"""

from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from core.database import get_db
from core.security import get_current_user_id, get_optional_user_id
from models.schemas import User, Payout
from services.payout_engine import calculate_payout, simulate_upi_payout

router = APIRouter(prefix="/api/payouts", tags=["payouts"])


class SimulatePayoutRequest(BaseModel):
    trigger_type: str = "rain"
    lost_hours: float = 8.0


@router.get("/history")
async def get_payout_history(request: Request, db: AsyncSession = Depends(get_db)):
    """Get payout history for the authenticated worker."""
    user_id = get_current_user_id(request)

    result = await db.execute(
        select(Payout).where(Payout.user_id == user_id).order_by(Payout.created_at.desc()).limit(20)
    )
    payouts = result.scalars().all()

    return [
        {
            "id": p.id[:12].upper(),
            "trigger_type": p.trigger_type,
            "amount": p.amount,
            "time_to_payout": p.time_to_payout,
            "method": p.payment_method,
            "payment_ref": p.payment_ref,
            "status": p.status,
            "date": p.date,
        }
        for p in payouts
    ]


@router.get("/all")
async def get_all_payouts(db: AsyncSession = Depends(get_db)):
    """Get all payouts (admin view)."""
    result = await db.execute(
        select(Payout).order_by(Payout.created_at.desc()).limit(50)
    )
    payouts = result.scalars().all()

    return [
        {
            "id": p.id[:12].upper(),
            "worker": p.worker_name,
            "trigger_type": p.trigger_type,
            "amount": p.amount,
            "time_to_payout": p.time_to_payout,
            "method": p.payment_method,
            "status": p.status,
            "date": p.date or (p.created_at.strftime("%b %d, %Y") if p.created_at else ""),
        }
        for p in payouts
    ]


@router.post("/simulate")
async def simulate_payout(
    req: SimulatePayoutRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    """Simulate a manual payout for the authenticated worker."""
    user_id = get_current_user_id(request)

    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    payout_calc = calculate_payout(req.lost_hours, user.hourly_rate, user.plan)
    upi_result = simulate_upi_payout(user.name, payout_calc["net_amount"])

    payout = Payout(
        user_id=user.id,
        worker_name=user.name,
        trigger_type=req.trigger_type,
        amount=payout_calc["net_amount"],
        time_to_payout=upi_result["time_to_payout"],
        payment_method="UPI",
        payment_ref=upi_result["payment_ref"],
        status="paid",
        date=datetime.now(timezone.utc).strftime("%b %d, %Y"),
    )
    db.add(payout)
    await db.commit()

    return {
        "payout": {
            "id": payout.id[:12].upper(),
            "worker": user.name,
            "amount": payout_calc["net_amount"],
            "breakdown": payout_calc["breakdown"],
            "time_to_payout": upi_result["time_to_payout"],
            "payment_ref": upi_result["payment_ref"],
            "status": "paid",
        },
        "fraud_check": "skipped (manual simulation)",
    }

"""
Policies Router — Weekly insurance policy management.

Endpoints:
  POST /api/policies/create       - Create a new weekly policy
  GET  /api/policies/active       - Get current active policy
  GET  /api/policies/history      - Get policy history
"""

from datetime import datetime, timezone, timedelta

from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from core.database import get_db
from core.security import get_current_user_id
from models.schemas import User, Policy
from services.premium_engine import calculate_premium

router = APIRouter(prefix="/api/policies", tags=["policies"])


class CreatePolicyRequest(BaseModel):
    tier: str = "basic"  # basic / standard / premium


@router.post("/create")
async def create_policy(
    req: CreatePolicyRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    """Create a new weekly insurance policy for the authenticated worker."""
    user_id = get_current_user_id(request)

    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Check for existing active policy
    result = await db.execute(
        select(Policy).where(Policy.user_id == user_id, Policy.status == "active")
    )
    existing = result.scalar_one_or_none()
    if existing:
        # Expire the old one
        existing.status = "expired"
        await db.commit()

    # Calculate premium
    premium_data = calculate_premium(req.tier, user.pincode, user.city)

    # Create policy
    now = datetime.now(timezone.utc)
    policy = Policy(
        user_id=user_id,
        tier=req.tier,
        premium_amount=premium_data["final_premium"],
        coverage_cap=premium_data["coverage_cap"],
        triggers_covered=premium_data["triggers_covered"],
        status="active",
        start_date=now,
        end_date=now + timedelta(days=7),
    )
    db.add(policy)

    # Update user plan
    user.plan = req.tier
    user.weekly_premium = premium_data["final_premium"]

    await db.commit()
    await db.refresh(policy)

    return {
        "id": policy.id,
        "tier": policy.tier,
        "premium_amount": policy.premium_amount,
        "coverage_cap": policy.coverage_cap,
        "triggers_covered": policy.triggers_covered,
        "status": policy.status,
        "start_date": policy.start_date.isoformat(),
        "end_date": policy.end_date.isoformat() if policy.end_date else None,
        "premium_breakdown": premium_data,
    }


@router.get("/active")
async def get_active_policy(request: Request, db: AsyncSession = Depends(get_db)):
    """Get the current active policy for the authenticated worker."""
    user_id = get_current_user_id(request)

    result = await db.execute(
        select(Policy).where(Policy.user_id == user_id, Policy.status == "active")
    )
    policy = result.scalar_one_or_none()

    if not policy:
        return {"active": False, "message": "No active policy. Purchase one to get covered."}

    return {
        "active": True,
        "id": policy.id,
        "tier": policy.tier,
        "premium_amount": policy.premium_amount,
        "coverage_cap": policy.coverage_cap,
        "triggers_covered": policy.triggers_covered,
        "status": policy.status,
        "start_date": policy.start_date.isoformat(),
        "end_date": policy.end_date.isoformat() if policy.end_date else None,
        "days_remaining": max(0, (policy.end_date.replace(tzinfo=None) - datetime.now(timezone.utc).replace(tzinfo=None)).days) if policy.end_date else 0,
    }


@router.get("/history")
async def get_policy_history(request: Request, db: AsyncSession = Depends(get_db)):
    """Get all past policies for the authenticated worker."""
    user_id = get_current_user_id(request)

    result = await db.execute(
        select(Policy).where(Policy.user_id == user_id).order_by(Policy.created_at.desc()).limit(20)
    )
    policies = result.scalars().all()

    return [
        {
            "id": p.id,
            "tier": p.tier,
            "premium_amount": p.premium_amount,
            "coverage_cap": p.coverage_cap,
            "status": p.status,
            "start_date": p.start_date.isoformat(),
            "end_date": p.end_date.isoformat() if p.end_date else None,
        }
        for p in policies
    ]

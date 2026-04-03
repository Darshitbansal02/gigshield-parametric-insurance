from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from core.database import get_db
from core.security import require_admin
from models.schemas import User, Claim, Payout

router = APIRouter(prefix="/api/admin", tags=["admin"])

@router.get("/stats", dependencies=[Depends(require_admin)])
async def get_admin_stats(db: AsyncSession = Depends(get_db)):
    """Get platform-wide statistics for the admin dashboard."""
    # Workers count
    workers_count = await db.scalar(select(func.count()).select_from(User).where(User.is_active == True, User.is_admin == False))
    
    # Active policies (approx by users)
    active_policies = workers_count 
    
    # Total payouts amount
    total_payouts_result = await db.scalar(select(func.sum(Payout.amount)).select_from(Payout))
    total_payouts = total_payouts_result or 0
    
    # Loss ratio (mock logic for demo: Payouts / (Workers * avg premium))
    avg_premium = 69 # mix of 49,69,99
    total_premiums = (workers_count or 1) * avg_premium * 4 # 4 weeks
    loss_ratio = (total_payouts / total_premiums * 100) if total_premiums > 0 else 0
    
    return {
        "total_workers": workers_count,
        "active_policies": active_policies,
        "total_payouts_amount": total_payouts,
        "loss_ratio": round(loss_ratio, 1)
    }

@router.get("/workers", dependencies=[Depends(require_admin)])
async def get_all_workers(db: AsyncSession = Depends(get_db)):
    """Get all workers with detailed info."""
    result = await db.execute(
        select(User).where(User.is_admin == False).order_by(User.created_at.desc())
    )
    workers = result.scalars().all()
    
    return [
        {
            "id": w.id,
            "name": w.name,
            "email": w.email,
            "city": w.city,
            "pincode": w.pincode,
            "plan": w.plan,
            "risk_score": w.zone_risk_score,
            "weekly_premium": w.weekly_premium
        }
        for w in workers
    ]

@router.get("/claims", dependencies=[Depends(require_admin)])
async def get_all_claims(db: AsyncSession = Depends(get_db)):
    """Get all claims across the platform."""
    result = await db.execute(
        select(Claim).order_by(Claim.created_at.desc())
    )
    claims = result.scalars().all()
    
    # Fetch users for names
    user_ids = list(set([c.user_id for c in claims]))
    users_result = await db.execute(select(User).where(User.id.in_(user_ids)))
    users_map = {u.id: u.name for u in users_result.scalars().all()}
    
    return [
        {
            "id": c.id,
            "worker_name": users_map.get(c.user_id, "Unknown"),
            "trigger_type": c.trigger_type,
            "lost_hours": c.lost_hours,
            "payout_amount": c.payout_amount,
            "fraud_score": c.fraud_score,
            "fraud_status": c.fraud_status,
            "status": c.status,
            "created_at": c.created_at.isoformat() if c.created_at else None,
        }
        for c in claims
    ]

@router.get("/fraud-flags", dependencies=[Depends(require_admin)])
async def get_fraud_flags(db: AsyncSession = Depends(get_db)):
    """Get flagged or rejected claims."""
    result = await db.execute(
        select(Claim).where(Claim.fraud_status != "clean").order_by(Claim.created_at.desc())
    )
    flagged = result.scalars().all()
    
    user_ids = list(set([c.user_id for c in flagged]))
    users_result = await db.execute(select(User).where(User.id.in_(user_ids)))
    users_map = {u.id: u for u in users_result.scalars().all()}
    
    return [
        {
            "id": c.id,
            "worker_name": users_map.get(c.user_id).name if c.user_id in users_map else "Unknown",
            "zone": users_map.get(c.user_id).pincode if c.user_id in users_map else "Unknown",
            "trigger_type": c.trigger_type,
            "fraud_score": c.fraud_score,
            "fraud_status": c.fraud_status,
            "status": c.status,
            "payout_amount": c.payout_amount,
            "created_at": c.created_at.isoformat() if c.created_at else None,
            "details": {
                # Mock component breakdown based on the fraud score
                "cluster_validation": "Failed (low sibling density)",
                "frequency": "Normal",
                "genuineness": "Failed" if c.fraud_score > 80 else "Warning",
            }
        }
        for c in flagged
    ]

@router.get("/health", dependencies=[Depends(require_admin)])
async def get_admin_health(db: AsyncSession = Depends(get_db)):
    """Check platform-wide trigger status and system health."""
    from datetime import datetime, timezone, timedelta
    from models.schemas import TriggerEvent
    
    one_hour_ago = datetime.now(timezone.utc) - timedelta(hours=1)
    
    # Active triggers platform wide
    result = await db.execute(
        select(TriggerEvent).where(
            TriggerEvent.status == "triggered",
            TriggerEvent.created_at >= one_hour_ago
        )
    )
    active_triggers = result.scalars().all()
    
    return {
        "status": "alert" if active_triggers else "healthy",
        "active_trigger_count": len(active_triggers),
        "active_zones": list(set([t.zone_pincode for t in active_triggers])),
        "data_sources": ["OpenWeatherMap", "AQICN", "CPCB", "UPI Gateway"],
        "scheduler_status": "active"
    }

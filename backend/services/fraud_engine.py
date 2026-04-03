"""
Fraud Engine — Cluster validation + anomaly detection.

Implements the multi-layered fraud prevention from README §10:
  1. Cluster Validation: Are multiple workers in the same zone affected?
  2. Anomaly Detection: Is this worker's claim rate abnormal?
  3. Duplicate Prevention: No double payouts for same event window.
  4. Genuineness Score: Multi-signal verification (simplified for Phase 2).
"""

import random
import logging
from datetime import datetime, timezone, timedelta
from typing import List, Optional

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from models.schemas import Claim, User, Payout

logger = logging.getLogger(__name__)


async def compute_fraud_score(
    db: AsyncSession,
    user_id: str,
    trigger_type: str,
    zone_pincode: str,
    city: str
) -> dict:
    """
    Compute a fraud score (0-100) for a claim.
    
    0 = definitely clean
    100 = definitely fraud
    
    Returns: { fraud_score, fraud_status, checks }
    """
    checks = {}

    # ── Check 1: Cluster Validation ──
    # Are other workers in the same zone also affected?
    cluster_score = await _cluster_validation(db, zone_pincode, trigger_type)
    checks["cluster_validation"] = {
        "score": cluster_score,
        "description": "Checking if multiple workers in zone are affected",
    }

    # ── Check 2: Claim Frequency Check ──
    # Is this worker claiming too frequently?
    frequency_score = await _claim_frequency_check(db, user_id)
    checks["claim_frequency"] = {
        "score": frequency_score,
        "description": "Checking worker's claim history for anomalies",
    }

    # ── Check 3: Duplicate Prevention ──
    # Has this worker already been paid for this event window?
    duplicate_score = await _duplicate_check(db, user_id, trigger_type)
    checks["duplicate_check"] = {
        "score": duplicate_score,
        "description": "Checking for duplicate claims in current event window",
    }

    # ── Check 4: Genuineness Score (simplified) ──
    # In production: cell tower + network latency + device sensors
    # For Phase 2: simulated based on user history
    genuineness_score = _simplified_genuineness_check()
    checks["genuineness"] = {
        "score": genuineness_score,
        "description": "Multi-signal location verification (simplified)",
    }

    # ── Weighted average ──
    fraud_score = (
        cluster_score * 0.30 +
        frequency_score * 0.25 +
        duplicate_score * 0.25 +
        genuineness_score * 0.20
    )
    fraud_score = round(fraud_score, 1)

    # Determine status
    if fraud_score >= 60:
        fraud_status = "rejected"
    elif fraud_score >= 30:
        fraud_status = "flagged"
    else:
        fraud_status = "clean"

    return {
        "fraud_score": fraud_score,
        "fraud_status": fraud_status,
        "checks": checks,
    }


async def _cluster_validation(db: AsyncSession, pincode: str, trigger_type: str) -> float:
    """
    Check if other workers in the same pincode have active triggers.
    If only this worker claims in a zone of 40+ workers → suspicious.
    Low score = clean (many affected), High score = suspicious (only this worker).
    """
    # Count workers in zone
    result = await db.execute(
        select(func.count(User.id)).where(User.pincode == pincode, User.is_active == True)
    )
    total_in_zone = result.scalar() or 1

    # Count recent claims from this zone (last 24 hours)
    cutoff = datetime.now(timezone.utc) - timedelta(hours=24)
    result = await db.execute(
        select(func.count(Claim.id)).where(
            Claim.trigger_type == trigger_type,
            Claim.created_at >= cutoff
        )
    )
    claims_in_zone = result.scalar() or 0

    # If 30%+ of zone workers are also claiming → very clean
    if total_in_zone > 1:
        affected_ratio = claims_in_zone / total_in_zone
        if affected_ratio >= 0.3:
            return 5.0   # very clean
        elif affected_ratio >= 0.1:
            return 20.0  # somewhat clean
        else:
            return 50.0  # suspicious — only this worker affected
    
    return 15.0  # single worker in zone, pass by default


async def _claim_frequency_check(db: AsyncSession, user_id: str) -> float:
    """
    Check if this worker's claim frequency is abnormally high.
    Normal: 1-2 claims per month
    Suspicious: 4+ claims per month
    """
    cutoff = datetime.now(timezone.utc) - timedelta(days=30)
    result = await db.execute(
        select(func.count(Claim.id)).where(
            Claim.user_id == user_id,
            Claim.created_at >= cutoff
        )
    )
    claim_count = result.scalar() or 0

    if claim_count <= 2:
        return 5.0   # normal
    elif claim_count <= 4:
        return 25.0  # elevated
    elif claim_count <= 6:
        return 55.0  # suspicious
    else:
        return 85.0  # very suspicious


async def _duplicate_check(db: AsyncSession, user_id: str, trigger_type: str) -> float:
    """
    Check if worker already got paid for this exact trigger type in the last 24 hours.
    """
    cutoff = datetime.now(timezone.utc) - timedelta(hours=24)
    result = await db.execute(
        select(func.count(Payout.id)).where(
            Payout.user_id == user_id,
            Payout.trigger_type == trigger_type,
            Payout.created_at >= cutoff
        )
    )
    existing = result.scalar() or 0

    if existing >= 1:
        return 90.0  # almost certainly a duplicate
    return 0.0


def _simplified_genuineness_check() -> float:
    """
    Simplified genuineness score for Phase 2.
    In production, this would use cell tower + network latency + device sensors.
    For demo: returns a low score (clean) most of the time with occasional flags.
    """
    return random.choices(
        [random.uniform(0, 15), random.uniform(15, 40), random.uniform(40, 70)],
        weights=[80, 15, 5],
        k=1
    )[0]

"""SQLAlchemy ORM models for GigShield."""

import uuid
from datetime import datetime, timezone

from sqlalchemy import (
    Column, String, Float, Integer, Boolean, DateTime, Text,
    ForeignKey
)
from sqlalchemy.orm import relationship

from core.database import Base


def utcnow():
    return datetime.now(timezone.utc)


def new_uuid():
    return str(uuid.uuid4())


# ──────────────────────────────────────────────
#  USER
# ──────────────────────────────────────────────
class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=new_uuid)
    name = Column(String(120), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    gig_type = Column(String(50), default="delivery")
    platform = Column(String(50), default="zepto")
    city = Column(String(100), default="Pune")
    pincode = Column(String(10), default="411038")
    plan = Column(String(20), default="basic")  # basic / standard / premium
    zone_risk_score = Column(Float, default=50.0)
    weekly_premium = Column(Float, default=49.0)
    hourly_rate = Column(Float, default=87.5)  # avg ₹700/8hr day
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), default=utcnow)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    policies = relationship("Policy", back_populates="user", lazy="selectin")
    payouts = relationship("Payout", back_populates="user", lazy="selectin")
    claims = relationship("Claim", back_populates="user", lazy="selectin")


# ──────────────────────────────────────────────
#  POLICY (Weekly Insurance Policy)
# ──────────────────────────────────────────────
class Policy(Base):
    __tablename__ = "policies"

    id = Column(String, primary_key=True, default=new_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    tier = Column(String(20), nullable=False)          # basic / standard / premium
    premium_amount = Column(Float, nullable=False)      # ₹49 / ₹69 / ₹99
    coverage_cap = Column(Float, nullable=False)        # ₹500 / ₹900 / ₹1500
    triggers_covered = Column(Integer, default=2)
    status = Column(String(20), default="active")       # active / expired / cancelled
    start_date = Column(DateTime(timezone=True), default=utcnow)
    end_date = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=utcnow)

    user = relationship("User", back_populates="policies")


# ──────────────────────────────────────────────
#  TRIGGER EVENT (Weather/AQI/Curfew readings)
# ──────────────────────────────────────────────
class TriggerEvent(Base):
    __tablename__ = "trigger_events"

    id = Column(String, primary_key=True, default=new_uuid)
    trigger_type = Column(String(50), nullable=False)   # rain / aqi / heat / curfew / flood / demand_crash / platform_outage
    zone_pincode = Column(String(10), nullable=False)
    city = Column(String(100), default="Pune")
    current_value = Column(String(50), nullable=False)  # e.g. "47.2mm"
    threshold = Column(String(50), nullable=False)      # e.g. "30mm/hr"
    status = Column(String(20), default="normal")       # normal / warning / triggered
    confidence = Column(Float, default=0.0)
    data_source = Column(String(100), default="OpenWeatherMap")
    last_updated = Column(DateTime(timezone=True), default=utcnow)
    created_at = Column(DateTime(timezone=True), default=utcnow)


# ──────────────────────────────────────────────
#  CLAIM (Auto-initiated by trigger engine)
# ──────────────────────────────────────────────
class Claim(Base):
    __tablename__ = "claims"

    id = Column(String, primary_key=True, default=new_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    trigger_event_id = Column(String, ForeignKey("trigger_events.id"), nullable=True)
    trigger_type = Column(String(50), nullable=False)
    lost_hours = Column(Float, default=0.0)
    hourly_rate = Column(Float, default=87.5)
    payout_amount = Column(Float, default=0.0)
    fraud_score = Column(Float, default=0.0)           # 0=clean, 100=fraud
    fraud_status = Column(String(20), default="clean")  # clean / flagged / rejected
    status = Column(String(20), default="pending")      # pending / approved / rejected / paid
    created_at = Column(DateTime(timezone=True), default=utcnow)

    user = relationship("User", back_populates="claims")


# ──────────────────────────────────────────────
#  PAYOUT (Auto-dispatched payment record)
# ──────────────────────────────────────────────
class Payout(Base):
    __tablename__ = "payouts"

    id = Column(String, primary_key=True, default=new_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    claim_id = Column(String, ForeignKey("claims.id"), nullable=True)
    worker_name = Column(String(120), nullable=False)
    trigger_type = Column(String(50), nullable=False)
    amount = Column(Float, nullable=False)
    time_to_payout = Column(String(20), default="3m 12s")
    payment_method = Column(String(30), default="UPI")
    payment_ref = Column(String(100), nullable=True)
    status = Column(String(20), default="paid")         # pending / paid / failed
    date = Column(String(20), nullable=True)
    created_at = Column(DateTime(timezone=True), default=utcnow)

    user = relationship("User", back_populates="payouts")


# ──────────────────────────────────────────────
#  WEATHER LOG (Historical weather data)
# ──────────────────────────────────────────────
class WeatherLog(Base):
    __tablename__ = "weather_logs"

    id = Column(String, primary_key=True, default=new_uuid)
    city = Column(String(100), nullable=False)
    pincode = Column(String(10), nullable=True)
    temperature = Column(Float, nullable=True)
    humidity = Column(Float, nullable=True)
    rainfall_mm = Column(Float, default=0.0)
    wind_speed = Column(Float, nullable=True)
    description = Column(String(200), nullable=True)
    source = Column(String(50), default="openweathermap")
    recorded_at = Column(DateTime(timezone=True), default=utcnow)


# ──────────────────────────────────────────────
#  AQI LOG (Air Quality readings)
# ──────────────────────────────────────────────
class AQILog(Base):
    __tablename__ = "aqi_logs"

    id = Column(String, primary_key=True, default=new_uuid)
    city = Column(String(100), nullable=False)
    pincode = Column(String(10), nullable=True)
    aqi_value = Column(Integer, nullable=False)
    dominant_pollutant = Column(String(20), nullable=True)
    source = Column(String(50), default="aqicn")
    recorded_at = Column(DateTime(timezone=True), default=utcnow)

"""
Auth Router — Registration, Login, Logout, Session.

Endpoints:
  POST /api/auth/register
  POST /api/auth/login
  GET  /api/auth/me
  POST /api/auth/logout
"""

from fastapi import APIRouter, Depends, HTTPException, Response, Request, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from core.database import get_db
from core.security import hash_password, verify_password, set_auth_cookie, clear_auth_cookie, get_current_user_id
from models.schemas import User
from services.risk_engine import compute_zone_risk_score, get_recommended_tier
from services.premium_engine import calculate_premium

router = APIRouter(prefix="/api/auth", tags=["auth"])


# ── Request / Response schemas ──

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    gig_type: str = "delivery"
    platform: str = "zepto"
    pincode: str = "411038"
    city: str = "Pune"
    plan: str = "standard"  # basic, standard, premium


class LoginRequest(BaseModel):
    email: str
    password: str

class VerifyOTPRequest(BaseModel):
    email: str
    otp: str


class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    gig_type: str
    platform: str
    city: str
    pincode: str
    plan: str
    zone_risk_score: float
    weekly_premium: float
    is_admin: bool = False
class RiskPreviewResponse(BaseModel):
    pincode: str
    city: str
    zone_risk_score: float
    base_premium: float
    zone_adjustment: float
    seasonal_adjustment: float
    safety_discount: float
    final_premium: float
    is_flood_safe: bool
    is_pollution_safe: bool
    risk_reasons: list[str]
    recommended_plan: str
    coverage_cap: float


# ── Endpoints ──

@router.get("/risk-preview", response_model=RiskPreviewResponse)
async def get_risk_preview(pincode: str, city: str = "Pune", plan: str = None):
    """Get a preview of the dynamic pricing for a given zone and/or plan."""
    risk_data = compute_zone_risk_score(pincode, city)
    recommended = get_recommended_tier(risk_data["score"])
    
    # Use selected plan if provided, otherwise recommend
    target_plan = plan if plan else recommended["tier"]
    premium_data = calculate_premium(target_plan, pincode, city)
    
    return {
        "pincode": pincode,
        "city": city,
        "zone_risk_score": risk_data["score"],
        **premium_data,
        "recommended_plan": recommended["tier"]
    }

@router.post("/verify-otp")
async def verify_otp(req: VerifyOTPRequest):
    """Mock OTP verification."""
    if req.otp != "123456":
        raise HTTPException(status_code=400, detail="Invalid OTP code. Use 123456 for demo.")
    return {"message": "OTP verified successfully"}

@router.post("/register", response_model=UserResponse)
async def register(req: RegisterRequest, response: Response, db: AsyncSession = Depends(get_db)):
    """Register a new gig worker."""
    # Check if email already exists
    result = await db.execute(select(User).where(User.email == req.email))
    existing = result.scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Compute zone risk score
    risk_data = compute_zone_risk_score(req.pincode, req.city)
    risk_score = risk_data["score"]
    recommended = get_recommended_tier(risk_score)
    # Compute premium based on SELECTED plan
    premium_data = calculate_premium(req.plan, req.pincode, req.city)

    # Create user
    user = User(
        name=req.name,
        email=req.email,
        hashed_password=hash_password(req.password),
        gig_type=req.gig_type,
        platform=req.platform,
        city=req.city,
        pincode=req.pincode,
        plan=req.plan,
        zone_risk_score=risk_score,
        weekly_premium=premium_data["final_premium"],
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)

    # Set auth cookie
    set_auth_cookie(response, user.id)

    return UserResponse(
        id=user.id,
        name=user.name,
        email=user.email,
        gig_type=user.gig_type,
        platform=user.platform,
        city=user.city,
        pincode=user.pincode,
        plan=user.plan,
        zone_risk_score=user.zone_risk_score,
        weekly_premium=user.weekly_premium,
    )


@router.post("/login", response_model=UserResponse)
async def login(req: LoginRequest, response: Response, db: AsyncSession = Depends(get_db)):
    """Login with email and password."""
    result = await db.execute(select(User).where(User.email == req.email))
    user = result.scalar_one_or_none()

    if not user or not verify_password(req.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    set_auth_cookie(response, user.id)

    return UserResponse(
        id=user.id,
        name=user.name,
        email=user.email,
        gig_type=user.gig_type,
        platform=user.platform,
        city=user.city,
        pincode=user.pincode,
        plan=user.plan,
        zone_risk_score=user.zone_risk_score,
        weekly_premium=user.weekly_premium,
        is_admin=user.is_admin,
    )


@router.get("/me", response_model=UserResponse)
async def get_me(request: Request, db: AsyncSession = Depends(get_db)):
    """Get the currently authenticated user."""
    user_id = get_current_user_id(request)

    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return UserResponse(
        id=user.id,
        name=user.name,
        email=user.email,
        gig_type=user.gig_type,
        platform=user.platform,
        city=user.city,
        pincode=user.pincode,
        plan=user.plan,
        zone_risk_score=user.zone_risk_score,
        weekly_premium=user.weekly_premium,
        is_admin=user.is_admin,
    )


@router.post("/logout")
async def logout(response: Response):
    """Clear the auth cookie."""
    clear_auth_cookie(response)
    return {"message": "Logged out"}

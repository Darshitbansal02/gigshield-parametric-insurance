"""
Risk Engine — Zone Risk Score (ZRS) calculation.

Computes a risk score (1-100) for a given pincode using:
- Historical rainfall patterns
- AQI trends
- Seasonal factors
- Delivery zone density

Uses a heuristic model (production would use trained ML model).
"""

import math
import random
from datetime import datetime


# ── Pincode risk profiles (curated from Pune data) ──
# Higher score = higher risk = higher premium
PINCODE_BASE_RISK = {
    # Pune zones
    "411038": 72,   # Kothrud — flood-prone
    "411057": 38,   # Hinjewadi — relatively safer
    "411001": 55,   # Pune Station — moderate
    "411041": 65,   # Sinhagad Road — flood-prone
    "411033": 42,   # Kharadi — moderate
    "411028": 60,   # Kondhwa — moderate-high
    "411006": 50,   # Deccan
    "411004": 48,   # Camp
    # Mumbai zones
    "400001": 75,   # South Mumbai — flood-prone
    "400050": 70,   # Bandra
    "400076": 80,   # Andheri — chronic flooding
    # Delhi zones
    "110001": 60,   # Connaught Place
    "110020": 55,   # Hauz Khas
    "110085": 68,   # Yamuna flood plain
    # Bengaluru zones
    "560001": 45,   # Majestic
    "560037": 50,   # Koramangala
    "560103": 35,   # Whitefield
    # Hyderabad
    "500001": 50,   # Charminar
    "500081": 58,   # Kukatpally
}

# ── Feature: Hyper-local Safety Zones (for ₹2/week discount) ──
FLOOD_SAFE_PINCODES = {"411057", "411033", "560103", "500081", "110020"}
POLLUTION_SAFE_PINCODES = {"411057", "560037", "400001"}


def compute_zone_risk_score(pincode: str, city: str = "Pune") -> float:
    """
    Compute Zone Risk Score (1-100) for a given pincode.
    
    Formula:
        ZRS = base_risk + seasonal_adjustment + weather_volatility + noise
    
    Returns a float between 1 and 100.
    """
    # Base risk from known pincodes (default 50 for unknown)
    base = PINCODE_BASE_RISK.get(pincode, 50)

    # Seasonal adjustment
    month = datetime.now().month
    seasonal = _seasonal_factor(month, city)

    # Weather volatility (simulated — would use historical data in production)
    volatility = _weather_volatility(pincode, city)

    # Small random noise for realism
    noise = random.uniform(-3, 3)

    score = base + seasonal + volatility + noise

    # Hyper-local safety discounts
    safety_discount = 0
    reasons = []
    
    if pincode in FLOOD_SAFE_PINCODES:
        safety_discount -= 5.0
        reasons.append("Historical Flood Safety Zone (-₹2 discount eligible)")
    if pincode in POLLUTION_SAFE_PINCODES:
        safety_discount -= 3.0
        reasons.append("Optimized Air Quality Corridor")
        
    final_score = round(max(1, min(100, score + safety_discount)), 1)
    
    return {
        "score": final_score,
        "base_risk": base,
        "seasonal_risk": round(seasonal, 1),
        "is_flood_safe": pincode in FLOOD_SAFE_PINCODES,
        "is_pollution_safe": pincode in POLLUTION_SAFE_PINCODES,
        "reasons": reasons
    }


def _seasonal_factor(month: int, city: str) -> float:
    """
    Adjust risk based on season.
    Monsoon (Jun-Sep): +10 to +20
    Winter pollution (Nov-Feb): +5 to +15 (esp. Delhi)
    Summer (Mar-May): +5 (heat risk)
    Clear season: -5
    """
    city_lower = city.lower()

    if month in (6, 7, 8, 9):  # Monsoon
        if city_lower in ("mumbai", "pune", "kolkata"):
            return random.uniform(12, 20)
        return random.uniform(8, 15)

    elif month in (11, 12, 1, 2):  # Winter
        if city_lower in ("delhi", "new delhi"):
            return random.uniform(10, 18)  # AQI risk
        return random.uniform(2, 8)

    elif month in (3, 4, 5):  # Summer
        if city_lower in ("delhi", "jaipur"):
            return random.uniform(8, 15)  # Heat risk
        return random.uniform(2, 8)

    return random.uniform(-5, 0)  # Oct — clear season


def _weather_volatility(pincode: str, city: str) -> float:
    """
    Simulate weather volatility component.
    Production: uses rolling std-dev of last 30 days' weather data.
    """
    base_volatility = PINCODE_BASE_RISK.get(pincode, 50) / 10
    return random.uniform(-base_volatility / 2, base_volatility / 2)


def get_recommended_tier(risk_score: float) -> dict:
    """
    Map Zone Risk Score to recommended insurance tier.
    
    Returns: { tier, premium, coverage_cap, triggers_covered }
    """
    if risk_score >= 70:
        return {
            "tier": "premium",
            "premium": 99,
            "coverage_cap": 1500,
            "triggers_covered": 7,
            "reason": "High-risk zone — maximum protection recommended"
        }
    elif risk_score >= 45:
        return {
            "tier": "standard",
            "premium": 69,
            "coverage_cap": 900,
            "triggers_covered": 4,
            "reason": "Moderate-risk zone — balanced coverage"
        }
    else:
        return {
            "tier": "basic",
            "premium": 49,
            "coverage_cap": 500,
            "triggers_covered": 2,
            "reason": "Low-risk zone — essential protection"
        }

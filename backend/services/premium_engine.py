"""
Premium Engine — Dynamic weekly premium calculation.

Formula: Weekly Premium = Base Rate + Zone Risk Adjustment + Seasonal Factor

Maps to tiers: Basic (₹49) / Standard (₹69) / Premium (₹99)
"""

from datetime import datetime

from services.risk_engine import compute_zone_risk_score


# ── Tier definitions ──
TIERS = {
    "basic": {
        "base_premium": 49,
        "coverage_cap": 500,
        "triggers_covered": 2,
        "trigger_types": ["rain", "aqi"],
        "zones_covered": 1,
    },
    "standard": {
        "base_premium": 69,
        "coverage_cap": 900,
        "triggers_covered": 4,
        "trigger_types": ["rain", "aqi", "heat", "platform_outage"],
        "zones_covered": 3,
    },
    "premium": {
        "base_premium": 99,
        "coverage_cap": 1500,
        "triggers_covered": 7,
        "trigger_types": ["rain", "aqi", "heat", "curfew", "flood", "demand_crash", "platform_outage"],
        "zones_covered": -1,  # unlimited
    },
}


def calculate_premium(tier: str, pincode: str = "411038", city: str = "Pune") -> dict:
    """
    Calculate the weekly premium for a worker.
    
    Returns: {
        tier, base_premium, zone_adjustment, seasonal_factor,
        final_premium, coverage_cap, triggers_covered
    }
    """
    tier_config = TIERS.get(tier, TIERS["basic"])
    base = tier_config["base_premium"]

    # Zone risk adjustment (±15% of base)
    risk_data = compute_zone_risk_score(pincode, city)
    risk_score = risk_data["score"]
    
    zone_adjustment = round((risk_score - 50) / 40 * base * 0.15, 2)

    # Seasonal factor
    month = datetime.now().month
    seasonal = _seasonal_premium_factor(month, city)
    seasonal_adjustment = round(base * seasonal, 2)

    # Apply Hyper-local Safety Discount (₹2 as per problem statement)
    safety_discount = 2.0 if risk_data["is_flood_safe"] else 0.0

    final = round(base + zone_adjustment + seasonal_adjustment - safety_discount, 0)
    # Clamp to reasonable bounds
    final = max(base - 15, min(base + 20, final))

    # Dynamic Coverage Enhancement (AI Predictive Adjustment)
    # If risk is extremely high, we offer slightly more coverage hours/cap to provide better value
    dyn_coverage_cap = tier_config["coverage_cap"]
    if risk_score > 75:
        dyn_coverage_cap += 200 # Predictive boost for high demand
    elif risk_score < 30:
        dyn_coverage_cap -= 100 # Adjusted for low risk stability

    return {
        "tier": tier,
        "base_premium": base,
        "zone_risk_score": risk_score,
        "zone_adjustment": zone_adjustment,
        "seasonal_factor": seasonal,
        "seasonal_adjustment": seasonal_adjustment,
        "safety_discount": safety_discount,
        "final_premium": final,
        "is_flood_safe": risk_data["is_flood_safe"],
        "is_pollution_safe": risk_data["is_pollution_safe"],
        "risk_reasons": risk_data["reasons"],
        "coverage_cap": dyn_coverage_cap,
        "triggers_covered": tier_config["triggers_covered"],
        "trigger_types": tier_config["trigger_types"],
        "zones_covered": tier_config["zones_covered"],
    }


def _seasonal_premium_factor(month: int, city: str) -> float:
    """
    Returns a multiplier (-0.10 to +0.15) based on seasonal risk.
    Monsoon months cost more, clear months cost less.
    """
    city_lower = city.lower()

    if month in (6, 7, 8, 9):  # Monsoon — highest risk
        if city_lower in ("mumbai", "pune", "kolkata"):
            return 0.12
        return 0.08

    elif month in (11, 12, 1, 2):  # Winter — AQI risk
        if city_lower in ("delhi", "new delhi"):
            return 0.10
        return 0.03

    elif month in (3, 4, 5):  # Summer — heat risk
        if city_lower in ("delhi", "jaipur"):
            return 0.08
        return 0.02

    return -0.05  # Oct — clear season discount

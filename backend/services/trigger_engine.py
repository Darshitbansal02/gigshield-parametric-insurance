"""
Trigger Engine — Parametric trigger detection logic.

Evaluates current weather/AQI against predefined thresholds.
When a threshold is breached, returns trigger status for auto-claim initiation.

Trigger Thresholds (from README):
  1. Rain > 30mm/hr for 2+ consecutive hours
  2. AQI > 400 sustained for 6+ hours
  3. Temperature > 45°C for 4+ consecutive hours
  4. Curfew/Bandh declared (admin manual)
  5. Flood alert OR rainfall > 100mm in 24hrs
  6. Order demand drop > 60% vs normal
  7. Platform outage > 30 minutes
"""

import logging
from typing import List

logger = logging.getLogger(__name__)


# ── Threshold definitions ──
THRESHOLDS = {
    "rain": {
        "name": "Heavy Rainfall",
        "parameter": "Rainfall (mm/hr)",
        "threshold": "30mm/hr",
        "threshold_value": 30.0,
        "min_duration_hours": 2,
        "data_source": "OpenWeatherMap",
    },
    "aqi": {
        "name": "Severe Air Pollution",
        "parameter": "Air Quality Index",
        "threshold": "AQI > 400",
        "threshold_value": 400,
        "min_duration_hours": 6,
        "data_source": "AQICN / CPCB",
    },
    "heat": {
        "name": "Extreme Heat",
        "parameter": "Temperature (°C)",
        "threshold": "45°C",
        "threshold_value": 45.0,
        "min_duration_hours": 4,
        "data_source": "OpenWeatherMap",
    },
    "flood": {
        "name": "Flood / Waterlogging",
        "parameter": "Rainfall (24hr cumulative)",
        "threshold": "100mm/24hr",
        "threshold_value": 100.0,
        "min_duration_hours": 0,
        "data_source": "Weather API + Govt Alerts",
    },
    "curfew": {
        "name": "Curfew / Bandh / Strike",
        "parameter": "Official Announcement",
        "threshold": "Zone closure declared",
        "threshold_value": 1,
        "min_duration_hours": 0,
        "data_source": "News API + Admin",
    },
    "demand_crash": {
        "name": "Order Demand Crash",
        "parameter": "Order Volume vs Baseline",
        "threshold": "> 60% drop",
        "threshold_value": 60,
        "min_duration_hours": 2,
        "data_source": "Platform Mock API",
    },
    "platform_outage": {
        "name": "Platform Outage",
        "parameter": "API Downtime",
        "threshold": "> 30 min",
        "threshold_value": 30,
        "min_duration_hours": 0,
        "data_source": "Platform Status API",
    },
}


def evaluate_triggers(weather_data: dict, aqi_data: dict) -> List[dict]:
    """
    Evaluate all parametric triggers against current data.
    
    Returns a list of trigger status dicts for each trigger type.
    """
    triggers = []

    # 1. Rain trigger
    rainfall = weather_data.get("rainfall_mm", 0)
    rain_status = "triggered" if rainfall >= 30 else ("warning" if rainfall >= 15 else "normal")
    rain_confidence = min(99.5, (rainfall / 30) * 100) if rainfall > 0 else 5.0
    triggers.append({
        "name": THRESHOLDS["rain"]["name"],
        "parameter": THRESHOLDS["rain"]["parameter"],
        "location": f"{weather_data.get('city', 'Pune')} ({weather_data.get('pincode', '411038')})",
        "current_value": f"{rainfall}mm",
        "threshold": THRESHOLDS["rain"]["threshold"],
        "status": rain_status,
        "confidence": round(rain_confidence, 1),
        "data_source": weather_data.get("source", "openweathermap"),
        "last_updated": weather_data.get("recorded_at", ""),
        "trigger_type": "rain",
    })

    # 2. AQI trigger
    aqi_value = aqi_data.get("aqi_value", 0)
    aqi_status = "triggered" if aqi_value >= 400 else ("warning" if aqi_value >= 200 else "normal")
    aqi_confidence = min(99.0, (aqi_value / 400) * 100) if aqi_value > 0 else 5.0
    triggers.append({
        "name": THRESHOLDS["aqi"]["name"],
        "parameter": THRESHOLDS["aqi"]["parameter"],
        "location": f"{aqi_data.get('city', 'Pune')}",
        "current_value": f"AQI {aqi_value}",
        "threshold": THRESHOLDS["aqi"]["threshold"],
        "status": aqi_status,
        "confidence": round(aqi_confidence, 1),
        "data_source": aqi_data.get("source", "aqicn"),
        "last_updated": aqi_data.get("recorded_at", ""),
        "trigger_type": "aqi",
    })

    # 3. Heat trigger
    temp = weather_data.get("temperature", 25)
    heat_status = "triggered" if temp >= 45 else ("warning" if temp >= 38 else "normal")
    heat_confidence = min(99.0, (temp / 45) * 100) if temp > 20 else 10.0
    triggers.append({
        "name": THRESHOLDS["heat"]["name"],
        "parameter": THRESHOLDS["heat"]["parameter"],
        "location": f"{weather_data.get('city', 'Pune')}",
        "current_value": f"{temp}°C",
        "threshold": THRESHOLDS["heat"]["threshold"],
        "status": heat_status,
        "confidence": round(heat_confidence, 1),
        "data_source": weather_data.get("source", "openweathermap"),
        "last_updated": weather_data.get("recorded_at", ""),
        "trigger_type": "heat",
    })

    # 4. Flood trigger (based on combined rainfall)
    flood_status = "triggered" if rainfall >= 100 else ("warning" if rainfall >= 50 else "normal")
    triggers.append({
        "name": THRESHOLDS["flood"]["name"],
        "parameter": THRESHOLDS["flood"]["parameter"],
        "location": f"{weather_data.get('city', 'Pune')}",
        "current_value": f"{rainfall}mm/24hr",
        "threshold": THRESHOLDS["flood"]["threshold"],
        "status": flood_status,
        "confidence": round(min(99.0, (rainfall / 100) * 100), 1),
        "data_source": "Weather API + Govt Alerts",
        "last_updated": weather_data.get("recorded_at", ""),
        "trigger_type": "flood",
    })

    # 5. Platform outage (simulated — always normal unless admin triggers)
    triggers.append({
        "name": THRESHOLDS["platform_outage"]["name"],
        "parameter": THRESHOLDS["platform_outage"]["parameter"],
        "location": "National",
        "current_value": "0 min",
        "threshold": THRESHOLDS["platform_outage"]["threshold"],
        "status": "normal",
        "confidence": 5.0,
        "data_source": "Platform Status API",
        "last_updated": weather_data.get("recorded_at", ""),
        "trigger_type": "platform_outage",
    })

    return triggers


def get_triggered_events(triggers: List[dict]) -> List[dict]:
    """Filter triggers to only those that are actively triggered."""
    return [t for t in triggers if t["status"] == "triggered"]


def calculate_lost_hours(trigger_type: str, current_value: float) -> float:
    """
    Estimate number of lost working hours based on trigger severity.
    """
    if trigger_type == "rain":
        if current_value >= 50:
            return 10.0  # full day
        elif current_value >= 30:
            return 6.0   # most of the day
        return 0.0

    elif trigger_type == "aqi":
        if current_value >= 500:
            return 10.0
        elif current_value >= 400:
            return 8.0
        return 0.0

    elif trigger_type == "heat":
        if current_value >= 48:
            return 8.0
        elif current_value >= 45:
            return 5.0
        return 0.0

    elif trigger_type == "flood":
        return 10.0  # full day
    
    elif trigger_type == "curfew":
        return 10.0  # complete loss of work
    
    elif trigger_type == "bandh":
        return 8.0   # significant loss of work
        
    elif trigger_type == "platform_outage":
        # Outages are handled in hours
        return current_value if current_value > 0 else 2.0  # min 2hr estimate if value unknown

    return 0.0

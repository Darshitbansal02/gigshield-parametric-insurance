"""
AQI Service — AQICN/WAQI integration with mock fallback.

Fetches current Air Quality Index for a given city.
If AQICN_API_TOKEN is not set, returns realistic mock data.
"""

import random
import logging
from datetime import datetime, timezone

import httpx

from core.config import settings

logger = logging.getLogger(__name__)

# City mapping for AQICN API
CITY_STATION_MAP = {
    "Pune": "pune",
    "Mumbai": "mumbai",
    "Delhi": "delhi",
    "Bengaluru": "bangalore",
    "Hyderabad": "hyderabad",
    "Chennai": "chennai",
    "Kolkata": "kolkata",
    "Jaipur": "jaipur",
}


async def get_aqi(city: str = "Pune") -> dict:
    """
    Fetch current AQI. Uses real API if token is available, else mock.
    Returns: { aqi_value, dominant_pollutant, category, source }
    """
    if settings.AQICN_API_TOKEN:
        try:
            return await _fetch_real_aqi(city)
        except Exception as e:
            logger.warning(f"AQICN API failed, falling back to mock: {e}")

    return _generate_mock_aqi(city)


async def _fetch_real_aqi(city: str) -> dict:
    """Call WAQI/AQICN API."""
    station = CITY_STATION_MAP.get(city, city.lower())
    url = f"https://api.waqi.info/feed/{station}/"
    params = {"token": settings.AQICN_API_TOKEN}

    async with httpx.AsyncClient(timeout=10.0) as client:
        resp = await client.get(url, params=params)
        resp.raise_for_status()
        data = resp.json()

    if data.get("status") != "ok":
        raise ValueError(f"AQICN returned status: {data.get('status')}")

    aqi_data = data["data"]
    aqi_value = aqi_data["aqi"]

    return {
        "aqi_value": aqi_value,
        "dominant_pollutant": aqi_data.get("dominentpol", "pm25"),
        "category": _aqi_category(aqi_value),
        "source": "aqicn",
        "city": city,
        "recorded_at": datetime.now(timezone.utc).isoformat(),
    }


def _generate_mock_aqi(city: str) -> dict:
    """Generate realistic mock AQI data."""
    month = datetime.now().month

    # HIGH FREQUENCY FOR DEMO: 50% chance of breach (>400)
    aqi = random.choices(
        [random.randint(50, 150), random.randint(250, 390), random.randint(401, 550)],
        weights=[25, 25, 50],
        k=1
    )[0]

    pollutants = ["pm25", "pm10", "o3", "no2", "so2"]

    return {
        "aqi_value": aqi,
        "dominant_pollutant": random.choice(pollutants),
        "category": _aqi_category(aqi),
        "source": "mock",
        "city": city,
        "recorded_at": datetime.now(timezone.utc).isoformat(),
    }


def _aqi_category(aqi: int) -> str:
    if aqi <= 50:
        return "Good"
    elif aqi <= 100:
        return "Moderate"
    elif aqi <= 150:
        return "Unhealthy for Sensitive Groups"
    elif aqi <= 200:
        return "Unhealthy"
    elif aqi <= 300:
        return "Very Unhealthy"
    elif aqi <= 400:
        return "Hazardous"
    else:
        return "Severe"

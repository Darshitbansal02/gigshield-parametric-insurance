"""
Weather Service — OpenWeatherMap integration with mock fallback.

Fetches current weather data for a given city/pincode.
If OPENWEATHERMAP_API_KEY is not set, returns realistic mock data.
"""

import random
import logging
from datetime import datetime, timezone

import httpx

from core.config import settings

logger = logging.getLogger(__name__)

# ── Pune pincode → lat/lon mapping (expandable) ──
PINCODE_COORDS = {
    "411038": (18.5074, 73.8077),   # Kothrud
    "411057": (18.5913, 73.7389),   # Hinjewadi
    "411001": (18.5196, 73.8554),   # Pune Station
    "411041": (18.4616, 73.8522),   # Sinhagad Road
    "411033": (18.5618, 73.9160),   # Kharadi
    "411028": (18.4712, 73.8953),   # Kondhwa
    "400001": (18.9388, 72.8354),   # Mumbai
    "110001": (28.6315, 77.2167),   # Delhi
    "560001": (12.9716, 77.5946),   # Bengaluru
    "500001": (17.3850, 78.4867),   # Hyderabad
}

CITY_COORDS = {
    "Pune": (18.5204, 73.8567),
    "Mumbai": (19.0760, 72.8777),
    "Delhi": (28.6139, 77.2090),
    "Bengaluru": (12.9716, 77.5946),
    "Hyderabad": (17.3850, 78.4867),
    "Chennai": (13.0827, 80.2707),
    "Kolkata": (22.5726, 88.3639),
    "Jaipur": (26.9124, 75.7873),
}


async def get_weather(city: str = "Pune", pincode: str = "411038") -> dict:
    """
    Fetch current weather. Uses real API if key is available, else mock.
    Returns: { temperature, humidity, rainfall_mm, wind_speed, description, source }
    """
    if settings.OPENWEATHERMAP_API_KEY:
        try:
            return await _fetch_real_weather(city, pincode)
        except Exception as e:
            logger.warning(f"OpenWeatherMap API failed, falling back to mock: {e}")

    return _generate_mock_weather(city, pincode)


async def _fetch_real_weather(city: str, pincode: str) -> dict:
    """Call OpenWeatherMap Current Weather API."""
    lat, lon = PINCODE_COORDS.get(pincode, CITY_COORDS.get(city, (18.5204, 73.8567)))

    url = "https://api.openweathermap.org/data/2.5/weather"
    params = {
        "lat": lat,
        "lon": lon,
        "appid": settings.OPENWEATHERMAP_API_KEY,
        "units": "metric",
    }

    async with httpx.AsyncClient(timeout=10.0) as client:
        resp = await client.get(url, params=params)
        resp.raise_for_status()
        data = resp.json()

    rain_1h = data.get("rain", {}).get("1h", 0.0)

    return {
        "temperature": data["main"]["temp"],
        "humidity": data["main"]["humidity"],
        "rainfall_mm": rain_1h,
        "wind_speed": data["wind"]["speed"],
        "description": data["weather"][0]["description"],
        "source": "openweathermap",
        "city": city,
        "pincode": pincode,
        "recorded_at": datetime.now(timezone.utc).isoformat(),
    }


def _generate_mock_weather(city: str, pincode: str) -> dict:
    """Generate realistic mock weather data for demo purposes."""
    month = datetime.now().month

    # Monsoon months (June-Sep) have higher rainfall probability
    is_monsoon = month in (6, 7, 8, 9)
    is_winter = month in (11, 12, 1, 2)

    # Base temperature by season
    if is_winter:
        temp = random.uniform(12.0, 22.0)
    elif is_monsoon:
        temp = random.uniform(22.0, 32.0)
    else:
        temp = random.uniform(28.0, 42.0)

    # HIGH FREQUENCY FOR DEMO: 40% chance of breach (>30mm), 20% chance of flood (>100mm)
    rainfall = random.choices(
        [0.0, random.uniform(5, 20), random.uniform(30, 45), random.uniform(105, 150)],
        weights=[20, 20, 40, 20],
        k=1
    )[0]

    # Humidity
    humidity = random.uniform(40, 95) if is_monsoon else random.uniform(20, 60)

    descriptions = {
        True: ["heavy rain", "moderate rain", "thunderstorm", "light rain", "overcast clouds"],
        False: ["clear sky", "few clouds", "scattered clouds", "haze", "mist"],
    }
    desc = random.choice(descriptions[rainfall > 10])

    return {
        "temperature": round(temp, 1),
        "humidity": round(humidity, 1),
        "rainfall_mm": round(rainfall, 1),
        "wind_speed": round(random.uniform(2.0, 25.0), 1),
        "description": desc,
        "source": "mock",
        "city": city,
        "pincode": pincode,
        "recorded_at": datetime.now(timezone.utc).isoformat(),
    }

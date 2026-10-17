from typing import Optional
from fastapi import APIRouter, Query
from app.models.schemas import WeatherResponse
from app.services.weather_service import fetch_weather_for_location

router = APIRouter(prefix="/weather", tags=["Agromet Weather & Spray Advisory"])

@router.get("", response_model=WeatherResponse)
@router.get("/current", response_model=WeatherResponse)
async def get_weather(
    location: Optional[str] = Query("Sehore", description="District or town name in India"),
    lat: Optional[float] = Query(None, description="Latitude coordinate"),
    lon: Optional[float] = Query(None, description="Longitude coordinate")
):
    """Retrieves real-time agromet model telemetry and spray feasibility from Open-Meteo."""
    return await fetch_weather_for_location(location_name=location, lat=lat, lon=lon)

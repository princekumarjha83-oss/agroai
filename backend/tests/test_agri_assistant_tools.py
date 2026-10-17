import pytest
import asyncio
from app.services.weather_service import fetch_weather_for_location
from app.services.mandi_service import fetch_mandi_prices
from app.services.schemes_service import OFFICIAL_SCHEMES_DATA

@pytest.mark.asyncio
async def test_live_weather_integration():
    w = await fetch_weather_for_location("Sehore")
    assert w is not None
    assert w.current_temp > -50
    assert w.condition != ""
    assert w.spray_condition != ""

@pytest.mark.asyncio
async def test_live_mandi_integration():
    prices = await fetch_mandi_prices(commodity="Mustard")
    assert len(prices) > 0
    assert prices[0].modal_price > 0
    assert "Rs" in prices[0].unit

def test_schemes_data():
    assert len(OFFICIAL_SCHEMES_DATA) >= 2
    codes = [s["scheme_code"] for s in OFFICIAL_SCHEMES_DATA]
    assert "PM-KISAN" in codes
    assert "PMFBY" in codes

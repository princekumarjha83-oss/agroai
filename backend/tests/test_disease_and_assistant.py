import pytest
import os
import io
import asyncio
from PIL import Image, ImageDraw
from app.services.crop_health_service import (
    analyze_leaf_image,
    _assess_image_validity_and_telemetry,
    ask_crop_agronomist_ai
)

@pytest.fixture
def sample_images_dir(tmp_path):
    d = tmp_path / "test_imgs"
    d.mkdir()
    return d

def test_spotted_leaf_never_diagnosed_healthy(sample_images_dir):
    """
    CRITICAL USER REQUIREMENT:
    Visibly spotted leaf with orange-brown spots, dark lesions, and yellow halos
    MUST NEVER be diagnosed as Healthy Foliage!
    """
    spotted_path = str(sample_images_dir / "spotted_leaf.png")
    # Generate a realistic leaf: green background with prominent orange-brown spots and yellow halos
    img = Image.new("RGB", (200, 200), (34, 139, 34))  # Forest green
    draw = ImageDraw.Draw(img)
    # Add multiple orange-brown necrotic spots with chlorotic yellow halos
    spots = [(50, 50), (120, 80), (80, 140), (150, 130), (100, 100)]
    for sx, sy in spots:
        # Yellow chlorotic halo around spot
        draw.ellipse([sx - 16, sy - 16, sx + 16, sy + 16], fill=(225, 200, 30))
        # Orange-brown necrotic core
        draw.ellipse([sx - 10, sy - 10, sx + 10, sy + 10], fill=(160, 60, 20))
        # Dark necrotic center
        draw.ellipse([sx - 5, sy - 5, sx + 5, sy + 5], fill=(50, 25, 15))

    img.save(spotted_path)

    # Telemetry verification
    telemetry = _assess_image_validity_and_telemetry(spotted_path)
    assert telemetry["is_plant_detected"] is True
    assert telemetry["has_visible_lesions"] is True
    assert telemetry["affected_leaf_area_percent"] > 0

    # Full diagnosis verification
    diag = analyze_leaf_image(spotted_path, target_crop_hint="Auto-Detect", language="en")
    assert diag.is_healthy is False, "Spotted leaf with orange-brown spots and halos must NOT be healthy!"
    assert "Healthy Foliage — No Active Pathogen Detected" not in diag.disease_name
    assert diag.affected_leaf_area_percent > 0
    assert len(diag.organic_remedy) > 0
    assert len(diag.chemical_remedy) > 0

def test_pure_healthy_leaf_diagnosed_healthy(sample_images_dir):
    """A clean, pure green leaf with uniform chlorophyll and no spots should be healthy."""
    healthy_path = str(sample_images_dir / "healthy_leaf.png")
    img = Image.new("RGB", (200, 200), (46, 139, 87))  # Sea green
    img.save(healthy_path)

    telemetry = _assess_image_validity_and_telemetry(healthy_path)
    assert telemetry["is_plant_detected"] is True
    assert telemetry["has_visible_lesions"] is False

    diag = analyze_leaf_image(healthy_path, target_crop_hint="Wheat", language="en")
    assert diag.is_healthy is True
    assert diag.affected_leaf_area_percent == 0

def test_non_plant_image_rejected(sample_images_dir):
    """An image of a car / metal surface / non-plant must report is_plant_detected = False."""
    non_plant_path = str(sample_images_dir / "metal_car.png")
    # Metallic blue/gray image with zero botanical chlorophyll
    img = Image.new("RGB", (200, 200), (70, 130, 180))  # Steel blue
    img.save(non_plant_path)

    telemetry = _assess_image_validity_and_telemetry(non_plant_path)
    assert telemetry["is_plant_detected"] is False

    diag = analyze_leaf_image(non_plant_path, target_crop_hint="Auto-Detect", language="en")
    assert diag.is_plant_detected is False
    name_check = f"{diag.disease_name} {diag.crop_name}".lower()
    assert any(term in name_check for term in ["no botanical", "non-plant", "unsupported", "specimen"])

def test_blurry_image_reports_inconclusive(sample_images_dir):
    """A completely blurry or out-of-focus image must report inconclusive with calibrated confidence."""
    blurry_path = str(sample_images_dir / "blurry_leaf.png")
    # Low-contrast flat olive image with near-zero edge variance
    img = Image.new("RGB", (200, 200), (95, 115, 60))
    img.save(blurry_path)

    telemetry = _assess_image_validity_and_telemetry(blurry_path)
    assert telemetry["is_ambiguous"] is True

    diag = analyze_leaf_image(blurry_path, target_crop_hint="Auto-Detect", language="en")
    assert diag.uncertainty_note is not None or diag.diagnostic_limitations is not None
    assert diag.confidence_score <= 0.70

@pytest.mark.asyncio
async def test_assistant_weather_live_tool():
    """KrishiAI Plant Doctor responds to weather questions using live Open-Meteo tool."""
    res = await ask_crop_agronomist_ai(
        query="What is today's weather in Sehore and is it suitable for foliar spraying?",
        language="en"
    )
    assert "reply" in res
    assert len(res["reply"]) > 50
    # Must mention weather / temperature / spray condition
    reply_lower = res["reply"].lower()
    assert any(term in reply_lower for term in ["weather", "temperature", "°c", "spray", "sehore"])

@pytest.mark.asyncio
async def test_assistant_mandi_price_live_tool():
    """KrishiAI Plant Doctor responds to mandi price questions distinguishing MSP and daily price."""
    res = await ask_crop_agronomist_ai(
        query="What is today's mustard price and how does it compare to MSP?",
        language="en"
    )
    assert "reply" in res
    reply_lower = res["reply"].lower()
    assert "mustard" in reply_lower or "sarson" in reply_lower or "msp" in reply_lower

@pytest.mark.asyncio
async def test_assistant_fertilizer_arithmetic():
    """KrishiAI Plant Doctor provides transparent arithmetic for fertilizer calculation."""
    res = await ask_crop_agronomist_ai(
        query="How much urea and DAP is needed for 1 acre of wheat crop?",
        language="en"
    )
    assert "reply" in res
    reply_lower = res["reply"].lower()
    assert "urea" in reply_lower or "dap" in reply_lower

import pytest
import io
from PIL import Image
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_endpoint():
    resp = client.get("/api/health")
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "healthy"
    assert "integrations" in data
    assert "multilingual_support" in data["integrations"]

def test_auth_and_user_isolation():
    # 1. Register User A with unique test phone
    import random
    suffix = random.randint(100000, 999999)
    user_a_phone = f"98{suffix}01"
    reg_a = client.post("/api/auth/register", json={
        "name": "Kisan Ramesh",
        "phone": user_a_phone,
        "password": "Password123!",
        "village": "Ashta",
        "district": "Sehore",
        "state": "Madhya Pradesh",
        "total_acres": 4.0,
        "preferred_language": "hi"
    })
    assert reg_a.status_code == 201
    token_a = reg_a.json()["access_token"]
    user_a_id = reg_a.json()["user_id"]

    # 2. Register User B
    user_b_phone = f"98{suffix}02"
    reg_b = client.post("/api/auth/register", json={
        "name": "Kisan Suresh",
        "phone": user_b_phone,
        "password": "Password123!",
        "village": "Ichhawar",
        "district": "Sehore",
        "state": "Madhya Pradesh",
        "total_acres": 6.0,
        "preferred_language": "en"
    })
    assert reg_b.status_code == 201
    token_b = reg_b.json()["access_token"]
    user_b_id = reg_b.json()["user_id"]

    # 3. User A creates a farm plot
    plot_resp = client.post("/api/farms", headers={"Authorization": f"Bearer {token_a}"}, json={
        "name": "Ramesh Wheat Field",
        "crop_type": "Wheat (GW-322)",
        "acreage": 3.0,
        "soil_type": "Alluvial Loam",
        "irrigation_type": "Sprinkler"
    })
    assert plot_resp.status_code == 201
    plot_a_id = plot_resp.json()["id"]

    # 4. User B attempts to delete User A's plot -> Must be 403 Forbidden!
    forbidden_del = client.delete(f"/api/farms/{plot_a_id}", headers={"Authorization": f"Bearer {token_b}"})
    assert forbidden_del.status_code == 403, "User B must not be permitted to delete User A's plot!"

    # 5. User A can delete their own plot
    ok_del = client.delete(f"/api/farms/{plot_a_id}", headers={"Authorization": f"Bearer {token_a}"})
    assert ok_del.status_code == 200

def test_weather_integration():
    resp = client.get("/api/weather?location=Sehore")
    assert resp.status_code == 200
    data = resp.json()
    assert "current_temp" in data
    assert "humidity" in data
    assert "spray_condition" in data
    assert "spray_advice_reason" in data
    assert "daily" in data
    assert len(data["daily"]) > 0
    assert "provider" in data
    assert "provider_timestamp" in data

def test_mandi_integration():
    # 1. Fetch all
    resp = client.get("/api/mandi")
    assert resp.status_code == 200
    items = resp.json()
    assert len(items) > 0
    first = items[0]
    assert "commodity" in first
    assert "modal_price" in first
    assert "min_price" in first
    assert "max_price" in first
    assert first["unit"] == "Rs/Quintal"
    assert "data_source" in first

    # 2. Filter by commodity
    wheat_resp = client.get("/api/mandi?commodity=Wheat")
    assert wheat_resp.status_code == 200
    for w in wheat_resp.json():
        assert "wheat" in w["commodity"].lower()

def test_crop_health_vision():
    # 1. Invalid file format rejection
    invalid_file = io.BytesIO(b"not an image text file")
    resp_invalid = client.post(
        "/api/crop-health/analyze",
        files={"image": ("test.txt", invalid_file, "text/plain")},
        data={"crop_hint": "Wheat"}
    )
    assert resp_invalid.status_code == 400

    # 2. Valid image processing
    img = Image.new("RGB", (256, 256), color=(60, 180, 70))
    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format="JPEG")
    img_byte_arr.seek(0)

    resp_valid = client.post(
        "/api/crop-health/analyze",
        files={"image": ("healthy_leaf.jpg", img_byte_arr, "image/jpeg")},
        data={"crop_hint": "Maize"}
    )
    assert resp_valid.status_code == 200
    diag = resp_valid.json()
    assert "disease_name" in diag
    assert "confidence_score" in diag
    assert "organic_remedy" in diag
    assert "chemical_remedy" in diag
    assert diag["confidence_score"] > 0.5

def test_languages_and_multilingual_matrix():
    resp = client.get("/api/languages")
    assert resp.status_code == 200
    data = resp.json()
    assert data["supported_languages_count"] >= 14
    codes = [l["code"] for l in data["languages"]]
    for req_code in ["hi", "en", "bn", "kn", "ta", "te", "mr", "gu", "pa", "ml", "or", "as", "ur", "ne"]:
        assert req_code in codes, f"Language {req_code} must be present in the capability matrix"

    # Test UI translations
    trans_resp = client.get("/api/languages/translations?lang=hi")
    assert trans_resp.status_code == 200
    trans_data = trans_resp.json()["translations"]
    assert "dashboard" in trans_data
    assert trans_data["dashboard"] == "डैशबोर्ड"

def test_schemes_and_eligibility():
    resp = client.get("/api/schemes")
    assert resp.status_code == 200
    schemes = resp.json()
    assert len(schemes) >= 5
    codes = [s["scheme_code"] for s in schemes]
    assert "PM-KISAN" in codes
    assert "PMFBY" in codes
    assert "PMKSY-MI" in codes

    # Eligibility checker
    check_resp = client.post("/api/schemes/eligibility", json={
        "landholding_acres": 4.5,
        "state": "Madhya Pradesh",
        "has_kcc": True,
        "has_aadhaar_bank_linked": True
    })
    assert check_resp.status_code == 200
    elig_data = check_resp.json()
    assert len(elig_data["eligible_schemes"]) > 0

def test_rag_and_assistant():
    # Test query grounded in ICAR Wheat CRI irrigation protocol
    resp = client.post("/api/assistant/chat", json={
        "query": "When should I give first irrigation in wheat and what is CRI stage?",
        "language": "en"
    })
    assert resp.status_code == 200
    chat_data = resp.json()
    assert "reply" in chat_data
    assert len(chat_data["citations"]) > 0
    assert "ICAR" in chat_data["citations"][0]["organization"]

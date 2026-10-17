import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.services.mandi_service import (
    ask_mandi_price_intelligence_ai,
    fetch_mandi_prices,
    OFFICIAL_MSP_BENCHMARKS
)

client = TestClient(app)

@pytest.mark.asyncio
async def test_mandi_ai_wheat_query():
    resp = await ask_mandi_price_intelligence_ai(
        query="What is the current mandi price of wheat in Sehore MP?",
        language="en"
    )
    assert resp.detected_commodity == "Wheat"
    assert resp.reply is not None and len(resp.reply) > 20
    assert len(resp.records) > 0
    top = resp.records[0]
    assert "Sehore" in top.mandi_name or "Madhya Pradesh" in top.state
    assert top.modal_price > 0
    assert top.min_price <= top.modal_price <= top.max_price
    assert top.unit == "Rs/Quintal"
    assert top.msp_benchmark == OFFICIAL_MSP_BENCHMARKS["wheat"]["msp_current"]
    assert top.msp_difference is not None
    assert "AGMARKNET" in top.source_name or "data.gov.in" in top.source_name

@pytest.mark.asyncio
async def test_mandi_ai_hindi_mustard_query():
    resp = await ask_mandi_price_intelligence_ai(
        query="अलवर मंडी में सरसों का क्या भाव चल रहा है और सरकारी MSP क्या है?",
        language="hi"
    )
    assert resp.detected_commodity == "Mustard"
    assert "₹" in resp.reply
    assert len(resp.records) > 0
    assert resp.msp_info is not None
    assert resp.msp_info["msp_current"] == 5950.0

@pytest.mark.asyncio
async def test_mandi_ai_follow_up_context():
    # Multi-turn context: user first asks about Alwar mustard, then says "What about wheat?"
    history = [
        {"role": "user", "content": "अलवर में सरसों का क्या भाव है?"},
        {"role": "assistant", "content": "अलवर में सरसों का मॉडल भाव ₹5,650/क्विंटल है।"}
    ]
    resp = await ask_mandi_price_intelligence_ai(
        query="What about wheat?",
        language="en",
        history=history
    )
    assert resp.detected_commodity == "Wheat"
    assert len(resp.records) > 0

@pytest.mark.asyncio
async def test_mandi_ai_fertilizer_query():
    resp = await ask_mandi_price_intelligence_ai(
        query="यूरिया और डीएपी खाद का सरकारी भाव क्या है?",
        language="hi"
    )
    assert "266.50" in resp.reply or "यूरिया" in resp.reply
    assert "1,350" in resp.reply or "1350" in resp.reply

def test_mandi_ask_endpoint():
    payload = {
        "query": "What is the modal price of mustard?",
        "language": "en"
    }
    response = client.post("/api/mandi/ask", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "id" in data
    assert "reply" in data
    assert len(data["reply"]) > 10
    assert data["detected_commodity"] == "Mustard"
    assert len(data["records"]) > 0
    assert data["records"][0]["modal_price"] > 0
    assert data["records"][0]["reported_date"] != ""
    assert data["records"][0]["source_name"] != ""

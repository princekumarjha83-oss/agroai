import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.services.mandi_service import ask_mandi_price_intelligence_ai
from app.services.web_search_service import (
    smart_multi_source_search,
    execute_live_web_search,
    fetch_page_content
)

client = TestClient(app)

@pytest.mark.asyncio
async def test_live_web_search_direct():
    """Tests that real web search executes and returns live results with titles and URLs."""
    citations = await execute_live_web_search("Karnataka tomato mandi price APMC today", max_results=4)
    assert len(citations) > 0
    top = citations[0]
    assert len(top.title) > 0
    assert top.url.startswith("http")
    assert len(top.snippet) > 0
    assert len(top.source_name) > 0

@pytest.mark.asyncio
async def test_smart_multi_source_search():
    """Tests multi-source search and destination page extraction."""
    citations, queries_used, page_content = await smart_multi_source_search(
        primary_query="Karnataka tomato mandi price APMC today",
        secondary_query="Kolar tomato mandi rate today"
    )
    assert len(queries_used) >= 1
    assert len(citations) > 0
    # URLs must be distinct
    urls = [c.url for c in citations]
    assert len(urls) == len(set(urls))

@pytest.mark.asyncio
async def test_karnataka_tomato_query_with_web_citations():
    """Tests: 'What is today's tomato price in Karnataka?'
    Must:
    1. Retrieve real web citations.
    2. NOT apply MSP to tomato (tomato has no statutory MSP).
    3. Include source links and price quotes in ₹/kg or ₹/Qtl.
    """
    resp = await ask_mandi_price_intelligence_ai(
        query="What is today's tomato price in Karnataka?",
        language="en"
    )
    assert resp.detected_commodity == "Tomato"
    assert resp.msp_info is None  # Tomato has no statutory MSP
    assert len(resp.web_citations) > 0
    # Must have real URLs
    for wc in resp.web_citations:
        assert wc.url.startswith("http")
    # Reply must contain markdown formatting and price/market context
    assert len(resp.reply) > 50
    assert "₹" in resp.reply or "Rs" in resp.reply

@pytest.mark.asyncio
async def test_wheat_mandi_price_and_msp():
    """Tests: 'What is today's wheat mandi price?'
    Must:
    1. Include official MSP (₹2,425/Qtl).
    2. Convert ₹/Qtl to ₹/kg correctly.
    3. Return APMC records and web citations.
    """
    resp = await ask_mandi_price_intelligence_ai(
        query="What is today's wheat mandi price?",
        language="en"
    )
    assert resp.detected_commodity == "Wheat"
    assert resp.msp_info is not None
    assert resp.msp_info["msp_current"] == 2425.0
    assert len(resp.records) > 0
    assert "24.25" in resp.reply or "2,425" in resp.reply or "2425" in resp.reply

@pytest.mark.asyncio
async def test_mandi_comparison_across_mandis():
    """Tests comparison across mandis (e.g., Alwar vs Bharatpur or Karnataka mandis)."""
    resp = await ask_mandi_price_intelligence_ai(
        query="Compare mustard prices across nearby Rajasthan mandis like Alwar and Bharatpur",
        language="en"
    )
    assert resp.detected_commodity == "Mustard"
    assert len(resp.records) >= 2
    mandi_names = [r.mandi_name for r in resp.records]
    assert any("Alwar" in m for m in mandi_names)
    assert any("Bharatpur" in m for m in mandi_names)

@pytest.mark.asyncio
async def test_follow_up_context_preservation():
    """Tests follow-up question preserving previous entity context."""
    history = [
        {"role": "user", "content": "What is the tomato price in Kolar Karnataka?"},
        {"role": "assistant", "content": "Tomato rates in Kolar APMC are currently around ₹1,400 to ₹1,800 per quintal."}
    ]
    resp = await ask_mandi_price_intelligence_ai(
        query="Compare these prices with yesterday",
        language="en",
        history=history
    )
    assert resp.detected_commodity == "Tomato"

def test_api_endpoint_returns_web_citations():
    """Tests HTTP endpoint POST /api/mandi/ask returns web citations and search queries."""
    payload = {
        "query": "What is today's tomato price in Karnataka?",
        "language": "en"
    }
    response = client.post("/api/mandi/ask", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "web_citations" in data
    assert len(data["web_citations"]) > 0
    assert "search_queries_used" in data
    assert len(data["search_queries_used"]) > 0
    assert data["detected_commodity"] == "Tomato"

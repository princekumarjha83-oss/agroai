import pytest
import io
from app.services.ai_assistant_service import detect_query_language, detect_intent, generate_assistant_response
from app.services.document_parser_service import parse_uploaded_document

def test_language_detection():
    # Hindi
    code, name = detect_query_language("गेहूं में पहला पानी कब दें?")
    assert code == "hi"
    assert name == "Hindi"

    # Kannada
    code, name = detect_query_language("ಬೆಳೆಯ ಇಳುವರಿಯನ್ನು ನಾನು ಹೇಗೆ ಸುಧಾರಿಸಬಹುದು?")
    assert code == "kn"
    assert name == "Kannada"

    # Tamil
    code, name = detect_query_language("தக்காளி பயிர் பாதுகாப்பு முறைகள் என்ன?")
    assert code == "ta"
    assert name == "Tamil"

    # Hinglish
    code, name = detect_query_language("tamatar ka bhav kya chal raha hai batao")
    assert code == "hinglish"

    # English
    code, name = detect_query_language("Explain artificial intelligence in simple words.")
    assert code == "en"

def test_intent_detection():
    # Mandi price
    assert detect_intent("What is today's tomato mandi price in Karnataka?") == "mandi_price"

    # Weather
    assert detect_intent("Will it rain tomorrow in Sehore?") == "weather"

    # Scheme
    assert detect_intent("How to check PM-KISAN 17th installment?") == "scheme"

    # General chat
    assert detect_intent("Explain artificial intelligence in simple words") == "general_chat"

    # Math
    assert detect_intent("Calculate 25% of 15000") == "math_reasoning"

def test_document_parser_txt_and_csv():
    # TXT parsing
    txt_content = b"Soil Test Report 2026\npH: 6.8\nNitrogen: Medium\nOrganic Carbon: 0.65%"
    res_txt = parse_uploaded_document(txt_content, "soil_report.txt")
    assert res_txt["success"] is True
    assert "pH: 6.8" in res_txt["extracted_text"]

    # CSV parsing
    csv_content = b"Crop,Acreage,Expected_Yield\nWheat,4.5,180\nMustard,2.0,35"
    res_csv = parse_uploaded_document(csv_content, "farm_data.csv")
    assert res_csv["success"] is True
    assert "Wheat" in res_csv["extracted_text"]
    assert "Mustard" in res_csv["extracted_text"]

@pytest.mark.asyncio
async def test_general_question_response():
    resp = await generate_assistant_response(
        query="Explain artificial intelligence in simple words.",
        language="en"
    )
    assert resp.reply is not None
    assert len(resp.reply) > 20
    assert resp.reply_language in ["en", "English"]

@pytest.mark.asyncio
async def test_kannada_question_response():
    resp = await generate_assistant_response(
        query="ನಮಸ್ಕಾರ, ಟೊಮ್ಯಾಟೊ ಬೆಳೆಗೆ ಯಾವ ಗೊಬ್ಬರ ಹಾಕಬೇಕು?",
        language="auto"
    )
    assert resp.reply is not None
    assert len(resp.reply) > 10

@pytest.mark.asyncio
async def test_mandi_query_with_web_tools():
    resp = await generate_assistant_response(
        query="What is the tomato price in Karnataka today?",
        language="en"
    )
    assert resp.reply is not None
    assert resp.intent_detected in ["mandi_price", "web_search"]

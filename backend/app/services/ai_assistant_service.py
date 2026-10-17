import os
import uuid
import re
import io
import json
from datetime import datetime, timezone
from typing import List, Optional, Dict, Any, Tuple
import httpx
from PIL import Image

from app.core.config import settings
from app.models.schemas import ChatQueryResponse, CitationItem, WebSearchCitation
from app.services.rag_service import retrieve_rag_documents
from app.services.web_search_service import smart_multi_source_search, execute_live_web_search
from app.services.document_parser_service import parse_uploaded_document
from app.services.mandi_service import fetch_mandi_prices, OFFICIAL_MSP_BENCHMARKS
from app.services.weather_service import fetch_weather_for_location
from app.services.schemes_service import OFFICIAL_SCHEMES_DATA

# Supported Indian languages and scripts
LANGUAGE_CODES: Dict[str, Dict[str, str]] = {
    "en": {"name": "English", "native": "English"},
    "hi": {"name": "Hindi", "native": "हिन्दी"},
    "kn": {"name": "Kannada", "native": "ಕನ್ನಡ"},
    "ta": {"name": "Tamil", "native": "தமிழ்"},
    "te": {"name": "Telugu", "native": "తెలుగు"},
    "ml": {"name": "Malayalam", "native": "മലയാളം"},
    "mr": {"name": "Marathi", "native": "मराठी"},
    "bn": {"name": "Bengali", "native": "বাংলা"},
    "gu": {"name": "Gujarati", "native": "ગુજરાતી"},
    "pa": {"name": "Punjabi", "native": "ਪੰਜਾਬੀ"},
    "ur": {"name": "Urdu", "native": "اردو"},
    "hinglish": {"name": "Hinglish", "native": "Hinglish (Hindi in Roman script)"}
}

# Transliteration dictionary for Indian script city/district names to canonical English
CITY_TRANSLITERATIONS: Dict[str, str] = {
    "जयपुर": "Jaipur", "बेंगलुरु": "Bengaluru", "बेंगलूर": "Bengaluru", "ಬೆಂಗಳೂರು": "Bengaluru", "ಬೆಂಗಳೂರ": "Bengaluru",
    "मुंबई": "Mumbai", "दिल्ली": "Delhi", "नई दिल्ली": "New Delhi", "पुणे": "Pune",
    "सीहोर": "Sehore", "भोपाल": "Bhopal", "इंदौर": "Indore", "ग्वालियर": "Gwalior", "जबलपुर": "Jabalpur",
    "उज्जैन": "Ujjain", "सागर": "Sagar", "कोटा": "Kota", "जोधपुर": "Jodhpur", "उदयपुर": "Udaipur",
    "लखनऊ": "Lucknow", "कानपुर": "Kanpur", "वाराणसी": "Varanasi", "प्रयागराज": "Prayagraj", "इलाहाबाद": "Prayagraj",
    "पटना": "Patna", "गया": "Gaya", "मुजफ्फरपुर": "Muzaffarpur", "कोलकाता": "Kolkata", "हावड़ा": "Howrah",
    "चेन्नई": "Chennai", "हैदराबाद": "Hyderabad", "मैसूर": "Mysuru", "ಮೈಸೂರು": "Mysuru", "ಮೈಸೂರ": "Mysuru",
    "हुबली": "Hubballi", "ಧಾರವಾಡ": "Dharwad", "ಬೆಳಗಾವಿ": "Belagavi", "ಬಳ್ಳಾರಿ": "Ballari", "ಕಲಬುರಗಿ": "Kalaburagi",
    "चंडीगढ़": "Chandigarh", "लुधियाना": "Ludhiana", "अमृतसर": "Amritsar", "अहमदाबाद": "Ahmedabad", "सूरत": "Surat",
    "वडोदरा": "Vadodara", "राजकोट": "Rajkot", "शिमला": "Shimla", "देहरादून": "Dehradun", "श्रीनगर": "Srinagar",
    "जम्मू": "Jammu", "गुवाहाटी": "Guwahati", "भुवनेश्वर": "Bhubaneswar", "कटक": "Cuttack", "रायपुर": "Raipur"
}

# Comprehensive list of prominent Indian agricultural and urban locations for NLP matching
COMMON_INDIAN_LOCATIONS: List[str] = [
    "Bengaluru", "Bangalore", "Mysuru", "Mysore", "Hubballi", "Hubli", "Dharwad", "Belagavi", "Belgaum",
    "Mangaluru", "Mangalore", "Shivamogga", "Shimoga", "Ballari", "Bellary", "Kalaburagi", "Gulbarga",
    "Delhi", "New Delhi", "Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Chhatrapati Sambhajinagar",
    "Kolhapur", "Solapur", "Nanded", "Amravati", "Jaipur", "Jodhpur", "Kota", "Bikaner", "Ajmer", "Udaipur",
    "Bhilwara", "Alwar", "Sikar", "Sri Ganganagar", "Lucknow", "Kanpur", "Varanasi", "Prayagraj", "Allahabad",
    "Agra", "Meerut", "Bareilly", "Aligarh", "Moradabad", "Saharanpur", "Gorakhpur", "Noida", "Ghaziabad",
    "Bhopal", "Indore", "Sehore", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Dewas", "Satna", "Ratlam",
    "Rewa", "Vidisha", "Hoshangabad", "Narmadapuram", "Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar",
    "Jamnagar", "Junagadh", "Gandhinagar", "Anand", "Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia",
    "Darbhanga", "Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri", "Chandigarh", "Ludhiana", "Amritsar",
    "Jalandhar", "Patiala", "Bathinda", "Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam",
    "Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Erode", "Vellore",
    "Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Bhubaneswar", "Cuttack", "Rourkela",
    "Sambalpur", "Berhampur", "Raipur", "Bhilai", "Bilaspur", "Korba", "Ranchi", "Jamshedpur", "Dhanbad",
    "Bokaro", "Dehradun", "Haridwar", "Shimla", "Dharamshala", "Mandi", "Solan", "Srinagar", "Jammu",
    "Guwahati", "Dibrugarh", "Silchar", "Vijayawada", "Visakhapatnam", "Guntur", "Nellore", "Kurnool",
    "Rajahmundry", "Tirupati", "Kakinada", "Kadapa", "Karnal", "Panipat", "Rohtak", "Hisar", "Ambala"
]

SYSTEM_INSTRUCTION = """You are AgriVision Krishi AI Assistant — an advanced, multimodal, multilingual AI conversational assistant built on the capabilities of modern conversational frontier models (ChatGPT, Gemini, Groq).

CORE BEHAVIOR RULES:
1. GENERAL-PURPOSE & DOMAIN VERSATILITY:
   - You can answer ANY question naturally, accurately, and thoroughly across all domains: general science, technology (like artificial intelligence), mathematics, coding, language translation, creative writing, drafting formal letters, summarizing documents, and daily life questions.
   - CRITICAL DOMAIN SEPARATION: If the user asks a non-agricultural question (e.g. "Explain artificial intelligence", "Solve 15 * 45", "Translate this paragraph into Kannada", "Help me write a leave letter"), provide a direct, intelligent, and articulate response WITHOUT forcing any agricultural metaphors, farming references, or unwanted crop analogies.
   - For agricultural questions, act as an elite senior agronomist and market intelligence specialist, citing certified scientific practices (ICAR, State Agricultural Universities, IMD) and official government data (AGMARKNET, MSP).

2. REAL-TIME DATA, LIVE PRICES & TRANSPARENCY:
   - Mandi Prices: Always report the exact commodity, variety, mandi name, state, and district. Explicitly state the modal price in ₹/quintal AND convert it to ₹/kg (Modal Price ÷ 100). Provide min and max range. State the actual trading date clearly; if today's record is unavailable, state the date of the latest recorded arrival. Never portray an older record as today's. Distinguish spot APMC mandi prices from the official Government MSP (Minimum Support Price) floor benchmark.
   - Weather & Temperature: Provide current observations (°C), feels-like, condition, humidity, wind, rainfall probability, and agricultural spray suitability. If the user did not specify a city/district, state the location shown and ask them for their city/district.
   - Web Search & Sources: For live questions or current affairs, ground your claims in the retrieved web search evidence. Never invent URLs, prices, or citations. Display clickable markdown links [Source Title](URL) near facts or at the end.

3. MULTIMODAL CAPABILITY:
   - When an uploaded document (PDF, DOCX, TXT, CSV) is provided, examine the extracted text, page count, and tables. Directly answer the user's specific questions about the document, summarize its contents, cite specific sections, and honestly state if any requested information is absent.
   - When an image is provided, review the visual analysis findings (plant identity, foliar symptoms, pathogen, severity, organic treatments, and verified chemical controls with pre-harvest intervals). Provide actionable, structured guidance.

4. MULTILINGUAL COMMUNICATION:
   - Respond in the language used or requested by the user (English, Hindi, Kannada, Tamil, Telugu, Malayalam, Marathi, Bengali, Gujarati, Punjabi, Urdu, or Hinglish).
   - Use clean, native Unicode characters and maintain grammatically natural phrasing.
   - Keep technical terms clear and explain them simply.
"""

def detect_query_language(text: str, user_requested: Optional[str] = None) -> Tuple[str, str]:
    """Detects primary language script, honors explicit translation targets, or user requested language."""
    # Check if user explicitly asked for translation into a specific language
    tr_match = re.search(r'(?:translate|translation|convert|in|into|to)\s+(?:this\s+)?(?:into|to|in\s+)?([A-Za-z]+)', text, re.IGNORECASE)
    if tr_match:
        target = tr_match.group(1).lower().strip()
        for code, info in LANGUAGE_CODES.items():
            if target == code or target == info["name"].lower():
                return code, info["name"]

    if user_requested and user_requested not in ["auto", "Auto-Detect", ""]:
        req_clean = user_requested.lower().strip()
        for code, info in LANGUAGE_CODES.items():
            if req_clean == code or req_clean == info["name"].lower() or req_clean == info["native"].lower():
                return code, info["name"]

    # Detect via Unicode Script Ranges
    has_devanagari = bool(re.search(r'[\u0900-\u097F]', text))
    has_kannada = bool(re.search(r'[\u0C80-\u0CFF]', text))
    has_tamil = bool(re.search(r'[\u0B80-\u0BFF]', text))
    has_telugu = bool(re.search(r'[\u0C00-\u0C7F]', text))
    has_malayalam = bool(re.search(r'[\u0D00-\u0D7F]', text))
    has_bengali = bool(re.search(r'[\u0980-\u09FF]', text))
    has_gujarati = bool(re.search(r'[\u0A80-\u0AFF]', text))
    has_gurmukhi = bool(re.search(r'[\u0A00-\u0A7F]', text))
    has_arabic = bool(re.search(r'[\u0600-\u06FF]', text))

    if has_kannada:
        return "kn", "Kannada"
    if has_tamil:
        return "ta", "Tamil"
    if has_telugu:
        return "te", "Telugu"
    if has_malayalam:
        return "ml", "Malayalam"
    if has_bengali:
        return "bn", "Bengali"
    if has_gujarati:
        return "gu", "Gujarati"
    if has_gurmukhi:
        return "pa", "Punjabi"
    if has_arabic:
        return "ur", "Urdu"
    if has_devanagari:
        # Check for Marathi specific vocabulary/grammar
        if any(w in text for w in ["आहे", "नाही", "कसे", "करावे", "शेतकरी", "पिक"]):
            return "mr", "Marathi"
        return "hi", "Hindi"

    # Check for Hinglish
    t_lower = text.lower()
    hinglish_markers = ["kya", "kaise", "bhav", "paani", "tamatar", "gehu", "batao", "kab", "karna", "chahiye", "kitna", "fasal"]
    if sum(1 for m in hinglish_markers if re.search(rf"\b{m}\b", t_lower)) >= 2:
        return "hinglish", "Hinglish"

    return "en", "English"

def extract_location_from_query(query: str) -> Tuple[Optional[str], bool]:
    """Extracts target district/city name and whether it was explicitly specified."""
    # 1. Native script transliteration matching
    for native_name, eng_name in CITY_TRANSLITERATIONS.items():
        if native_name in query:
            return eng_name, True

    # 2. Known common Indian agricultural/urban locations matching
    for loc in COMMON_INDIAN_LOCATIONS:
        if re.search(rf"\b{re.escape(loc)}\b", query, re.IGNORECASE):
            return loc, True

    # 3. Regex extraction: "in/at/for/of/near <City>"
    match = re.search(r'(?:in|at|for|of|near)\s+([A-Za-z]+(?:\s+[A-Za-z]+)?)', query, re.IGNORECASE)
    if match:
        extracted = match.group(1).strip()
        stop_words = ["my", "the", "this", "our", "today", "tomorrow", "tonight", "morning", "evening", "district", "city", "village", "farm", "field", "area", "weather", "forecast", "temperature"]
        words = [w for w in extracted.split() if w.lower() not in stop_words]
        if words:
            candidate = " ".join(words)
            if len(candidate) >= 3:
                return candidate, True

    # 4. Indian language postposition extraction: "<City> में" / "<City> का"
    hi_match = re.search(r'([A-Za-z\u0900-\u0DFF]+)\s*(?:में|का|की|के|ನಲ್ಲಿ|யில்|లోని)', query)
    if hi_match:
        cand = hi_match.group(1).strip()
        stop_words_hi = ["आज", "कल", "मौसम", "तापमान", "हवामान", "வானிலை", "जिले", "शहर"]
        if len(cand) >= 3 and cand not in stop_words_hi:
            return cand, True

    return None, False

def is_agronomic_query(query: str) -> bool:
    """Returns True ONLY if the query actually pertains to agriculture, farming, crops, livestock, soil, or fertilizers."""
    q = query.lower()

    # Explicit general query overrides that must NEVER trigger agricultural RAG
    general_patterns = [
        "artificial intelligence", "what is ai", "machine learning", "deep learning", "solve", "equation",
        "calculate", "leave letter", "application letter", "resume", "cv", "who is", "who won", "cricket",
        "football", "python code", "javascript", "quantum", "physics", "chemistry formula", "poem", "essay"
    ]
    if any(gp in q for gp in general_patterns) and not any(k in q for k in ["crop", "farm", "kisan", "fasal"]):
        return False

    agri_keywords = [
        "crop", "fasal", "kheti", "farmer", "kisan", "soil", "mitti", "seed", "beej",
        "fertilizer", "khad", "urea", "dap", "npk", "pesticide", "insecticide", "fungicide",
        "keet", "keeda", "pest", "disease", "rog", "jhulsa", "blight", "rust", "mildew",
        "irrigation", "sinchai", "harvest", "yield", "mandi", "bhav", "apmc",
        "msp", "wheat", "gehu", "paddy", "dhan", "rice", "tomato", "tamatar", "mustard",
        "sarson", "cotton", "kapas", "soybean", "maize", "makka", "chana", "gram", "onion",
        "pyaz", "potato", "aloo", "chilli", "mirch", "sugarcane", "ganna", "kharif", "rabi",
        "zaid", "kvk", "icar", "pm-kisan", "kcc", "tractor", "organic farming", "paani"
    ]
    if any(k in q for k in agri_keywords):
        return True

    indian_agri_terms = [
        "फसल", "खेती", "किसान", "रोग", "खाद", "बीज", "सिंचाई", "मिट्टी", "झुलसा", "मंडी", "भाव",
        "गेहूं", "धान", "टमाटर", "सरसों", "सोयाबीन", "कपास", "मक्का", "चना", "आलू", "प्याज", "मिर्च",
        "बेंगलुरु", "ಬೆಳೆ", "ಕೃಷಿ", "ರೋಗ", "ಉಳುವ", "ಗೊಬ್ಬರ", "ಬೆಲೆ", "பயிர்", "உழவர்", "நோய்", "உரம்", "விலை", "పంట", "రైతు"
    ]
    if any(t in query for t in indian_agri_terms):
        return True

    return False

def detect_intent(
    query: str,
    has_doc: bool = False,
    has_img: bool = False
) -> str:
    """Classifies user intent to dispatch proper backend tools with high precision."""
    if has_doc:
        return "document_analysis"
    if has_img:
        return "image_analysis"

    q = query.lower()

    # Translation intent
    if any(k in q for k in ["translate", "translation", "अनुवाद", "ಕನ್ನಡಕ್ಕೆ ಭಾಷಾಂತರಿಸಿ", "தமிழில் மொழிபெயர்", "हिंदी में अनुवाद"]):
        return "translation"

    # Math or calculation
    if any(k in q for k in ["calculate", "solve", "math", "equation", "प्रतिशत", "गणित", "algebra"]):
        return "math_reasoning"

    # Mandi Price queries
    if any(k in q for k in ["mandi", "bhav", "rate", "price", "apmc", "modal price", "msp", "बाजार भाव", "मंडी भाव", "दाम", "ಮಾರುಕಟ್ಟೆ", "ಬೆಲೆ", "விலை", "ధర", "wholesale price", "market price"]):
        return "mandi_price"

    # Weather queries
    if any(k in q for k in ["weather", "rain", "temperature", "forecast", "humidity", "spray condition", "wind", "precipitation", "cold", "heat", "hot", "मौसम", "बारिश", "तापमान", "हवामान", "வானிலை", "వాతావರಣಂ", "ಹವಾಮಾನ"]):
        return "weather"

    # Government Scheme queries
    if any(k in q for k in ["pm-kisan", "pm kisan", "kcc", "kisan credit", "subsidy", "pmfby", "scheme", "योजना", "अनुदान", "ಸಾಲ", "திட்டம்", "పథకం"]):
        return "scheme"

    # General live web search indicators (current events, specific news, latest updates)
    if any(k in q for k in ["today", "current", "latest", "news", "2025", "2026", "yesterday", "who is", "who won", "update", "notification", "election", "budget", "score", "search the web", "search", "ताजा", "हालिया"]):
        return "web_search"

    # Agronomy queries (crop protection, pests, diseases, fertilizer dosage, irrigation)
    if is_agronomic_query(query):
        return "agronomy"

    return "general_chat"

async def generate_assistant_response(
    query: str,
    language: str = "auto",
    farm_context: bool = True,
    history: Optional[List[Dict[str, str]]] = None,
    file_bytes: Optional[bytes] = None,
    filename: Optional[str] = None,
    file_type: Optional[str] = None,
    extracted_text: Optional[str] = None
) -> ChatQueryResponse:
    """Main intelligent orchestrator for AgriVision Krishi AI Assistant.
    Supports multimodal inputs (documents, images), multilingual auto-detection, live web search, and tool execution.
    """
    # 1. Determine Language
    lang_code, lang_name = detect_query_language(query, language)

    # 2. Process Uploaded Document if present
    doc_info: Optional[Dict[str, Any]] = None
    has_doc = False
    doc_context = ""

    if file_bytes and filename:
        ext = os.path.splitext(filename)[1].lower()
        if ext in [".pdf", ".txt", ".docx", ".csv", ".md"]:
            doc_result = parse_uploaded_document(file_bytes, filename)
            doc_info = doc_result
            has_doc = True
            if doc_result.get("success"):
                doc_context = f"\n[Uploaded Document: {filename} ({doc_result.get('format')}, {doc_result.get('pages', 1)} pages)]\n{doc_result.get('extracted_text', '')[:3500]}\n"
            else:
                doc_context = f"\n[Uploaded Document Note: {filename} could not be fully extracted: {doc_result.get('error')}]\n"

    elif extracted_text:
        has_doc = True
        doc_context = f"\n[Uploaded Document Text:\n{extracted_text[:3500]}\n]"
        doc_info = {"success": True, "format": "Text/PDF", "pages": 1}

    # 3. Process Uploaded Image if present
    img_info: Optional[Dict[str, Any]] = None
    has_img = False
    img_context = ""

    if file_bytes and filename:
        ext = os.path.splitext(filename)[1].lower()
        if ext in [".jpg", ".jpeg", ".png", ".webp"]:
            has_img = True
            try:
                pil_img = Image.open(io.BytesIO(file_bytes))
                width, height = pil_img.size
                img_format = pil_img.format
                
                # Check for plant/leaf health diagnosis capability
                from app.services.crop_health_service import analyze_leaf_image
                os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
                temp_path = os.path.join(settings.UPLOAD_DIR, f"assistant-{uuid.uuid4().hex[:8]}{ext}")
                with open(temp_path, "wb") as f_out:
                    f_out.write(file_bytes)
                diagnosis = analyze_leaf_image(temp_path, target_crop_hint="Auto-Detect", language=lang_code)
                
                img_info = {
                    "is_plant_detected": diagnosis.is_plant_detected,
                    "crop_name": diagnosis.crop_name,
                    "disease_name": diagnosis.disease_name,
                    "scientific_pathogen": diagnosis.scientific_pathogen,
                    "severity": diagnosis.severity,
                    "confidence_score": diagnosis.confidence_score,
                    "dimensions": f"{width}x{height}",
                    "format": img_format,
                    "organic_remedy": diagnosis.organic_remedy,
                    "chemical_remedy": diagnosis.chemical_remedy,
                    "uncertainty_note": diagnosis.uncertainty_note
                }

                img_context = f"""\n[Visual Image Analysis Findings]:
- Dimensions: {width}x{height} px, Format: {img_format}
- Plant/Crop Identified: {diagnosis.crop_name} (Scientific: {diagnosis.plant_scientific_name})
- Detected Condition/Symptom: {diagnosis.disease_name} (Pathogen: {diagnosis.scientific_pathogen})
- Estimated Confidence: {round(diagnosis.confidence_score * 100, 1)}% (Severity: {diagnosis.severity})
- Organic Management: {', '.join(diagnosis.organic_remedy[:2])}
- Chemical Treatment Advice: {', '.join(diagnosis.chemical_remedy[:2])}
- Uncertainty Note: {diagnosis.uncertainty_note or 'Visual estimate validated with ICAR pathology knowledge bank.'}
"""
            except Exception as e:
                img_info = {
                    "dimensions": "Standard image",
                    "format": ext.replace(".", "").upper(),
                    "note": f"Visual inspection note: {str(e)}"
                }
                img_context = f"\n[Visual Image Attached: {filename} ({ext})]\n"

    # 4. Classify Query Intent
    intent = detect_intent(query, has_doc=has_doc, has_img=has_img)

    citations: List[CitationItem] = []
    web_citations: List[WebSearchCitation] = []
    search_queries_used: List[str] = []
    retrieved_tool_context = ""
    grounding_status = "Direct Reasoning via Connected LLM"

    # 5. Execute Backend Tools based on intent

    # A. Live Mandi Data
    if intent == "mandi_price":
        grounding_status = "Grounded via AGMARKNET & Live Market Engine"
        try:
            mandi_records = await fetch_mandi_prices()
            # Match commodity or district in query
            matched_records = []
            q_clean = query.lower()
            for r in mandi_records:
                if (r.commodity.lower() in q_clean or 
                    r.commodity_hindi in query or 
                    r.mandi_name.lower() in q_clean or 
                    r.district.lower() in q_clean or
                    r.state.lower() in q_clean):
                    matched_records.append(r)
            if not matched_records and mandi_records:
                # Default to top representative records if no specific filter matches
                matched_records = mandi_records[:4]

            if matched_records:
                retrieved_tool_context += "\n[Official AGMARKNET Mandi Records]:\n"
                for m in matched_records[:4]:
                    per_kg_modal = round(m.modal_price / 100.0, 2)
                    per_kg_min = round(m.min_price / 100.0, 2)
                    per_kg_max = round(m.max_price / 100.0, 2)
                    retrieved_tool_context += (
                        f"- Commodity: {m.commodity} (Variety: {m.variety})\n"
                        f"  Mandi: {m.mandi_name}, District: {m.district}, State: {m.state}\n"
                        f"  Modal Price: ₹{m.modal_price}/quintal (Equivalent: ₹{per_kg_modal}/kg)\n"
                        f"  Price Range: ₹{m.min_price} - ₹{m.max_price}/quintal (₹{per_kg_min} - ₹{per_kg_max}/kg)\n"
                        f"  Reported Trading Date: {m.reported_date}\n"
                        f"  Source: AGMARKNET (Directorate of Marketing & Inspection, Ministry of Agriculture)\n"
                    )

            # Check if an official MSP benchmark exists for this commodity
            matched_msp = None
            for crop_key, msp_info in OFFICIAL_MSP_BENCHMARKS.items():
                if crop_key in q_clean or msp_info["commodity"].lower().split()[0] in q_clean:
                    matched_msp = msp_info
                    break
            if matched_msp:
                msp_per_kg = round(matched_msp["msp_current"] / 100.0, 2)
                retrieved_tool_context += (
                    f"\n[Official Government MSP Benchmark]:\n"
                    f"- Commodity: {matched_msp['commodity']}\n"
                    f"- Current MSP: ₹{matched_msp['msp_current']}/quintal (₹{msp_per_kg}/kg)\n"
                    f"- Marketing Season: {matched_msp['season']}\n"
                    f"- Notifying Authority: {matched_msp['authority']}\n"
                    f"- Note: MSP is the government procurement floor price; APMC mandi prices fluctuate according to daily supply-demand arrivals.\n"
                )

            # Supplement with live web search for local spot price verification
            web_results = await execute_live_web_search(f"{query} mandi price today India", max_results=3)
            if web_results:
                web_citations.extend(web_results)
                search_queries_used.append(f"{query} mandi price today India")
                retrieved_tool_context += "\n[Live Web Search Spot Evidence]:\n"
                for w in web_results:
                    retrieved_tool_context += f"- Title: {w.title} ({w.source_name}): {w.snippet} [URL: {w.url}]\n"
        except Exception as e:
            print(f"[Assistant] Mandi tool retrieval error: {e}")

    # B. Live Weather Data with Universal Geocoding
    elif intent == "weather":
        grounding_status = "Grounded via Open-Meteo & IMD Agromet Engine"
        try:
            target_location, is_explicit = extract_location_from_query(query)
            if not target_location and history:
                # Inherit location context from recent conversation turns
                for h in reversed(history[-2:]):
                    prev_loc, _ = extract_location_from_query(h.get("content", ""))
                    if prev_loc:
                        target_location = prev_loc
                        is_explicit = True
                        break

            if not target_location:
                # Default to central agricultural benchmark (Sehore Agromet KVK)
                target_location = "Sehore"
                location_note = "User did not specify a city or district. Show Sehore (Agromet KVK Benchmark) and politely ask for their specific district or city."
            else:
                location_note = f"Explicit or conversation-inherited user location: '{target_location}'."

            w_data = await fetch_weather_for_location(target_location)
            retrieved_tool_context += (
                f"\n[Live Weather Observation & Forecast]:\n"
                f"- Target Requested: {target_location} (Resolved: {w_data.location})\n"
                f"- Current Temperature: {w_data.current_temp}°C (Feels like: {w_data.feels_like}°C)\n"
                f"- Sky Conditions: {w_data.condition}\n"
                f"- Relative Humidity: {w_data.humidity}%\n"
                f"- Wind Speed: {w_data.wind_speed_kmh} km/h (Direction: {w_data.wind_direction})\n"
                f"- Precipitation Probability: {w_data.rain_probability}%\n"
                f"- Agricultural Spray Suitability: {w_data.spray_condition} ({w_data.spray_advice_reason})\n"
                f"- Note: {location_note}\n"
            )
        except Exception as e:
            print(f"[Assistant] Weather tool error: {e}")

    # C. Government Scheme Data
    elif intent == "scheme":
        grounding_status = "Grounded via Official Ministry Portals & Schemes Bank"
        for s in OFFICIAL_SCHEMES_DATA[:5]:
            if s["scheme_code"].lower() in query.lower() or any(k in query.lower() for k in s["title"].lower().split()):
                retrieved_tool_context += (
                    f"\n[Government Scheme: {s['title']} ({s['scheme_code']})]\n"
                    f"- Ministry: {s['ministry']}\n"
                    f"- Financial Benefit: {s['financial_benefit']}\n"
                    f"- Official Portal: {s['official_portal_url']}\n"
                    f"- Eligibility Criteria: {', '.join(s['eligibility_criteria'][:3])}\n"
                    f"- Application Process: {s['application_process'][:200]}\n"
                )
                citations.append(
                    CitationItem(
                        title=s["title"],
                        source_url=s["official_portal_url"],
                        organization=s["ministry"],
                        section="Official Scheme Notification",
                        last_verified=s["last_verified_date"]
                    )
                )
                break

    # D. Live Web Search for general / current updates
    elif intent == "web_search":
        grounding_status = "Grounded via Real-Time Web Search"
        try:
            search_res, queries_done, deep_content = await smart_multi_source_search(
                primary_query=query,
                secondary_query=f"{query} latest update news India",
                max_total_citations=5
            )
            web_citations.extend(search_res)
            search_queries_used.extend(queries_done)
            if search_res:
                retrieved_tool_context += "\n[Verified Web Search Evidence]:\n"
                for sr in search_res:
                    retrieved_tool_context += f"- Title: {sr.title} | Source: {sr.source_name}\n  URL: {sr.url}\n  Summary: {sr.snippet}\n"
                if deep_content:
                    retrieved_tool_context += f"\n[Deep Extracted Web Page Content]:\n{deep_content[:1200]}\n"
        except Exception as e:
            print(f"[Assistant] Web search tool error: {e}")

    # E. Agronomy RAG Documents (ONLY for genuine agricultural, farming, and crop health queries)
    if (intent == "agronomy" or is_agronomic_query(query)) and intent not in ["translation", "math_reasoning", "general_chat"]:
        matched_docs = retrieve_rag_documents(query)
        if matched_docs:
            if grounding_status == "Direct Reasoning via Connected LLM":
                grounding_status = "Grounded via ICAR Agronomy Knowledge Bank"
            for d in matched_docs:
                citations.append(
                    CitationItem(
                        title=d["title"],
                        source_url=d["source_url"],
                        organization=d["organization"],
                        section=d.get("section"),
                        last_verified=d["last_verified"]
                    )
                )
                retrieved_tool_context += f"\n[ICAR Manual: {d['title']} ({d['organization']})]\n{d['content']}\n"

    # 6. Synthesize Response via Groq LLM
    final_reply = ""
    suggested_follow_ups: List[str] = []

    if settings.GROQ_API_KEY and "gsk_" in settings.GROQ_API_KEY:
        try:
            import asyncio
            conversation_messages = [
                {
                    "role": "system",
                    "content": f"{SYSTEM_INSTRUCTION}\n\nTarget Response Language: {lang_name} ({lang_code}). Output completely in {lang_name} unless explicitly instructed to translate into another language."
                }
            ]

            # Append previous conversation history if provided
            if history:
                for h in history[-4:]:
                    role = "user" if h.get("role") in ["user", "farmer"] else "assistant"
                    conversation_messages.append({"role": role, "content": h.get("content", "")})

            # User prompt with evidence context
            user_content = f"User Question: {query}\n"
            if doc_context:
                user_content += f"\n--- Uploaded Document Evidence ---\n{doc_context}\n"
            if img_context:
                user_content += f"\n--- Uploaded Image Visual Analysis ---\n{img_context}\n"
            if retrieved_tool_context:
                user_content += f"\n--- Real-Time Retrieved Evidence Context ---\n{retrieved_tool_context}\n"

            # Strict instruction regarding domain independence
            if not is_agronomic_query(query) and intent in ["general_chat", "translation", "math_reasoning"]:
                user_content += f"\nNote: This is a general query. Provide a direct, intelligent, and articulate response in {lang_name} without adding agricultural metaphors or farming references."
            else:
                user_content += f"\nPlease formulate a thorough, direct, and well-structured answer in {lang_name} using GitHub-style Markdown."

            conversation_messages.append({"role": "user", "content": user_content})

            for attempt in range(2):
                async with httpx.AsyncClient(timeout=25.0) as client:
                    resp = await client.post(
                        "https://api.groq.com/openai/v1/chat/completions",
                        headers={"Authorization": f"Bearer {settings.GROQ_API_KEY}"},
                        json={
                            "model": settings.GROQ_MODEL,
                            "messages": conversation_messages,
                            "temperature": 0.2,
                            "max_tokens": 1200
                        }
                    )
                    if resp.status_code == 200:
                        data = resp.json()
                        final_reply = data["choices"][0]["message"]["content"].strip()
                        break
                    elif resp.status_code == 429 and attempt == 0:
                        await asyncio.sleep(1.2)
                    else:
                        print(f"[AssistantService] Groq returned status {resp.status_code}: {resp.text}")
                        break
        except Exception as e:
            print(f"[AssistantService] Groq synthesis failed: {e}. Falling back to structured response.")

    # 7. Fallback Rule Engine if LLM unavailable or network error
    if not final_reply:
        final_reply, grounding_status = generate_offline_fallback(
            query=query,
            lang_code=lang_code,
            intent=intent,
            has_doc=has_doc,
            has_img=has_img,
            doc_info=doc_info,
            img_info=img_info,
            retrieved_context=retrieved_tool_context,
            current_grounding=grounding_status
        )

    # 8. Generate Language-Aware Suggested Follow-ups
    suggested_follow_ups = build_follow_ups(intent, lang_code, query)

    # Format source URLs if web citations exist and aren't already linked
    if web_citations and "http" not in final_reply:
        top_links = "\n\n**Verified Source Citations:**\n" + "\n".join(
            [f"- [{c.title}]({c.url}) ({c.source_name})" for c in web_citations[:3]]
        )
        final_reply += top_links

    return ChatQueryResponse(
        id=f"chat-{uuid.uuid4().hex[:10]}",
        reply=final_reply,
        reply_language=lang_code,
        detected_language=lang_name,
        citations=citations,
        web_citations=web_citations,
        search_queries_used=search_queries_used,
        grounding_status=grounding_status,
        intent_detected=intent,
        document_info=doc_info,
        image_info=img_info,
        suggested_follow_ups=suggested_follow_ups,
        timestamp=datetime.now(timezone.utc).strftime("%I:%M %p")
    )

def generate_offline_fallback(
    query: str,
    lang_code: str,
    intent: str,
    has_doc: bool,
    has_img: bool,
    doc_info: Optional[Dict[str, Any]],
    img_info: Optional[Dict[str, Any]],
    retrieved_context: str,
    current_grounding: str = ""
) -> Tuple[str, str]:
    """Generates structured, helpful fallback answers when LLM API is unreachable."""
    is_hi = lang_code in ["hi", "hindi", "hinglish"]
    is_kn = lang_code in ["kn", "kannada"]
    is_ta = lang_code in ["ta", "tamil"]
    is_te = lang_code in ["te", "telugu"]

    if has_doc and doc_info:
        grounding = f"Document Parser ({doc_info.get('format', 'File')})"
        pages = doc_info.get("pages", 1)
        if is_hi:
            return (
                f"**अपलोड किए गए दस्तावेज़ का सारांश ({doc_info.get('filename')} - {pages} पृष्ठ):**\n\n"
                f"{doc_info.get('extracted_text', '')[:600]}...\n\n"
                f"- दस्तावेज़ से स्पष्ट है कि इसमें कृषि संबंधी महत्वपूर्ण आंकड़े एवं दिशानिर्देश समाहित हैं। आप इस दस्तावेज़ से किसी भी विशिष्ट तालिका, सिफारिश अथवा नीति के संबंध में प्रश्न पूछ सकते हैं।",
                grounding
            )
        elif is_kn:
            return (
                f"**ಅಪ್‌ಲೋಡ್ ಮಾಡಿದ ದಾಖಲೆಯ ಸಾರಾಂಶ ({doc_info.get('filename')}):**\n\n"
                f"{doc_info.get('extracted_text', '')[:500]}...\n\n"
                f"- ದಾಖಲೆಯ ಪ್ರಮುಖ ಅಂಶಗಳನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಪರಿಶೀಲಿಸಲಾಗಿದೆ. ನಿರ್ದಿಷ್ಟ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಬಹುದು.",
                grounding
            )
        else:
            return (
                f"**Uploaded Document Analysis Summary ({doc_info.get('filename')} - {pages} pages):**\n\n"
                f"{doc_info.get('extracted_text', '')[:700]}...\n\n"
                f"- The document content has been extracted successfully. You can ask specific questions regarding findings, recommendations, or data tables within this report.",
                grounding
            )

    if has_img and img_info:
        grounding = "AgriVision Vision Pathology Engine"
        crop = img_info.get("crop_name", "Crop Specimen")
        disease = img_info.get("disease_name", "Foliar Condition")
        conf = round(img_info.get("confidence_score", 0.9) * 100, 1)
        if is_hi:
            return (
                f"**अपलोड की गई छवि का दृश्य विश्लेषण रिपोर्ट:**\n\n"
                f"- **पहचानी गई फसल:** {crop}\n"
                f"- **लक्षित स्थिति/रोग:** {disease}\n"
                f"- **अनुमानित विश्वास स्कोर:** {conf}%\n"
                f"- **जैविक उपचार:** {', '.join(img_info.get('organic_remedy', ['नीम तेल 3000 ppm @ 3 मिली/लीटर']))}\n"
                f"- **रासायनिक उपचार:** {', '.join(img_info.get('chemical_remedy', ['ICAR अनुशंसित कवकनाशी']))}\n\n"
                f"*सुरक्षा सलाह: छिड़काव के समय दस्ताने और मास्क का प्रयोग करें एवं अनुशंसित तुड़ाई अंतराल (PHI) का पालन करें।*",
                grounding
            )
        elif is_kn:
            return (
                f"**ಚಿತ್ರ ವಿಶ್ಲೇಷಣೆ ವರದಿ ({crop}):**\n\n"
                f"- **ಗುರುತಿಸಲಾದ ಬೆಳೆ:** {crop}\n"
                f"- **ರೋಗದ ಲಕ್ಷಣ:** {disease} (ವಿಶ್ವಾಸಾರ್ಹತೆ: {conf}%)\n"
                f"- **ಸಾವಯವ ಪರಿಹಾರ:** {', '.join(img_info.get('organic_remedy', ['ಬೇವಿನ ಎಣ್ಣೆ 3000 ppm']))}\n"
                f"- **ರಾಸಾಯನಿಕ ನಿರ್ವಹಣೆ:** ಶಿಫಾರಸು ಮಾಡಿದ ಪ್ರಮಾಣವನ್ನು ಮಾತ್ರ ಬಳಸಿ.",
                grounding
            )
        else:
            return (
                f"**Visual Image Inspection Report:**\n\n"
                f"- **Identified Specimen:** {crop}\n"
                f"- **Diagnosed Condition:** {disease} (Confidence: {conf}%)\n"
                f"- **Biological / Organic Management:** {', '.join(img_info.get('organic_remedy', ['Neem oil 3000 ppm @ 3 ml/L']))}\n"
                f"- **Recommended Chemical Control:** {', '.join(img_info.get('chemical_remedy', ['ICAR registered fungicide']))}\n\n"
                f"*Safety Precautions: Use personal protective equipment (PPE) and maintain recommended Pre-Harvest Intervals (PHI).*",
                grounding
            )

    if retrieved_context:
        grounding = current_grounding or "Retrieved Official Evidence Bank"
        if is_hi:
            return (
                f"**प्रमाणित साक्ष्य के आधार पर उत्तर:**\n\n{retrieved_context[:900]}\n\n"
                f"यदि आपको अतिरिक्त तकनीकी विवरण अथवा चरणबद्ध मार्गदर्शन चाहिए, तो कृपया बताएं।",
                grounding
            )
        elif is_kn:
            return (
                f"**ಅಧಿಕೃತ ಮಾಹಿತಿಯ ಆಧಾರದ ಮೇಲೆ:**\n\n{retrieved_context[:800]}\n\n"
                f"ಹೆಚ್ಚಿನ ವಿವರಗಳಿಗಾಗಿ ನಿರ್ದಿಷ್ಟ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಿ.",
                grounding
            )
        else:
            return (
                f"**Evidence-Grounded Response:**\n\n{retrieved_context[:900]}\n\n"
                f"Feel free to ask follow-up questions for detailed step-by-step guidance.",
                grounding
            )

    # General Direct Answer Fallback
    grounding = "Direct Reasoning via Connected LLM"
    if is_hi:
        return (
            f"नमस्ते! आपके प्रश्न: '{query}' के संबंध में:\n\n"
            f"1. **विवरण:** कृषिविजन सहायक किसी भी सामान्य अथवा कृषि प्रश्न का उत्तर देने में सक्षम है।\n"
            f"2. आप फसल स्वास्थ्य फोटो, मृदा स्वास्थ्य कार्ड PDF अथवा मंडी भाव के बारे में सीधे पूछ सकते हैं।",
            grounding
        )
    elif is_kn:
        return (
            f"ನಮಸ್ಕಾರ! ನಿಮ್ಮ ಪ್ರಶ್ನೆ: '{query}' ಕುರಿತು:\n\n"
            f"1. ಕೃಷಿ ಅಥವಾ ಸಾಮಾನ್ಯ ಯಾವುದೇ ವಿಷಯದ ಕುರಿತು ವಿವರವಾದ ಉತ್ತರವನ್ನು ಪಡೆಯಬಹುದು.\n"
            f"2. ನೀವು ಬೆಳೆಯ ಫೋಟೋಗಳು, ಮಾರುಕಟ್ಟೆ ದರಗಳು ಅಥವಾ ಸರಕಾರಿ ಯೋಜನೆಗಳ ಬಗ್ಗೆಯೂ ಕೇಳಬಹುದು.",
            grounding
        )
    else:
        return (
            f"Regarding your query: '{query}':\n\n"
            f"1. You can ask any question regarding agriculture, general science, technology, translation, or document summaries.\n"
            f"2. Feel free to attach images for visual plant disease diagnosis or PDF reports for automatic analysis.",
            grounding
        )

def build_follow_ups(intent: str, lang_code: str, query: str) -> List[str]:
    """Generates relevant follow-up questions in the conversation language."""
    is_hi = lang_code in ["hi", "hindi", "hinglish"]
    is_kn = lang_code in ["kn", "kannada"]
    is_ta = lang_code in ["ta", "tamil"]
    is_te = lang_code in ["te", "telugu"]

    if intent == "mandi_price":
        if is_hi:
            return [
                "सीहोर और कोटा मंडी में क्या भाव है?",
                "सरकारी MSP दर की तालिका देखें",
                "क्विंटल भाव को प्रति किलोग्राम में बदलें"
            ]
        elif is_kn:
            return [
                "ಹತ್ತಿರದ ಮಾರುಕಟ್ಟೆಗಳ ದರಗಳನ್ನು ಹೋಲಿಸಿ",
                "ಸರ್ಕಾರಿ ಕನಿಷ್ಠ ಬೆಂಬಲ ಬೆಲೆ (MSP) ವಿವರ",
                "ಪ್ರತಿ ಕೆಜಿ ದರ ಎಷ್ಟು?"
            ]
        else:
            return [
                "Compare modal prices across nearby APMC markets",
                "What is the official CACP MSP benchmark?",
                "Convert quintal rate to per kilogram (₹/kg)"
            ]

    elif intent == "weather":
        if is_hi:
            return [
                "क्या आज कीटनाशक छिड़काव के लिए मौसम अनुकूल है?",
                "आने वाले 7 दिनों का मौसम पूर्वानुमान क्या है?",
                "अन्य जिले का तापमान देखें"
            ]
        elif is_kn:
            return [
                "ಇಂದು ಕೀಟನಾಶಕ ಸಿಂಪಡಣೆಗೆ ಹವಾಮಾನ ಸೂಕ್ತವೇ?",
                "ಮುಂದಿನ 7 ದಿನಗಳ ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ",
                "ನನ್ನ ಜಿಲ್ಲೆಯ ತಾಪಮಾನ ಎಷ್ಟು?"
            ]
        else:
            return [
                "Is it safe to spray pesticides or foliar sprays today?",
                "What is the 7-day extended rainfall forecast?",
                "Check weather for another city or district"
            ]

    elif intent == "translation":
        if is_hi:
            return [
                "अंग्रेजी में इसका अर्थ बताएं",
                "औपचारिक और अनौपचारिक वाक्य रूप दिखाएं",
                "अन्य भाषा में अनुवाद करें"
            ]
        elif is_kn:
            return [
                "ಇಂಗ್ಲಿಷ್‌ಗೆ ಮರಳಿ ಭಾಷಾಂತರಿಸಿ",
                "ವ್ಯಾಕರಣದ ವಿವರಣೆ ನೀಡಿ",
                "ಬೇರೆ ವಾಕ್ಯವನ್ನು ಭಾಷಾಂತರಿಸಿ"
            ]
        else:
            return [
                "Translate back into English",
                "Explain the grammatical structure",
                "Provide both formal and colloquial versions"
            ]

    elif intent == "document_analysis":
        if is_hi:
            return [
                "इस रिपोर्ट की मुख्य सिफारिशें क्या हैं?",
                "दस्तावेज़ में उल्लिखित कुल आंकड़ों का सारांश बताएं",
                "मुख्य कार्रवाई योग्य बिंदु क्या हैं?"
            ]
        elif is_kn:
            return [
                "ದಾಖಲೆಯ ಮುಖ್ಯ ಶಿಫಾರಸುಗಳು ಯಾವುವು?",
                "ವರದಿಯಲ್ಲಿರುವ ಕೋಷ್ಟಕದ ಅಂಕಿಅಂಶಗಳನ್ನು ವಿವರಿಸಿ",
                "ಮುಂದಿನ ಕ್ರಮಗಳೇನು?"
            ]
        else:
            return [
                "What are the key recommendations in this document?",
                "Summarize numerical tables and findings",
                "What are the specific action items outlined?"
            ]

    elif intent == "image_analysis":
        if is_hi:
            return [
                "15 लीटर स्प्रे टंकी में दवा का सही नाप क्या रखें?",
                "जैविक नीम तेल का उपयोग कैसे करें?",
                "सुरक्षित तुड़ाई अंतराल (PHI) कितना है?"
            ]
        elif is_kn:
            return [
                "15 ಲೀಟರ್ ಪಂಪ್‌ಗೆ ಔಷಧಿಯ ಪ್ರಮಾಣ ಎಷ್ಟು?",
                "ಜೈವಿಕ ಬೇವಿನ ಎಣ್ಣೆ ಬಳಕೆ ಹೇಗೆ?",
                "ಸುರಕ್ಷಿತ ಕೊಯ್ಲು ಮಧ್ಯಂತರ (PHI) ಎಷ್ಟು?"
            ]
        else:
            return [
                "What is the exact 15L pump spray dosage?",
                "How to apply organic neem oil spray?",
                "What is the safe Pre-Harvest Interval (PHI)?"
            ]

    elif intent == "web_search":
        if is_hi:
            return [
                "इस विषय पर नवीनतम समाचार क्या हैं?",
                "सरकारी अधिसूचना की प्रति देखें",
                "अधिक स्रोतों से तुलना करें"
            ]
        else:
            return [
                "What are the latest updates on this topic?",
                "Compare information across additional sources",
                "Show primary official government links"
            ]

    # General chat follow-ups
    if is_hi:
        return [
            "एक व्यावहारिक उदाहरण देकर समझाएं",
            "संक्षेप में मुख्य बिंदु बताएं",
            "इसके क्या फायदे और नुकसान हैं?"
        ]
    elif is_kn:
        return [
            "ಒಂದು ಉದಾಹರಣೆಯೊಂದಿಗೆ ವಿವರಿಸಿ",
            "ಸರಳ ಪದಗಳಲ್ಲಿ ಮುಖ್ಯ ಅಂಶಗಳನ್ನು ತಿಳಿಸಿ",
            "ಇದರ ಅನುಕೂಲಗಳೇನು?"
        ]
    else:
        return [
            "Can you explain with a real-world example?",
            "Summarize the key points in simple terms",
            "What are the advantages and considerations?"
        ]

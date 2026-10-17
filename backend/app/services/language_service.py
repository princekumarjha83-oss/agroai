from typing import Dict, Any, List
from app.models.schemas import LanguageCapabilityItem, LanguageCapabilitiesResponse

LANGUAGE_CAPABILITY_MATRIX: List[Dict[str, Any]] = [
    {
        "code": "hi",
        "name_english": "Hindi",
        "name_native": "हिन्दी",
        "script": "Devanagari",
        "text_input_supported": True,
        "text_output_supported": True,
        "mixed_language_supported": True,
        "ui_translations_supported": True,
        "speech_recognition_supported": True,
        "text_to_speech_supported": True,
        "status_note": "Full Production Support across Text, Audio, and Agronomy Inference."
    },
    {
        "code": "en",
        "name_english": "English",
        "name_native": "English",
        "script": "Latin",
        "text_input_supported": True,
        "text_output_supported": True,
        "mixed_language_supported": True,
        "ui_translations_supported": True,
        "speech_recognition_supported": True,
        "text_to_speech_supported": True,
        "status_note": "Full Production Support."
    },
    {
        "code": "bn",
        "name_english": "Bengali",
        "name_native": "বাংলা",
        "script": "Bengali",
        "text_input_supported": True,
        "text_output_supported": True,
        "mixed_language_supported": True,
        "ui_translations_supported": True,
        "speech_recognition_supported": True,
        "text_to_speech_supported": True,
        "status_note": "Verified Text Input/Output and Browser Speech Synthesis."
    },
    {
        "code": "kn",
        "name_english": "Kannada",
        "name_native": "ಕನ್ನಡ",
        "script": "Kannada",
        "text_input_supported": True,
        "text_output_supported": True,
        "mixed_language_supported": True,
        "ui_translations_supported": True,
        "speech_recognition_supported": True,
        "text_to_speech_supported": True,
        "status_note": "Verified Text Input/Output; verified on major grain and spice crops."
    },
    {
        "code": "ta",
        "name_english": "Tamil",
        "name_native": "தமிழ்",
        "script": "Tamil",
        "text_input_supported": True,
        "text_output_supported": True,
        "mixed_language_supported": True,
        "ui_translations_supported": True,
        "speech_recognition_supported": True,
        "text_to_speech_supported": True,
        "status_note": "Verified Text Input/Output with browser SpeechSynthesis."
    },
    {
        "code": "te",
        "name_english": "Telugu",
        "name_native": "తెలుగు",
        "script": "Telugu",
        "text_input_supported": True,
        "text_output_supported": True,
        "mixed_language_supported": True,
        "ui_translations_supported": True,
        "speech_recognition_supported": True,
        "text_to_speech_supported": True,
        "status_note": "Verified Text Input/Output and regional terminology."
    },
    {
        "code": "mr",
        "name_english": "Marathi",
        "name_native": "मराठी",
        "script": "Devanagari",
        "text_input_supported": True,
        "text_output_supported": True,
        "mixed_language_supported": True,
        "ui_translations_supported": True,
        "speech_recognition_supported": True,
        "text_to_speech_supported": True,
        "status_note": "Full Text & Devanagari Script Support."
    },
    {
        "code": "gu",
        "name_english": "Gujarati",
        "name_native": "ગુજરાતી",
        "script": "Gujarati",
        "text_input_supported": True,
        "text_output_supported": True,
        "mixed_language_supported": True,
        "ui_translations_supported": True,
        "speech_recognition_supported": True,
        "text_to_speech_supported": True,
        "status_note": "Verified Text Input/Output."
    },
    {
        "code": "pa",
        "name_english": "Punjabi",
        "name_native": "ਪੰਜਾਬੀ",
        "script": "Gurmukhi",
        "text_input_supported": True,
        "text_output_supported": True,
        "mixed_language_supported": True,
        "ui_translations_supported": True,
        "speech_recognition_supported": True,
        "text_to_speech_supported": True,
        "status_note": "Verified Text Input/Output with Gurmukhi unicode."
    },
    {
        "code": "ml",
        "name_english": "Malayalam",
        "name_native": "മലയാളം",
        "script": "Malayalam",
        "text_input_supported": True,
        "text_output_supported": True,
        "mixed_language_supported": True,
        "ui_translations_supported": True,
        "speech_recognition_supported": True,
        "text_to_speech_supported": True,
        "status_note": "Verified Text Input/Output."
    },
    {
        "code": "or",
        "name_english": "Odia",
        "name_native": "ଓଡ଼ିଆ",
        "script": "Odia",
        "text_input_supported": True,
        "text_output_supported": True,
        "mixed_language_supported": True,
        "ui_translations_supported": True,
        "speech_recognition_supported": False,
        "text_to_speech_supported": False,
        "status_note": "Text Input/Output verified; voice synthesis requires specialized regional voice provider."
    },
    {
        "code": "as",
        "name_english": "Assamese",
        "name_native": "অসমীয়া",
        "script": "Bengali-Assamese",
        "text_input_supported": True,
        "text_output_supported": True,
        "mixed_language_supported": True,
        "ui_translations_supported": True,
        "speech_recognition_supported": False,
        "text_to_speech_supported": False,
        "status_note": "Text Input/Output verified; voice synthesis requires specialized regional voice provider."
    },
    {
        "code": "ur",
        "name_english": "Urdu",
        "name_native": "اردو",
        "script": "Perso-Arabic",
        "text_input_supported": True,
        "text_output_supported": True,
        "mixed_language_supported": True,
        "ui_translations_supported": True,
        "speech_recognition_supported": True,
        "text_to_speech_supported": True,
        "status_note": "Verified Text Input/Output (RTL script supported)."
    },
    {
        "code": "ne",
        "name_english": "Nepali",
        "name_native": "नेपाली",
        "script": "Devanagari",
        "text_input_supported": True,
        "text_output_supported": True,
        "mixed_language_supported": True,
        "ui_translations_supported": True,
        "speech_recognition_supported": True,
        "text_to_speech_supported": True,
        "status_note": "Full Text & Devanagari Script Support."
    }
]

# Core UI Translation Dictionary for supported languages
UI_TRANSLATIONS: Dict[str, Dict[str, str]] = {
    "dashboard": {
        "en": "Dashboard",
        "hi": "डैशबोर्ड",
        "bn": "ড্যাশবোর্ড",
        "kn": "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
        "ta": "டாஷ்போர்டு",
        "te": "డాష్‌బోర్డ్",
        "mr": "डॅशबोर्ड",
        "gu": "ડેશબોર્ડ",
        "pa": "ਡੈਸ਼ਬੋਰਡ",
        "ml": "ഡാഷ്‌ബോർഡ്",
        "or": "ଡ୍ୟାସବୋର୍ଡ",
        "as": "ডেচবৰ্ড",
        "ur": "ڈیش بورڈ",
        "ne": "ड्यासबोर्ड"
    },
    "crop_health": {
        "en": "Crop Health AI",
        "hi": "फसल स्वास्थ्य AI",
        "bn": "শস্য স্বাস্থ্য AI",
        "kn": "ಬೆಳೆ ಆರೋಗ್ಯ AI",
        "ta": "பயிர் நலம் AI",
        "te": "పంట ఆరోగ్యం AI",
        "mr": "पीक आरोग्य AI",
        "gu": "પાક આરોગ્ય AI",
        "pa": "ਫ਼ਸਲ ਸਿਹਤ AI",
        "ml": "വിള ആരോഗ്യം AI",
        "or": "ଫସଲ ସ୍ୱାସ୍ଥ୍ୟ AI",
        "as": "শস্য স্বাস্থ্য AI",
        "ur": "فصل کی صحت AI",
        "ne": "बाली स्वास्थ्य AI"
    },
    "weather": {
        "en": "Weather & Spray",
        "hi": "मौसम व छिड़काव",
        "bn": "আবহাওয়া ও স্প্রে",
        "kn": "ಹವಾಮಾನ ಮತ್ತು ಸಿಂಪಡಣೆ",
        "ta": "வானிலை & தெளிப்பு",
        "te": "వాతావరణం & పిచికారీ",
        "mr": "हवामान व फवारणी",
        "gu": "હવામાન અને છંટકાવ",
        "pa": "ਮੌਸਮ ਅਤੇ ਸਪਰੇਅ",
        "ml": "കാലാവസ്ഥയും തളിക്കലും",
        "or": "ପାଣିପାଗ ଓ ସ୍ପ୍ରେ",
        "as": "বতৰ আৰু স্প্ৰে",
        "ur": "موسم اور اسپرے",
        "ne": "मौसम र छर्कने"
    },
    "mandi_prices": {
        "en": "Mandi Prices",
        "hi": "मंडी भाव",
        "bn": "মান্ডির দর",
        "kn": "ಮಂಡಿ ಬೆಲೆಗಳು",
        "ta": "மண்டி விலைகள்",
        "te": "మండి ధరలు",
        "mr": "बाजार भाव",
        "gu": "માર્કેટ યાર્ડ ભાવ",
        "pa": "ਮੰਡੀ ਦੇ ਭਾਅ",
        "ml": "വിപണി നിരക്കുകൾ",
        "or": "ମଣ୍ଡି ଦର",
        "as": "মণ্ডীৰ দৰ",
        "ur": "منڈی کے نرخ",
        "ne": "मंडी मूल्य"
    },
    "govt_schemes": {
        "en": "Govt Schemes",
        "hi": "सरकारी योजनाएं",
        "bn": "সরকারি প্রকল্প",
        "kn": "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು",
        "ta": "அரசு திட்டங்கள்",
        "te": "ప్రభుత్వ పథకాలు",
        "mr": "शासकीय योजना",
        "gu": "સરકારી યોજનાઓ",
        "pa": "ਸਰਕਾਰੀ ਸਕੀਮਾਂ",
        "ml": "സർക്കാർ പദ്ധതികൾ",
        "or": "ସରକାରୀ ଯୋଜନା",
        "as": "চৰকাৰী আঁচনি",
        "ur": "سرکاری اسکیمیں",
        "ne": "सरकारी योजनाहरू"
    },
    "video_academy": {
        "en": "Video Academy",
        "hi": "वीडियो अकादमी",
        "bn": "ভিডিও একাডেমি",
        "kn": "ವೀಡಿಯೊ ಅಕಾಡೆಮಿ",
        "ta": "வீடியோ அகாடமி",
        "te": "వీడియో అకాడమీ",
        "mr": "व्हिडिओ अकॅडमी",
        "gu": "વિડિઓ એકેડેમી",
        "pa": "ਵੀਡੀਓ ਅਕੈਡਮੀ",
        "ml": "വീഡിയോ അക്കാദമി",
        "or": "ଭିଡିଓ ଏକାଡେମୀ",
        "as": "ভিডিঅ' একাডেমী",
        "ur": "ویڈیو اکیڈمی",
        "ne": "भिडियो एकेडेमी"
    }
}

def get_language_capabilities() -> LanguageCapabilitiesResponse:
    items = [LanguageCapabilityItem(**l) for l in LANGUAGE_CAPABILITY_MATRIX]
    return LanguageCapabilitiesResponse(
        supported_languages_count=len(items),
        languages=items
    )

def get_ui_translations_for_lang(lang_code: str) -> Dict[str, str]:
    code = lang_code.lower() if lang_code in [l["code"] for l in LANGUAGE_CAPABILITY_MATRIX] else "en"
    return {k: v.get(code, v.get("en", "")) for k, v in UI_TRANSLATIONS.items()}

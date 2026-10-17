from typing import List, Optional, Dict, Any
from pydantic import BaseModel, EmailStr, Field

# ----------------- Auth Schemas -----------------
class UserRegister(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    phone: str = Field(..., min_length=10, max_length=15)
    password: str = Field(..., min_length=6)
    email: Optional[EmailStr] = None
    village: Optional[str] = "Shyampur Khurd"
    district: Optional[str] = "Sehore"
    state: Optional[str] = "Madhya Pradesh"
    preferred_language: str = "hi"
    total_acres: Optional[float] = 5.0

class UserLogin(BaseModel):
    phone: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    name: str
    phone: str
    preferred_language: str

class UserProfileResponse(BaseModel):
    id: str
    name: str
    phone: str
    email: Optional[str] = None
    village: str
    district: str
    state: str
    kisan_credit_card_no: Optional[str] = None
    total_acres: float
    preferred_language: str
    is_admin: bool = False
    created_at: str

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    village: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = None
    kisan_credit_card_no: Optional[str] = None
    preferred_language: Optional[str] = None
    total_acres: Optional[float] = None

class PasswordResetRequest(BaseModel):
    phone: str

class PasswordResetConfirm(BaseModel):
    phone: str
    otp: str
    new_password: str

# ----------------- Farm & Plots Schemas -----------------
class FarmPlotCreate(BaseModel):
    name: str
    crop_type: str
    variety: Optional[str] = "Standard"
    acreage: float
    sowing_date: Optional[str] = None
    estimated_harvest_date: Optional[str] = None
    growth_stage: Optional[str] = "Vegetative"
    soil_type: Optional[str] = "Alluvial Loam"
    irrigation_type: Optional[str] = "Drip System"
    coordinates: Optional[List[List[float]]] = None
    notes: Optional[str] = None

class FarmPlotResponse(BaseModel):
    id: str
    user_id: str
    name: str
    crop_type: str
    variety: str
    acreage: float
    sowing_date: str
    estimated_harvest_date: str
    growth_stage: str
    soil_type: str
    irrigation_type: str
    health_score: int = 90
    moisture_percent: int = 38
    nitrogen_status: str = "Optimal"
    phosphorus_status: str = "Optimal"
    potassium_status: str = "Optimal"
    coordinates: List[List[float]] = []
    notes: Optional[str] = None
    created_at: str

# ----------------- Weather Schemas -----------------
class HourlyWeatherItem(BaseModel):
    time: str
    temp: float
    condition: str
    rain_chance: int
    icon: str

class DailyWeatherItem(BaseModel):
    day: str
    date: str
    min_temp: float
    max_temp: float
    condition: str
    rain_chance: int
    rainfall_mm: float
    spray_advisory: str

class WeatherResponse(BaseModel):
    location: str
    latitude: float
    longitude: float
    current_temp: float
    feels_like: float
    condition: str
    humidity: int
    wind_speed_kmh: float
    wind_direction: str
    rain_probability: int
    soil_temperature_c: float
    soil_moisture_percent: int
    evapotranspiration_mm: float
    uv_index: float
    spray_condition: str
    spray_advice_reason: str
    hourly: List[HourlyWeatherItem]
    daily: List[DailyWeatherItem]
    provider: str
    provider_timestamp: str
    retrieval_timestamp: str
    is_forecast_model: bool = True
    is_stale: bool = False

# ----------------- Mandi Schemas -----------------
class MandiPriceItem(BaseModel):
    id: str
    commodity: str
    commodity_hindi: str
    variety: str
    mandi_name: str
    district: str
    state: str
    modal_price: float
    min_price: float
    max_price: float
    price_change_percent: float
    arrivals_tonnes: float
    reported_date: str
    unit: str = "Rs/Quintal"
    data_source: str
    retrieval_timestamp: str
    freshness: str = "Official Daily Record"

class MandiPriceAlertCreate(BaseModel):
    commodity: str
    mandi_name: Optional[str] = None
    target_price: float
    alert_type: str = "ABOVE" # "ABOVE" or "BELOW"

class MandiRecordCitation(BaseModel):
    mandi_name: str
    district: str
    state: str
    commodity: str
    variety: Optional[str] = None
    min_price: float
    modal_price: float
    max_price: float
    unit: str = "Rs/Quintal"
    reported_date: str
    retrieval_timestamp: str
    source_name: str
    source_url: str = "https://agmarknet.gov.in"
    msp_benchmark: Optional[float] = None
    msp_difference: Optional[float] = None

class WebSearchCitation(BaseModel):
    title: str
    url: str
    snippet: str
    source_name: str
    published_date: Optional[str] = None
    extracted_content: Optional[str] = None

class MandiAskRequest(BaseModel):
    query: str
    language: str = "en"
    commodity: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    mandi_name: Optional[str] = None
    history: Optional[List[Dict[str, str]]] = None

class MandiAskResponse(BaseModel):
    id: str
    reply: str
    reply_language: str
    detected_commodity: Optional[str] = None
    detected_location: Optional[str] = None
    records: List[MandiRecordCitation] = []
    web_citations: List[WebSearchCitation] = []
    search_queries_used: List[str] = []
    msp_info: Optional[Dict[str, Any]] = None
    suggested_follow_ups: List[str] = []
    timestamp: str
    grounding_status: str

# ----------------- Crop Health Diagnostics -----------------
class AlternativeDiagnosisItem(BaseModel):
    disease_name: str
    disease_hindi: Optional[str] = None
    confidence_score: float
    scientific_pathogen: Optional[str] = None

class ChemicalDetailItem(BaseModel):
    product_name: str
    active_ingredient: str
    formulation: str
    dosage: str
    pre_harvest_interval_days: int
    ppe_required: List[str]
    frac_code: Optional[str] = None
    precautions: Optional[str] = None

class CropDiagnosisResponse(BaseModel):
    id: str
    crop_name: str
    plant_scientific_name: Optional[str] = None
    crop_category: Optional[str] = None
    plant_part: Optional[str] = "Foliar Leaf"
    is_plant_detected: bool = True
    is_healthy: bool = False
    disease_name: str
    disease_hindi: str
    scientific_pathogen: str
    severity: str
    confidence_score: float
    affected_leaf_area_percent: int
    alternative_diagnoses: List[AlternativeDiagnosisItem] = []
    visible_signs: List[str] = []
    contributing_environmental_factors: List[str] = []
    immediate_actions: List[str] = []
    symptoms: List[str]
    symptoms_hindi: List[str]
    organic_remedy: List[str]
    organic_remedy_hindi: List[str]
    chemical_remedy: List[str]
    chemical_remedy_hindi: List[str]
    chemical_details: List[ChemicalDetailItem] = []
    preventive_measures: List[str]
    recommended_spray_window: str
    ai_explanation: Optional[str] = None
    diagnostic_limitations: Optional[str] = None
    image_url: str
    scanned_at: str
    uncertainty_note: Optional[str] = None
    model_version: str = "AgriVision-Vision-Pathology-v2.5"

# ----------------- Crop Calendar Tasks -----------------
class TaskCreate(BaseModel):
    title: str
    title_hindi: Optional[str] = None
    crop: str
    plot_name: str
    due_date: str
    category: str = "Irrigation"
    priority: str = "Medium"

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    title_hindi: Optional[str] = None
    crop: Optional[str] = None
    plot_name: Optional[str] = None
    due_date: Optional[str] = None
    category: Optional[str] = None
    priority: Optional[str] = None
    is_completed: Optional[bool] = None

class TaskResponse(BaseModel):
    id: str
    user_id: str
    title: str
    title_hindi: Optional[str] = None
    crop: str
    plot_name: str
    due_date: str
    category: str
    priority: str
    is_completed: bool = False
    created_at: str

class CropCalendarPlanRequest(BaseModel):
    crop: str = "Wheat"
    variety: Optional[str] = None
    sowing_date: str = "2026-11-12"
    location: Optional[str] = "Sehore"
    state: Optional[str] = "Madhya Pradesh"
    district: Optional[str] = "Sehore"
    plot_name: Optional[str] = "North Terrace Field"
    acreage: Optional[float] = 3.5
    soil_type: Optional[str] = "Alluvial Loam"
    irrigation_type: Optional[str] = "Sprinkler"

# ----------------- Government Schemes -----------------
class SchemeResponse(BaseModel):
    id: str
    scheme_code: str
    title: str
    title_hindi: str
    ministry: str
    short_description: str
    short_description_hindi: str
    target_beneficiaries: str
    financial_benefit: str
    eligibility_criteria: List[str]
    required_documents: List[str]
    official_portal_url: str
    application_deadline: str
    category: str
    verified_source_url: str
    last_verified_date: str

class EligibilityCheckRequest(BaseModel):
    landholding_acres: float
    state: str
    category: Optional[str] = None
    crop: Optional[str] = None
    has_kcc: bool = True
    has_aadhaar_bank_linked: bool = True

class EligibilityCheckResponse(BaseModel):
    eligible_schemes: List[SchemeResponse]
    potential_financial_benefit: str
    notes: List[str]

# ----------------- AI Assistant & RAG -----------------
class CitationItem(BaseModel):
    title: str
    source_url: str
    organization: str
    section: Optional[str] = None
    last_verified: str

class ChatQueryRequest(BaseModel):
    query: str
    language: Optional[str] = "en"
    farm_context: Optional[bool] = True
    history: Optional[List[Dict[str, str]]] = None
    file_url: Optional[str] = None
    file_name: Optional[str] = None
    file_type: Optional[str] = None
    extracted_text: Optional[str] = None

class ChatQueryResponse(BaseModel):
    id: str
    reply: str
    reply_language: str
    detected_language: Optional[str] = None
    citations: List[CitationItem] = []
    web_citations: List[WebSearchCitation] = []
    search_queries_used: List[str] = []
    grounding_status: str
    intent_detected: Optional[str] = None
    document_info: Optional[Dict[str, Any]] = None
    image_info: Optional[Dict[str, Any]] = None
    suggested_follow_ups: List[str] = []
    timestamp: str

# ----------------- Video Academy -----------------
class VideoItem(BaseModel):
    id: str
    youtube_video_id: str
    title: str
    category: str
    channel_name: str
    instructor_name: Optional[str] = None
    duration: str
    views_count: str
    published_date: str
    thumbnail_url: str
    is_institution_verified: bool
    source_channel_url: str

# ----------------- Languages Capability -----------------
class LanguageCapabilityItem(BaseModel):
    code: str
    name_english: str
    name_native: str
    script: str
    text_input_supported: bool
    text_output_supported: bool
    mixed_language_supported: bool
    ui_translations_supported: bool
    speech_recognition_supported: bool
    text_to_speech_supported: bool
    status_note: str

class LanguageCapabilitiesResponse(BaseModel):
    supported_languages_count: int
    languages: List[LanguageCapabilityItem]

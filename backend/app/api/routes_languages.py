from typing import Dict
from fastapi import APIRouter, Query
from app.models.schemas import LanguageCapabilitiesResponse
from app.services.language_service import get_language_capabilities, get_ui_translations_for_lang

router = APIRouter(prefix="/languages", tags=["Multilingual Capability Matrix & Localization"])

@router.get("", response_model=LanguageCapabilitiesResponse)
async def list_supported_languages():
    """Returns the capability matrix for all 14 supported Indian and regional languages."""
    return get_language_capabilities()

@router.get("/translations")
async def get_ui_translations(lang: str = Query("hi")):
    """Returns the UI localization dictionary for navigation and key labels."""
    return {
        "language": lang,
        "translations": get_ui_translations_for_lang(lang)
    }

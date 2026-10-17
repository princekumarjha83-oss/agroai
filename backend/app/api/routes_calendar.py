from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, Any

from app.models.schemas import CropCalendarPlanRequest
from app.services.crop_calendar_service import (
    calculate_crop_calendar_plan,
    get_available_crops_and_varieties
)
from app.core.security import get_current_user_payload

router = APIRouter(prefix="/calendar", tags=["Crop Phenology & Agronomy Calendar"])

@router.get("/crops")
async def get_crops_and_varieties():
    """Returns all supported crops, varieties with durations, and soil types."""
    return get_available_crops_and_varieties()

@router.post("/plan")
async def get_dynamic_crop_plan(
    req: CropCalendarPlanRequest,
    current_user: dict = Depends(get_current_user_payload)
) -> Dict[str, Any]:
    """
    Calculates dynamic crop phenology timeline, stage dates from sowing date,
    variety duration, Open-Meteo weather correlations, irrigation advice,
    and stage-specific nutrient management.
    """
    plan = await calculate_crop_calendar_plan(
        crop=req.crop,
        variety=req.variety,
        sowing_date_str=req.sowing_date,
        location=req.location or "Sehore",
        state=req.state or "Madhya Pradesh",
        district=req.district or "Sehore",
        plot_name=req.plot_name or "North Terrace Field",
        acreage=req.acreage or 3.5,
        soil_type=req.soil_type or "Alluvial Loam",
        irrigation_type=req.irrigation_type or "Sprinkler"
    )
    return plan

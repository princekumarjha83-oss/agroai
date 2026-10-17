from typing import List, Optional
from fastapi import APIRouter, Query, Depends, HTTPException, status
from app.models.schemas import (
    MandiPriceItem, 
    MandiPriceAlertCreate, 
    MandiAskRequest, 
    MandiAskResponse
)
from app.services.mandi_service import fetch_mandi_prices, ask_mandi_price_intelligence_ai
from app.core.security import get_optional_user_payload
from app.core.database import get_db_client

router = APIRouter(prefix="/mandi", tags=["APMC Mandi Price Intelligence"])

@router.get("", response_model=List[MandiPriceItem])
@router.get("/prices", response_model=List[MandiPriceItem])
async def get_mandi_prices(
    search: Optional[str] = Query(None, description="Search keyword for commodity, district, or market"),
    commodity: Optional[str] = Query(None, description="Filter by crop commodity"),
    state: Optional[str] = Query(None, description="Filter by Indian state")
):
    """Retrieves official APMC Mandi price records with modal rates, range, and arrivals."""
    return await fetch_mandi_prices(search=search, commodity=commodity, state=state)

@router.post("/ask", response_model=MandiAskResponse)
async def ask_mandi_advisor(req: MandiAskRequest):
    """Conversational AI Market Advisor with live backend Agmarknet retrieval and official MSP benchmarks."""
    return await ask_mandi_price_intelligence_ai(
        query=req.query,
        language=req.language,
        commodity=req.commodity,
        state=req.state,
        district=req.district,
        mandi_name=req.mandi_name,
        history=req.history
    )

@router.post("/alerts", status_code=status.HTTP_201_CREATED)
async def create_price_alert(
    alert_data: MandiPriceAlertCreate,
    current_user: Optional[dict] = Depends(get_optional_user_payload)
):
    db = await get_db_client()
    user_id = current_user["sub"] if current_user else "anonymous"
    alert_doc = {
        "user_id": user_id,
        "commodity": alert_data.commodity,
        "mandi_name": alert_data.mandi_name,
        "target_price": alert_data.target_price,
        "alert_type": alert_data.alert_type,
        "is_active": True
    }
    await db.insert_one("mandi_cache", alert_doc)
    return {
        "status": "success",
        "message": f"Price alert configured for {alert_data.commodity} at ₹{alert_data.target_price}/qtl."
    }

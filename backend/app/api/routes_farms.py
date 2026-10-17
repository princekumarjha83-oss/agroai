import uuid
from datetime import datetime, timezone
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from app.models.schemas import FarmPlotCreate, FarmPlotResponse
from app.core.security import get_current_user_payload
from app.core.database import get_db_client

router = APIRouter(prefix="/farms", tags=["Farm & Plot Management"])

SEED_PLOTS = [
    {
        "id": "plot-1",
        "user_id": "farmer-001",
        "name": "North Terrace Field (उत्तरी खेत)",
        "crop_type": "Wheat (Sharbati GW-322)",
        "variety": "GW-322 High Yield",
        "acreage": 3.5,
        "sowing_date": "2026-11-12",
        "estimated_harvest_date": "2027-03-25",
        "growth_stage": "Tillering",
        "soil_type": "Alluvial Loam",
        "irrigation_type": "Sprinkler",
        "health_score": 92,
        "moisture_percent": 38,
        "nitrogen_status": "Optimal",
        "phosphorus_status": "Optimal",
        "potassium_status": "Optimal",
        "coordinates": [[23.2045, 77.0851], [23.2062, 77.0864], [23.2058, 77.0885], [23.2039, 77.0872]],
        "notes": "First CRI top dressing with neem-coated urea scheduled.",
        "created_at": "2026-11-12T00:00:00Z"
    },
    {
        "id": "plot-2",
        "user_id": "farmer-001",
        "name": "Canal Ridge Basin (नहर किनारा)",
        "crop_type": "Mustard (Pusa Bold)",
        "variety": "Pusa Bold Drought Tolerant",
        "acreage": 2.2,
        "sowing_date": "2026-10-20",
        "estimated_harvest_date": "2027-02-18",
        "growth_stage": "Flowering",
        "soil_type": "Black Clay",
        "irrigation_type": "Drip System",
        "health_score": 86,
        "moisture_percent": 29,
        "nitrogen_status": "Low",
        "phosphorus_status": "Optimal",
        "potassium_status": "Optimal",
        "coordinates": [[23.2075, 77.0892], [23.2089, 77.0911], [23.2078, 77.0924], [23.2061, 77.0905]],
        "notes": "Aphid scouting required as weather warms up.",
        "created_at": "2026-10-20T00:00:00Z"
    }
]

@router.get("", response_model=List[FarmPlotResponse])
async def list_my_farms(current_user: dict = Depends(get_current_user_payload)):
    user_id = current_user["sub"]
    db = await get_db_client()
    plots = await db.find("farms", {"user_id": user_id})
    if not plots and user_id == "farmer-001":
        plots = SEED_PLOTS
    return [FarmPlotResponse(**p) for p in plots]

@router.post("", response_model=FarmPlotResponse, status_code=status.HTTP_201_CREATED)
async def create_farm_plot(plot_data: FarmPlotCreate, current_user: dict = Depends(get_current_user_payload)):
    user_id = current_user["sub"]
    db = await get_db_client()
    
    new_plot = {
        "id": f"plot-{uuid.uuid4().hex[:8]}",
        "user_id": user_id,
        "name": plot_data.name,
        "crop_type": plot_data.crop_type,
        "variety": plot_data.variety or "Standard",
        "acreage": plot_data.acreage,
        "sowing_date": plot_data.sowing_date or datetime.now(timezone.utc).strftime("%Y-%m-%d"),
        "estimated_harvest_date": plot_data.estimated_harvest_date or "2027-03-31",
        "growth_stage": plot_data.growth_stage or "Tillering",
        "soil_type": plot_data.soil_type or "Alluvial Loam",
        "irrigation_type": plot_data.irrigation_type or "Drip System",
        "health_score": 90,
        "moisture_percent": 35,
        "nitrogen_status": "Optimal",
        "phosphorus_status": "Optimal",
        "potassium_status": "Optimal",
        "coordinates": plot_data.coordinates or [[23.2045, 77.0851], [23.2062, 77.0864], [23.2058, 77.0885], [23.2039, 77.0872]],
        "notes": plot_data.notes,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.insert_one("farms", new_plot)
    return FarmPlotResponse(**new_plot)

@router.delete("/{plot_id}")
async def delete_farm_plot(plot_id: str, current_user: dict = Depends(get_current_user_payload)):
    user_id = current_user["sub"]
    db = await get_db_client()
    
    # Enforce strict user isolation: User A cannot delete User B's plot
    plot = await db.find_one("farms", {"id": plot_id})
    if plot and plot.get("user_id") != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: You cannot modify a farm plot belonging to another farmer."
        )
        
    await db.delete_one("farms", {"id": plot_id, "user_id": user_id})
    return {"status": "success", "message": f"Plot {plot_id} deleted."}

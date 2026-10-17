import pytest
from datetime import date, timedelta
from fastapi.testclient import TestClient
from app.main import app
from app.services.crop_calendar_service import (
    calculate_crop_calendar_plan,
    get_available_crops_and_varieties,
    CROP_AGRONOMY_DATABASE
)

client = TestClient(app)

@pytest.mark.asyncio
async def test_available_crops_and_varieties():
    crops = get_available_crops_and_varieties()
    assert "Wheat" in crops
    assert "Mustard" in crops
    assert "Tomato" in crops
    assert "Rice" in crops
    assert "Maize" in crops
    assert "Gram / Chickpea" in crops

    wheat_varieties = [v["name"] for v in crops["Wheat"]["varieties"]]
    assert "GW-322 High Yield" in wheat_varieties
    assert "HD-2967" in wheat_varieties

@pytest.mark.asyncio
async def test_wheat_dynamic_phenology_plan():
    # Sowing date set to 22 days ago -> CRI stage should be active
    sowing_dt = (date.today() - timedelta(days=22)).isoformat()
    plan = await calculate_crop_calendar_plan(
        crop="Wheat",
        variety="GW-322 High Yield",
        sowing_date_str=sowing_dt,
        plot_name="North Terrace Field",
        soil_type="Alluvial Loam",
        irrigation_type="Sprinkler"
    )

    assert plan["crop"] == "Wheat"
    assert plan["duration_days"] == 125
    assert plan["days_after_sowing"] == 22
    assert len(plan["stages"]) >= 6
    
    # Check that CRI stage (Day 20-25) is active
    cri_stage = next(s for s in plan["stages"] if s["stage_number"] == 2)
    assert cri_stage["status"] == "In Progress (Active)"
    assert "Mandatory 1st Irrigation" in cri_stage["irrigation_advice"]

    # Recommended tasks generated
    assert len(plan["recommended_tasks"]) > 0
    categories = [t["category"] for t in plan["recommended_tasks"]]
    assert "Irrigation" in categories

@pytest.mark.asyncio
async def test_mustard_phenology_and_agronomic_rules():
    sowing_dt = (date.today() - timedelta(days=50)).isoformat()
    plan = await calculate_crop_calendar_plan(
        crop="Mustard",
        variety="Pusa Bold Drought Tolerant",
        sowing_date_str=sowing_dt,
        plot_name="Canal Ridge Basin",
        soil_type="Black Clay",
        irrigation_type="Drip System"
    )

    assert plan["crop"] == "Mustard"
    assert plan["duration_days"] == 125
    
    # Check flowering stage rule: avoid flood irrigation during bloom
    flowering_stage = next(s for s in plan["stages"] if s["stage_number"] == 4)
    assert "Avoid flood irrigation" in flowering_stage["irrigation_advice"]

@pytest.mark.asyncio
async def test_tomato_non_msp_and_staking():
    sowing_dt = (date.today() - timedelta(days=25)).isoformat()
    plan = await calculate_crop_calendar_plan(
        crop="Tomato",
        variety="Abhinav (Syngenta)",
        sowing_date_str=sowing_dt,
        plot_name="Polyhouse Block A"
    )

    assert plan["crop"] == "Tomato"
    # Stage 2 is vegetative & staking
    st2 = next(s for s in plan["stages"] if s["stage_number"] == 2)
    assert "Staking" in st2["name"] or "staking" in st2["agronomic_action"].lower()

from app.core.security import create_access_token

def get_auth_headers():
    token = create_access_token({"sub": "farmer-001"})
    return {"Authorization": f"Bearer {token}"}

def test_api_calendar_crops_endpoint():
    response = client.get("/api/calendar/crops")
    assert response.status_code == 200
    data = response.json()
    assert "Wheat" in data
    assert "Mustard" in data

def test_api_calendar_plan_endpoint():
    payload = {
        "crop": "Wheat",
        "variety": "GW-322 High Yield",
        "sowing_date": "2026-11-12",
        "plot_name": "North Terrace Field",
        "acreage": 3.5,
        "soil_type": "Alluvial Loam",
        "irrigation_type": "Sprinkler"
    }
    response = client.post("/api/calendar/plan", json=payload, headers=get_auth_headers())
    assert response.status_code == 200
    data = response.json()
    assert data["crop"] == "Wheat"
    assert "stages" in data
    assert len(data["stages"]) >= 6
    assert "irrigation_advisory" in data
    assert "nutrient_advisory" in data

def test_tasks_crud_endpoints():
    headers = get_auth_headers()
    # 1. Create Task
    create_payload = {
        "title": "Check Soil Moisture in Zone B",
        "crop": "Wheat GW-322",
        "plot_name": "North Terrace Field",
        "due_date": "2026-10-25",
        "category": "Irrigation",
        "priority": "High"
    }
    res_create = client.post("/api/tasks", json=create_payload, headers=headers)
    assert res_create.status_code == 201
    task_data = res_create.json()
    task_id = task_data["id"]
    assert task_data["title"] == "Check Soil Moisture in Zone B"

    # 2. Toggle Task
    res_toggle = client.patch(f"/api/tasks/{task_id}/toggle", headers=headers)
    assert res_toggle.status_code == 200
    assert res_toggle.json()["is_completed"] is True

    # 3. Update Task
    res_update = client.put(f"/api/tasks/{task_id}", json={"priority": "Low", "due_date": "2026-10-28"}, headers=headers)
    assert res_update.status_code == 200
    assert res_update.json()["priority"] == "Low"

    # 4. Delete Task
    res_del = client.delete(f"/api/tasks/{task_id}", headers=headers)
    assert res_del.status_code == 200

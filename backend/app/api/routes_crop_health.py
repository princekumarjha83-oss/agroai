import os
import uuid
import shutil
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status, Depends
from app.models.schemas import CropDiagnosisResponse
from app.services.crop_health_service import analyze_leaf_image, ask_crop_agronomist_ai
from app.core.security import get_optional_user_payload
from app.core.database import get_db_client
from app.core.config import settings

router = APIRouter(prefix="/crop-health", tags=["Crop Health Pathology AI"])

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}

class CropAskRequest(BaseModel):
    query: str
    language: Optional[str] = "en"
    crop_name: Optional[str] = None
    disease_name: Optional[str] = None
    severity: Optional[str] = None
    history: Optional[List[Dict[str, str]]] = None

@router.post("/analyze", response_model=CropDiagnosisResponse)
@router.post("/diagnosis", response_model=CropDiagnosisResponse)
async def analyze_crop_leaf(
    image: UploadFile = File(...),
    crop_hint: Optional[str] = Form("Auto-Detect"),
    language: Optional[str] = Form("en"),
    current_user: Optional[dict] = Depends(get_optional_user_payload)
):
    """Validates leaf photo, runs pathology vision inference, and returns ICAR remediation."""
    ext = os.path.splitext(image.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file format '{ext}'. Allowed image extensions: JPG, JPEG, PNG, WEBP."
        )

    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    file_id = f"leaf-{uuid.uuid4().hex[:10]}{ext}"
    saved_path = os.path.join(settings.UPLOAD_DIR, file_id)

    try:
        with open(saved_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process upload: {e}")

    try:
        diagnosis = analyze_leaf_image(saved_path, target_crop_hint=crop_hint, language=language or "en")
    except Exception as e:
        if os.path.exists(saved_path):
            os.remove(saved_path)
        raise HTTPException(status_code=400, detail=str(e))

    # Persist analysis report
    user_id = current_user["sub"] if current_user else "farmer-001"
    db = await get_db_client()
    doc = diagnosis.model_dump()
    doc["user_id"] = user_id
    await db.insert_one("crop_analyses", doc)

    return diagnosis

@router.post("/ask")
async def ask_plant_doctor_assistant(
    req: CropAskRequest,
    current_user: Optional[dict] = Depends(get_optional_user_payload)
):
    """Real-time universal plant doctor AI chat assistant (like ChatGPT / Groq / Gemini)."""
    return await ask_crop_agronomist_ai(
        query=req.query,
        language=req.language or "en",
        crop_name=req.crop_name,
        disease_name=req.disease_name,
        severity=req.severity,
        history=req.history
    )

@router.get("/history", response_model=List[CropDiagnosisResponse])
async def get_my_diagnostic_history(current_user: Optional[dict] = Depends(get_optional_user_payload)):
    user_id = current_user["sub"] if current_user else "farmer-001"
    db = await get_db_client()
    records = await db.find("crop_analyses", {"user_id": user_id}, limit=30)
    return [CropDiagnosisResponse(**r) for r in records]


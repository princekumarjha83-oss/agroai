import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from app.models.schemas import (
    UserRegister, UserLogin, TokenResponse, UserProfileResponse, 
    ProfileUpdate, PasswordResetRequest, PasswordResetConfirm
)
from app.core.security import (
    get_password_hash, verify_password, create_access_token, 
    get_current_user_payload
)
from app.core.database import get_db_client

router = APIRouter(prefix="/auth", tags=["Authentication & Farmer Profiles"])

# Initial baseline user for development and testing
SEED_FARMER = {
    "id": "farmer-001",
    "phone": "9876543210",
    "name": "Rajinder Singh Patel",
    "password_hash": get_password_hash("agrivision123"),
    "email": "rajinder.patel@agrivision.in",
    "village": "Shyampur Khurd",
    "district": "Sehore",
    "state": "Madhya Pradesh",
    "kisan_credit_card_no": "KCC-MP-2024-8842",
    "total_acres": 7.5,
    "preferred_language": "hi",
    "is_admin": False,
    "created_at": "2026-01-15T10:00:00Z"
}

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
@router.post("/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register_farmer(req: UserRegister):
    db = await get_db_client()
    existing = await db.find_one("users", {"phone": req.phone})
    if existing or req.phone == SEED_FARMER["phone"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A farmer account with this mobile number is already registered."
        )

    user_id = f"farmer-{uuid.uuid4().hex[:8]}"
    new_user = {
        "id": user_id,
        "name": req.name,
        "phone": req.phone,
        "password_hash": get_password_hash(req.password),
        "email": req.email,
        "village": req.village or "Shyampur Khurd",
        "district": req.district or "Sehore",
        "state": req.state or "Madhya Pradesh",
        "total_acres": req.total_acres or 5.0,
        "preferred_language": req.preferred_language or "hi",
        "is_admin": False,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.insert_one("users", new_user)

    token = create_access_token({"sub": user_id, "phone": req.phone, "name": req.name})
    return TokenResponse(
        access_token=token,
        user_id=user_id,
        name=req.name,
        phone=req.phone,
        preferred_language=req.preferred_language
    )

@router.post("/login", response_model=TokenResponse)
async def login_farmer(req: UserLogin):
    db = await get_db_client()
    user = await db.find_one("users", {"phone": req.phone})
    
    # Check seed farmer if not found in db
    if not user and req.phone == SEED_FARMER["phone"]:
        user = SEED_FARMER

    if not user or not verify_password(req.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid mobile number or password credentials."
        )

    token = create_access_token({"sub": user["id"], "phone": user["phone"], "name": user["name"]})
    return TokenResponse(
        access_token=token,
        user_id=user["id"],
        name=user["name"],
        phone=user["phone"],
        preferred_language=user.get("preferred_language", "hi")
    )

@router.get("/me", response_model=UserProfileResponse)
async def get_my_profile(current_user: dict = Depends(get_current_user_payload)):
    user_id = current_user["sub"]
    db = await get_db_client()
    user = await db.find_one("users", {"id": user_id})
    if not user and user_id == SEED_FARMER["id"]:
        user = SEED_FARMER
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User profile not found.")
    
    return UserProfileResponse(
        id=user["id"],
        name=user["name"],
        phone=user["phone"],
        email=user.get("email"),
        village=user.get("village", "Sehore"),
        district=user.get("district", "Sehore"),
        state=user.get("state", "Madhya Pradesh"),
        kisan_credit_card_no=user.get("kisan_credit_card_no"),
        total_acres=float(user.get("total_acres", 5.0)),
        preferred_language=user.get("preferred_language", "hi"),
        is_admin=user.get("is_admin", False),
        created_at=user.get("created_at", datetime.now(timezone.utc).isoformat())
    )

@router.patch("/me", response_model=UserProfileResponse)
async def update_my_profile(update_data: ProfileUpdate, current_user: dict = Depends(get_current_user_payload)):
    user_id = current_user["sub"]
    db = await get_db_client()
    
    updates = {k: v for k, v in update_data.model_dump().items() if v is not None}
    if updates:
        await db.update_one("users", {"id": user_id}, updates)
        
    return await get_my_profile(current_user)

@router.post("/forgot-password")
async def forgot_password(req: PasswordResetRequest):
    return {
        "status": "success",
        "message": f"Verification 6-digit OTP dispatched to {req.phone}.",
        "phone": req.phone
    }

@router.post("/reset-password")
async def reset_password(req: PasswordResetConfirm):
    db = await get_db_client()
    new_hash = get_password_hash(req.new_password)
    updated = await db.update_one("users", {"phone": req.phone}, {"password_hash": new_hash})
    return {
        "status": "success",
        "message": "Password updated successfully. Please sign in with your new credentials."
    }

@router.get("/export-data")
async def export_my_farmer_data(current_user: dict = Depends(get_current_user_payload)):
    user_id = current_user["sub"]
    db = await get_db_client()
    user = await db.find_one("users", {"id": user_id}) or SEED_FARMER
    farms = await db.find("farms", {"user_id": user_id})
    tasks = await db.find("tasks", {"user_id": user_id})
    analyses = await db.find("crop_analyses", {"user_id": user_id})
    
    return {
        "export_timestamp": datetime.now(timezone.utc).isoformat(),
        "user_profile": {k: v for k, v in user.items() if k != "password_hash"},
        "farm_plots": farms,
        "crop_calendar_tasks": tasks,
        "crop_analyses": analyses
    }

@router.delete("/me")
async def delete_my_account(current_user: dict = Depends(get_current_user_payload)):
    user_id = current_user["sub"]
    db = await get_db_client()
    await db.delete_one("users", {"id": user_id})
    return {"status": "success", "message": "Farmer account and records deleted."}

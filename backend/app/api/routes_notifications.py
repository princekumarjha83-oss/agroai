from datetime import datetime, timezone
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends
from app.core.security import get_optional_user_payload
from app.core.database import get_db_client

router = APIRouter(prefix="/notifications", tags=["Farm Alerts & Notifications"])

SEED_NOTIFICATIONS = [
    {
        "id": "notif-1",
        "title": "Favorable Spray Advisory Window",
        "title_hindi": "कीटनाशक छिड़काव के लिए अनुकूल मौसम",
        "message": "Optimal morning window (07:00 - 10:30 AM). Low wind speed (<10 km/h) and moderate humidity recorded for Sehore district.",
        "message_hindi": "सुबह 07:00 से 10:30 बजे तक छिड़काव का सबसे अनुकूल समय है। हवा की गति 10 किमी/घंटा से कम है।",
        "category": "Weather Alert",
        "priority": "Info",
        "timestamp": "35 mins ago",
        "read": False,
        "action_url": "/weather"
    },
    {
        "id": "notif-2",
        "title": "Sharbati Wheat Prices Rose +2.8% in Sehore Mandi",
        "title_hindi": "सीहोर मंडी में शरबती गेहूं के भाव में 2.8% की बढ़त",
        "message": "Modal price touched ₹2,840/qtl due to strong flour mill procurement demand. 420 tonnes arrivals reported today.",
        "message_hindi": "सीहोर मंडी में भाव ₹2,840 प्रति क्विंटल पहुंचा। आज 420 टन आवक दर्ज की गई।",
        "category": "Mandi Price",
        "priority": "Info",
        "timestamp": "2 hours ago",
        "read": False,
        "action_url": "/mandi"
    },
    {
        "id": "notif-3",
        "title": "PM-KISAN e-KYC Verification Reminder",
        "title_hindi": "पीएम-किसान ई-केवाईसी सत्यापन सूचना",
        "message": "Ensure OTP-based or biometric e-KYC is linked with your Aadhaar before the upcoming DBT disbursement tranche.",
        "message_hindi": "आगामी 17वीं किस्त के लिए अपने आधार से ई-केवाईसी सत्यापन पूर्ण कर लें।",
        "category": "Government Scheme",
        "priority": "Warning",
        "timestamp": "1 day ago",
        "read": True,
        "action_url": "/schemes"
    }
]

@router.get("")
async def get_my_notifications(current_user: Optional[dict] = Depends(get_optional_user_payload)):
    user_id = current_user["sub"] if current_user else "farmer-001"
    db = await get_db_client()
    notifs = await db.find("notifications", {"user_id": user_id})
    if not notifs:
        return SEED_NOTIFICATIONS
    return notifs

@router.post("/mark-all-read")
async def mark_all_notifications_read(current_user: Optional[dict] = Depends(get_optional_user_payload)):
    user_id = current_user["sub"] if current_user else "farmer-001"
    db = await get_db_client()
    for n in SEED_NOTIFICATIONS:
        n["read"] = True
    return {"status": "success", "message": "All notifications marked as read."}

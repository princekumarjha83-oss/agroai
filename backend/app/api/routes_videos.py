from typing import List, Optional
from fastapi import APIRouter, Query, Depends
from app.models.schemas import VideoItem
from app.services.video_service import search_agriculture_videos
from app.core.security import get_optional_user_payload
from app.core.database import get_db_client

router = APIRouter(prefix="/videos", tags=["Hindi Agriculture Video Academy"])

@router.get("", response_model=List[VideoItem])
async def get_videos(
    category: Optional[str] = Query(None),
    query: Optional[str] = Query(None)
):
    """Retrieves verified extension tutorials via YouTube API v3 or verified institutional catalog."""
    return await search_agriculture_videos(category=category, query=query)

@router.post("/bookmarks/{video_id}")
async def bookmark_video(
    video_id: str,
    current_user: dict = Depends(get_optional_user_payload)
):
    db = await get_db_client()
    user_id = current_user["sub"] if current_user else "farmer-001"
    doc = {"user_id": user_id, "video_id": video_id, "type": "bookmark"}
    await db.insert_one("video_interactions", doc)
    return {"status": "success", "message": f"Video {video_id} bookmarked."}

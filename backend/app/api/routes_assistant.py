import os
import json
import uuid
from typing import Optional, List
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
import httpx

from app.models.schemas import ChatQueryRequest, ChatQueryResponse
from app.services.ai_assistant_service import generate_assistant_response
from app.core.security import get_optional_user_payload
from app.core.database import get_db_client
from app.core.config import settings

router = APIRouter(prefix="/assistant", tags=["Multilingual Krishi AI Assistant"])

@router.post("/chat", response_model=ChatQueryResponse)
async def chat_with_agri_assistant(
    req: ChatQueryRequest,
    current_user: dict = Depends(get_optional_user_payload)
):
    """Answers general and agronomy questions in user's language using live tools and RAG evidence."""
    response = await generate_assistant_response(
        query=req.query,
        language=req.language or "auto",
        farm_context=req.farm_context if req.farm_context is not None else True,
        history=req.history,
        extracted_text=req.extracted_text
    )

    # Save to user's conversation history
    try:
        db = await get_db_client()
        user_id = current_user["sub"] if current_user else "anonymous"
        chat_doc = response.model_dump()
        chat_doc["user_id"] = user_id
        chat_doc["user_query"] = req.query
        await db.insert_one("chat_messages", chat_doc)
    except Exception as e:
        print(f"[AssistantRoute] Error persisting chat history: {e}")

    return response

@router.post("/upload-chat", response_model=ChatQueryResponse)
async def chat_with_file_upload(
    query: str = Form(...),
    language: Optional[str] = Form("auto"),
    farm_context: Optional[bool] = Form(True),
    history_json: Optional[str] = Form(None),
    file: UploadFile = File(...),
    current_user: dict = Depends(get_optional_user_payload)
):
    """Handles multimodal chat requests with uploaded images (JPG, PNG, WebP) or documents (PDF, TXT, DOCX, CSV)."""
    # 1. Validate file size and type
    file_bytes = await file.read()
    if len(file_bytes) > settings.MAX_UPLOAD_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"Uploaded file exceeds maximum limit of {settings.MAX_UPLOAD_SIZE_BYTES // (1024*1024)} MB."
        )

    # 2. Parse history if sent as JSON string
    history_list = None
    if history_json:
        try:
            history_list = json.loads(history_json)
        except Exception:
            history_list = None

    # 3. Process multimodal assistant response
    response = await generate_assistant_response(
        query=query,
        language=language or "auto",
        farm_context=farm_context,
        history=history_list,
        file_bytes=file_bytes,
        filename=file.filename,
        file_type=file.content_type
    )

    # 4. Save to user's conversation history
    try:
        db = await get_db_client()
        user_id = current_user["sub"] if current_user else "anonymous"
        chat_doc = response.model_dump()
        chat_doc["user_id"] = user_id
        chat_doc["user_query"] = query
        chat_doc["attached_filename"] = file.filename
        await db.insert_one("chat_messages", chat_doc)
    except Exception as e:
        print(f"[AssistantRoute] Error persisting upload chat: {e}")

    return response

@router.post("/voice/transcribe")
async def transcribe_voice_audio(
    audio: UploadFile = File(...),
    language: Optional[str] = Form(None),
    current_user: dict = Depends(get_optional_user_payload)
):
    """Transcribes audio using Groq Whisper model (whisper-large-v3) with browser fallback."""
    if not settings.GROQ_API_KEY or "gsk_" not in settings.GROQ_API_KEY:
        return {"transcript": "", "error": "Speech recognition backend not configured. Using browser speech recognition."}

    audio_bytes = await audio.read()
    if not audio_bytes:
        raise HTTPException(status_code=400, detail="Empty audio payload")

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            files = {
                "file": (audio.filename or "recording.webm", audio_bytes, audio.content_type or "audio/webm")
            }
            data = {
                "model": "whisper-large-v3"
            }
            if language and language != "auto":
                data["language"] = language

            resp = await client.post(
                "https://api.groq.com/openai/v1/audio/transcriptions",
                headers={"Authorization": f"Bearer {settings.GROQ_API_KEY}"},
                files=files,
                data=data
            )
            if resp.status_code == 200:
                result = resp.json()
                return {"transcript": result.get("text", "").strip()}
            else:
                return {"transcript": "", "error": f"Transcription error: {resp.text}"}
    except Exception as e:
        return {"transcript": "", "error": f"Speech processing exception: {str(e)}"}

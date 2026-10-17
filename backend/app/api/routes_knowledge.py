from typing import List, Optional
from fastapi import APIRouter, Query
from app.services.rag_service import RAG_KNOWLEDGE_DOCUMENTS, retrieve_rag_documents

router = APIRouter(prefix="/knowledge-base", tags=["Agronomy Knowledge Base & RAG Index"])

@router.get("")
async def search_knowledge_base(query: Optional[str] = Query(None)):
    """Retrieves verified ICAR agricultural manuals, packages of practices, and citations."""
    if query:
        return retrieve_rag_documents(query, max_results=10)
    return [
        {
            "id": d["id"],
            "title": d["title"],
            "organization": d["organization"],
            "section": d.get("section"),
            "source_url": d["source_url"],
            "last_verified": d["last_verified"],
            "summary": d["content"][:200] + "..."
        }
        for d in RAG_KNOWLEDGE_DOCUMENTS
    ]

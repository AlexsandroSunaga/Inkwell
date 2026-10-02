from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.db import get_db
from src.orm_models import ChatMessage, ChatSession, Chunk, Document

router = APIRouter(tags=["analytics"])


@router.get("/analytics")
def analytics(db: Session = Depends(get_db)) -> dict:
    doc_count = db.query(Document).count()
    chunk_count = db.query(Chunk).count()
    session_count = db.query(ChatSession).count()
    message_count = db.query(ChatMessage).count()
    user_messages = db.query(ChatMessage).filter(ChatMessage.role == "user").count()
    return {
        "documents": doc_count,
        "chunks": chunk_count,
        "sessions": session_count,
        "messages": message_count,
        "userMessages": user_messages,
        "avgChunksPerDoc": round(chunk_count / doc_count, 1) if doc_count else 0,
    }

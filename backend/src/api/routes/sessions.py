import json

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from src.db import get_db
from src.orm_models import ChatMessage, ChatSession

router = APIRouter(tags=["sessions"])


@router.get("/sessions")
def list_sessions(db: Session = Depends(get_db)) -> list[dict]:
    rows = db.query(ChatSession).order_by(ChatSession.created_at.desc()).limit(50).all()
    return [{"id": s.id, "title": s.title, "createdAt": s.created_at.isoformat()} for s in rows]


@router.get("/sessions/{session_id}/messages")
def session_messages(session_id: int, db: Session = Depends(get_db)) -> list[dict]:
    rows = (
        db.query(ChatMessage)
        .filter(ChatMessage.session_id == session_id)
        .order_by(ChatMessage.id.asc())
        .all()
    )
    return [
        {
            "id": m.id,
            "role": m.role,
            "content": m.content,
            "citations": json.loads(m.citations_json or "[]"),
        }
        for m in rows
    ]


@router.delete("/sessions/{session_id}")
def delete_session(session_id: int, db: Session = Depends(get_db)) -> dict:
    row = db.get(ChatSession, session_id)
    if not row:
        raise HTTPException(404, "Session not found")
    db.delete(row)
    return {"deleted": session_id}

import json
import logging

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.config import settings
from app.db import get_db
from app.models import ChatMessage, ChatSession
from app.schemas.chat import ChatRequest
from app.services import local_mode
from app.services.openai_client import openai_client
from app.services.retrieval import citations_payload, retrieve

router = APIRouter(tags=["chat"])
logger = logging.getLogger("inkwell.chat")


@router.post("/chat")
async def chat(body: ChatRequest, db: Session = Depends(get_db)) -> dict:
    message = body.message.strip()
    if not message:
        raise HTTPException(400, "message required")

    session = db.get(ChatSession, body.sessionId) if body.sessionId else None
    if not session:
        session = ChatSession(title=message[:60])
        db.add(session)
        db.flush()

    db.add(ChatMessage(session_id=session.id, role="user", content=message))
    db.flush()

    use_openai = bool(settings.openai_api_key)
    query_vec = (await openai_client.embed([message]))[0] if use_openai else local_mode.embed([message])[0]
    hits = retrieve(db, query_vec, top_k=5)
    context = "\n\n".join(f"[{i+1}] {h['text']}" for i, h in enumerate(hits))
    system = (
        "You are Halden Labs's internal knowledge assistant. Answer only from sources. "
        "Cite with [1], [2], etc. If unknown, say so."
    )
    user = f"Sources:\n{context}\n\nQuestion: {message}"
    answer = await openai_client.chat(system, user) if use_openai else local_mode.compose_answer(message, hits)

    cites = citations_payload(hits)
    db.add(
        ChatMessage(
            session_id=session.id,
            role="assistant",
            content=answer,
            citations_json=cites,
        )
    )
    logger.info("chat_complete session=%s citations=%s", session.id, len(hits))
    return {
        "sessionId": session.id,
        "mode": "openai" if use_openai else "local",
        "answer": answer,
        "citations": json.loads(cites),
        "retrieval": hits,
    }

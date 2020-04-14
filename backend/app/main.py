import json
from pathlib import Path

from fastapi import Depends, FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.config import settings
from app.db import embedding_to_json, get_db, init_db
from app.models import ChatMessage, ChatSession, Chunk, Document
from app.services.ingest import chunk_text, extract_text
from app.services.openai_client import openai_client
from app.services.retrieval import citations_payload, retrieve

app = FastAPI(title="ACME Knowledge API", version="2.0.0")

origins = [o.strip() for o in settings.cors_origins.split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    Path("data").mkdir(exist_ok=True)
    init_db()


class ChatRequest(BaseModel):
    sessionId: int | None = None
    message: str


@app.get("/health")
def health() -> dict:
    return {
        "status": "ok",
        "openaiConfigured": bool(settings.openai_api_key),
        "chatModel": settings.openai_chat_model,
        "embedModel": settings.openai_embed_model,
    }


@app.get("/integrations")
def integrations() -> dict:
    return {
        "providers": [
            {
                "name": "OpenAI",
                "purpose": "Embeddings + chat completions",
                "docs": "https://platform.openai.com/docs",
                "configured": bool(settings.openai_api_key),
            }
        ]
    }


@app.get("/documents")
def list_documents(db: Session = Depends(get_db)) -> list[dict]:
    docs = db.query(Document).order_by(Document.created_at.desc()).all()
    return [
        {
            "id": d.id,
            "title": d.title,
            "filename": d.filename,
            "chunkCount": len(d.chunks),
            "createdAt": d.created_at.isoformat(),
        }
        for d in docs
    ]


@app.delete("/documents/{doc_id}")
def delete_document(doc_id: int, db: Session = Depends(get_db)) -> dict:
    doc = db.get(Document, doc_id)
    if not doc:
        raise HTTPException(404, "Document not found")
    db.delete(doc)
    return {"deleted": doc_id}


@app.post("/documents/upload")
async def upload_document(file: UploadFile = File(...), db: Session = Depends(get_db)) -> dict:
    if not settings.openai_api_key:
        raise HTTPException(503, "OPENAI_API_KEY required for ingestion (embeddings)")
    raw = await file.read()
    text = extract_text(file.filename or "upload.txt", raw)
    if not text:
        raise HTTPException(400, "No text extracted from file")
    pieces = chunk_text(text)
    vectors = await openai_client.embed(pieces)
    doc = Document(title=file.filename or "Untitled", filename=file.filename or "upload.txt")
    db.add(doc)
    db.flush()
    for i, (piece, vec) in enumerate(zip(pieces, vectors)):
        db.add(
            Chunk(
                document_id=doc.id,
                idx=i,
                text=piece,
                embedding_json=embedding_to_json(vec),
            )
        )
    return {"documentId": doc.id, "chunks": len(pieces)}


@app.get("/analytics")
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


@app.delete("/sessions/{session_id}")
def delete_session(session_id: int, db: Session = Depends(get_db)) -> dict:
    row = db.get(ChatSession, session_id)
    if not row:
        raise HTTPException(404, "Session not found")
    db.delete(row)
    return {"deleted": session_id}


@app.get("/sessions")
def list_sessions(db: Session = Depends(get_db)) -> list[dict]:
    rows = db.query(ChatSession).order_by(ChatSession.created_at.desc()).limit(50).all()
    return [{"id": s.id, "title": s.title, "createdAt": s.created_at.isoformat()} for s in rows]


@app.get("/sessions/{session_id}/messages")
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


@app.post("/chat")
async def chat(body: ChatRequest, db: Session = Depends(get_db)) -> dict:
    if not body.message.strip():
        raise HTTPException(400, "message required")
    if not settings.openai_api_key:
        raise HTTPException(503, "OPENAI_API_KEY required")

    session = db.get(ChatSession, body.sessionId) if body.sessionId else None
    if not session:
        session = ChatSession(title=body.message[:60])
        db.add(session)
        db.flush()

    db.add(ChatMessage(session_id=session.id, role="user", content=body.message))
    db.flush()

    query_vec = (await openai_client.embed([body.message]))[0]
    hits = retrieve(db, query_vec, top_k=5)
    context = "\n\n".join(f"[{i+1}] {h['text']}" for i, h in enumerate(hits))
    system = (
        "You are ACME Corp's internal knowledge assistant. Answer only from sources. "
        "Cite with [1], [2], etc. If unknown, say so."
    )
    user = f"Sources:\n{context}\n\nQuestion: {body.message}"
    answer = await openai_client.chat(system, user)

    cites = citations_payload(hits)
    db.add(
        ChatMessage(
            session_id=session.id,
            role="assistant",
            content=answer,
            citations_json=cites,
        )
    )
    return {
        "sessionId": session.id,
        "answer": answer,
        "citations": json.loads(cites),
        "retrieval": hits,
    }

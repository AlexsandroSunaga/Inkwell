import logging

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from src.config.manager import get_settings
from src.db import embedding_to_json, get_db
from src.orm_models import Chunk, Document
from src.services.ingest import chunk_text, extract_text
from src.services.openai_client import openai_client

router = APIRouter(tags=["documents"])
logger = logging.getLogger("acme.knowledge.documents")


@router.get("/documents")
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


@router.delete("/documents/{doc_id}")
def delete_document(doc_id: int, db: Session = Depends(get_db)) -> dict:
    doc = db.get(Document, doc_id)
    if not doc:
        raise HTTPException(404, "Document not found")
    db.delete(doc)
    logger.info("document_deleted id=%s", doc_id)
    return {"deleted": doc_id}


@router.post("/documents/upload")
async def upload_document(file: UploadFile = File(...), db: Session = Depends(get_db)) -> dict:
    if not get_settings().openai_api_key:
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
    logger.info("document_ingested id=%s chunks=%s", doc.id, len(pieces))
    return {"documentId": doc.id, "chunks": len(pieces)}

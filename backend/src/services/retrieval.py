import json

from sqlalchemy.orm import Session

from src.db import cosine_similarity, embedding_from_json
from src.orm_models import Chunk


def retrieve(db: Session, query_embedding: list[float], top_k: int = 5) -> list[dict]:
    rows = db.query(Chunk).all()
    scored: list[tuple[float, Chunk]] = []
    for row in rows:
        emb = embedding_from_json(row.embedding_json)
        scored.append((cosine_similarity(query_embedding, emb), row))
    scored.sort(key=lambda x: x[0], reverse=True)
    out = []
    for score, row in scored[:top_k]:
        if score <= 0:
            continue
        out.append(
            {
                "chunkId": row.id,
                "documentId": row.document_id,
                "score": round(score, 4),
                "text": row.text,
            }
        )
    return out


def citations_payload(chunks: list[dict]) -> str:
    return json.dumps(
        [
            {
                "chunkId": c["chunkId"],
                "documentId": c["documentId"],
                "excerpt": c["text"][:320],
            }
            for c in chunks
        ]
    )

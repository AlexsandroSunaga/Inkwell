"""Load the sample documents on first start so the product is not an empty shell."""
import logging
from pathlib import Path

from sqlalchemy.orm import Session

from app.config import settings
from app.db import embedding_to_json
from app.models import Chunk, Document
from app.services import local_mode
from app.services.ingest import chunk_text, extract_text
from app.services.openai_client import openai_client

logger = logging.getLogger("inkwell.seed")
SAMPLE_DIR = Path(__file__).resolve().parent.parent / "sample_docs"


async def seed_sample_documents(db: Session) -> int:
    """Add the sample documents when the knowledge base is empty. Returns how many were added."""
    if db.query(Document).count() > 0:
        return 0
    added = 0
    for path in sorted(SAMPLE_DIR.glob("*.md")):
        text = extract_text(path.name, path.read_bytes())
        pieces = chunk_text(text)
        try:
            vectors = await openai_client.embed(pieces) if settings.openai_api_key else local_mode.embed(pieces)
        except Exception:  # a failed API call must not stop the app from starting
            logger.exception("seed_failed file=%s", path.name)
            continue
        title = path.stem.replace("-", " ").title()
        doc = Document(title=title, filename=path.name)
        db.add(doc)
        db.flush()
        for index, (piece, vec) in enumerate(zip(pieces, vectors)):
            db.add(Chunk(document_id=doc.id, idx=index, text=piece, embedding_json=embedding_to_json(vec)))
        added += 1
    db.commit()
    logger.info("seeded_sample_documents count=%s", added)
    return added

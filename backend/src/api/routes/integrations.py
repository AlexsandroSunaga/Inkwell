import os

from fastapi import APIRouter

router = APIRouter(prefix="/integrations", tags=["integrations"])


@router.get("/status")
def integration_status():
    return {
        "openai": {"enabled": bool(os.getenv("OPENAI_API_KEY"))},
        "pinecone": {"enabled": bool(os.getenv("PINECONE_API_KEY"))},
        "s3": {"enabled": bool(os.getenv("AWS_ACCESS_KEY_ID"))},
    }

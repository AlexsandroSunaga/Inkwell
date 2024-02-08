from fastapi import APIRouter

from app.config import settings

router = APIRouter(tags=["health"])


@router.get("/health")
def health() -> dict:
    return {
        "status": "ok",
        "version": "2.1.0",
        "openaiConfigured": bool(settings.openai_api_key),
        "chatModel": settings.openai_chat_model,
        "embedModel": settings.openai_embed_model,
    }


@router.get("/integrations")
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

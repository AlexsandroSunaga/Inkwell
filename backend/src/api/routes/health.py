from fastapi import APIRouter

from src.config.manager import get_settings

router = APIRouter(tags=["health"])


@router.get("/health")
def health() -> dict:
    settings = get_settings()
    return {
        "status": "ok",
        "version": settings.app_version,
        "openaiConfigured": bool(settings.openai_api_key),
        "chatModel": settings.openai_chat_model,
        "embedModel": settings.openai_embed_model,
    }


@router.get("/integrations")
def integrations() -> dict:
    settings = get_settings()
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

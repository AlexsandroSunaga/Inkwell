import logging
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.api.middleware.request_id import RequestIdMiddleware
from src.api.router import api_router
from src.config.manager import get_settings
from src.db import init_db
from src.utilities.logging import configure_logging

logger = logging.getLogger("acme.knowledge")


@asynccontextmanager
async def lifespan(_: FastAPI):
    settings = get_settings()
    configure_logging("INFO")
    Path("data").mkdir(exist_ok=True)
    init_db()
    logger.info("ACME Knowledge API ready (openai=%s)", bool(settings.openai_api_key))
    yield


def create_application() -> FastAPI:
    settings = get_settings()
    app = FastAPI(title=settings.app_name, version=settings.app_version, lifespan=lifespan)
    app.add_middleware(RequestIdMiddleware)
    origins = [o.strip() for o in settings.cors_origins.split(",") if o.strip()]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins or ["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.include_router(api_router)
    return app


backend_app = create_application()

import logging
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router
from app.config import settings
from app.core.logging import configure_logging
from app.db import init_db
from app.middleware.request_id import RequestIdMiddleware

logger = logging.getLogger("inkwell")


@asynccontextmanager
async def lifespan(_: FastAPI):
    configure_logging("INFO")
    Path("data").mkdir(exist_ok=True)
    init_db()
    logger.info("Inkwell API ready (openai=%s)", bool(settings.openai_api_key))
    yield


app = FastAPI(title="Inkwell API", version="2.1.0", lifespan=lifespan)
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

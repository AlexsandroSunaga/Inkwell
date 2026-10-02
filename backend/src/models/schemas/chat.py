from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    sessionId: int | None = None
    message: str = Field(min_length=1, max_length=8000)

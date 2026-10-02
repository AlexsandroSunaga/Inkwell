import httpx

from src.config.manager import get_settings


class OpenAIClient:
    def __init__(self) -> None:
        self.base = "https://api.openai.com/v1"

    @property
    def key(self) -> str:
        return get_settings().openai_api_key

    def _headers(self) -> dict[str, str]:
        if not self.key:
            raise RuntimeError("OPENAI_API_KEY is not configured")
        return {"Authorization": f"Bearer {self.key}"}

    async def embed(self, texts: list[str]) -> list[list[float]]:
        async with httpx.AsyncClient(timeout=60.0) as client:
            res = await client.post(
                f"{self.base}/embeddings",
                headers=self._headers(),
                json={"model": get_settings().openai_embed_model, "input": texts},
            )
            res.raise_for_status()
            data = res.json()
            return [row["embedding"] for row in data["data"]]

    async def chat(self, system: str, user: str) -> str:
        async with httpx.AsyncClient(timeout=90.0) as client:
            res = await client.post(
                f"{self.base}/chat/completions",
                headers=self._headers(),
                json={
                    "model": get_settings().openai_chat_model,
                    "temperature": 0.2,
                    "messages": [
                        {"role": "system", "content": system},
                        {"role": "user", "content": user},
                    ],
                },
            )
            res.raise_for_status()
            data = res.json()
            return data["choices"][0]["message"]["content"]


openai_client = OpenAIClient()

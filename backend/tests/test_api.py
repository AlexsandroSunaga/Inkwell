import asyncio

from app.config import settings
from app.db import SessionLocal, cosine_similarity
from app.services import local_mode
from app.services.ingest import chunk_text
from app.services.openai_client import openai_client
from app.services.seed import seed_sample_documents

POLICY = (
    b"Annual leave: every full-time employee gets 25 days of paid vacation per year. "
    b"Unused days up to 5 can be carried over into the next year. "
    b"Expenses: submit expense claims within 30 days with a receipt."
)


def test_health_reports_local_mode_without_a_key(client):
    r = client.get("/health")
    assert r.status_code == 200
    body = r.json()
    assert body["status"] == "ok"
    assert body["openaiConfigured"] is False
    assert body["mode"] == "local"


def test_integrations_lists_openai_unconfigured(client):
    providers = client.get("/integrations").json()["providers"]
    assert providers[0]["name"] == "OpenAI"
    assert providers[0]["configured"] is False


def test_documents_and_analytics_empty_state(client):
    assert client.get("/documents").json() == []
    stats = client.get("/analytics").json()
    assert stats["documents"] == 0
    assert stats["avgChunksPerDoc"] == 0


def test_upload_and_cited_answer_in_local_mode(client):
    up = client.post("/documents/upload", files={"file": ("handbook.txt", POLICY, "text/plain")})
    assert up.status_code == 200
    assert up.json()["chunks"] >= 1

    r = client.post("/chat", json={"message": "How many vacation days do I get?"})
    assert r.status_code == 200
    body = r.json()
    assert body["mode"] == "local"
    assert "25 days" in body["answer"]
    assert "[1]" in body["answer"]
    assert body["citations"] and body["retrieval"][0]["score"] > 0
    assert client.get("/analytics").json()["userMessages"] >= 1


def test_question_with_no_match_says_so(client):
    r = client.post("/chat", json={"message": "Who won the football match yesterday?"})
    assert r.status_code == 200
    assert "could not find" in r.json()["answer"].lower()
    assert r.json()["citations"] == []


def test_empty_upload_is_rejected(client):
    r = client.post("/documents/upload", files={"file": ("empty.txt", b"   ", "text/plain")})
    assert r.status_code == 400


def test_chat_validation_errors(client):
    assert client.post("/chat", json={"message": ""}).status_code == 422
    assert client.post("/chat", json={}).status_code == 422
    assert client.post("/chat", json={"message": "   "}).status_code == 400


def test_delete_missing_document_is_404(client):
    assert client.delete("/documents/99999").status_code == 404


def test_openai_path_is_used_when_a_key_is_set(client, monkeypatch):
    calls = {"embed": 0, "chat": 0}

    async def fake_embed(texts):
        calls["embed"] += 1
        return [[1.0, 0.0, 0.0] for _ in texts]

    async def fake_chat(system, user):
        calls["chat"] += 1
        return "Answer written by the model."

    monkeypatch.setattr(settings, "openai_api_key", "test-key")
    monkeypatch.setattr(openai_client, "embed", fake_embed)
    monkeypatch.setattr(openai_client, "chat", fake_chat)

    assert client.get("/health").json()["mode"] == "openai"
    r = client.post("/chat", json={"message": "Anything at all"})
    assert r.status_code == 200
    assert r.json()["mode"] == "openai"
    assert r.json()["answer"] == "Answer written by the model."
    assert calls == {"embed": 1, "chat": 1}


def test_sample_documents_are_seeded_into_an_empty_knowledge_base(client):
    for doc in client.get("/documents").json():
        client.delete(f"/documents/{doc['id']}")
    with SessionLocal() as db:
        assert asyncio.run(seed_sample_documents(db)) == 3
        assert asyncio.run(seed_sample_documents(db)) == 0  # not seeded twice
    titles = {d["title"] for d in client.get("/documents").json()}
    assert {"Employee Handbook", "Security Policy", "Refund Policy"} <= titles
    r = client.post("/chat", json={"message": "How soon must I report a lost laptop?"})
    assert "1 hour" in r.json()["answer"]


def test_chunking_and_similarity_helpers():
    chunks = chunk_text("word " * 600, size=800, overlap=120)
    assert len(chunks) > 1
    assert all(len(c) <= 800 for c in chunks)
    assert chunk_text("   ") == []
    assert cosine_similarity([1, 0], [1, 0]) == 1.0
    assert cosine_similarity([1, 0], [0, 1]) == 0.0
    assert cosine_similarity([0, 0], [1, 1]) == 0.0


def test_vectors_of_different_models_are_never_compared():
    assert cosine_similarity([1.0, 0.0], [1.0, 0.0, 0.0]) == 0.0
    vec = local_mode.embed(["vacation days per year"])[0]
    assert len(vec) == local_mode.DIM
    assert abs(sum(v * v for v in vec) - 1.0) < 1e-6

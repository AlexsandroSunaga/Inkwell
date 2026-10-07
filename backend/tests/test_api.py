from app.db import cosine_similarity
from app.services.ingest import chunk_text


def test_health_reports_openai_not_configured(client):
    r = client.get("/health")
    assert r.status_code == 200
    body = r.json()
    assert body["status"] == "ok"
    assert body["openaiConfigured"] is False


def test_integrations_lists_openai_unconfigured(client):
    providers = client.get("/integrations").json()["providers"]
    assert providers[0]["name"] == "OpenAI"
    assert providers[0]["configured"] is False


def test_documents_and_analytics_empty_state(client):
    assert client.get("/documents").json() == []
    stats = client.get("/analytics").json()
    assert stats["documents"] == 0
    assert stats["avgChunksPerDoc"] == 0


def test_upload_without_key_degrades_to_503(client):
    r = client.post("/documents/upload", files={"file": ("a.txt", b"hello world", "text/plain")})
    assert r.status_code == 503
    assert "OPENAI_API_KEY" in r.json()["detail"]


def test_chat_without_key_degrades_to_503(client):
    r = client.post("/chat", json={"message": "What is the refund policy?"})
    assert r.status_code == 503


def test_chat_validation_errors(client):
    assert client.post("/chat", json={"message": ""}).status_code == 422
    assert client.post("/chat", json={}).status_code == 422
    assert client.post("/chat", json={"message": "   "}).status_code == 400


def test_delete_missing_document_is_404(client):
    assert client.delete("/documents/99999").status_code == 404


def test_chunking_and_similarity_helpers():
    chunks = chunk_text("word " * 600, size=800, overlap=120)
    assert len(chunks) > 1
    assert all(len(c) <= 800 for c in chunks)
    assert chunk_text("   ") == []
    assert cosine_similarity([1, 0], [1, 0]) == 1.0
    assert cosine_similarity([1, 0], [0, 1]) == 0.0
    assert cosine_similarity([0, 0], [1, 1]) == 0.0

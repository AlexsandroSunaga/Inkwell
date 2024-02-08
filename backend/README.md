# ACME Knowledge API (FastAPI)

Product backend: documents, embeddings, chat sessions, OpenAI integration.

**Layout:** `app/api/routes/*` (routers), `app/services/*` (RAG + ingest), `app/schemas/*` (Pydantic), request-id middleware, structured logging.

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload
```

Open http://127.0.0.1:8000/docs

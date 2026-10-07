# Inkwell

**RAG · LLM · semantic search · cited answers**

![Python](https://img.shields.io/badge/Python-3.11+-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-API-009688?logo=fastapi&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-embeddings%20%2B%20chat-412991)
![RAG](https://img.shields.io/badge/RAG-retrieval%20augmented-6366f1)
![Next.js](https://img.shields.io/badge/Next.js-15-000?logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-React-3178C6?logo=typescript&logoColor=white)
![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-SQLite-red)

Split **product** architecture: dedicated `frontend/` and `backend/` services.

**GitHub topics:** `rag`, `llm`, `openai`, `fastapi`, `embeddings`, `semantic-search`, `nextjs`, `sqlalchemy`

| Layer | Folder | Role |
|-------|--------|------|
| **Frontend** | `frontend/` | Next.js + React + Tailwind — marketing, dashboard, chat, documents, integrations |
| **Backend** | `backend/` | FastAPI — REST API, SQLAlchemy DB, ingestion, retrieval, chat |
| **Third-party** | OpenAI | Embeddings (`text-embedding-3-small`) + chat (`gpt-4o-mini`) via HTTPS API |


## Run locally

```bash
# Backend
cd backend
python -m venv .venv
.venv\Scripts\activate   # Windows
pip install -r requirements.txt
copy .env.example .env   # add OPENAI_API_KEY
uvicorn app.main:app --reload --app-dir .

# Frontend
cd ../frontend
npm install
copy .env.example .env.local
npm run dev
```

- UI: http://localhost:3000  
- API: http://localhost:8000/docs  

## Product features (v2 — senior UI)

- **Marketing**: hero, product browser mock, logo row, pricing block, FAQ
- **Shell**: grouped sidebar (workspace / intelligence / admin), collapse, **⌘K command palette** (`cmdk`), mobile drawer, breadcrumbs, notification menu
- **Overview**: review alerts, stuck-draft counters, recent audit feed
- **Assistant**: retrieval pipeline steps, suggestion chips, model selector, citation chips, **evidence inspector** with scores
- **Knowledge base**: category cards, ingest tab, table/grid toggle, bulk select, pagination, status badges
- **Analytics**: tabs (usage / corpus / **content gaps**), area + bar charts
- **Audit log** + **Team & roles** (sample data for enterprise workflows)
- **Settings** + **Integrations** (OpenAI status, server-side keys)
- **Backend**: FastAPI + SQLAlchemy + OpenAI embeddings/chat + `/analytics`

### UI references (patterns only — not copied assets)

- [satnaing/shadcn-admin](https://github.com/satnaing/shadcn-admin) — command menu, dense admin shell
- [shadcn sidebar + command block](https://www.shadcn.io/blocks/sidebar-with-command-menu) — ⌘K in sidebar
- [Help Desk Kit — KB screens](https://thefrontkit.com/docs/help-desk-kit/knowledge-base-screens) — categories, gaps, analytics
- [Refine KB admin use case](https://refine.dev/use-cases/customer-support/knowledge-base-admin/) — review queue, publishing status
- [RAG frontend architecture (React)](https://ai-powered-seo-audit.hashnode.dev/rag-frontend-architecture-react-tailwind-motion) — 3-pane shell, retrieval status, source panel
- [Automatos chatbot UX PRD](https://docs.automatos.app/automatos-ai-docs/design-docs/prds/31-chatbot-ux-upgrade) — inspector, sources cards, tool traces

## Not included (typical client work)

Clerk/Auth0 SSO, Stripe billing, pgvector at scale, S3, multi-tenant RBAC — typically scoped per deployment.

## Deploy

- Frontend → Vercel (`NEXT_PUBLIC_API_URL` → your API host)
- Backend → Railway / Fly / Render with `OPENAI_API_KEY` + persistent volume for SQLite (or swap `DATABASE_URL` to Postgres)

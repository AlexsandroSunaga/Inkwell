import os
import sys
import tempfile
from pathlib import Path

# Isolate tests: no OpenAI key (graceful path), throwaway SQLite DB.
# Environment variables take precedence over any local .env file.
_tmp = tempfile.mkdtemp(prefix="inkwell-tests-")
os.environ["OPENAI_API_KEY"] = ""
os.environ["DATABASE_URL"] = f"sqlite:///{Path(_tmp, 'test.db').as_posix()}"

ROOT = Path(__file__).resolve().parent.parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

import pytest  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402

from app.main import app  # noqa: E402


@pytest.fixture(scope="session")
def client():
    with TestClient(app) as c:
        yield c

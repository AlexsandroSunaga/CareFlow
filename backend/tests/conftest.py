import os
import tempfile
from pathlib import Path

import pytest

# Isolated cwd + DB so tests never touch backend/data
_tmp = tempfile.mkdtemp(prefix="careflow-test-")
os.chdir(_tmp)
os.environ["DATABASE_URL"] = f"sqlite+aiosqlite:///{Path(_tmp, 'test.db').as_posix()}"
os.environ["UPLOAD_DIR"] = str(Path(_tmp, "uploads"))
os.environ["REDACTED_DIR"] = str(Path(_tmp, "redacted"))


@pytest.fixture(scope="session")
def client():
    from fastapi.testclient import TestClient
    from src.main import backend_app

    with TestClient(backend_app) as c:
        yield c


@pytest.fixture(scope="session")
def auth_headers(client):
    r = client.post("/api/v1/auth/login", json={"email": "admin@careflow.demo", "password": "CareflowDemo2026!"})
    assert r.status_code == 200, r.text
    return {"Authorization": f"Bearer {r.json()['access_token']}"}

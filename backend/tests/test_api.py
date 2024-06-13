def test_health(client):
    r = client.get("/api/v1/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"


def test_login_rejects_bad_password(client):
    r = client.post("/api/v1/auth/login", json={"email": "admin@careflow.demo", "password": "wrong"})
    assert r.status_code == 401


def test_login_and_me(client, auth_headers):
    r = client.get("/api/v1/auth/me", headers=auth_headers)
    assert r.status_code == 200
    assert r.json()["email"] == "admin@careflow.demo"


def test_departments_seeded(client, auth_headers):
    r = client.get("/api/v1/departments", headers=auth_headers)
    assert r.status_code == 200
    assert len(r.json()) >= 5


def test_command_overview(client, auth_headers):
    r = client.get("/api/v1/command/overview", headers=auth_headers)
    assert r.status_code == 200
    assert isinstance(r.json(), dict)

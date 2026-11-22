from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    res = client.get("/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "ok"
    assert data["data_mode"] == "mock"

def test_districts():
    res = client.get("/api/districts")
    assert res.status_code == 200
    districts = res.json()
    assert isinstance(districts, list)
    assert "Sangrur" in districts

def test_villages_list():
    res = client.get("/api/villages?district=Sangrur")
    assert res.status_code == 200
    villages = res.json()
    assert len(villages) == 12
    v1 = villages[0]
    assert v1["id"] == "VIL-PB-SAN-001"
    assert v1["is_sample"] is True
    assert "stress_score" in v1
    assert "low" in v1["stress_score"]

def test_village_single_found():
    res = client.get("/api/villages/VIL-PB-SAN-001")
    assert res.status_code == 200
    v = res.json()
    assert v["name"] == "Sample Village 01 (Bhawanigarh)"
    assert v["confidence"]["level"] in ["high", "medium", "low"]

def test_village_not_found():
    res = client.get("/api/villages/NON_EXISTENT")
    assert res.status_code == 404
    data = res.json()
    assert "error" in data["detail"]
    assert data["detail"]["code"] == "NOT_FOUND"

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

def test_forecast_endpoint():
    res = client.get("/api/villages/VIL-PB-SAN-001/forecast?season=2027-pre-summer")
    assert res.status_code == 200
    data = res.json()
    assert "water_level_bgl" in data
    assert data["water_level_bgl"]["unit"] == "m"
    assert "supply_ml" in data
    assert "demand_ml" in data
    assert "balance_ml" in data
    assert "history" in data
    assert "baseline_comparison" in data
    assert data["baseline_comparison"]["model_beats_baseline"] is True
    assert data["is_sample"] is True

def test_forecast_not_found():
    res = client.get("/api/villages/NON_EXISTENT/forecast")
    assert res.status_code == 404

def test_actions_endpoint():
    res = client.get("/api/villages/VIL-PB-SAN-001/actions?season=kharif")
    assert res.status_code == 200
    actions = res.json()
    assert len(actions) == 3
    assert actions[0]["rank"] == 1
    assert "expected_water_effect_ml" in actions[0]
    assert actions[0]["expected_water_effect_ml"]["unit"] == "ML"

def test_meta_endpoints():
    r1 = client.get("/api/meta/sources")
    assert r1.status_code == 200
    sources = r1.json()
    assert len(sources) >= 3

    r2 = client.get("/api/meta/crops")
    assert r2.status_code == 200
    crops_meta = r2.json()
    assert "crops" in crops_meta
    assert "paddy" in crops_meta["crops"]
    assert "maize" in crops_meta["crops"]

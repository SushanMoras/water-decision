from fastapi.testclient import TestClient
from app.main import app
from app.services.recommender import run_scenario
from app.schemas import ScenarioRequest

client = TestClient(app)

def test_scenario_math_and_logic():
    req = ScenarioRequest(
        village_id="VIL-PB-SAN-001",
        from_crop="paddy",
        to_crop="maize",
        shift_percent=20.0,
        season="kharif"
    )
    res = run_scenario(req)
    
    # 1. Verification of ranges
    assert res.water_saved_ml.low <= res.water_saved_ml.mid <= res.water_saved_ml.high
    assert res.water_saved_ml.unit == "ML"
    assert res.water_saved_ml.mid > 0.0  # Paddy to maize saves water
    
    assert res.income_change_inr.low <= res.income_change_inr.mid <= res.income_change_inr.high
    assert res.income_change_inr.unit == "INR"
    
    # 2. Shift percentage reflection
    assert res.shift_percent == 20.0
    assert len(res.notes) >= 2
    assert res.is_sample is True

def test_scenario_api_endpoints():
    # Valid call
    payload = {
        "village_id": "VIL-PB-SAN-001",
        "from_crop": "paddy",
        "to_crop": "maize",
        "shift_percent": 15.0,
        "season": "kharif"
    }
    r = client.post("/api/scenario", json=payload)
    assert r.status_code == 200
    data = r.json()
    assert "water_saved_ml" in data
    assert data["water_saved_ml"]["mid"] > 0

    # 422: Shift percent out of bounds (>100)
    invalid_pct = {**payload, "shift_percent": 125.0}
    r2 = client.post("/api/scenario", json=invalid_pct)
    assert r2.status_code == 422

    # 422: Unknown crop
    invalid_crop = {**payload, "to_crop": "non_existent_crop"}
    r3 = client.post("/api/scenario", json=invalid_crop)
    assert r3.status_code == 422
    assert "Unknown crop" in r3.json()["detail"]["error"]

    # 404: Non-existent village
    invalid_vil = {**payload, "village_id": "NON-EXISTENT-VIL"}
    r4 = client.post("/api/scenario", json=invalid_vil)
    assert r4.status_code == 404

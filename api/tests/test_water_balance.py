from app.services.water_balance import calculate_water_balance

def test_water_balance_calculation():
    sample_village = {
        "id": "VIL-TEST-001",
        "name": "Test Village",
        "area_ha": 600.0,
        "population": 2500,
        "crop_area_ha": {
            "paddy": 400.0,
            "maize": 50.0
        }
    }
    
    supply, demand, balance, notes = calculate_water_balance(sample_village)
    
    # 1. Units check
    assert supply.unit == "ML"
    assert demand.unit == "ML"
    assert balance.unit == "ML"
    
    # 2. Low <= Mid <= High ordering
    assert supply.low <= supply.mid <= supply.high
    assert demand.low <= demand.mid <= demand.high
    assert balance.low <= balance.mid <= balance.high
    
    # 3. Balance sign in over-exploited area (demand typically far exceeds supply in paddy belt)
    # Paddy alone: 400 ha * 1200 mm = 4,800,000 m3 = 4,800 ML demand
    assert demand.mid > 3000.0
    assert balance.mid < 0.0  # Deficit in over-exploited paddy zone
    
    # 4. Notes are returned as assumptions
    assert len(notes) >= 3

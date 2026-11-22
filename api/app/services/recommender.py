import json
import os
from typing import List, Dict, Any
from app.schemas import (
    ScenarioRequest,
    ScenarioResponse,
    Action,
    Range,
    Confidence,
    Source
)
from app.loaders.real_loader import get_loader
from app.services.water_balance import calculate_water_balance, load_crop_rules
from app.services.confidence import evaluate_confidence

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ACTIONS_PATH = os.path.join(BASE_DIR, "rules", "actions.json")
DISCLAIMER_TEXT = "Decision support, not a substitute for expert advice."

def load_actions_rules() -> List[Dict[str, Any]]:
    with open(ACTIONS_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def run_scenario(req: ScenarioRequest) -> ScenarioResponse:
    loader = get_loader()
    village = loader.get_village(req.village_id)
    if not village:
        raise ValueError(f"Village {req.village_id} not found")
        
    crop_rules = load_crop_rules()
    crops = crop_rules.get("crops", {})
    
    from_crop_key = req.from_crop.lower()
    to_crop_key = req.to_crop.lower()
    
    if from_crop_key not in crops:
        raise KeyError(f"Unknown crop: '{req.from_crop}'")
    if to_crop_key not in crops:
        raise KeyError(f"Unknown crop: '{req.to_crop}'")
        
    from_crop = crops[from_crop_key]
    to_crop = crops[to_crop_key]
    
    # Area allocated to from_crop
    crop_areas = village.get("crop_area_ha", {})
    from_area_ha = crop_areas.get(from_crop_key, crop_areas.get("paddy", 200.0))
    
    shift_ratio = req.shift_percent / 100.0
    shifted_area_ha = from_area_ha * shift_ratio
    
    # 1. Water saved (ML) = (from_demand - to_demand) * shifted_area_ha * 10 / 1000
    from_kc = from_crop.get("kc_season_total_mm", 1200.0)
    to_kc = to_crop.get("kc_season_total_mm", 550.0)
    delta_water_mm = max(0.0, from_kc - to_kc)
    
    mid_water_saved_ml = (delta_water_mm * shifted_area_ha * 10.0) / 1000.0
    water_saved = Range(
        low=round(mid_water_saved_ml * 0.85, 2),
        mid=round(mid_water_saved_ml, 2),
        high=round(mid_water_saved_ml * 1.15, 2),
        unit="ML"
    )
    
    # 2. Income change (INR) = (to_margin - from_margin) * shifted_area_ha
    from_margin = from_crop.get("margin_inr_per_ha", {})
    to_margin = to_crop.get("margin_inr_per_ha", {})
    
    mid_inc_diff = to_margin.get("mid", 45000.0) - from_margin.get("mid", 55000.0)
    low_inc_diff = to_margin.get("low", 30000.0) - from_margin.get("high", 70000.0)
    high_inc_diff = to_margin.get("high", 60000.0) - from_margin.get("low", 40000.0)
    
    income_change = Range(
        low=round(low_inc_diff * shifted_area_ha, 0),
        mid=round(mid_inc_diff * shifted_area_ha, 0),
        high=round(high_inc_diff * shifted_area_ha, 0),
        unit="INR"
    )
    
    # 3. New Balance
    _, _, current_bal, _ = calculate_water_balance(village, season=req.season)
    new_balance = Range(
        low=round(current_bal.low + water_saved.low, 2),
        mid=round(current_bal.mid + water_saved.mid, 2),
        high=round(current_bal.high + water_saved.high, 2),
        unit="ML"
    )
    
    notes = [
        f"Shift of {req.shift_percent}% ({shifted_area_ha:.1f} ha) from {req.from_crop} to {req.to_crop}.",
        f"Consumptive irrigation gap: {from_kc:.0f} mm vs {to_kc:.0f} mm per season.",
        "Margin calculations assume local mandi MSP and typical operational cultivation costs (subject to agronomic review)."
    ]
    
    conf_data = village.get("confidence", {})
    conf = evaluate_confidence(
        wells_used=conf_data.get("wells_used", 5),
        last_reading_date=conf_data.get("last_reading_date", "2026-08-15")
    )
    
    sources = [
        Source(
            name="FAO-56 Irrigation and Drainage Paper",
            url="https://www.fao.org/land-water/databases-and-software/cropwat",
            downloaded_on="2026-08-01",
            is_sample=village.get("is_sample", True)
        ),
        Source(
            name="Punjab Agricultural University Agronomy Package of Practices",
            url="https://www.pau.edu",
            downloaded_on="2026-08-01",
            is_sample=village.get("is_sample", True)
        )
    ]
    
    return ScenarioResponse(
        village_id=req.village_id,
        shift_percent=req.shift_percent,
        water_saved_ml=water_saved,
        income_change_inr=income_change,
        new_balance_ml=new_balance,
        notes=notes,
        confidence=conf,
        sources=sources,
        disclaimer=DISCLAIMER_TEXT,
        is_sample=village.get("is_sample", True)
    )

def get_top_actions(village_id: str, season: str = "kharif") -> List[Action]:
    loader = get_loader()
    village = loader.get_village(village_id)
    if not village:
        raise ValueError(f"Village {village_id} not found")
        
    raw_actions = load_actions_rules()
    actions: List[Action] = []
    
    for act in raw_actions:
        actions.append(Action(
            rank=act["rank"],
            title=act["title"],
            why=act["why"],
            expected_water_effect_ml=Range(**act["expected_water_effect_ml"]),
            cost_level=act["cost_level"],
            source=Source(**act["source"]),
            confidence=Confidence(**act["confidence"])
        ))
        
    return actions

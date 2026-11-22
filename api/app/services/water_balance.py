import json
import os
from typing import Dict, Any, Tuple
from app.schemas import Range

# Load crop and hydrological parameters
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RULES_PATH = os.path.join(BASE_DIR, "rules", "crops.json")

def load_crop_rules() -> Dict[str, Any]:
    with open(RULES_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def calculate_water_balance(
    village_data: Dict[str, Any],
    season: str = "kharif",
    rainfall_scenario: str = "normal"
) -> Tuple[Range, Range, Range, list[str]]:
    """Calculates supply, demand, and net water balance in Megalitres (ML).
    
    Formulas:
    1. Crop demand: ETc (mm) * area (ha) * 10 = m^3; / 1000 = ML.
    2. Domestic & Livestock: (pop * lpcd * days) / 1e6 ML.
    3. Supply: rainfall_mm * recharge_factor * total_area_ha * 10 / 1000 ML + groundwater storage adjustment.
    """
    rules = load_crop_rules()
    crops_cfg = rules.get("crops", {})
    domestic_lpcd = rules.get("domestic_lpcd", 70.0)
    livestock_lpcd = rules.get("livestock_lpcd", 50.0)
    recharge_factor = rules.get("recharge_factor", 0.12)
    
    notes: list[str] = [
        "Demand calculated using FAO-56 crop water requirement norms (ETc = Kc * ET0).",
        "Domestic & livestock allowance based on standard 70 LPCD & 50 LPCD per capita norms (awaiting expert validation).",
        "Recharge estimated using CGWB GEC-2015 methodology with 20th/50th/80th rainfall percentiles (+/-20% recharge coefficient)."
    ]
    
    area_ha = village_data.get("area_ha", 500.0)
    crop_area = village_data.get("crop_area_ha", {})
    population = village_data.get("population", 2000)
    
    # Season days
    season_days = 120  # standard Kharif / Rabi duration
    
    # 1. Agricultural Demand (ML)
    # Sum: area_ha * ETc_mm * 10 / 1000 = area_ha * ETc_mm / 100
    base_crop_demand_ml = 0.0
    for crop_name, c_area in crop_area.items():
        crop_info = crops_cfg.get(crop_name.lower(), {})
        kc_mm = crop_info.get("kc_season_total_mm", 600.0)
        demand_ml = (c_area * kc_mm * 10.0) / 1000.0
        base_crop_demand_ml += demand_ml
        
    # 2. Domestic & Livestock Demand (ML)
    domestic_ml = (population * domestic_lpcd * season_days) / 1e6
    livestock_count = population * 0.4  # estimated 0.4 livestock per person
    livestock_ml = (livestock_count * livestock_lpcd * season_days) / 1e6
    non_agri_demand_ml = domestic_ml + livestock_ml
    
    total_demand_mid = base_crop_demand_ml + non_agri_demand_ml
    demand_range = Range(
        low=round(total_demand_mid * 0.90, 2),
        mid=round(total_demand_mid, 2),
        high=round(total_demand_mid * 1.15, 2),
        unit="ML"
    )
    
    # 3. Supply (Rainfall Recharge + Return Flow)
    # Typical monsoon rainfall in Sangrur: 400 - 550 mm
    # 20th, 50th, 80th percentiles: ~320mm, 450mm, 580mm
    rain_p20, rain_p50, rain_p80 = 320.0, 450.0, 580.0
    rf_low, rf_mid, rf_high = recharge_factor * 0.8, recharge_factor, recharge_factor * 1.2
    
    supply_low = (rain_p20 * rf_low * area_ha * 10.0) / 1000.0
    supply_mid = (rain_p50 * rf_mid * area_ha * 10.0) / 1000.0
    supply_high = (rain_p80 * rf_high * area_ha * 10.0) / 1000.0
    
    # Add agricultural irrigation return flow (~15% of applied groundwater)
    supply_low += base_crop_demand_ml * 0.10
    supply_mid += base_crop_demand_ml * 0.15
    supply_high += base_crop_demand_ml * 0.20
    
    supply_range = Range(
        low=round(supply_low, 2),
        mid=round(supply_mid, 2),
        high=round(supply_high, 2),
        unit="ML"
    )
    
    # 4. Net Balance = Supply - Demand
    # Note: low balance occurs when supply is low and demand is high
    balance_low = round(supply_range.low - demand_range.high, 2)
    balance_mid = round(supply_range.mid - demand_range.mid, 2)
    balance_high = round(supply_range.high - demand_range.low, 2)
    
    balance_range = Range(
        low=balance_low,
        mid=balance_mid,
        high=balance_high,
        unit="ML"
    )
    
    return supply_range, demand_range, balance_range, notes

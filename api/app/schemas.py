from typing import Literal, List, Optional, Dict, Any
from pydantic import BaseModel, Field

class Range(BaseModel):
    low: float
    mid: float
    high: float
    unit: str  # "m", "mm", "ha", "INR", "%", "ML"

class Confidence(BaseModel):
    level: Literal["high", "medium", "low"]
    wells_used: int
    last_reading_date: Optional[str] = None  # ISO date
    reasons: List[str]

class Source(BaseModel):
    name: str
    url: str
    downloaded_on: Optional[str] = None
    is_sample: bool

class VillageSummary(BaseModel):
    id: str
    name: str
    block: str
    district: str
    lat: float
    lon: float
    stress_class: Literal["safe", "watch", "stressed", "critical", "unknown"]
    stress_score: Range  # 0-100 index
    confidence: Confidence
    is_sample: bool

class ForecastResponse(BaseModel):
    village_id: str
    season: str
    water_level_bgl: Range
    supply_ml: Range
    demand_ml: Range
    balance_ml: Range
    history: List[Dict[str, Any]]
    baseline_comparison: Dict[str, Any]
    confidence: Confidence
    sources: List[Source]
    disclaimer: str
    is_sample: bool

class ScenarioRequest(BaseModel):
    village_id: str
    from_crop: str
    to_crop: str
    shift_percent: float = Field(..., ge=0.0, le=100.0)
    season: str

class ScenarioResponse(BaseModel):
    village_id: str
    shift_percent: float
    water_saved_ml: Range
    income_change_inr: Range
    new_balance_ml: Range
    notes: List[str]
    confidence: Confidence
    sources: List[Source]
    disclaimer: str
    is_sample: bool

class Action(BaseModel):
    rank: int
    title: str
    why: str
    expected_water_effect_ml: Range
    cost_level: Literal["low", "medium", "high"]
    source: Source
    confidence: Confidence

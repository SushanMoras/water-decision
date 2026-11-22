from typing import List, Tuple
from app.schemas import Confidence

def evaluate_confidence(wells_used: int, last_reading_date: str | None = None, months_ago: float | None = None) -> Confidence:
    """Rules for Confidence.level:
    - high: 5+ wells within 10 km and last reading within 6 months
    - medium: 2-4 wells or last reading 6-18 months ago
    - low: fewer than 2 wells or older than 18 months
    """
    reasons: List[str] = []
    
    if months_ago is None:
        months_ago = 3.0  # default assumption for recent mock data
        
    # Check well density
    if wells_used >= 5:
        well_status = "high"
        reasons.append(f"{wells_used} observation wells within 10 km (dense coverage)")
    elif 2 <= wells_used < 5:
        well_status = "medium"
        reasons.append(f"{wells_used} observation wells within 10 km (moderate coverage)")
    else:
        well_status = "low"
        reasons.append(f"Only {wells_used} observation well(s) available (sparse coverage)")
        
    # Check recency
    if months_ago <= 6.0:
        recency_status = "high"
        reasons.append(f"Latest reading is recent (~{months_ago:.1f} months ago)")
    elif 6.0 < months_ago <= 18.0:
        recency_status = "medium"
        reasons.append(f"Latest reading is moderately aged (~{months_ago:.1f} months ago)")
    else:
        recency_status = "low"
        reasons.append(f"Latest reading is aged (>18 months ago)")
        
    # Combine (the lower of the two dictates or weighted)
    if well_status == "high" and recency_status == "high":
        level = "high"
    elif well_status == "low" or recency_status == "low":
        level = "low"
    else:
        level = "medium"
        
    return Confidence(
        level=level,
        wells_used=wells_used,
        last_reading_date=last_reading_date,
        reasons=reasons
    )

from fastapi import APIRouter
from typing import Dict, Any, List
from app.services.water_balance import load_crop_rules

router = APIRouter(prefix="/meta", tags=["metadata"])

@router.get("/sources")
def get_data_sources() -> List[Dict[str, Any]]:
    return [
        {
            "name": "Central Ground Water Board (CGWB) Ground Water Year Book & Manual Levels",
            "url": "https://indiawris.gov.in",
            "licence": "Government Open Data License - India (GODL)",
            "downloaded_on": "2026-08-20",
            "frequency": "Quarterly (Jan, May, Aug, Nov)",
            "spatial_resolution": "Observation well points",
            "is_sample": True
        },
        {
            "name": "National Water Data Portal (NWDP) Telemetry DWLR Series",
            "url": "https://nwdp.nwic.gov.in",
            "licence": "GODL-India",
            "downloaded_on": "2026-08-20",
            "frequency": "Six-hourly",
            "spatial_resolution": "Automated digital piezometers",
            "is_sample": True
        },
        {
            "name": "India Meteorological Department (IMD) District & Gridded Daily Rainfall",
            "url": "https://imdpune.gov.in",
            "licence": "Open Access / IMD Research License",
            "downloaded_on": "2026-08-20",
            "frequency": "Daily / Cumulative",
            "spatial_resolution": "0.25 deg x 0.25 deg grid",
            "is_sample": True
        },
        {
            "name": "FAO-56 Crop Evapotranspiration Guidelines",
            "url": "https://www.fao.org/land-water/databases-and-software/cropwat",
            "licence": "UN FAO Open Access",
            "downloaded_on": "2026-08-01",
            "frequency": "Static agronomic reference",
            "spatial_resolution": "Agro-ecological zones",
            "is_sample": True
        }
    ]

@router.get("/crops")
def get_crop_metadata() -> Dict[str, Any]:
    rules = load_crop_rules()
    return {
        "crops": rules.get("crops", {}),
        "needs_review": rules.get("needs_review", True),
        "source": rules.get("source", "")
    }

from fastapi import APIRouter, HTTPException, Query
from typing import List
from app.schemas import ForecastResponse, Action
from app.services.forecast import predict_groundwater
from app.services.recommender import get_top_actions

router = APIRouter(prefix="/villages", tags=["forecast & actions"])

@router.get("/{id}/forecast", response_model=ForecastResponse)
def get_village_forecast(id: str, season: str = Query("2027-pre-summer", description="Target forecast season")):
    try:
        return predict_groundwater(village_id=id, season=season)
    except ValueError as e:
        raise HTTPException(status_code=404, detail={"error": str(e), "code": "NOT_FOUND"})
    except FileNotFoundError as e:
        raise HTTPException(status_code=503, detail={"error": str(e), "code": "DATA_MISSING"})

@router.get("/{id}/actions", response_model=List[Action])
def get_village_actions(id: str, season: str = Query("kharif", description="Agricultural season")):
    try:
        return get_top_actions(village_id=id, season=season)
    except ValueError as e:
        raise HTTPException(status_code=404, detail={"error": str(e), "code": "NOT_FOUND"})
    except FileNotFoundError as e:
        raise HTTPException(status_code=503, detail={"error": str(e), "code": "DATA_MISSING"})

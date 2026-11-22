from fastapi import APIRouter, HTTPException
from app.schemas import ScenarioRequest, ScenarioResponse
from app.services.recommender import run_scenario

router = APIRouter(prefix="/scenario", tags=["scenario"])

@router.post("", response_model=ScenarioResponse)
def evaluate_scenario(req: ScenarioRequest):
    try:
        return run_scenario(req)
    except ValueError as e:
        raise HTTPException(status_code=404, detail={"error": str(e), "code": "NOT_FOUND"})
    except KeyError as e:
        raise HTTPException(status_code=422, detail={"error": str(e), "code": "BAD_INPUT"})
    except FileNotFoundError as e:
        raise HTTPException(status_code=503, detail={"error": str(e), "code": "DATA_MISSING"})

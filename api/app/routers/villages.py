from fastapi import APIRouter, Query, HTTPException
from typing import List, Optional
from app.schemas import VillageSummary
from app.loaders.real_loader import get_loader

router = APIRouter(prefix="/villages", tags=["villages"])

@router.get("", response_model=List[VillageSummary])
def get_villages(district: Optional[str] = Query(None, description="District name to filter by")):
    loader = get_loader()
    try:
        raw_list = loader.get_villages(district=district)
        return [VillageSummary(**v) for v in raw_list]
    except FileNotFoundError as e:
        raise HTTPException(status_code=503, detail={"error": str(e), "code": "DATA_MISSING"})

@router.get("/{id}", response_model=VillageSummary)
def get_village(id: str):
    loader = get_loader()
    try:
        v = loader.get_village(id)
        if not v:
            raise HTTPException(status_code=404, detail={"error": f"Village with id '{id}' not found", "code": "NOT_FOUND"})
        return VillageSummary(**v)
    except FileNotFoundError as e:
        raise HTTPException(status_code=503, detail={"error": str(e), "code": "DATA_MISSING"})

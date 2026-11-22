from fastapi import APIRouter
from typing import List
from app.loaders.real_loader import get_loader

router = APIRouter(prefix="/districts", tags=["districts"])

@router.get("", response_model=List[str])
def list_districts():
    loader = get_loader()
    return loader.get_districts()

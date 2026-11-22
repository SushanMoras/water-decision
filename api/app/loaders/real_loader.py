from typing import List, Optional, Dict, Any
from app.loaders.base import BaseDataLoader
from app.loaders.mock_loader import MockDataLoader
from app.config import settings

class RealDataLoader(BaseDataLoader):
    """Placeholder loader for Phase E. Currently falls back or raises."""
    def get_districts(self) -> List[str]:
        return ["Sangrur"]

    def get_villages(self, district: Optional[str] = None) -> List[Dict[str, Any]]:
        raise FileNotFoundError("Real processed data not found in data/processed/. Set DATA_MODE=mock or run Phase E pipeline.")

    def get_village(self, village_id: str) -> Optional[Dict[str, Any]]:
        raise FileNotFoundError("Real processed data not found in data/processed/.")

    def get_timeseries(self, village_id: str) -> Optional[List[Dict[str, Any]]]:
        raise FileNotFoundError("Real processed data not found in data/processed/.")

def get_loader() -> BaseDataLoader:
    if settings.DATA_MODE == "real":
        return RealDataLoader()
    return MockDataLoader()

import json
import os
from typing import List, Optional, Dict, Any
from app.loaders.base import BaseDataLoader

class MockDataLoader(BaseDataLoader):
    def __init__(self):
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.mock_dir = os.path.join(base_dir, "mock")
        
        villages_path = os.path.join(self.mock_dir, "villages.json")
        with open(villages_path, "r", encoding="utf-8") as f:
            self.villages = json.load(f)
            
        timeseries_path = os.path.join(self.mock_dir, "timeseries.json")
        with open(timeseries_path, "r", encoding="utf-8") as f:
            self.timeseries = json.load(f)

    def get_districts(self) -> List[str]:
        districts = sorted(list({v["district"] for v in self.villages}))
        return districts

    def get_villages(self, district: Optional[str] = None) -> List[Dict[str, Any]]:
        if not district:
            return self.villages
        return [v for v in self.villages if v["district"].lower() == district.lower()]

    def get_village(self, village_id: str) -> Optional[Dict[str, Any]]:
        for v in self.villages:
            if v["id"].lower() == village_id.lower():
                return v
        return None

    def get_timeseries(self, village_id: str) -> Optional[List[Dict[str, Any]]]:
        for k, v in self.timeseries.items():
            if k.lower() == village_id.lower():
                return v
        return None

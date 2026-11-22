from abc import ABC, abstractmethod
from typing import List, Optional, Dict, Any

class BaseDataLoader(ABC):
    @abstractmethod
    def get_districts(self) -> List[str]:
        pass

    @abstractmethod
    def get_villages(self, district: Optional[str] = None) -> List[Dict[str, Any]]:
        pass

    @abstractmethod
    def get_village(self, village_id: str) -> Optional[Dict[str, Any]]:
        pass

    @abstractmethod
    def get_timeseries(self, village_id: str) -> Optional[List[Dict[str, Any]]]:
        pass

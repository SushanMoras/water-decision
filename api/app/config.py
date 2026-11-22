import os
from pydantic import BaseModel

class Settings(BaseModel):
    DATA_MODE: str = os.getenv("DATA_MODE", "mock")
    PILOT_DISTRICT: str = os.getenv("PILOT_DISTRICT", "Sangrur")
    API_PREFIX: str = "/api"

settings = Settings()

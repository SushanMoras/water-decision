from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import health, districts, villages, forecast_actions, scenario, meta, brief

app = FastAPI(
    title="Village Water Decision Platform API",
    description="Decision support platform for groundwater monitoring, supply-demand balance and crop scenarios.",
    version="0.1.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root / health endpoints
app.include_router(health.router)

# API routers under /api
app.include_router(districts.router, prefix="/api")
app.include_router(villages.router, prefix="/api")
app.include_router(forecast_actions.router, prefix="/api")
app.include_router(scenario.router, prefix="/api")
app.include_router(meta.router, prefix="/api")
app.include_router(brief.router, prefix="/api")

@app.get("/")
def root():
    return {
        "message": "Village Water Decision Platform API is operational",
        "docs": "/docs",
        "health": "/health"
    }

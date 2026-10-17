import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.core.database import init_database

# Routers
from app.api.routes_auth import router as auth_router
from app.api.routes_farms import router as farms_router
from app.api.routes_weather import router as weather_router
from app.api.routes_mandi import router as mandi_router
from app.api.routes_crop_health import router as crop_health_router
from app.api.routes_schemes import router as schemes_router
from app.api.routes_assistant import router as assistant_router
from app.api.routes_videos import router as videos_router
from app.api.routes_tasks import router as tasks_router
from app.api.routes_calendar import router as calendar_router
from app.api.routes_notifications import router as notifications_router
from app.api.routes_languages import router as languages_router
from app.api.routes_knowledge import router as knowledge_router
from app.api.routes_health import router as health_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print(f"[{settings.PROJECT_NAME}] Starting production-grade backend v{settings.VERSION}...")
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    await init_database()
    yield
    # Shutdown
    print(f"[{settings.PROJECT_NAME}] Shutting down gracefully...")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="AgriVision AI — Production Backend for Smart Agriculture Monitoring & Farmer Assistance Platform",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows frontend dev server on any port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files for uploaded crop diagnosis images
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Mount Routers under /api
api_prefix = settings.API_PREFIX
app.include_router(health_router, prefix=api_prefix)
app.include_router(auth_router, prefix=api_prefix)
app.include_router(farms_router, prefix=api_prefix)
app.include_router(weather_router, prefix=api_prefix)
app.include_router(mandi_router, prefix=api_prefix)
app.include_router(crop_health_router, prefix=api_prefix)
app.include_router(schemes_router, prefix=api_prefix)
app.include_router(assistant_router, prefix=api_prefix)
app.include_router(videos_router, prefix=api_prefix)
app.include_router(tasks_router, prefix=api_prefix)
app.include_router(calendar_router, prefix=api_prefix)
app.include_router(notifications_router, prefix=api_prefix)
app.include_router(languages_router, prefix=api_prefix)
app.include_router(knowledge_router, prefix=api_prefix)

# Direct alias for POST /api/diagnosis and POST /api/crop-health/ask
from app.api.routes_crop_health import analyze_crop_leaf, ask_plant_doctor_assistant
from app.api.routes_mandi import ask_mandi_advisor
from app.models.schemas import CropDiagnosisResponse, MandiAskResponse
app.add_api_route(f"{api_prefix}/diagnosis", analyze_crop_leaf, methods=["POST"], response_model=CropDiagnosisResponse, tags=["Crop Health Pathology AI"])
app.add_api_route(f"{api_prefix}/crop-health/ask", ask_plant_doctor_assistant, methods=["POST"], tags=["Crop Health Pathology AI"])
app.add_api_route(f"{api_prefix}/mandi/ask", ask_mandi_advisor, methods=["POST"], response_model=MandiAskResponse, tags=["APMC Mandi Price Intelligence"])


@app.get("/")
def root():
    return {
        "platform": settings.PROJECT_NAME,
        "tagline": "Smarter Farming. Evidence-Based Decisions.",
        "status": "online",
        "version": settings.VERSION,
        "api_docs": "/docs",
        "health_check": f"{settings.API_PREFIX}/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
# AgriVision AI backend reloader trigger
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

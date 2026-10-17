import os
from typing import List, Optional
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "AgriVision AI"
    VERSION: str = "2.0.0"
    API_PREFIX: str = "/api"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    # Security
    JWT_SECRET: str = "agrivision_production_insecure_default_change_in_env_2026_super_secret"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # Database
    MONGODB_URI: Optional[str] = None
    DATABASE_NAME: str = "agrivision_db"

    # AI & RAG Configuration
    GROQ_API_KEY: Optional[str] = None
    GROQ_MODEL: str = "qwen/qwen3.8-27b"
    GEMINI_API_KEY: Optional[str] = None

    # External APIs
    YOUTUBE_API_KEY: Optional[str] = None
    DATA_GOV_IN_API_KEY: Optional[str] = None
    TAVILY_API_KEY: Optional[str] = None
    BRAVE_API_KEY: Optional[str] = None
    OPEN_METEO_BASE_URL: str = "https://api.open-meteo.com/v1"
    GEOCODING_BASE_URL: str = "https://geocoding-api.open-meteo.com/v1"

    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ]

    # File uploads
    UPLOAD_DIR: str = "backend/uploads"
    MAX_UPLOAD_SIZE_BYTES: int = 15 * 1024 * 1024  # 15 MB

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"

settings = Settings()

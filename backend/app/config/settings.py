import os
import sys
from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    """Application settings"""
    # API settings
    API_V1_STR: str = "/api/v1"
    
    # Check if PROJECT_NAME is provided in environment, exit if not
    PROJECT_NAME: str = os.getenv("PROJECT_NAME")
    if not PROJECT_NAME:
        print("ERROR: PROJECT_NAME environment variable is required and cannot be empty")
        sys.exit(1)
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "development_secret_key")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    ALGORITHM: str = "HS256"
    
    # Database
    DB_PATH: str = os.getenv("DB_PATH", "~/epic-isolator/data/epic.db")
    
    # File paths
    BACKUP_DIR: str = os.getenv("BACKUP_DIR", "~/epic-isolator/backups")
    LOG_DIR: str = os.getenv("LOG_DIR", "~/epic-isolator/logs")
    
    # Docker settings
    DOCKER_HOST: str = os.getenv("DOCKER_HOST", "unix:///var/run/docker.sock")
    DOCKER_API_VERSION: str = os.getenv("DOCKER_API_VERSION", "auto")
    
    # Resource limits (defaults)
    DEFAULT_CPU_LIMIT: float = float(os.getenv("DEFAULT_CPU_LIMIT", "1.0"))
    DEFAULT_MEMORY_LIMIT: int = int(os.getenv("DEFAULT_MEMORY_LIMIT", "512"))
    
    class Config:
        env_file = ".env"
        case_sensitive = True

@lru_cache()
def get_settings():
    """Return cached settings"""
    return Settings()
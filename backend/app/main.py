from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer

from app.api import auth, apps, system
from app.config.settings import Settings
from app.db.session import init_db

if not Settings().PROJECT_NAME:
    raise ValueError("ERROR: PROJECT_NAME environment variable is required and cannot be empty")

app = FastAPI(
    title="Epic Isolator API",
    description="API for Epic Isolator platform",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["authentication"])
app.include_router(apps.router, prefix="/apps", tags=["application management"])
app.include_router(system.router, prefix="/system", tags=["system monitoring"])

@app.on_event("startup")
async def startup_event():
    """Initialize database and other startup tasks"""
    init_db()

@app.get("/health", tags=["health"])
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
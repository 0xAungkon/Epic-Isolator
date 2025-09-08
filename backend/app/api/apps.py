from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from app.api.auth import get_current_user
from app.models.app import App
from app.models.user import User
from app.services.app_service import create_container, start_container, stop_container

router = APIRouter()

# App schema models
class AppBase(BaseModel):
    name: str
    description: Optional[str] = None
    app_type: str
    memory_limit: int = 512
    cpu_limit: float = 1.0
    
class AppCreate(AppBase):
    config: Optional[str] = None

class AppUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    memory_limit: Optional[int] = None
    cpu_limit: Optional[float] = None
    config: Optional[str] = None

class AppOut(AppBase):
    id: int
    status: str
    container_id: Optional[str] = None
    port: Optional[int] = None
    volume_path: Optional[str] = None
    created_at: str
    
    class Config:
        orm_mode = True

# App endpoints
@router.get("/", response_model=List[AppOut])
async def list_apps(current_user: User = Depends(get_current_user)):
    """List all apps"""
    apps = App.select()
    return list(apps)

@router.post("/", response_model=AppOut, status_code=status.HTTP_201_CREATED)
async def create_app(app_data: AppCreate, current_user: User = Depends(get_current_user)):
    """Create a new app"""
    # Create app in database
    app = App.create(
        name=app_data.name,
        description=app_data.description,
        app_type=app_data.app_type,
        memory_limit=app_data.memory_limit,
        cpu_limit=app_data.cpu_limit,
        config=app_data.config
    )
    
    # Create container for the app (this will be implemented in the app_service)
    container_data = create_container(app)
    
    # Update app with container details
    app.container_id = container_data.get("container_id")
    app.port = container_data.get("port")
    app.volume_path = container_data.get("volume_path")
    app.save()
    
    return app

@router.get("/{app_id}", response_model=AppOut)
async def get_app(app_id: int, current_user: User = Depends(get_current_user)):
    """Get app details by ID"""
    try:
        app = App.get_by_id(app_id)
        return app
    except App.DoesNotExist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="App not found"
        )

@router.put("/{app_id}", response_model=AppOut)
async def update_app(app_id: int, app_data: AppUpdate, current_user: User = Depends(get_current_user)):
    """Update an existing app"""
    try:
        app = App.get_by_id(app_id)
        
        # Update fields if provided
        if app_data.name is not None:
            app.name = app_data.name
        if app_data.description is not None:
            app.description = app_data.description
        if app_data.status is not None:
            app.status = app_data.status
        if app_data.memory_limit is not None:
            app.memory_limit = app_data.memory_limit
        if app_data.cpu_limit is not None:
            app.cpu_limit = app_data.cpu_limit
        if app_data.config is not None:
            app.config = app_data.config
            
        app.save()
        return app
    except App.DoesNotExist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="App not found"
        )

@router.delete("/{app_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_app(app_id: int, current_user: User = Depends(get_current_user)):
    """Delete an app"""
    try:
        app = App.get_by_id(app_id)
        app.delete_instance()
    except App.DoesNotExist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="App not found"
        )

@router.post("/{app_id}/start", response_model=AppOut)
async def start_app(app_id: int, current_user: User = Depends(get_current_user)):
    """Start an app container"""
    try:
        app = App.get_by_id(app_id)
        if app.status == "active":
            return app
            
        # Start container (will be implemented in app_service)
        start_container(app)
        
        # Update app status
        app.status = "active"
        app.save()
        
        return app
    except App.DoesNotExist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="App not found"
        )

@router.post("/{app_id}/stop", response_model=AppOut)
async def stop_app(app_id: int, current_user: User = Depends(get_current_user)):
    """Stop an app container"""
    try:
        app = App.get_by_id(app_id)
        if app.status == "inactive":
            return app
            
        # Stop container (will be implemented in app_service)
        stop_container(app)
        
        # Update app status
        app.status = "inactive"
        app.save()
        
        return app
    except App.DoesNotExist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="App not found"
        )

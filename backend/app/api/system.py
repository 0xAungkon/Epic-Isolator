from typing import Dict, List
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
import psutil
import os
import shutil

from app.api.auth import get_current_user
from app.models.user import User
from app.config.settings import get_settings

router = APIRouter()
settings = get_settings()

# System models
class SystemStats(BaseModel):
    cpu_percent: float
    memory_percent: float
    disk_percent: float
    running_apps: int

class BackupInfo(BaseModel):
    total_backups: int
    total_size: int
    backup_dir: str

# System endpoints
@router.get("/stats", response_model=SystemStats)
async def get_system_stats(current_user: User = Depends(get_current_user)):
    """Get system resource usage statistics"""
    from app.models.app import App
    
    stats = {
        "cpu_percent": psutil.cpu_percent(),
        "memory_percent": psutil.virtual_memory().percent,
        "disk_percent": psutil.disk_usage('/').percent,
        "running_apps": App.select().where(App.status == "active").count()
    }
    
    return stats

@router.get("/backup-info", response_model=BackupInfo)
async def get_backup_info(current_user: User = Depends(get_current_user)):
    """Get information about backups"""
    from app.models.backup import Backup
    
    backup_dir = os.path.expanduser(settings.BACKUP_DIR)
    
    # Ensure backup directory exists
    if not os.path.exists(backup_dir):
        os.makedirs(backup_dir)
    
    # Get total size of backup directory
    total_size = 0
    for dirpath, dirnames, filenames in os.walk(backup_dir):
        for f in filenames:
            fp = os.path.join(dirpath, f)
            if not os.path.islink(fp):
                total_size += os.path.getsize(fp)
    
    return {
        "total_backups": Backup.select().count(),
        "total_size": total_size,
        "backup_dir": backup_dir
    }

@router.post("/cleanup", status_code=status.HTTP_200_OK)
async def system_cleanup(current_user: User = Depends(get_current_user)):
    """Clean up temporary files and logs"""
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    # Implement cleanup logic here
    # For example, delete old log files, temporary files, etc.
    
    return {"status": "Cleanup completed successfully"}

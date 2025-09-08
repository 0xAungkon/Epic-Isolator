import os
import shutil
import datetime
import tarfile
import json
from typing import Dict, Any

from app.config.settings import get_settings
from app.models.backup import Backup
from app.models.app import App

settings = get_settings()

def create_app_backup(app, backup_type="full", notes=None) -> Dict[str, Any]:
    """Create a backup of an app
    
    Args:
        app: App model instance
        backup_type: Type of backup (full, data, config)
        notes: Optional notes about the backup
        
    Returns:
        Dict with backup details
    """
    # Ensure backup directory exists
    backup_dir = os.path.expanduser(settings.BACKUP_DIR)
    os.makedirs(backup_dir, exist_ok=True)
    
    # Create backup filename with timestamp
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_filename = f"{app.name}_{app.id}_{backup_type}_{timestamp}.tar.gz"
    backup_path = os.path.join(backup_dir, backup_filename)
    
    # Get app volume path
    volume_path = app.volume_path
    if not volume_path or not os.path.exists(volume_path):
        return {"success": False, "error": "App volume not found"}
    
    try:
        # Create tar archive of the app data
        with tarfile.open(backup_path, "w:gz") as tar:
            # Add app data based on backup type
            if backup_type in ["full", "data"]:
                tar.add(volume_path, arcname="data")
            
            # Add app configuration
            if backup_type in ["full", "config"]:
                # Create a temporary config file
                config_file = os.path.join(backup_dir, f"config_{timestamp}.json")
                with open(config_file, "w") as f:
                    config_data = {
                        "app_id": app.id,
                        "name": app.name,
                        "description": app.description,
                        "app_type": app.app_type,
                        "status": app.status,
                        "container_id": app.container_id,
                        "port": app.port,
                        "memory_limit": app.memory_limit,
                        "cpu_limit": app.cpu_limit,
                        "config": app.config,
                        "backup_date": timestamp
                    }
                    json.dump(config_data, f, indent=2)
                
                # Add config file to backup
                tar.add(config_file, arcname="config.json")
                
                # Clean up temp file
                os.remove(config_file)
        
        # Get backup size
        backup_size = os.path.getsize(backup_path)
        
        # Create backup record in database
        backup = Backup.create(
            app=app,
            filename=backup_filename,
            size=backup_size,
            backup_type=backup_type,
            status="complete",
            notes=notes
        )
        
        return {
            "success": True,
            "backup_id": backup.id,
            "filename": backup_filename,
            "path": backup_path,
            "size": backup_size
        }
    except Exception as e:
        return {"success": False, "error": str(e)}

def restore_backup(backup_id) -> Dict[str, Any]:
    """Restore an app from backup
    
    Args:
        backup_id: ID of the backup to restore
        
    Returns:
        Dict with restore status
    """
    try:
        # Get backup record
        backup = Backup.get_by_id(backup_id)
        app = backup.app
        
        # Get backup file path
        backup_dir = os.path.expanduser(settings.BACKUP_DIR)
        backup_path = os.path.join(backup_dir, backup.filename)
        
        if not os.path.exists(backup_path):
            return {"success": False, "error": "Backup file not found"}
        
        # Get app volume path
        volume_path = app.volume_path
        if not volume_path:
            return {"success": False, "error": "App volume path not found"}
        
        # Create backup of current data before restoring
        backup_current = create_app_backup(app, backup_type="pre_restore", 
                                         notes=f"Auto backup before restoring from backup ID {backup_id}")
        
        # Clear current app volume
        if os.path.exists(volume_path):
            for item in os.listdir(volume_path):
                item_path = os.path.join(volume_path, item)
                if os.path.isfile(item_path):
                    os.remove(item_path)
                elif os.path.isdir(item_path):
                    shutil.rmtree(item_path)
        
        # Extract backup to app volume
        with tarfile.open(backup_path, "r:gz") as tar:
            # Extract data directory
            data_members = [m for m in tar.getmembers() if m.name.startswith("data/")]
            if data_members:
                tar.extractall(path=os.path.dirname(volume_path), members=data_members)
            
            # Extract config if it exists
            config_member = [m for m in tar.getmembers() if m.name == "config.json"]
            if config_member:
                tar.extract(config_member[0], path="/tmp")
                
                # Load config data
                with open("/tmp/config.json", "r") as f:
                    config_data = json.load(f)
                
                # Update app with config data if needed
                if backup.backup_type in ["full", "config"]:
                    app.name = config_data.get("name", app.name)
                    app.description = config_data.get("description", app.description)
                    app.config = config_data.get("config", app.config)
                    app.save()
                
                # Clean up temp file
                os.remove("/tmp/config.json")
        
        # Return success
        return {
            "success": True,
            "app_id": app.id,
            "backup_id": backup_id,
            "pre_restore_backup_id": backup_current.get("backup_id") if backup_current["success"] else None
        }
    except Exception as e:
        return {"success": False, "error": str(e)}

def list_app_backups(app_id):
    """List backups for an app
    
    Args:
        app_id: ID of the app
        
    Returns:
        List of backup records
    """
    try:
        app = App.get_by_id(app_id)
        backups = Backup.select().where(Backup.app == app).order_by(Backup.created_at.desc())
        return list(backups)
    except App.DoesNotExist:
        return []
    except Exception:
        return []

def delete_backup(backup_id) -> Dict[str, Any]:
    """Delete a backup
    
    Args:
        backup_id: ID of the backup to delete
        
    Returns:
        Dict with delete status
    """
    try:
        # Get backup record
        backup = Backup.get_by_id(backup_id)
        
        # Delete backup file
        backup_dir = os.path.expanduser(settings.BACKUP_DIR)
        backup_path = os.path.join(backup_dir, backup.filename)
        
        if os.path.exists(backup_path):
            os.remove(backup_path)
        
        # Delete backup record
        backup.delete_instance()
        
        return {"success": True}
    except Backup.DoesNotExist:
        return {"success": False, "error": "Backup not found"}
    except Exception as e:
        return {"success": False, "error": str(e)}
import docker
import time
from typing import Dict, Any, List, Optional

from app.utils.logger import app_logger, error_logger

# Initialize Docker client
client = docker.from_env()

def check_docker_available() -> bool:
    """Check if Docker is available and running
    
    Returns:
        bool: True if Docker is available, False otherwise
    """
    try:
        client.ping()
        return True
    except Exception as e:
        error_logger.error(f"Docker not available: {str(e)}")
        return False

def list_running_containers() -> List[Dict[str, Any]]:
    """Get list of running containers
    
    Returns:
        List of container info dictionaries
    """
    try:
        containers = client.containers.list(filters={"name": "epic-isolator-"})
        return [
            {
                "id": container.short_id,
                "name": container.name,
                "status": container.status,
                "image": container.image.tags[0] if container.image.tags else "unknown"
            }
            for container in containers
        ]
    except Exception as e:
        error_logger.error(f"Error listing containers: {str(e)}")
        return []

def get_network_info() -> Dict[str, Any]:
    """Get Docker network information
    
    Returns:
        Dict with network information
    """
    try:
        networks = client.networks.list(names=["bridge"])
        if not networks:
            return {"error": "Bridge network not found"}
        
        bridge = networks[0]
        return {
            "id": bridge.short_id,
            "name": bridge.name,
            "containers": len(bridge.containers)
        }
    except Exception as e:
        error_logger.error(f"Error getting network info: {str(e)}")
        return {"error": str(e)}

def pull_image(image_name: str) -> bool:
    """Pull a Docker image
    
    Args:
        image_name: Name of the image to pull
        
    Returns:
        bool: True if successful, False otherwise
    """
    try:
        app_logger.info(f"Pulling Docker image: {image_name}")
        client.images.pull(image_name)
        return True
    except Exception as e:
        error_logger.error(f"Error pulling image {image_name}: {str(e)}")
        return False

def wait_for_container_ready(container_id: str, timeout: int = 30) -> bool:
    """Wait for a container to be ready
    
    Args:
        container_id: Container ID
        timeout: Timeout in seconds
        
    Returns:
        bool: True if container is ready, False if timeout
    """
    start_time = time.time()
    while time.time() - start_time < timeout:
        try:
            container = client.containers.get(container_id)
            if container.status == "running":
                # Check container health if available
                if hasattr(container, "attrs") and "Health" in container.attrs["State"]:
                    health_status = container.attrs["State"]["Health"]["Status"]
                    if health_status == "healthy":
                        return True
                    elif health_status == "unhealthy":
                        return False
                else:
                    # If no health check, assume it's ready if running
                    return True
            elif container.status in ["exited", "dead"]:
                return False
        except Exception as e:
            error_logger.error(f"Error checking container status: {str(e)}")
            return False
            
        time.sleep(1)
    
    return False
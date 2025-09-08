import os
import json
import uuid
import docker
from typing import Dict, Any

from app.config.settings import get_settings

settings = get_settings()

# Initialize Docker client
client = docker.from_env()

def create_container(app) -> Dict[str, Any]:
    """Create a Docker container for an app
    
    Args:
        app: App model instance
        
    Returns:
        Dict with container_id, port, and volume_path
    """
    # Generate unique volume path
    volume_name = f"epic-isolator-{app.id}-{uuid.uuid4().hex[:8]}"
    volume_path = os.path.join(os.path.expanduser("~/epic-isolator/volumes"), volume_name)
    os.makedirs(volume_path, exist_ok=True)
    
    # Parse app config if available
    config = {}
    if app.config:
        try:
            config = json.loads(app.config)
        except:
            config = {}
    
    # Set container parameters based on app type
    image = "ubuntu:latest"  # Default image
    command = None
    ports = {}
    volumes = {volume_path: {'bind': '/app/data', 'mode': 'rw'}}
    environment = {}
    
    if app.app_type == "web":
        image = config.get("image", "nginx:latest")
        ports = {80: None}  # Will be assigned a random port
    elif app.app_type == "desktop":
        image = config.get("image", "ubuntu:latest")
        # Add desktop app specific configuration here
    elif app.app_type == "server":
        image = config.get("image", "ubuntu:latest")
        # Add server app specific configuration here
    
    # Create and start container
    container = client.containers.run(
        image=image,
        command=command,
        detach=True,
        ports=ports,
        volumes=volumes,
        environment=environment,
        name=f"epic-isolator-{app.name}-{app.id}",
        cpu_count=app.cpu_limit,
        mem_limit=f"{app.memory_limit}m"
    )
    
    # Get assigned port
    port = None
    if ports:
        container_info = client.containers.get(container.id)
        port_bindings = container_info.attrs['NetworkSettings']['Ports']
        for container_port, host_info in port_bindings.items():
            if host_info:
                port = int(host_info[0]['HostPort'])
                break
    
    return {
        "container_id": container.id,
        "port": port,
        "volume_path": volume_path
    }

def start_container(app):
    """Start an app container
    
    Args:
        app: App model instance
    """
    try:
        container = client.containers.get(app.container_id)
        container.start()
        return True
    except Exception as e:
        print(f"Error starting container: {str(e)}")
        return False

def stop_container(app):
    """Stop an app container
    
    Args:
        app: App model instance
    """
    try:
        container = client.containers.get(app.container_id)
        container.stop()
        return True
    except Exception as e:
        print(f"Error stopping container: {str(e)}")
        return False

def restart_container(app):
    """Restart an app container
    
    Args:
        app: App model instance
    """
    try:
        container = client.containers.get(app.container_id)
        container.restart()
        return True
    except Exception as e:
        print(f"Error restarting container: {str(e)}")
        return False

def get_container_logs(app, lines=100):
    """Get container logs
    
    Args:
        app: App model instance
        lines: Number of log lines to return
        
    Returns:
        Container logs as string
    """
    try:
        container = client.containers.get(app.container_id)
        return container.logs(tail=lines).decode('utf-8')
    except Exception as e:
        print(f"Error getting container logs: {str(e)}")
        return ""

def get_container_stats(app):
    """Get container resource usage statistics
    
    Args:
        app: App model instance
        
    Returns:
        Dict with CPU, memory and network statistics
    """
    try:
        container = client.containers.get(app.container_id)
        stats = container.stats(stream=False)
        
        # Calculate CPU usage percentage
        cpu_delta = stats['cpu_stats']['cpu_usage']['total_usage'] - stats['precpu_stats']['cpu_usage']['total_usage']
        system_delta = stats['cpu_stats']['system_cpu_usage'] - stats['precpu_stats']['system_cpu_usage']
        cpu_percent = 0.0
        if system_delta > 0 and cpu_delta > 0:
            cpu_percent = (cpu_delta / system_delta) * len(stats['cpu_stats']['cpu_usage']['percpu_usage']) * 100.0
        
        # Calculate memory usage
        memory_usage = stats['memory_stats'].get('usage', 0)
        memory_limit = stats['memory_stats'].get('limit', 1)
        memory_percent = (memory_usage / memory_limit) * 100.0 if memory_limit > 0 else 0
        
        return {
            "status": container.status,
            "cpu_percent": round(cpu_percent, 2),
            "memory_usage": memory_usage,
            "memory_percent": round(memory_percent, 2),
            "network_rx": stats['networks']['eth0']['rx_bytes'] if 'networks' in stats else 0,
            "network_tx": stats['networks']['eth0']['tx_bytes'] if 'networks' in stats else 0
        }
    except Exception as e:
        print(f"Error getting container stats: {str(e)}")
        return {
            "status": "error",
            "cpu_percent": 0,
            "memory_usage": 0,
            "memory_percent": 0,
            "network_rx": 0,
            "network_tx": 0
        }
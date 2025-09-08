import peewee as pw
from app.models.base import BaseModel

class App(BaseModel):
    """Model for application isolation instances"""
    name = pw.CharField(max_length=100)
    description = pw.TextField(null=True)
    app_type = pw.CharField(max_length=50)  # web, desktop, server, etc.
    status = pw.CharField(max_length=20, default="inactive")  # active, inactive, error
    container_id = pw.CharField(max_length=100, null=True)
    port = pw.IntegerField(null=True)
    memory_limit = pw.IntegerField(default=512)  # Memory limit in MB
    cpu_limit = pw.FloatField(default=1.0)  # CPU limit in cores
    volume_path = pw.CharField(null=True)
    config = pw.TextField(null=True)  # JSON configuration
    
    def __str__(self):
        return f"{self.name} ({self.app_type})"